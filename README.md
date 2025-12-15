# Tic‑Tac‑Toe (React + MUI + TypeScript) + Node.js Telegram integration

Коротко: проект содержит фронтенд (Vite + React + TS + MUI) и небольшой сервер на Express, который отправляет сообщения в Telegram Bot API при победе/поражении.

Ключевые файлы:
- `client/` — фронтенд
- `server/` — бэкенд
- `docker-compose.yml` — локальная сборка контейнеров

Настройка (локально):

1. Скопируйте токен бота и chat id в `server/.env` (см. `.env.example`):

```
BOT_TOKEN=123456:ABC-DEF
CHAT_ID=123456789
PORT=3001
```

2. Запуск напрямую (если установлены Node.js и npm):

Для сервера:

```bash
cd server
npm install
npm start
```

Для фронтенда (в другом терминале):

```bash
cd client
npm install
npm run dev
```

3. Docker (пример):

```bash
docker-compose up --build
```

Примечание: фронтенд отправляет POST-запросы на `${VITE_API_BASE}` (по умолчанию `http://localhost:3001`).
