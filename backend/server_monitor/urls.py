from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from users.views import CustomTokenObtainPairView  # 👈 здесь
from rest_framework_simplejwt.views import TokenRefreshView

def root(request):
    return JsonResponse({"message": "API is running!"})

urlpatterns = [
    path('', root),
    path('admin/', admin.site.urls),
    path('api/servers/', include('servers.urls')),
    path('api/users/', include('users.urls')),
    path('api/promotions/', include('promotions.urls')),
    path('api/payments/', include('payments.urls')),

    # 👇 Заменили TokenObtainPairView на кастомную
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
