import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  users: number;
  votes: number;
  services: number;
  downloads: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn("❌ Токен отсутствует");
      navigate('/');
      return;
    }

    const payloadBase64 = token.split('.')[1];
    try {
      const decodedPayload = JSON.parse(atob(payloadBase64));
      console.log("✅ JWT payload:", decodedPayload);

      if (!decodedPayload.is_superuser) {
        console.warn("❌ Пользователь НЕ суперюзер");
        navigate('/');
        return;
      }
    } catch (e) {
      console.error("❌ Ошибка при декодировании JWT:", e);
      navigate('/');
      return;
    }

    axios.get('http://localhost:8000/api/payments/admin-stats/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("✅ Данные admin-stats получены:", res.data);
        setStats(res.data);
      })
      .catch(err => {
        console.warn("❌ Ошибка при запросе admin-stats", err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/');
        }
      });
  }, [navigate]);

  if (!stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#888' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Админ-панель</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard title="Пользователи" value={stats.users} />
        <StatCard title="Голоса (всего)" value={stats.votes} />
        <StatCard title="Купленные услуги" value={stats.services} />
        <StatCard title="Скачивания сборок" value={stats.downloads} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div style={{
    padding: '1.5rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #e9d8ff, #f3e8ff)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '250px',
    textAlign: 'center'
  }}>
    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#555' }}>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#222' }}>{value}</p>
  </div>
);

export default AdminDashboard;
