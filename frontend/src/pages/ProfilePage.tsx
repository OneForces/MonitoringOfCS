// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import ProfileServices from '../components/ProfileServices';
import ServerCard from '../components/ServerCard';
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import QueueBoostPage from '../components/QueueBoostPage';
import QueuePremiumPage from '../components/QueuePremiumPage';
import QueueVipPage from '../components/QueueVipPage';
import BillsPage from '../components/BillsPage';
import DiscountsPage from '../components/DiscountsPage';
import ProfileLogs from '../components/ProfileLogs';
import ProfileSettings from '../components/ProfileSettings';
import { Server as FullServer } from '../components/ServiceCheckout';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
  map: string;
  current_players: number;
  max_players: number;
  is_online: boolean;
  likes?: number;
  upvotes?: number;
  downvotes?: number;
}

interface UserNotification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

const sections = [
  'Личный кабинет',
  'Услуги',
  'Очередь на Будь первым',
  'Очередь на Премиум',
  'Очередь на VIP',
  'Счета',
  'Скидки',
  'Логи',
  'Настройки',
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Личный кабинет');
  const [servers, setServers] = useState<Server[]>([]);
  const [balance, setBalance] = useState("0.00");
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const fetchMyServers = async () => {
    try {
      const res = await axios.get('/servers/my/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      let baseServers: Server[] = res.data;

      await Promise.all(
        baseServers.map(async (server, idx) => {
          try {
            const pingRes = await axios.post(
              '/servers/ping/',
              { ip: server.ip, port: server.port },
              {
                headers: {
                  Authorization: `Token ${localStorage.getItem('token')}`,
                },
              }
            );

            baseServers[idx] = {
              ...server,
              is_online: !!pingRes.data.ping_success,
              current_players: pingRes.data.players ?? 0,
              max_players: pingRes.data.max_players ?? 0,
              map: pingRes.data.map ?? server.map,
            };
          } catch {
            baseServers[idx] = { ...server, is_online: false };
          }
        })
      );

      setServers([...baseServers]);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error('Ошибка при получении серверов:', err.response?.data || err.message);
      } else {
        console.error('Неизвестная ошибка при получении серверов');
      }
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get('/users/balance/', {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setBalance(res.data.balance);
    } catch {
      console.error("Ошибка получения баланса");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/users/notifications/', {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(res.data);
    } catch {
      console.error("Ошибка загрузки уведомлений");
    }
  };

  useEffect(() => {
    fetchMyServers();
    fetchBalance();
    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить сервер?')) return;
    try {
      await axios.delete(`/servers/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setServers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const handlePromote = (id: number) => {
    navigate(`/promote?server_id=${id}`);
  };

  const handleAddServer = () => {
    navigate('/add-server');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Личный кабинет':
        return (
          <>
            <h2>Кабинет</h2>

            <div className="balance-box">
              <div className="balance-info">
                <span className="balance-label">Ваш баланс:</span>
                <span className="balance-amount">{balance} руб</span>
                <button className="topup-btn" onClick={() => navigate('/donate')}>
                  Пополнить баланс
                </button>
              </div>
            </div>

            {/* Уведомления */}
            {notifications.length > 0 && (
              <div className="notification-box">
                <h3>Уведомления</h3>
                <ul>
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <strong>{new Date(n.created_at).toLocaleString()}:</strong> {n.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {servers.length === 0 ? (
              <p>Список ваших серверов пуст</p>
            ) : (
              servers.map((server) => (
                <div key={server.id} className="server-box">
                  <ServerCard
                    server={{
                      id: server.id,
                      name: server.name,
                      ip: server.ip,
                      port: server.port.toString(),
                      map: server.map,
                      players: server.current_players,
                      maxPlayers: server.max_players,
                      country: 'ru',
                      isOnline: server.is_online,
                      likes: server.likes,
                      upvotes: server.upvotes,
                      downvotes: server.downvotes,
                    }}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => {
                        setActiveSection('Услуги');
                        localStorage.setItem('selectedServerId', String(server.id));
                      }}
                      className="promote-button"
                    >
                      Продвинуть
                    </button>
                    <button onClick={() => handleDelete(server.id)} className="delete-button">
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
            <button className="add-server" onClick={handleAddServer}>
              Добавить сервер
            </button>
          </>
        );

      case 'Услуги':
        return (
          <ProfileServices
            servers={servers.map((s) => ({
              id: s.id,
              name: s.name,
              ip: String(s.ip),
              port: String(s.port),
              map: s.map || '',
              players: s.current_players ?? 0,
              maxPlayers: s.max_players ?? 0,
              country: 'ru',
              isVip: false,
              isOnline: s.is_online ?? false,
              votes: 0,
            }))}
          />
        );
      case 'Очередь на Будь первым':
        return <QueueBoostPage />;
      case 'Очередь на Премиум':
        return <QueuePremiumPage />;
      case 'Очередь на VIP':
        return <QueueVipPage />;
      case 'Счета':
        return <BillsPage />;
      case 'Скидки':
        return <DiscountsPage />;
      case 'Логи':
        return <ProfileLogs />;
      case 'Настройки':
        return <ProfileSettings />;
      default:
        return <p>Раздел «{activeSection}» пока не реализован.</p>;
    }
  };

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <ul>
          {sections.map((section) => (
            <li
              key={section}
              className={section === activeSection ? 'active' : ''}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </li>
          ))}
        </ul>
      </aside>

      <main className="profile-content">{renderSection()}</main>
    </div>
  );
};

export default ProfilePage;
