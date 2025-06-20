from django.db import models
from users.models import CustomUser
from servers.models import Server

class Vote(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    server = models.ForeignKey(Server, related_name='votes', on_delete=models.CASCADE)
    is_upvote = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'server')