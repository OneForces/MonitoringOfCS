// src/pages/ServerDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
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

interface PurchasedServiceStub {
  id: number;
  service: string;
  expires_at: string;
  extra_description?: string;
}

const ServerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [server, setServer] = useState<Server | null>(null);

  const fakeServices: PurchasedServiceStub[] = [
    {
      id: 1,
      service: 'Премиум место и GAMEMENU от 10р',
      expires_at: '2025-06-21T17:27:00',
      extra_description: 'Место № 2',
    },
    {
      id: 2,
      service: 'BOOST и GAMEMENU от 15р',
      expires_at: '2025-06-30T13:12:00',
      extra_description: 'Количество кругов: 31',
    },
    {
      id: 3,
      service: 'VIP статус от 290р',
      expires_at: '2025-07-08T13:36:00',
    },
    {
      id: 4,
      service: 'Цвет 190р / 30 дней',
      expires_at: '2025-07-05T20:33:00',
      extra_description: 'Цвет: Жёлтый',
    },
  ];

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
        <div className="server-info-left">
          <h2 className="server-title">Сервер: {server.name}</h2>
          <ul className="server-info-list">
            <li><strong>IP:</strong> {server.ip}:{server.port}</li>
            <li><strong>Карта:</strong> <span className="map-name">{server.map || '—'}</span></li>
            <li><strong>Игроков:</strong> {server.players !== undefined ? `${server.players} / ${server.maxPlayers}` : '—'}</li>
            <li><strong>Страна:</strong> {server.country || '—'}</li>
            <li><strong>Лайков:</strong> {server.likes ?? 0}</li>
            <li><strong>VIP:</strong> {server.isVip ? 'Да' : 'Нет'}</li>
            <li><strong>Онлайн:</strong> {server.isOnline ? 'Да' : 'Нет'}</li>
          </ul>
        </div>

        {server.map && (
          <div className="server-map-preview">
            <img
              src={`/cs16_maps/${server.map}.jpg`}
              alt={server.map}
              className="map-image"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
      </div>

      {/* 🔧 Затычка для отображения услуг */}
      <div className="purchased-services">
        <h3>Услуги</h3>
        <ul className="purchased-services-list">
          {fakeServices.map((s) => (
            <li key={s.id}>
              <span className="service-name">{s.service}</span>
              {s.extra_description && <span className="service-extra"> ({s.extra_description})</span>}
              <span className="service-expiration">
                {' '}Оплачено до: {new Date(s.expires_at).toLocaleDateString('ru-RU')} [{new Date(s.expires_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}]
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServerDetailsPage;
