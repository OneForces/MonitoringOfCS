import React from 'react';
import './QueueBoostPage.css'; // используем тот же CSS

const QueueVipPage: React.FC = () => {
  return (
    <div className="queue-container">
      <h2>Очередь на VIP статус от 290₽</h2>

      <p className="queue-price">Начальная цена: 290₽ + ваша ставка</p>
      <p><strong>Ставка</strong> для автодобавления без очереди: 490₽ + 290₽ на месяц (итого: 780₽)</p>
      <p className="queue-duration">Длительность: 30 дней</p>

      <div className="queue-slot">
        <p>Место: 12.06.2025 18:41:00</p>
        <p>Время: 11.06.2025 01:10:24</p>
        <p>Слот номер: 54</p>
      </div>

      <form className="queue-form">
        <select>
          <option value="">Выберите сервер</option>
          <option value="45.136.204.155:27015">45.136.204.155:27015</option>
        </select>
        <button type="submit">Выбрать сервер</button>
      </form>

      <hr style={{ margin: '32px 0' }} />

      <h3>Список серверов в очереди</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Адрес</th>
            <th>Ставка</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', padding: 12 }}>Свободно</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: 40 }}>История</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Адрес</th>
            <th>Сумма</th>
            <th>Срок</th>
            <th>Дата добавления</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>152.89.199.84:27044</td>
            <td>334.00 руб.</td>
            <td>30 дн.</td>
            <td>08.06.2025 21:44:03</td>
          </tr>
          <tr>
            <td>2</td>
            <td>152.89.199.84:27028</td>
            <td>780.00 руб.</td>
            <td>30 дн.</td>
            <td>06.06.2025 09:58:02</td>
          </tr>
          <tr>
            <td>3</td>
            <td>194.93.2.128:27015</td>
            <td>780.00 руб.</td>
            <td>30 дн.</td>
            <td>05.06.2025 16:52:02</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default QueueVipPage;
