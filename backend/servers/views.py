# backend/servers/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils.timezone import now, timedelta, localtime
from django.http import HttpResponse
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import Server, DownloadStat
from .serializers import ServerSerializer
from .steam_ping import ping_server


class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all().prefetch_related('votes')
    serializer_class = ServerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ServerPingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ip = request.data.get("ip")
        port = request.data.get("port")

        if not ip or not port:
            return Response({"error": "ip and port are required"}, status=400)

        try:
            port = int(port)
        except ValueError:
            return Response({"error": "port must be an integer"}, status=400)

        result = ping_server(ip, port)
        return Response(result)


class MyServersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        servers = Server.objects.filter(owner=request.user)
        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data)


class ServerStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = now().date()
        week_ago = today - timedelta(days=6)

        last_7_days = []
        for i in range(7):
            day = week_ago + timedelta(days=i)
            count = Server.objects.filter(created_at__date=day).count()
            last_7_days.append({
                "date": day.isoformat(),
                "count": count
            })

        total_servers = Server.objects.count()
        active_today = Server.objects.filter(last_check__date=today).count()
        new_this_week = Server.objects.filter(created_at__gte=week_ago).count()

        data = {
            "totalServers": total_servers,
            "activeToday": active_today,
            "newThisWeek": new_this_week,
            "last7Days": last_7_days,
        }
        return Response(data)


class DownloadStatsView(APIView):
    def get(self, request):
        stats = (
            DownloadStat.objects
            .annotate(date=TruncDate('downloaded_at'))
            .values('date')
            .annotate(total=Count('id'))
            .order_by('date')
        )
        return Response(stats)


class DailyDownloadStatsView(APIView):
    def get(self, request):
        downloads = DownloadStat.objects.all()
        stats = {}

        for d in downloads:
            local_date = localtime(d.downloaded_at).date().isoformat()
            stats[local_date] = stats.get(local_date, 0) + 1

        result = [{"date": date, "total": count} for date, count in sorted(stats.items())]
        return Response(result)


def download_build(request, build_name):
    DownloadStat.objects.create(
        ip=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        build_name=build_name
    )
    file_path = f'static/builds/{build_name}.zip'
    try:
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="{build_name}.zip"'
            return response
    except FileNotFoundError:
        return HttpResponse("Сборка не найдена", status=404)


def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0]
    return request.META.get('REMOTE_ADDR')
