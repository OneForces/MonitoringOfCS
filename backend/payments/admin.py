from django.contrib import admin
from .models import ManualDonation

@admin.register(ManualDonation)
class ManualDonationAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "status", "created_at")
    list_filter = ("status",)
    actions = ["confirm_selected", "reject_selected"]

    @admin.action(description="Подтвердить выбранные донаты")
    def confirm_selected(self, request, queryset):
        updated = queryset.update(status="confirmed")
        self.message_user(request, f"✅ Подтверждено {updated} заявок.")

    @admin.action(description="Отклонить выбранные донаты")
    def reject_selected(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"🚫 Отклонено {updated} заявок.")