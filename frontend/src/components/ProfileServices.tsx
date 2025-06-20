// src/components/ProfileServices.tsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ServiceCheckout, { Server as FullServer, Service as FullService } from './ServiceCheckout';
import './ProfileServices.css';

// Используем только типы из ServiceCheckout!
interface Props {
  servers: FullServer[];
}

const ProfileServices: React.FC<Props> = ({ servers }) => {
  const [services, setServices] = useState<FullService[]>([]);
  const [selectedServer, setSelectedServer] = useState<FullServer | null>(null);
  const [selectedService, setSelectedService] = useState<FullService | null>(null);

  useEffect(() => {
    axios.get('/promotions/services/').then(res => {
      setServices(res.data);
    });
  }, []);

  const voteServices = services.filter(s => s.service_type === 'votes');
  const otherServices = services.filter(s => s.service_type !== 'votes');

  if (selectedService?.service_type === 'votes') {
    return (
      <ServiceCheckout
        server={undefined}
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  if (selectedServer && selectedService) {
    return (
      <ServiceCheckout
        server={selectedServer}
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <div className="profile-services">
      <h2>Услуги сервера</h2>

      {!selectedServer ? (
        <>
          <div className="server-select">
            <label htmlFor="server">Выберите сервер:</label>
            <select
              id="server"
              onChange={(e) => {
                const selected = servers.find((s: FullServer) => s.id === parseInt(e.target.value));
                if (selected) setSelectedServer(selected);
              }}
            >
              <option value="">-- Выберите --</option>
              {servers.map((server: FullServer) => (
                <option key={server.id} value={server.id}>
                  {server.name} ({server.ip}:{server.port})
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <p><strong>СЕРВЕР:</strong> {selectedServer.name}</p>
          <button className="service-back-btn" onClick={() => setSelectedServer(null)}>
            ← Назад к выбору сервера
          </button>

          <h4>Покупка услуг</h4>
          <div className="service-list">
            {otherServices.map(service => (
              <div key={service.id} className="service-card">
                <strong>{service.name}</strong>
                <p>{service.description}</p>
                <p>от {service.price_per_unit} руб</p>
                <button className="buy-button" onClick={() => setSelectedService(service)}>
                  Оформить
                </button>
              </div>
            ))}
          </div>

          {voteServices.length > 0 && (
            <>
              <h4 style={{ marginTop: '40px' }}>Покупка голосов</h4>
              <div className="service-list">
                {voteServices.map(service => (
                  <div key={service.id} className="service-card votes-card">
                    <strong>{service.name}</strong>
                    <p>{service.description}</p>
                    <p>от {service.price_per_unit} руб</p>
                    <button
                      className="buy-button"
                      onClick={() => setSelectedService(service)}
                    >
                      Купить голоса
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileServices;
