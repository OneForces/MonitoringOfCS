from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, create_manual_donation
from payments.views import AdminStatsView

router = DefaultRouter()
router.register(r'', PaymentViewSet)

urlpatterns = [
    path('manual-donation/', create_manual_donation, name='manual_donation'),
    path('admin-stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),

]

