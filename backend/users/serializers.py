# users/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['is_moderator'] = getattr(user, 'is_moderator', False)
        token['votes_balance'] = getattr(user, 'votes_balance', 0)
        token['balance'] = str(getattr(user, 'balance', 0))
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['is_superuser'] = self.user.is_superuser
        data['is_moderator'] = getattr(self.user, 'is_moderator', False)
        data['votes_balance'] = getattr(self.user, 'votes_balance', 0)
        data['balance'] = str(getattr(self.user, 'balance', 0))
        return data

class UserSerializer(serializers.ModelSerializer):
    votes_balance = serializers.IntegerField(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'votes_balance']

from .models import UserNotification

class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = ['id', 'message', 'created_at', 'is_read']