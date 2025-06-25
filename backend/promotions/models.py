# backend/payments/models.py

from django.db import models
from servers.models import Server
from django.contrib.auth import get_user_model

User = get_user_model()


class Service(models.Model):
    TYPE_CHOICES = [
        ('boost', 'Boost'),
        ('color', 'Color'),
        ('votes', 'Голоса'),  # ✅ добавлен тип голосов
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    service_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2)
    duration_days = models.IntegerField(default=30, help_text="Применимо для цветных услуг")
    available_colors = models.JSONField(blank=True, null=True)
    listing_limit = models.IntegerField(default=0, help_text="Максимум мест (0 = без лимита)")
    priority = models.IntegerField(default=0, help_text="Порядок сортировки в листинге")
    show_in_listing = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ServerService(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    quantity = models.IntegerField(default=1)
    color = models.CharField(max_length=16, blank=True, null=True)

    def __str__(self):
        return f"{self.service.name} on {self.server.name}"


class RobokassaTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    is_verified = models.BooleanField(default=False)
    robokassa_inv_id = models.IntegerField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    server = models.ForeignKey(Server, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_balance_topup = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment #{self.robokassa_inv_id} - {self.amount} RUB"


class PurchasedService(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)  # ✅ количество (голосов, дней и т.п.)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} купил {self.service} ×{self.quantity} для {self.server}"
