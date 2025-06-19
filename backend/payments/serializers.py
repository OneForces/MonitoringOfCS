from rest_framework import serializers
from .models import Payment, ManualDonation

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ManualDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualDonation
        fields = ['id', 'user', 'amount', 'comment', 'status', 'created_at']
        read_only_fields = ['status', 'created_at', 'user']
