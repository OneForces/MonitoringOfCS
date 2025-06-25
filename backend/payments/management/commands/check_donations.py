# backend/payments/management/commands/confirm_donations.py

from django.core.management.base import BaseCommand
from payments.models import ManualDonation
from servers.models import Server, Vote
from django.contrib.auth import get_user_model
import csv
import os

User = get_user_model()

class Command(BaseCommand):
    help = "Проверяет донаты в bank_export.csv и подтверждает их"

    def handle(self, *args, **options):
        path = os.path.join(os.getcwd(), "bank_export.csv")
        if not os.path.exists(path):
            self.stdout.write(self.style.ERROR("❌ Файл bank_export.csv не найден."))
            return

        confirmed = 0
        skipped = 0

        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                code = row.get('code', '').strip()
                if not code:
                    self.stdout.write(self.style.WARNING("⛔ Пропущена строка без кода."))
                    continue

                try:
                    donation = ManualDonation.objects.get(payment_code=code, status="pending")
                    amount = int(donation.amount)

                    # Подтверждение
                    donation.status = "confirmed"
                    donation.save()

                    # Начисление голосов
                    if donation.server:
                        for _ in range(amount):
                            Vote.objects.create(user=donation.user, server=donation.server)

                        donation.server.votes_count += amount
                        donation.server.save()

                        self.stdout.write(self.style.SUCCESS(
                            f"✅ {amount} голосов начислено на сервер {donation.server.name} (код: {code})"
                        ))
                    else:
                        self.stdout.write(self.style.WARNING(
                            f"⚠ Донат без сервера (код: {code}) — голоса не начислены"
                        ))

                    # Обновление баланса голосов у пользователя
                    donation.user.votes_balance += amount
                    donation.user.save()

                    confirmed += 1

                except ManualDonation.DoesNotExist:
                    skipped += 1
                    continue

        self.stdout.write(self.style.SUCCESS(f"\nИТОГО: подтверждено {confirmed}, пропущено {skipped}"))
