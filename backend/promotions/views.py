# backend/promotions/views.py
from .serializers import ListingServiceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Service, ServerService, RobokassaTransaction
from servers.models import Server
from .serializers import ServiceSerializer, ServicePurchaseSerializer, ServerServiceSerializer
from decimal import Decimal
import hashlib
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils import timezone
from urllib.parse import quote
from .models import PurchasedService
from .serializers import PurchasedServiceSerializer

class AvailableServicesView(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class BuyServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ServicePurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data

        try:
            server = Server.objects.get(id=data['server_id'], owner=user)
        except Server.DoesNotExist:
            return Response({"error": "Сервер не найден"}, status=404)

        service = Service.objects.get(id=data['service_id'])
        quantity = data.get("quantity", 1)
        color = data.get("color", None)
        amount = f"{Decimal(service.price_per_unit) * quantity:.2f}"
        inv_id = RobokassaTransaction.objects.count() + 1

        # Подпись для demo-магазина
        signature = generate_robokassa_signature(
            login='demo',
            amount=amount,
            inv_id=inv_id,
            password1='qwerty'
        )

        # Создаём запись о транзакции
        RobokassaTransaction.objects.create(
            user=user,
            amount=amount,
            robokassa_inv_id=inv_id,
            service=service,
            server=server
        )

        # URL-кодируем Description (кириллица, пробелы, спецсимволы)
        description = quote(service.name)

        return Response({
            "payment_url": f"https://auth.robokassa.ru/Merchant/Index.aspx?"
                           f"MerchantLogin=demo"
                           f"&OutSum={amount}"
                           f"&InvId={inv_id}"
                           f"&Description={description}"
                           f"&SignatureValue={signature}"
                           f"&IsTest=1"
        })



class ActiveServicesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, server_id):
        user = request.user
        services = ServerService.objects.filter(server__id=server_id, user=user)
        serializer = ServerServiceSerializer(services, many=True)
        return Response(serializer.data)


@csrf_exempt
def robokassa_result(request):
    if request.method != "POST":
        return HttpResponse("Bad request", status=400)

    try:
        inv_id = int(request.POST.get('InvId'))
        out_sum = request.POST.get('OutSum')
        received_sig = request.POST.get('SignatureValue', '').lower()

        transaction = RobokassaTransaction.objects.get(robokassa_inv_id=inv_id)
        expected_sig = generate_robokassa_signature_result(out_sum, inv_id, password2="qwerty")

        if received_sig != expected_sig.lower():
            return HttpResponse("Invalid signature", status=400)

        # Помечаем транзакцию как проверенную
        transaction.is_verified = True
        transaction.save()

        # 👉 Пополнение баланса
        if transaction.is_balance_topup:
            transaction.user.balance += Decimal(out_sum)
            transaction.user.save()
            return HttpResponse(f"OK{inv_id}")

        # 👉 Покупка услуги
        service = transaction.service
        server = transaction.server
        user = transaction.user

        server_service = ServerService.objects.create(
            server=server,
            service=service,
            user=user,
            quantity=1,
            color=service.available_colors[0] if service.service_type == "color" and service.available_colors else None,
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(days=service.duration_days),
        )

        # Применение цвета к серверу
        if service.service_type == "color" and server_service.color:
            server.color = server_service.color
            server.save()

        return HttpResponse(f"OK{inv_id}")

    except RobokassaTransaction.DoesNotExist:
        return HttpResponse("Transaction not found", status=404)

    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)



@csrf_exempt
def robokassa_success(request):
    return HttpResponse("Оплата прошла успешно!")


@csrf_exempt
def robokassa_fail(request):
    return HttpResponse("Оплата не удалась :(")


def generate_robokassa_signature(login, amount, inv_id, password1):
    string_to_hash = f"{login}:{amount}:{inv_id}:{password1}"
    return hashlib.md5(string_to_hash.encode()).hexdigest()


def generate_robokassa_signature_result(out_sum, inv_id, password2):
    string = f"{out_sum}:{inv_id}:{password2}"
    return hashlib.md5(string.encode()).hexdigest()

class CreateBalanceTopUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        if not amount:
            return Response({"error": "Сумма не указана"}, status=400)

        try:
            amount = f"{Decimal(amount):.2f}"
        except:
            return Response({"error": "Неверная сумма"}, status=400)

        inv_id = RobokassaTransaction.objects.count() + 1000

        signature = hashlib.md5(f"demo:{amount}:{inv_id}:qwerty".encode()).hexdigest()

        RobokassaTransaction.objects.create(
            user=request.user,
            amount=amount,
            robokassa_inv_id=inv_id,
            is_balance_topup=True
        )

        return Response({
            "payment_url": f"https://auth.robokassa.ru/Merchant/Index.aspx?"
                           f"MerchantLogin=demo"
                           f"&OutSum={amount}"
                           f"&InvId={inv_id}"
                           f"&Description={quote('Пополнение баланса')}"
                           f"&SignatureValue={signature}"
                           f"&IsTest=1"
        })


class UserBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"balance": str(request.user.balance)})
    
class BalancePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        try:
            server_id = data.get("server_id")
            service_id = data.get("service_id")
            quantity = int(data.get("quantity", 1))
            selected_color = data.get("color")

            server = Server.objects.get(id=server_id, owner=user)
            service = Service.objects.get(id=service_id)

            total_cost = service.price_per_unit * quantity

            if user.balance < total_cost:
                return Response({"detail": "Недостаточно средств."}, status=status.HTTP_402_PAYMENT_REQUIRED)

            user.balance -= total_cost
            user.save()

            start = timezone.now()
            end = start + timezone.timedelta(days=service.duration_days)

            ServerService.objects.create(
                user=user,
                server=server,
                service=service,
                quantity=quantity,
                color=selected_color if service.service_type == "color" else None,
                start_date=start,
                end_date=end
            )

            if service.service_type == "color" and selected_color:
                server.color = selected_color
                server.save()

            return Response({"success": True})

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class PurchasedServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PurchasedService.objects.all().select_related('user', 'server', 'service')
    serializer_class = PurchasedServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        server_id = self.request.query_params.get('server_id')
        if server_id:
            queryset = queryset.filter(server__id=server_id)
        return queryset.order_by('-purchased_at')
    

from rest_framework.permissions import AllowAny

class ListingServicesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        services = Service.objects.filter(show_in_listing=True).order_by('priority')
        data = ListingServiceSerializer(services, many=True).data
        return Response(data)