// frontend/src/App.tsx

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ServerListPage from './pages/ServerListPage';
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddServerPage from './pages/AddServerPage';
import PromotionPage from './pages/PromotionPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import StatsPage from './pages/StatsPage';
import ServicesPage from './pages/ServicesPage';
import DonatePage from './pages/DonatePage';
import ServerDetailsPage from './pages/ServerDetailsPage';
import AdminDashboard from './pages/AdminDashboard';

import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Главная */}
          <Route
            path="/"
            element={
              <Layout>
                <ServerListPage />
              </Layout>
            }
          />

          {/* Листинг */}
          <Route
            path="/listing"
            element={
              <Layout>
                <ListingPage />
              </Layout>
            }
          />

          {/* Страница деталей сервера */}
          <Route
            path="/server/:id"
            element={
              <Layout>
                <ServerDetailsPage />
              </Layout>
            }
          />

          {/* Публичные маршруты */}
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <RegisterPage />
              </Layout>
            }
          />

          {/* Приватные маршруты */}
          <Route
            path="/add-server"
            element={
              <PrivateRoute>
                <Layout>
                  <AddServerPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/promotion"
            element={
              <PrivateRoute>
                <Layout>
                  <PromotionPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Информационные страницы */}
          <Route
            path="/contacts"
            element={
              <Layout>
                <ContactsPage />
              </Layout>
            }
          />
          <Route
            path="/stats"
            element={
              <Layout>
                <StatsPage />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <ServicesPage />
              </Layout>
            }
          />
          <Route
            path="/donate"
            element={
              <Layout>
                <DonatePage />
              </Layout>
            }
          />

          {/* ✅ Админ-панель */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
