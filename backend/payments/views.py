# backend/payments/views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db import models

from .models import Payment, PurchasedService, ManualDonation, DownloadStat
from .serializers import PaymentSerializer, ManualDonationSerializer
from servers.models import Server, Vote  # нужно для начисления голосов

User = get_user_model()

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_manual_donation(request):
    serializer = ManualDonationSerializer(data=request.data)
    if serializer.is_valid():
        donation = serializer.save(user=request.user)
        amount_int = int(donation.amount)

        # Начисляем голоса серверу, если выбран
        if donation.server:
            for _ in range(amount_int):
                Vote.objects.create(user=request.user, server=donation.server)
            donation.server.votes_count += amount_int
            donation.server.save()

        # Всегда увеличиваем баланс голосов пользователя
        request.user.votes_balance += amount_int
        request.user.save()

        donation.status = "confirmed"
        donation.save(update_fields=["status"])

        return Response({"status": "ok", "message": f"✅ Начислено {amount_int} голосов серверу и на ваш баланс."})
    else:
        return Response(serializer.errors, status=400)


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_count = User.objects.count()
        votes_total = User.objects.aggregate(total_votes=models.Sum('votes_balance'))['total_votes'] or 0
        services_count = PurchasedService.objects.count()
        downloads_count = DownloadStat.objects.count()

        return Response({
            "users": users_count,
            "votes": votes_total,
            "services": services_count,
            "downloads": downloads_count,
        })


# ✅ Сигнал для автоматического начисления голосов при покупке услуги "Голоса"
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=PurchasedService)
def add_votes_on_purchase(sender, instance, created, **kwargs):
    if created and instance.service.service_type == 'votes':
        user = instance.user
        quantity = instance.quantity

        # Прибавляем к голосовому балансу
        user.votes_balance += quantity
        user.save()

        # Если сервер указан — обновляем его votes_count и создаём записи
        if instance.server:
            instance.server.votes_count += quantity
            instance.server.save()

            # Создаём записи голосов от system-пользователя
            system_user, _ = User.objects.get_or_create(username='system', defaults={'password': '!'})
            for _ in range(quantity):
                Vote.objects.create(user=system_user, server=instance.server, is_upvote=True)
