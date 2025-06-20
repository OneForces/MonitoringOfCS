from django.urls import path
from .views import RegisterView, CurrentUserAPIView, VoteServerAPIView
from .views import UserBalanceAPIView, CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
    path('vote/<int:server_id>/', VoteServerAPIView.as_view(), name='vote-server'),
    path('balance/', UserBalanceAPIView.as_view()),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
