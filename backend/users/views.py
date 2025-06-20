from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.db import IntegrityError
from .serializers import RegisterSerializer
from servers.models import Server, Vote  # импортируем модели серверов и голосов

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
        })


class VoteServerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, server_id):
        user = request.user
        today = now().date()

        # ⚠️ Читаем поле из JSON тела
        is_upvote = request.data.get("is_upvote", True)

        # Проверяем наличие голоса за сегодня
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

        # Создаём голос с направлением
        Vote.objects.create(user=user, server=server, is_upvote=is_upvote)

        return Response({"detail": "Голос успешно засчитан."})

class UserBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"balance": str(request.user.balance)})
    
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer