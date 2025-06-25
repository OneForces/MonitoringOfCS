// src/components/ProfileSettings.tsx

import React, { useState } from 'react';
import axios from '../api/axios';
import './ProfileSettings.css';

const ProfileSettings: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    repeat_password: '',
  });

  const [emailData, setEmailData] = useState({
    current_password: '',
    old_email: '',
    new_email: '',
  });

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.repeat_password) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      await axios.post(
        '/users/change-password/',
        passwordData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Пароль успешно изменён');
    } catch (error) {
      alert('Ошибка смены пароля');
    }
  };

  const handleEmailChange = async () => {
    try {
      await axios.post(
        '/users/change-email/',
        emailData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Email успешно изменён');
    } catch (error) {
      alert('Ошибка смены email');
    }
  };

  return (
    <div className="settings-container">
      <h2>НАСТРОЙКИ</h2>
      <div className="settings-forms">
        <div className="settings-block">
          <input
            type="password"
            placeholder="Введите текущий пароль"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Введите новый пароль"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Повторите новый пароль"
            value={passwordData.repeat_password}
            onChange={(e) => setPasswordData({ ...passwordData, repeat_password: e.target.value })}
          />
          <button onClick={handlePasswordChange}>СМЕНИТЬ ПАРОЛЬ</button>
        </div>

        <div className="settings-block">
          <input
            type="password"
            placeholder="Введите текущий пароль"
            value={emailData.current_password}
            onChange={(e) => setEmailData({ ...emailData, current_password: e.target.value })}
          />
          <input
            type="email"
            placeholder="Введите старый email"
            value={emailData.old_email}
            onChange={(e) => setEmailData({ ...emailData, old_email: e.target.value })}
          />
          <input
            type="email"
            placeholder="Введите новый email"
            value={emailData.new_email}
            onChange={(e) => setEmailData({ ...emailData, new_email: e.target.value })}
          />
          <button onClick={handleEmailChange}>СМЕНИТЬ EMAIL</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
