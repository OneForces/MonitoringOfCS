from rest_framework import viewsets
from .models import Payment
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
