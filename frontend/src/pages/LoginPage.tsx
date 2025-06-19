// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      login(access, refresh);
      navigate('/profile');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        setError('Ошибка при входе, попробуйте позже');
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Логин</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;