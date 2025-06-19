from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, create_manual_donation

router = DefaultRouter()
router.register(r'', PaymentViewSet)

urlpatterns = [
    path('manual-donation/', create_manual_donation, name='manual_donation'),
    path('', include(router.urls)),
]
