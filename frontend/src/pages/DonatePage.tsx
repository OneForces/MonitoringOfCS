import React, { useState } from 'react';
import { sendManualDonation } from '../api/manualDonation';
import './DonatePage.css';

const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const qrUrl = 'https://tbank.ru/cf/49yDaBtk68w';
  const recipient = 'Сагиров Инсаф Радилович';
  const paymentPurpose = 'Поддержка сервера';

  const handleCopy = () => {
    const text = `Получатель: ${recipient}
Ссылка: ${qrUrl}
Назначение: ${paymentPurpose}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Реквизиты скопированы в буфер обмена');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await sendManualDonation(Number(amount), comment);
      setSuccess('✅ Заявка успешно отправлена, ожидает подтверждения.');
      setAmount('');
      setComment('');
    } catch {
      setError('❌ Ошибка при отправке. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    <div className="donate-container">
      <h2>Поддержать сервер</h2>

      <div className="donate-qr">
        <img
            src="/QR.png"
            alt="QR Code"
            width={200}
            height={200}
        />
        <p><strong>Получатель:</strong> {recipient}</p>
        <p>
          <strong>Ссылка для перевода:</strong>{' '}
          <a href={qrUrl} target="_blank" rel="noreferrer">{qrUrl}</a>
        </p>
        <p><strong>Назначение:</strong> {paymentPurpose}</p>
        <button onClick={handleCopy}>Скопировать реквизиты</button>
      </div>

      <div className="donate-form">
        <form onSubmit={handleSubmit}>
          <label>Сумма (₽):</label>
          <input
            type="number"
            value={amount}
            required
            min="1"
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Свой номер телефона/карты для проверки оплаты:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit">Я оплатил</button>
        </form>
      </div>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default DonatePage;
