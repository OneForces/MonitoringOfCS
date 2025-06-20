// src/components/ServiceCheckout.tsx
import React, { useState } from 'react';
import './ServiceCheckout.css';

export interface Server {
  id: number;
  name: string;
  ip: string;
  port: string;
  map: string;
  players: number;
  maxPlayers: number;
  country: string;
  isVip?: boolean;
  isOnline: boolean;
  votes: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price_per_unit: string;
  service_type: 'boost' | 'color' | 'votes';
  duration_days: number;
  available_colors?: string[];
}

interface ServiceCheckoutProps {
  server: Server | undefined;
  service: Service;
  onBack: () => void;
  onSuccess?: () => void;
}

const ServiceCheckout: React.FC<ServiceCheckoutProps> = ({
  server,
  service,
  onBack,
  onSuccess,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [voteCount, setVoteCount] = useState<number>(1);
  const [success, setSuccess] = useState(false);

  const calculatePrice = (): number => {
    if (service.service_type === 'votes') {
      return parseFloat(service.price_per_unit) * voteCount;
    } else {
      return parseFloat(service.price_per_unit) * selectedOption;
    }
  };

  const handlePayment = async () => {
    // Здесь должна быть логика POST-запроса на покупку с use_balance
    setSuccess(true);
    if (onSuccess) await onSuccess();
  };

  return (
    <div className="service-checkout-container">
      <div className="checkout-box">
        <h2>Покупка услуги</h2>
        <div className="checkout-info">
          <div><span className="label">СЕРВЕР:</span> <span className="value">{server ? `${server.name} (${server.ip}:${server.port})` : 'Не выбран'}</span></div>
          <div><span className="label">УСЛУГА:</span> <span className="value">{service.name}</span></div>
        </div>

        {service.service_type === 'boost' && (
          <div className="form-group">
            <label>Выберите количество:</label>
            <select value={selectedOption} onChange={(e) => setSelectedOption(Number(e.target.value))}>
              <option value={1}>1 круг — 15 руб</option>
              <option value={3}>3 кругов — 45 руб</option>
              <option value={5}>5 кругов — 75 руб</option>
              <option value={11}>11 кругов — 165 руб</option>
              <option value={30}>30 кругов — 450 руб</option>
              <option value={50}>50 кругов — 750 руб</option>
            </select>
          </div>
        )}

        {service.service_type === 'color' && (
          <div className="form-group">
            <label>Выберите цвет:</label>
            <div className="color-options">
              {service.available_colors?.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  className={selectedColor === color ? 'selected' : ''}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        {service.service_type === 'votes' && (
          <div className="form-group">
            <label htmlFor="voteCount">Введите количество голосов:</label>
            <input
              type="number"
              id="voteCount"
              min={1}
              value={voteCount}
              onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        )}

        <div className="total">Итого: {calculatePrice()} руб</div>

        <div className="checkout-actions">
          <button className="btn-buy" onClick={handlePayment}>
            Оплатить с баланса
          </button>
          <button className="btn-back" onClick={onBack}>← Назад</button>
        </div>

        {success && <div className="success-message">Покупка успешно совершена!</div>}
      </div>
    </div>
  );
};

export default ServiceCheckout;
