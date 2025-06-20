from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_moderator = models.BooleanField(default=False)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    votes_balance = models.PositiveIntegerField(default=0)
    level = models.CharField(max_length=50, default='Новичок')

