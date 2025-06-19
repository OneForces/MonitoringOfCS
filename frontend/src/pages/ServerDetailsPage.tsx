import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import PurchasedServicesList from '../components/PurchasedServicesList';
import './ServerDetailsPage.css';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: string;
  map?: string;
  players?: number;
  maxPlayers?: number;
  country?: string;
  isVip?: boolean;
  isOnline?: boolean;
  likes?: number;
}

const ServerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<Server | null>(null);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const res = await api.get(`/servers/${id}/`);
        setServer(res.data);
      } catch (err) {
        console.error('Ошибка загрузки сервера:', err);
      }
    };

    fetchServer();
  }, [id]);

  // 🔄 Получаем актуальные данные через ping
  useEffect(() => {
    if (!server) return;

    const fetchPing = async () => {
      try {
        const res = await api.post('/servers/ping/', {
          ip: server.ip,
          port: server.port,
        });

        setServer(prev => prev && {
          ...prev,
          isOnline: res.data.ping_success,
          players: res.data.players || 0,
          maxPlayers: res.data.max_players || 0,
          map: res.data.map || prev.map,
        });
      } catch {
        setServer(prev => prev && { ...prev, isOnline: false });
      }
    };

    fetchPing();
  }, [server]);

  if (!server) return <div>Загрузка...</div>;

  return (
    <div className="server-details-container">
      <div className="server-details-card">
        <h2>Сервер: {server.name}</h2>
        <ul className="server-info-list">
          <li><strong>IP:</strong> {server.ip}:{server.port}</li>
          <li><strong>Карта:</strong> {server.map || '—'}</li>
          <li><strong>Игроков:</strong> {server.players !== undefined ? `${server.players} / ${server.maxPlayers}` : '—'}</li>
          <li><strong>Страна:</strong> {server.country || '—'}</li>
          <li><strong>Лайков:</strong> {server.likes ?? 0}</li>
          <li><strong>VIP:</strong> {server.isVip ? 'Да' : 'Нет'}</li>
          <li><strong>Онлайн:</strong> {server.isOnline ? 'Да' : 'Нет'}</li>
        </ul>
      </div>

      {/* Листинг купленных услуг снизу */}
      <PurchasedServicesList serverId={parseInt(id || '0')} />
    </div>
  );
};

export default ServerDetailsPage;
