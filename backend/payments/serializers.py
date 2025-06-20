# payments/serializers.py

from rest_framework import serializers
from .models import Payment, ManualDonation
from servers.models import Server

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']


class ManualDonationSerializer(serializers.ModelSerializer):
    server = serializers.PrimaryKeyRelatedField(required=False, allow_null=True, queryset=Server.objects.all())

    class Meta:
        model = ManualDonation
        fields = ['id', 'user', 'server', 'amount', 'comment', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'status', 'created_at']