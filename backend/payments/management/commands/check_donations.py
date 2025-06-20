from django.core.management.base import BaseCommand
from payments.models import ManualDonation
from servers.models import Server, Vote
import csv
import os

class Command(BaseCommand):
    help = "Проверяет донаты в bank_export.csv и подтверждает их"

    def handle(self, *args, **options):
        path = os.path.join(os.getcwd(), "bank_export.csv")
        if not os.path.exists(path):
            self.stdout.write("Файл bank_export.csv не найден.")
            return

        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                code = row['code'].strip()
                try:
                    donation = ManualDonation.objects.get(payment_code=code, status="pending")
                    donation.status = "confirmed"
                    donation.save()

                    if donation.server:
                        for _ in range(int(donation.amount)):
                            Vote.objects.create(user=donation.user, server=donation.server)
                        self.stdout.write(f"✅ Донат подтверждён и {int(donation.amount)} голосов начислено на {donation.server}")
                    else:
                        self.stdout.write("⚠ Донат без сервера — голоса не начислены")

                except ManualDonation.DoesNotExist:
                    continue
