# servers/serializers.py
from rest_framework import serializers
from .models import Server

class ServerSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = '__all__'
        read_only_fields = ['owner', 'created_at']

    def get_likes(self, obj):
        upvotes = obj.votes.filter(is_upvote=True).count()
        downvotes = obj.votes.filter(is_upvote=False).count()
        return upvotes - downvotes