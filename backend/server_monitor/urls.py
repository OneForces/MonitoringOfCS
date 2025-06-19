from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def root(request):
    return JsonResponse({"message": "API is running!"})

urlpatterns = [
    path('', root),
    path('admin/', admin.site.urls),
    path('api/servers/', include('servers.urls')),
    path('api/users/', include('users.urls')),
    path('api/promotions/', include('promotions.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('payments.urls')),
]
