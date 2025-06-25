from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ManualDonation
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=ManualDonation)
def handle_manual_donation_confirmation(sender, instance, created, **kwargs):
    if not created and instance.status == 'confirmed':
        user = instance.user
        if user:
            user.balance += instance.amount
            user.save()
