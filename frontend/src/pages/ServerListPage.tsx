// src/pages/ServerListPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServerList from '../components/ServerList';
import FeaturedServerBlock from '../components/FeaturedServerBlock';
import Pagination from '../components/Pagination';
import ServiceCheckout, { Service, Server } from '../components/ServiceCheckout';
import api from '../api/axios';
import './ServerListPage.css';

const ServerListPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('popular');
  const [filter, setFilter] = useState('all');
  const [searchParams] = useSearchParams();

  const [selectedServer, setSelectedServer] = useState<Server | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchServers = async () => {
    try {
      const res = await api.get('servers/');
      let baseServers: Server[] = res.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        ip: s.ip,
        port: String(s.port),
        map: s.map || '',
        players: 0,
        maxPlayers: 0,
        country: s.country || 'ru',
        isVip: s.is_vip ?? false,
        isOnline: false,
        votes: s.votes ?? 0,
      }));

      await Promise.all(
        baseServers.map(async (server: Server, idx: number) => {
          try {
            const pingRes = await api.post('/servers/ping/', {
              ip: server.ip,
              port: server.port,
            });
            if (pingRes.data.ping_success) {
              baseServers[idx].isOnline = true;
              baseServers[idx].players = pingRes.data.players || 0;
              baseServers[idx].maxPlayers = pingRes.data.max_players || 0;
              baseServers[idx].map = pingRes.data.map || '';
            }
          } catch {
            baseServers[idx].isOnline = false;
          }
        })
      );

      setServers(baseServers);
    } catch (err) {
      console.error('Ошибка при получении серверов:', err);
    }
  };

  const fetchUserBalance = async () => {
    try {
      await api.get('/users/balance/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
    } catch (err) {
      console.error('Ошибка при получении баланса:', err);
    }
  };

  const reloadData = async () => {
    await fetchServers();
    await fetchUserBalance();
  };

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

    let filtered = [...servers].filter((server) => {
      const matchesSearch = !search || server.name.toLowerCase().includes(search);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'vip' && server.isVip) ||
        (filter === 'onlineOnly' && server.isOnline);
      return matchesSearch && matchesFilter;
    });

    if (sort === 'popular') {
      filtered.sort((a, b) => b.players - a.players);
    } else if (sort === 'new') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sort === 'online') {
      filtered.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
    } else if (sort === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredServers(filtered);
  }, [servers, searchParams, filter, sort]);

  return (
    <div className="server-list-page">
      <FeaturedServerBlock />

      <h2 className="page-title">Листинг серверов CS 1.6</h2>

      <div className="filters">
        <label>Сортировка:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="popular">По популярности</option>
          <option value="new">Новые</option>
          <option value="online">Онлайн</option>
          <option value="alphabetical">По алфавиту</option>
        </select>

        <label>Фильтр:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="vip">VIP</option>
          <option value="onlineOnly">Только онлайн</option>
        </select>
      </div>

      {!showCheckout ? (
        <>
          <ServerList
            servers={filteredServers}
            sort={sort}
            filter={filter}
            onVote={() => reloadData()}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={216}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        selectedServer && selectedService && (
          <ServiceCheckout
            server={selectedServer}
            service={selectedService}
            onBack={() => setShowCheckout(false)}
            onSuccess={reloadData}
          />
        )
      )}
    </div>
  );
};

export default ServerListPage;
