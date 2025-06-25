import React, { useState } from 'react';

interface Props {
  onSubmit: (data: {
    name: string;
    ip: string;
    port: number;
    map: string;
  }) => void;
}

const ServerForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(27015);
  const [map, setMap] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, ip, port, map });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>Название сервера:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={{ marginTop: 10 }}>
        <label>IP-адрес:</label>
        <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} required />
      </div>
      <div style={{ marginTop: 10 }}>
        <label>Порт:</label>
        <input type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} required />
      </div>
      <div style={{ marginTop: 10 }}>
        <label>Карта:</label>
        <input type="text" value={map} onChange={(e) => setMap(e.target.value)} required />
      </div>
      <button type="submit" style={{ marginTop: 15 }}>Добавить сервер</button>
    </form>
  );
};

export default ServerForm;
