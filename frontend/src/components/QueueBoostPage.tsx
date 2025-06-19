import React from 'react';
import './QueueBoostPage.css';

const QueueBoostPage: React.FC = () => {
  return (
    <div className="queue-container">
      <h2>Очередь на Будь первым и Gamemenu от 15₽</h2>
      <p className="queue-price">Начальная цена: 15₽ + ваша ставка</p>
      <p className="queue-duration">Длительность: 1 день</p>
      <div className="queue-slot">
        <p>Место: 11.06.2025 12:02:04</p>
        <p>Время: 11.06.2025 01:05:29</p>
        <p>Слот номер: 1</p>
      </div>
      <form className="queue-form">
        <input type="text" placeholder="IP:PORT" />
        <input type="number" placeholder="Укажите итоговую ставку" />
        <button type="submit">Поставить</button>
      </form>
    </div>
  );
};

export default QueueBoostPage;
