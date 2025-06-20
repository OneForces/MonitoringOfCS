# promotions/serializers.py

from rest_framework import serializers
from .models import Service, ServerService, PurchasedService
from servers.models import Server


# 🎯 Основная информация об услуге
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'description',
            'service_type',
            'price_per_unit',
            'duration_days',
            'available_colors'
        ]


# 🎯 Привязка сервера к услуге (активные покупки)
class ServerServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerService
        fields = '__all__'


# 🎯 Сериализатор для покупки услуги
class ServicePurchaseSerializer(serializers.Serializer):
    server_id = serializers.IntegerField(required=False)  # не обязателен для голосов
    service_id = serializers.IntegerField()
    quantity = serializers.IntegerField(required=False, default=1)
    color = serializers.CharField(required=False, allow_blank=True, allow_null=True)


# 🎯 Информация о совершённой покупке
class PurchasedServiceSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    service = serializers.StringRelatedField()
    server = serializers.StringRelatedField(allow_null=True)

    class Meta:
        model = PurchasedService
        fields = ['id', 'user', 'server', 'service', 'quantity', 'purchased_at']


# 🎯 Сериализатор для отображения сервера в списке услуги
class ListingServerSerializer(serializers.ModelSerializer):
    server_name = serializers.CharField(source='server.name')
    end_date = serializers.DateTimeField(format='%d.%m.%Y [%H:%M]')

    class Meta:
        model = ServerService
        fields = ['server_name', 'end_date']


# 🎯 Список доступных услуг (листинг)
class ListingServiceSerializer(serializers.ModelSerializer):
    used = serializers.SerializerMethodField()
    servers = serializers.SerializerMethodField()
    next_slot = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'listing_limit', 'used', 'next_slot', 'servers']

    def get_used(self, obj):
        return ServerService.objects.filter(service=obj).count()

    def get_servers(self, obj):
        items = ServerService.objects.filter(service=obj).order_by('end_date')[:10]
        return ListingServerSerializer(items, many=True).data

    def get_next_slot(self, obj):
        next_item = ServerService.objects.filter(service=obj).order_by('end_date').first()
        if next_item and next_item.end_date:
            return next_item.end_date.strftime('%d.%m.%Y [%H:%M]')
        return "Вытеснение" if obj.listing_limit > 0 else "~"
