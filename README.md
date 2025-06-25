# 🎮 MonitoringOfCS

**MonitoringOfCS** — это система мониторинга игровых серверов (например, CS 1.6), позволяющая пользователям:

- добавлять и продвигать серверы;
- покупать услуги через Робокассу и внутренний баланс;
- отслеживать статистику скачиваний сборок;
- управлять услугами через админ-панель;
- вести взаимодействие через интерфейс с авторизацией, балансом и историей.

---

## 🚀 Технологии

- **Backend**: Django + PostgreSQL
- **Frontend**: React (TypeScript)
- **Платежи**: Робокасса, внутренняя система голосов
- **Docker**: Полностью контейнеризирован
- **DevOps**: Docker Compose для продакшна

---

## 📦 Структура проекта

```
MonitoringOfCS/
├── backend/        # Django проект: модели, API, платежи, админка
├── frontend/       # React-приложение
├── docker-compose.yml
```

---

## 🛠 Установка

### 1. Клонировать репозиторий:

```bash
git clone https://github.com/yourname/MonitoringOfCS.git
cd MonitoringOfCS
```

### 2. Построить и запустить контейнеры:

```bash
docker compose up --build -d
```

После запуска:
- Frontend: http://localhost
- Backend API: http://localhost/api/
- Админка Django: http://localhost/admin/

---

## ⚙ .env (для backend)

Создайте `backend/.env` и укажите:

```
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=localhost 127.0.0.1
DB_NAME=monitoring
DB_USER=admin
DB_PASSWORD=adminpassword
DB_HOST=db
DB_PORT=5432
```

---

## 💳 Робокасса

Проект поддерживает оплату услуг и голосов через Робокассу. Покупка фиксируется в базе и обновляет баланс пользователя.

---

## 📊 Функциональность

- [x] Авторизация/регистрация
- [x] Привязка серверов
- [x] Покупка услуг (boost, цвет, VIP и т.д.)
- [x] Робокасса и баланс
- [x] Листинг и очередь серверов
- [x] Панель администратора
- [x] Статистика по сборкам
- [x] Уведомления и история действий

---

## 📂 Дополнительно

- `frontend/nginx.conf` — конфигурация прокси с React на Django `/api/`
- `backend/download_maps.py` — автоматическая загрузка CS карт
- `bank_export.csv` — пример выгрузки платежей

