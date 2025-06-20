# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username', 'email', 'is_superuser', 'is_staff',
        'is_moderator', 'balance', 'votes_balance', 'date_joined'
    )
    list_filter = ('is_superuser', 'is_staff', 'is_moderator')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined')

    fieldsets = UserAdmin.fieldsets + (
        (None, {
            'fields': ('balance', 'votes_balance', 'level', 'is_moderator')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'fields': ('balance', 'votes_balance', 'level', 'is_moderator')
        }),
    )

    actions = ['add_votes_to_selected']

    @admin.action(description="➕ Выдать 100 голосов выбранным пользователям")
    def add_votes_to_selected(self, request, queryset):
        updated = 0
        for user in queryset:
            user.votes_balance += 100
            user.save()
            updated += 1
        self.message_user(request, f"✅ Добавлено по 100 голосов {updated} пользователям.")
