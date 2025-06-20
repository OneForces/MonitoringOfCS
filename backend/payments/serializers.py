# payments/serializers.py

from rest_framework import serializers
from .models import Payment, ManualDonation


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']


class ManualDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualDonation
        fields = ['id', 'user', 'server', 'amount', 'comment', 'status', 'created_at', 'payment_code']
        read_only_fields = ['status', 'created_at', 'user', 'payment_code']
