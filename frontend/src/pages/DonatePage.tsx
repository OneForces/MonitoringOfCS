// frontend/src/pages/DonatePage.tsx

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './DonatePage.css';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
}

const DonatePage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<number | null>(null);

  useEffect(() => {
    axios.get('/servers/')
      .then((res) => setServers(res.data))
      .catch(() => setServers([]));
  }, []);

  const handleRedirectToRobokassa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    try {
      const res = await axios.post('/api/robokassa/start/', {
        server_id: selectedServer,
      });

      if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        alert('Ошибка при получении ссылки для оплаты');
      }
    } catch (err) {
      alert('Ошибка запроса: ' + (err as any)?.response?.data?.detail || 'неизвестно');
    }
  };

  return (
    <div className="donate-container">
      <h2>Покупка голосов через Робокассу</h2>
      <form onSubmit={handleRedirectToRobokassa}>
        <div>
          <label>Сервер для доната:</label>
          <select
            required
            value={selectedServer ?? ''}
            onChange={(e) => setSelectedServer(Number(e.target.value))}
          >
            <option value="">-- Выберите сервер --</option>
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name} ({server.ip}:{server.port})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Перейти к оплате</button>
      </form>
    </div>
  );
};

export default DonatePage;
