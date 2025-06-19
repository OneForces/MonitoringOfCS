// src/components/ServiceCheckout.tsx
import React, { useState } from 'react';
import axios from '../api/axios';
import './ServiceCheckout.css';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface Service {
  id: number;
  name: string;
  price_per_unit: string;
  service_type: 'boost' | 'color';
  available_colors?: string[];
}

interface Props {
  server: Server;
  service: Service;
  onBack: () => void;
}

const ServiceCheckout: React.FC<Props> = ({ server, service, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleBalancePayment = async () => {
    try {
      const res = await axios.post('/promotions/pay-from-balance/', {
        server_id: server.id,
        service_id: service.id,
        quantity,
        color: service.service_type === 'color' ? color : null,
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        setSuccessMessage('✅ Услуга успешно активирована с баланса!');
        setTimeout(() => {
          setSuccessMessage('');
          onBack();
        }, 2000);
      } else {
        alert('Ошибка при оплате с баланса');
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка при оплате с баланса');
    }
  };

  return (
    <div className="service-checkout">
      <h3>Покупка услуги</h3>
      <p><strong>СЕРВЕР:</strong> {server.name}</p>
      <p><strong>УСЛУГА:</strong> {service.name}</p>

      {service.service_type === 'color' && (
        <>
          <p>Выберите цвет:</p>
          <div className="color-options">
            {service.available_colors?.map((c) => (
              <button
                key={c}
                className={color === c ? 'selected' : ''}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </>
      )}

      {service.service_type === 'boost' && (
        <>
          <p>Выберите количество:</p>
          <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
            {[1, 3, 5, 11, 30, 50].map(q => (
              <option key={q} value={q}>
                {q} круг{q > 1 ? 'ов' : ''} — {Number(service.price_per_unit) * q} руб
              </option>
            ))}
          </select>
        </>
      )}

      <p className="total">Итого: {Number(service.price_per_unit) * quantity} руб</p>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="action-buttons">
        <button className="balance-pay-button" onClick={handleBalancePayment}>
          Оплатить с баланса
        </button>
        <button className="back-button" onClick={onBack}>← Назад</button>
      </div>
    </div>
  );
};

export default ServiceCheckout;
