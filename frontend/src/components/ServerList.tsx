// src/components/ServerList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ServerList.css';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export interface Server {
  id: number;
  name: string;
  ip: string;
  port: string;
  map: string;
  players: number;
  maxPlayers: number;
  country: string;
  isVip?: boolean;
  isOnline: boolean;
  votes_count?: number; // ✅ заменили likes → votes_count
}

interface ServerListProps {
  servers: Server[];
  sort?: string;
  filter?: string;
  onVote?: (serverId: number) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, sort = 'popular', filter = 'all', onVote }) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Record<number, string>>({});

  const handleVote = async (serverId: number, isUpvote: boolean) => {
    if (!isAuthenticated) {
      setMessages((prev) => ({ ...prev, [serverId]: 'Только для авторизованных' }));
      return;
    }

    try {
      const response = await api.post(`/users/vote/${serverId}/`, {
        is_upvote: isUpvote,
      });
      setMessages((prev) => ({ ...prev, [serverId]: response.data.detail }));
      onVote?.(serverId); // 🔄 обновить список серверов после голосования
    } catch (err: any) {
      console.error('Ошибка голосования:', err.response?.data);
      const detail = err?.response?.data?.detail || 'Ошибка при голосовании';
      setMessages((prev) => ({ ...prev, [serverId]: detail }));
    }
  };

  let filtered = [...servers];

  if (filter === 'vip') {
    filtered = filtered.filter((s) => s.isVip);
  } else if (filter === 'onlineOnly') {
    filtered = filtered.filter((s) => s.isOnline);
  }

  if (sort === 'popular') {
    filtered.sort((a, b) => b.players - a.players);
  } else if (sort === 'new') {
    filtered.sort((a, b) => b.id - a.id);
  } else if (sort === 'online') {
    filtered.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
  } else if (sort === 'alphabetical') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <table className="server-table">
      <thead>
        <tr>
          <th>Игра</th>
          <th>Название</th>
          <th>Адрес</th>
          <th>Игроки</th>
          <th>Карта</th>
          <th>Онлайн</th>
          <th>Голоса</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((s) => (
          <tr
            key={s.id}
            className={`${s.isVip ? 'vip-row' : ''} ${s.isOnline ? 'active-row' : 'offline-row'}`}
          >
            <td>🎮 CS 1.6</td>
            <td>
              <Link to={`/server/${s.id}`} className="server-link">
                {s.name}
              </Link>
            </td>
            <td>
              <span className="flag">{(s.country || 'ru').toUpperCase()}</span> {s.ip}:{s.port}
            </td>
            <td>
              <span className="players-icon">👥</span> {s.players}/{s.maxPlayers}
            </td>
            <td>{s.map || <em>Не указана</em>}</td>
            <td>
              {s.isOnline ? (
                <span className="online-status green">🟢 Онлайн</span>
              ) : (
                <span className="online-status red">🔴 Оффлайн</span>
              )}
            </td>
            <td className="votes">
              <div className="vote-controls">
                <button title="Голос вверх" onClick={() => handleVote(s.id, true)}>➕</button>
                <button title="Голос вниз" onClick={() => handleVote(s.id, false)}>➖</button>
                <span className="star">⭐ {s.votes_count || 0}</span>
              </div>
              {messages[s.id] && <span className="vote-message">{messages[s.id]}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServerList;
