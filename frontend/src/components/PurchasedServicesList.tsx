// frontend/components/PurchasedServicesList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PurchasedServicesList.css';

interface PurchasedService {
  id: number;
  service: string;
  expires_at: string;
  extra_description?: string;
}

export default function PurchasedServicesList({ serverId }: { serverId: number }) {
  const [services, setServices] = useState<PurchasedService[]>([]);

  useEffect(() => {
    axios
      .get(`/api/purchased-services/?server_id=${serverId}`)
      .then((res) => setServices(res.data))
      .catch((err) => console.error('Ошибка при загрузке услуг:', err));
  }, [serverId]);

  if (services.length === 0) return null;

  return (
    <div className="purchased-services">
      <h3>Услуги</h3>
      <ul className="purchased-services-list">
        {services.map((s) => (
          <li key={s.id}>
            <span className="service-name">{s.service}</span>
            {s.extra_description && (
              <span className="service-extra"> ({s.extra_description})</span>
            )}
            <span className="service-expiration">
              {' '}Оплачено до:{' '}
              {new Date(s.expires_at).toLocaleDateString('ru-RU')}{' '}
              [{new Date(s.expires_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}]
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
