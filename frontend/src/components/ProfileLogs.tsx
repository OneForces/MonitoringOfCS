// src/components/ProfileLogs.tsx

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './ProfileLogs.css';

interface LogEntry {
  id: number;
  ip_address: string;
  action: string;
  timestamp: string;
}

const ProfileLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get('/logs/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.ip_address.includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="logs-container">
      <h2>Логи</h2>
      <input
        type="text"
        placeholder="Поиск по IP или действию..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="logs-search"
      />
      <table className="logs-table">
        <thead>
          <tr>
            <th>#</th>
            <th>IP</th>
            <th>Действие</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, idx) => (
            <tr key={log.id}>
              <td>{idx + 1}</td>
              <td>{log.ip_address}</td>
              <td>{log.action}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileLogs;
