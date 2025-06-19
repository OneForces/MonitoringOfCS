// src/components/ProfileServices.tsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ServiceCheckout from './ServiceCheckout';
import './ProfileServices.css';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price_per_unit: string;
  service_type: 'boost' | 'color';
  duration_days: number;
  available_colors?: string[];
}

interface Props {
  servers: Server[];
}

const ProfileServices: React.FC<Props> = ({ servers }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    axios.get('/promotions/services/').then(res => {
      console.log('Полученные услуги:', res.data);
      setServices(res.data);
    });
  }, []);

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
        <div className="server-select">
          <label htmlFor="server">Выберите сервер:</label>
          <select
            id="server"
            onChange={(e) => {
              const selected = servers.find(s => s.id === parseInt(e.target.value));
              if (selected) setSelectedServer(selected);
            }}
          >
            <option value="">-- Выберите --</option>
            {servers.map(server => (
              <option key={server.id} value={server.id}>
                {server.name} ({server.ip}:{server.port})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <p><strong>СЕРВЕР:</strong> {selectedServer.name}</p>
          <button className="service-back-btn" onClick={() => setSelectedServer(null)}>
            ← Назад к выбору сервера
          </button>

          <h4>Покупка услуг</h4>
          <div className="service-list">
            {services.map(service => (
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
        </>
      )}
    </div>
  );
};

export default ProfileServices;
