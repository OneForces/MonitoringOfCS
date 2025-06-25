# servers/models.py

from django.db import models
from django.conf import settings


class Server(models.Model):
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    port = models.PositiveIntegerField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=16, blank=True, null=True)
    map = models.CharField(max_length=100, blank=True, null=True)
    current_players = models.PositiveIntegerField(default=0)
    max_players = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='server_images/', blank=True, null=True)
    last_check = models.DateTimeField(null=True, blank=True)
    votes_count = models.PositiveIntegerField(default=0)  # голоса от донатов

    def __str__(self):
        return f"{self.name} ({self.ip}:{self.port})"


class Vote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='server_votes'
    )
    server = models.ForeignKey(
        Server,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    is_upvote = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'server', 'created_at')  # можно адаптировать под "1 голос в день"

    def __str__(self):
        direction = 'лайк' if self.is_upvote else 'дизлайк'
        return f"{direction} от {self.user.username} за {self.server.name} ({self.created_at.date()})"


class DownloadStat(models.Model):
    ip = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    build_name = models.CharField(max_length=100)
    downloaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ip} → {self.build_name} @ {self.downloaded_at}"
