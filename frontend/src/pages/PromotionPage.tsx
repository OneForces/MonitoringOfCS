import React, { useState } from 'react';
import './PromotionPage.css';

const promotions = [
  {
    id: 'top',
    title: '🔝 Поднять в топ',
    description: 'Ваш сервер отобразится первым в списке.',
    price: 50,
  },
  {
    id: 'highlight',
    title: '🌈 Выделить цветом',
    description: 'Привлечёт внимание цветной рамкой.',
    price: 30,
  },
  {
    id: 'pin',
    title: '📌 Закрепить',
    description: 'Сервер будет закреплён вверху на 7 дней.',
    price: 70,
  },
];

const PromotionPage: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleBuy = () => {
    if (!selected) return alert('Выберите вариант продвижения');
    alert(`Вы выбрали: ${selected}. Переход к оплате...`);
    // Тут будет переход на оплату
  };

  return (
    <div className="promotion-container">
      <h2 className="promotion-title">Продвижение сервера</h2>
      <div className="promotion-options">
        {promotions.map(promo => (
          <div
            key={promo.id}
            className={`promotion-card ${selected === promo.id ? 'selected' : ''}`}
            onClick={() => setSelected(promo.id)}
          >
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
            <span>{promo.price}₽</span>
          </div>
        ))}
      </div>
      <button className="promotion-button" onClick={handleBuy}>
        Перейти к оплате
      </button>
    </div>
  );
};

export default PromotionPage;
