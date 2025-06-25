import React from 'react';
import './QueueBoostPage.css'; // Используем тот же стиль

const QueuePremiumPage: React.FC = () => {
  return (
    <div className="queue-container">
      <h2>Очередь на Премиум место и Gamemenu от 10₽</h2>
      <p className="queue-price">Начальная цена: 10₽ + ваша ставка</p>
      <p className="queue-duration">Длительность: 1 день</p>
      <div className="queue-slot">
        <p>Место: 11.06.2025 17:20:04</p>
        <p>Время: 11.06.2025 01:08:35</p>
        <p>Слот номер: 4</p>
      </div>
      <form className="queue-form">
        <select>
          <option value="">Выберите сервер</option>
          <option value="45.136.204.155:27015">45.136.204.155:27015</option>
          {/* Здесь позже будет динамически подгружаться список */}
        </select>
        <button type="submit">Выбрать сервер</button>
      </form>
    </div>
  );
};

export default QueuePremiumPage;
