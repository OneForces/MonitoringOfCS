import React, { useState } from 'react';
import './DiscountsPage.css';

const DiscountsPage: React.FC = () => {
  const [agree, setAgree] = useState(false);
  const [resources, setResources] = useState('');

  const handleSubmit = () => {
    if (!agree || !resources.trim()) {
      alert('Пожалуйста, заполните поле и подтвердите согласие.');
      return;
    }
    alert('✅ Заявка отправлена!');
  };

  return (
    <div className="discounts-container">
      <h2>Скидки</h2>

      <div className="partner-block">
        <h3>Партнерская программа</h3>
        <div className="info-box">
          Мы начисляем бонусные рубли на ваш счёт за уникальные скачивания нашей сборки<br />
          <a href="#">Условия сотрудничества</a>
        </div>
        <textarea
          placeholder="Укажите ресурсы, где будут распространяться партнерские ссылки"
          value={resources}
          onChange={(e) => setResources(e.target.value)}
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          С условиями ознакомлен и согласен
        </label>
        <button onClick={handleSubmit}>ОТПРАВИТЬ ЗАЯВКУ НА СОТРУДНИЧЕСТВО</button>
      </div>

      <div className="tier-block">
        <h3>Накопительная</h3>
        <div className="info-box">
          При пополнении баланса или покупке услуг, сумма потраченных средств растет,
          достигая некой установленной отметки вы получаете соответствующий % скидки
          на покупку и продление всех услуг.
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Название</th>
              <th>Скидка</th>
              <th>Необходимо потратить</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Бронза</td><td>5%</td><td>5000 руб (Осталось потратить 5000 руб)</td></tr>
            <tr><td>2</td><td>Золото</td><td>10%</td><td>10000 руб (Осталось 10000 руб)</td></tr>
            <tr><td>3</td><td>Платина</td><td>15%</td><td>15000 руб (Осталось 15000 руб)</td></tr>
            <tr><td>4</td><td>Core</td><td>20%</td><td>150000 руб (Осталось 150000 руб)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountsPage;
