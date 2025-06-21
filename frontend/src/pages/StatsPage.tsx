// frontend/src/pages/StatsPage.tsx

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
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [dailyDownloads, setDailyDownloads] = useState<{ date: string; total: number }[]>([]);

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
        const total = res.data.reduce((sum: number, item: any) => sum + item.total, 0);
        setTotalDownloads(total);
      } catch (err) {
        console.error('Ошибка при получении загрузок:', err);
      }
    };

    const fetchDailyDownloads = async () => {
      try {
        const res = await api.get('servers/downloads/daily/');
        setDailyDownloads(res.data);
      } catch (err) {
        console.error('Ошибка при получении ежедневной статистики загрузок:', err);
      }
    };

    fetchStats();
    fetchDownloads();
    fetchDailyDownloads();
  }, []);

  if (!stats || !Array.isArray(stats.last7Days)) {
    return <div className="stats-container">Загрузка...</div>;
  }

  const serverChartData = {
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

  const downloadChartData = {
    labels: dailyDownloads.map((d) => d.date),
    datasets: [
      {
        label: 'Скачивания сборок (за день)',
        data: dailyDownloads.map((d) => d.total),
        borderColor: 'rgba(153, 102, 255, 1)',
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
        <Line data={serverChartData} />
      </div>

      <div className="download-stats">
        <h2>Скачивания сборок</h2>
        <p><strong>Всего скачиваний:</strong> {totalDownloads}</p>
        <Line data={downloadChartData} />
        
      </div>
    </div>
  );
};

export default StatsPage;
