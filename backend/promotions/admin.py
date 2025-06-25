# backend/promotions/admin.py

from django.contrib import admin
from .models import Service, ServerService, RobokassaTransaction, PurchasedService


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_per_unit', 'priority', 'listing_limit', 'show_in_listing')
    list_filter = ('service_type', 'show_in_listing')
    search_fields = ('name',)


@admin.register(ServerService)
class ServerServiceAdmin(admin.ModelAdmin):
    list_display = ('server', 'service', 'user', 'start_date', 'end_date', 'quantity', 'color')
    list_filter = ('service', 'color')
    search_fields = ('server__name', 'user__username')


@admin.register(RobokassaTransaction)
class RobokassaTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'is_verified', 'robokassa_inv_id', 'created_at', 'is_balance_topup')
    list_filter = ('is_verified', 'is_balance_topup')
    search_fields = ('user__username', 'robokassa_inv_id')


@admin.register(PurchasedService)
class PurchasedServiceAdmin(admin.ModelAdmin):
    list_display = ('user', 'server', 'service', 'purchased_at')
    list_filter = ('service',)
    search_fields = ('user__username', 'server__name')
