import a2s
import socket
from servers.models import Server
from django.utils.timezone import now

def ping_server(address, port):
    try:
        info = a2s.info((address, port), timeout=3)

        # 🔄 Обновим last_check в базе, если сервер найден
        try:
            server = Server.objects.get(ip=address, port=port)
            server.last_check = now()
            server.current_players = info.player_count
            server.max_players = info.max_players
            server.map = info.map_name
            server.save(update_fields=["last_check", "current_players", "max_players", "map"])
        except Server.DoesNotExist:
            pass  # Сервер не зарегистрирован в базе — пропускаем

        return {
            "name": info.server_name,
            "map": info.map_name,
            "players": info.player_count,
            "max_players": info.max_players,
            "ping_success": True,
        }

    except (a2s.BrokenMessageError, socket.timeout, ConnectionRefusedError, TimeoutError, ConnectionResetError) as e:
        return {
            "ping_success": False,
            "error": str(e)
        }
