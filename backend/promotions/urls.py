# backend/promotions/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    AvailableServicesView,
    BuyServiceView,
    ActiveServicesView,
    robokassa_result,
    robokassa_success,
    robokassa_fail,
    CreateBalanceTopUpView,
    UserBalanceView,
    BalancePaymentView,
    PurchasedServiceViewSet,
    ListingServicesView,
    purchase_votes,
)



router = DefaultRouter()
router.register(r'purchased-services', PurchasedServiceViewSet, basename='purchasedservice')


urlpatterns = [
    path('services/', AvailableServicesView.as_view()),
    path('services/buy/', BuyServiceView.as_view()),
    path('servers/<int:server_id>/services/', ActiveServicesView.as_view()),
    path('robokassa/result/', robokassa_result),
    path('robokassa/success/', robokassa_success),
    path('robokassa/fail/', robokassa_fail),
    path('balance/topup/', CreateBalanceTopUpView.as_view()),
    path('balance/', UserBalanceView.as_view(), name='user-balance'),
    path("pay-from-balance/", BalancePaymentView.as_view()),
    path('', include(router.urls)),
    path('listing-services/', ListingServicesView.as_view(), name='listing-services'),
    path('purchase/votes/', purchase_votes, name='purchase-votes'),
]
