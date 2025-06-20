// frontend/src/pages/DonatePage.tsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

interface Server {
  id: number;
  name: string;
  ip: string;
  port: number;
}

const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/servers/')
      .then((res) => setServers(res.data))
      .catch(() => setServers([]));
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post('/manual-donation/', {
        amount,
        comment,
        server: selectedServer, // Передаём сервер
      });
      setSuccess('Заявка успешно отправлена, ожидайте подтверждения.');
      setAmount('');
      setComment('');
      setSelectedServer(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Ошибка отправки заявки');
    }
  };

  return (
    <div>
      <h2>Ручное пополнение голосов</h2>
      <form onSubmit={handleDonate}>
        <div>
          <label>Сервер для доната:</label>
          <select value={selectedServer ?? ''} onChange={e => setSelectedServer(Number(e.target.value) || null)} required>
            <option value="">--Выберите сервер--</option>
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name} ({server.ip}:{server.port})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Сумма (голосов):</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <label>Комментарий:</label>
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <button type="submit">Я оплатил</button>
      </form>
      {success && <div style={{ color: "green" }}>{success}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default DonatePage;
