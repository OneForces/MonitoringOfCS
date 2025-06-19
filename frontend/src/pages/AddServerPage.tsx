import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // твой axios
import '../App.css';

const AddServerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(27015);
  const [map, setMap] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/servers/', { name, ip, port, map });
      navigate('/profile'); // ← возвращение в ЛК
    } catch (err) {
      alert('Ошибка при добавлении сервера');
      console.error(err);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Добавить сервер</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Название сервера</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="ip">IP-адрес</label>
        <input id="ip" type="text" value={ip} onChange={(e) => setIp(e.target.value)} required />

        <label htmlFor="port">Порт</label>
        <input id="port" type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} required />

        <label htmlFor="map">Карта по умолчанию</label>
        <input id="map" type="text" value={map} onChange={(e) => setMap(e.target.value)} />

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default AddServerPage;
