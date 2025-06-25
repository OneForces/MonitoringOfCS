# backend/servers/serializers.py
from rest_framework import serializers
from .models import Server, Vote

class ServerSerializer(serializers.ModelSerializer):
    upvotes = serializers.SerializerMethodField()
    votes = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = ['id', 'name', 'ip', 'port', 'votes_count', 'upvotes', 'votes']

    def get_upvotes(self, obj):
        # Только реальные лайки + донатные (votes_count)
        real_upvotes = obj.votes.filter(is_upvote=True).exclude(user__username='system').count()
        return real_upvotes + obj.votes_count

    def get_votes(self, obj):
        # Аналогично, только сумма
        real_upvotes = obj.votes.filter(is_upvote=True).exclude(user__username='system').count()
        return real_upvotes + obj.votes_count
