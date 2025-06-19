import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import DownloadModal from './DownloadModal';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const basePath = location.pathname;
    if (query.trim()) {
      navigate(`${basePath}?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(basePath);
    }
  };

  const handleClear = () => {
    setQuery('');
    navigate(location.pathname);
  };

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
          <div className="logo-text">
            <div className="title">HOSTING<span>.NET</span></div>
            <div className="subtitle">РАСКРУТКА СЕРВЕРОВ КС 1.6</div>
          </div>
        </div>

        <div className="auth-search">
          <div className="auth-links">
            {isLoggedIn ? (
              <>
                <Link to="/profile">Мой профиль</Link>
                <span className="divider">|</span>
                <button onClick={handleLogout} className="logout-button">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login">Авторизация</Link>
                <span className="divider">|</span>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Поиск серверов..."
              className="search-box"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={handleClear} className="clear-button">
                ✖
              </button>
            )}
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>
        </div>
      </div>

      <nav className="main-nav">
        <Link to="/">ГЛАВНАЯ</Link>
        <Link to="/listing">ЛИСТИНГ</Link>
        <Link to="/services">УСЛУГИ</Link>
        <Link to="/stats">СТАТИСТИКА</Link>
        <Link to="/contacts">КОНТАКТЫ</Link>
        <span
          className="nav-link download-link"
          onClick={() => setDownloadModalOpen(true)}
        >
          СКАЧАТЬ КС 1.6
        </span>
      </nav>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </header>
  );
};

export default Header;
