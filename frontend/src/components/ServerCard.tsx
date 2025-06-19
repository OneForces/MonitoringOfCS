import React, { useEffect, useState } from 'react';
import './ServerCard.css';
import api from '../api/axios';

export interface Server {
  id: number;
  name: string;
  ip: string;
  port: string;
  map: string;
  players: number;
  maxPlayers: number;
  country: string;
  isOnline?: boolean;
}

interface ServerCardProps {
  server: Server;
}

const ServerCard: React.FC<ServerCardProps> = ({ server }) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const checkPing = async () => {
      try {
        const response = await api.post('/servers/ping/', {
          ip: server.ip,
          port: server.port
        });
        setIsOnline(response.data.ping_success === true);
      } catch {
        setIsOnline(false);
      }
    };

    checkPing();
  }, [server.ip, server.port]);

  return (
    <div className="server-card">
      <div className="server-details">
        <div className="server-name">{server.name}</div>

        <div className="server-ip">
          {server.ip}:{server.port}
        </div>

        <div className="server-map">Карта: {server.map}</div>

        <div className="server-players">
          Игроки: {server.players}/{server.maxPlayers}
        </div>

        <div className="server-meta">
          <span className="server-country">🌍 {server.country.toUpperCase()}</span>
          <span className={isOnline ? 'online' : 'offline'}>
            {isOnline ? '🟢 Онлайн' : '🔴 Оффлайн'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;
