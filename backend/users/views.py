# users/views.py

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils.timezone import now

from servers.models import Server, Vote
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_moderator": user.is_moderator,
            "votes_balance": user.votes_balance,
            "balance": str(user.balance),
            "level": user.level,
        })


class VoteServerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, server_id):
        user = request.user
        today = now().date()

        is_upvote = request.data.get("is_upvote", True)

        already_voted = Vote.objects.filter(
            user=user,
            server_id=server_id,
            created_at__date=today
        ).exists()

        if already_voted:
            return Response(
                {"detail": "Вы уже голосовали за этот сервер сегодня."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            server = Server.objects.get(id=server_id)
        except Server.DoesNotExist:
            return Response({"detail": "Сервер не найден."}, status=404)

        Vote.objects.create(user=user, server=server, is_upvote=is_upvote)
        return Response({"detail": "Голос успешно засчитан."})


class UserBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "balance": str(request.user.balance),
            "votes_balance": request.user.votes_balance
        })


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from .models import UserNotification
from .serializers import UserNotificationSerializer
from rest_framework import viewsets, permissions

class UserNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNotification.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
