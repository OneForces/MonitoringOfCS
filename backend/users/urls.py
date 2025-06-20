# backend/users/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CurrentUserAPIView,
    VoteServerAPIView,
    UserBalanceAPIView,
    CustomTokenObtainPairView,
    UserNotificationViewSet,
)

router = DefaultRouter()
router.register(r'notifications', UserNotificationViewSet, basename='user-notifications')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
    path('vote/<int:server_id>/', VoteServerAPIView.as_view(), name='vote-server'),
    path('balance/', UserBalanceAPIView.as_view(), name='user-balance'),

    # Кастомная JWT авторизация с полем is_superuser
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Подключаем router.urls
    path('', include(router.urls)),
]
