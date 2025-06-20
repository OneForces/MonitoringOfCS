# servers/serializers.py
from rest_framework import serializers
from .models import Server

class ServerSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()
    downvotes = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = '__all__'
        read_only_fields = ['owner', 'created_at']

    def get_upvotes(self, obj):
        real_upvotes = obj.votes.filter(is_upvote=True).exclude(user__username='system').count()
        fake_upvotes = obj.votes.filter(is_upvote=True, user__username='system').count()
        return real_upvotes + fake_upvotes + obj.votes_count  # поле с накрученными голосами

    def get_downvotes(self, obj):
        return obj.votes.filter(is_upvote=False).count()

    def get_likes(self, obj):
        return self.get_upvotes(obj) - self.get_downvotes(obj)
