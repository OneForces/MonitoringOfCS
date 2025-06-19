// frontend/components/PurchasedServicesList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PurchasedService {
  id: number;
  user: string;
  service: string;
  purchased_at: string;
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
    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <h3>Приобретённые услуги</h3>
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            <strong>{s.user}</strong> купил <em>{s.service}</em> — {new Date(s.purchased_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
