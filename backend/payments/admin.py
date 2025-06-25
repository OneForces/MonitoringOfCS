# backend/payments/admin.py

from django.contrib import admin
from .models import ManualDonation, DownloadStat


@admin.register(ManualDonation)
class ManualDonationAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "status", "created_at", "payment_code")
    list_filter = ("status",)
    search_fields = ("user__username", "payment_code")
    actions = ["confirm_selected", "reject_selected"]

    @admin.action(description="✅ Подтвердить выбранные донаты")
    def confirm_selected(self, request, queryset):
        updated = queryset.update(status="confirmed")
        self.message_user(request, f"✅ Подтверждено {updated} заявок.")

    @admin.action(description="🚫 Отклонить выбранные донаты")
    def reject_selected(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"🚫 Отклонено {updated} заявок.")


@admin.register(DownloadStat)
class DownloadStatAdmin(admin.ModelAdmin):
    list_display = ('ip', 'user_agent', 'downloaded_at', 'build')  # ✅ заменено
    list_filter = ('build', 'downloaded_at')                        # ✅ заменено
    search_fields = ('ip', 'user_agent')
