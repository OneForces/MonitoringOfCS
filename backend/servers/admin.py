from django.contrib import admin
from .models import Server
from django import forms
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.contrib.auth import get_user_model

User = get_user_model()

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ('name', 'ip', 'port', 'created_at', 'upvote_count')
    search_fields = ('name', 'ip')
    actions = ['add_upvotes_custom']

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('add-votes/', self.admin_site.admin_view(self.add_votes_view), name='add_votes'),
        ]
        return custom_urls + urls

    def add_upvotes_custom(self, request, queryset):
        selected = queryset.values_list('id', flat=True)
        return redirect(f"add-votes/?ids={','.join(map(str, selected))}")
    add_upvotes_custom.short_description = "🔺 Накрутить N голосов..."

    def add_votes_view(self, request):
        if request.method == "POST":
            count = int(request.POST.get("count", 0))
            ids = request.POST.get("ids", "").split(",")
            servers = Server.objects.filter(id__in=ids)
            system_user = User.objects.filter(username='system').first()
            if not system_user:
                messages.error(request, "Пользователь 'system' не найден.")
                return redirect("..")
            total = 0
            for server in servers:
                Vote.objects.bulk_create([
                    Vote(user=system_user, server=server, is_upvote=True)
                    for _ in range(count)
                ])
                total += count
            messages.success(request, f"✅ Накручено {total} голосов.")
            return redirect("..")
        else:
            ids = request.GET.get("ids", "")
            return render(request, "admin/add_votes.html", {"ids": ids})

    def upvote_count(self, obj):
        return obj.votes.filter(is_upvote=True).count()
    upvote_count.short_description = "👍 Голосов"
