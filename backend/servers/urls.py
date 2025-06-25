from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServerViewSet, ServerPingView, MyServersAPIView, ServerStatsAPIView, download_build, DownloadStatsView, DailyDownloadStatsView
from promotions.views import CreateBalanceTopUpView


router = DefaultRouter()
router.register(r'', ServerViewSet)

urlpatterns = [
    path('ping/', ServerPingView.as_view(), name="server-ping"),
    path('my/', MyServersAPIView.as_view(), name="my-servers"),
    path('stats/', ServerStatsAPIView.as_view(), name='server-stats'),
    path("robokassa/balance/topup/", CreateBalanceTopUpView.as_view(), name="balance_topup"),
    path('', include(router.urls)),
    path('download/<str:build_name>/', download_build, name='download_build'),
    path('downloads/stats/', DownloadStatsView.as_view(), name='download_stats'),
    path('downloads/daily/', DailyDownloadStatsView.as_view(), name='daily-download-stats'),
]