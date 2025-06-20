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
  description: string;
  price_per_unit: string;
  service_type: 'boost' | 'color' | 'votes';
  duration_days: number;
  available_colors?: string[];
}

interface Props {
  server?: Server;
  service: Service;
  onBack: () => void;
}

const ServiceCheckout: React.FC<Props> = ({ server, service, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleBalancePayment = async () => {
    try {
      let res;

      if (service.service_type === 'votes') {
        // Покупка голосов
        res = await axios.post('/promotions/purchase/votes/', {
          votes: quantity,
          use_balance: true
        }, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Обычные услуги
        res = await axios.post('/promotions/pay-from-balance/', {
          server_id: server?.id ?? null,
          service_id: service.id,
          quantity,
          color: service.service_type === 'color' ? color : null,
        }, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
      }

      if (res.data.success || res.status === 200) {
        setSuccessMessage('✅ Услуга успешно активирована с баланса!');
        setTimeout(() => {
          setSuccessMessage('');
          onBack();
        }, 2000);
      } else {
        alert(res.data?.detail || 'Ошибка при оплате с баланса');
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка при оплате с баланса');
    }
  };

  return (
    <div className="service-checkout">
      <h3>Покупка услуги</h3>
      {server ? (
        <p><strong>СЕРВЕР:</strong> {server.name}</p>
      ) : (
        <p><strong>Тип:</strong> Покупка голосов</p>
      )}
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

      {service.service_type === 'boost' || service.service_type === 'votes' ? (
        <>
          <p>Выберите количество:</p>
          <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
            {[1, 3, 5, 11, 30, 50, 100].map(q => (
              <option key={q} value={q}>
                {q} шт. — {Number(service.price_per_unit) * q} руб
              </option>
            ))}
          </select>
        </>
      ) : null}

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
