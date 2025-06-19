import React, { useEffect, useState } from 'react';
import './StatsPage.css';
import { Line } from 'react-chartjs-2';
import api from '../api/axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [downloads, setDownloads] = useState<{ build_name: string; total: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('servers/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Ошибка при получении статистики серверов:', error);
      }
    };

    const fetchDownloads = async () => {
      try {
        const res = await api.get('servers/downloads/stats/');
        setDownloads(res.data);
      } catch (err) {
        console.error('Ошибка при получении загрузок:', err);
      }
    };

    fetchStats();
    fetchDownloads();
  }, []);

  if (!stats || !Array.isArray(stats.last7Days)) {
    return <div className="stats-container">Загрузка...</div>;
  }

  const chartData = {
    labels: stats.last7Days.map((d: any) => d.date),
    datasets: [
      {
        label: 'Новые сервера (за день)',
        data: stats.last7Days.map((d: any) => d.count),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="stats-container">
      <h1>Статистика серверов</h1>

      <div className="stats-overview">
        <p>Всего серверов: <strong>{stats.totalServers}</strong></p>
        <p>Активных сегодня: <strong>{stats.activeToday}</strong></p>
        <p>Новых за неделю: <strong>{stats.newThisWeek}</strong></p>
      </div>

      <div className="stats-chart">
        <Line data={chartData} />
      </div>

      <div className="download-stats">
        <h2>Скачивания сборок</h2>
        {downloads.length > 0 ? (
          <ul>
            {downloads.map((item, idx) => (
              <li key={idx}>
                <strong>{item.build_name}</strong>: {item.total} скачиваний
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет данных о загрузках</p>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
