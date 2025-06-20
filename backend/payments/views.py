from rest_framework import viewsets
from .models import Payment
from .models import PurchasedService, DownloadStat
from .serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ManualDonation
from .serializers import ManualDonationSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_manual_donation(request):
    serializer = ManualDonationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({"status": "ok", "message": "Заявка на донат зарегистрирована."})
    return Response(serializer.errors, status=400)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.db import models
from .models import PurchasedService, DownloadStat

User = get_user_model()

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_count = User.objects.count()
        votes_total = User.objects.aggregate(total_votes=models.Sum('votes_balance'))['total_votes'] or 0
        services_count = PurchasedService.objects.count()
        downloads_count = DownloadStat.objects.count()

        return Response({
            "users": users_count,
            "votes": votes_total,
            "services": services_count,
            "downloads": downloads_count,
        })
