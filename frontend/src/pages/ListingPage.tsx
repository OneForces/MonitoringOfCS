import React, { useEffect, useState } from 'react';
import './ListingPage.css';
import api from '../api/axios';

interface ServerInfo {
  server_name: string;
  end_date: string;
}

interface ListingService {
  id: number;
  name: string;
  description: string;
  listing_limit: number;
  used: number;
  next_slot: string;
  servers: ServerInfo[];
}

const ListingPage: React.FC = () => {
  const [services, setServices] = useState<ListingService[]>([]);

  const currentTime = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    api.get('/promotions/listing-services/')
      .then(res => setServices(res.data))
      .catch(err => console.error('Ошибка загрузки листинга:', err));
  }, []);

  const renderAvailable = (s: ListingService) => {
    if (s.listing_limit === 0) return '∞';
    return `${s.listing_limit - s.used} из ${s.listing_limit}`;
  };

  return (
    <div className="listing-page">
      <h2>Листинг услуг</h2>
      <p className="current-time"><strong>Текущее время:</strong> {currentTime}</p>

      <section className="listing-table">
        <table>
          <thead>
            <tr>
              <th>Услуга</th>
              <th>Описание</th>
              <th>Свободные места</th>
              <th>Ближайшее место</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{renderAvailable(service)}</td>
                <td>{service.next_slot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Список серверов под таблицей */}
      <section className="listing-servers">
        {services.map(service => (
          <div key={service.id} className="service-block">
            <h4>Услуга: {service.name}</h4>
            {service.servers.length > 0 ? (
              <div className="listing-service-table">
                <div className="listing-service-header">
                  <strong>Сервер</strong>
                  <strong>До</strong>
                </div>
                {service.servers.map((srv, idx) => (
                  <div key={idx} className="listing-service-row">
                    <span>{srv.server_name}</span>
                    <span>{srv.end_date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Нет активных серверов</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default ListingPage;
