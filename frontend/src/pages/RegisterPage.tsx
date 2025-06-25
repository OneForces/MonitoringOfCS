import React, { useState } from 'react';
import axios from '../api/axios'; // путь может отличаться
import '../App.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      // Шаг 1: регистрация
      await axios.post('/users/register/', {
        username,
        password,
      });

      // Шаг 2: вход
      const loginRes = await axios.post('/token/', {
        username,
        password,
      });

      // Шаг 3: сохранить токены
      localStorage.setItem('accessToken', loginRes.data.access);
      localStorage.setItem('refreshToken', loginRes.data.refresh);

      // Успех и переход
      setSuccess(true);
      window.location.href = '/profile'; // или navigate('/profile')

    } catch (err: any) {
      if (err.response?.data?.username) {
        setError(err.response.data.username[0]);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ошибка при регистрации или входе');
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
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

        <label htmlFor="confirm">Повторите пароль</label>
        <input
          type="password"
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Успешная регистрация! Переход в кабинет...</p>}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;
