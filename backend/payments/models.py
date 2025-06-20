from django.db import models
from users.models import CustomUser
from uuid import uuid4
from django.contrib.auth import get_user_model

class Payment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} ({self.status})"


class ManualDonation(models.Model):
    STATUS_CHOICES = (
        ('pending', 'В ожидании'),
        ('confirmed', 'Подтверждено'),
        ('rejected', 'Отклонено'),
    )

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    comment = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    payment_code = models.CharField(max_length=32, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.payment_code:
            self.payment_code = uuid4().hex[:8]  # короткий уникальный код
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} — {self.amount}₽ — {self.status} — {self.payment_code}"

from django.db import models
from django.contrib.auth import get_user_model
from servers.models import Server  # убедись, что у тебя есть модель Server

User = get_user_model()

# backend/payments/models.py

class PurchasedService(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchased_services_payments")
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="purchased_services_payments")
    service_name = models.CharField(max_length=255)
    purchased_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.service_name} — {self.user.username} — {self.server.name}"
    
class DownloadStat(models.Model):
    ip = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    build = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.ip} — {self.build} — {self.timestamp}"