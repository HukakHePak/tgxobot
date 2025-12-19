
# Tic-Tac-Toe Telegram WebApp (Vite + React + Node.js + Docker)

## Описание

Мультиконтейнерное приложение: игра "Крестики-нолики" (React + MUI + TypeScript) с интеграцией Telegram WebApp и ботом на Node.js (grammy). При победе или поражении бот отправляет сообщение пользователю в Telegram. Всё работает через публичный HTTPS-домен (ngrok) и полностью dockerized для локальной разработки.

---

## Структура проекта
- `client/` — фронтенд (Vite, React, TypeScript, MUI)
- `server/` — бэкенд (Express, TypeScript, grammy)
- `nginx/` — прокси для client/server
- `docker-compose.dev.yml` — dev-окружение (client, server, nginx, ngrok)
- `.env`, `.env.example` — переменные окружения

---

## Быстрый старт (Docker)

1. Скопируйте `.env.example` в `.env` и заполните:
	- `BOT_TOKEN` — токен Telegram-бота
	- `VITE_WEBAPP_URL` — публичный ngrok-URL (например, https://xxxx.ngrok-free.dev)
	- `NGROK_AUTHTOKEN` — ваш токен ngrok
	- `NGINX_PORT` — для переопределения порта nginx

2. Запустите dev-окружение:
```bash
docker compose -f docker-compose.dev.yml up --build
```

3. После запуска:
	- Фронтенд доступен по публичному ngrok-URL (см. логи ngrok)
	- Бот работает через polling, сообщения о победе/поражении приходят в Telegram
	- Все изменения фронта автоматически hot-reload'ятся (через polling)

---

## Интеграция с Telegram
- В боте должна быть web_app-кнопка с вашим публичным URL (см. документацию Telegram WebApp)
- Пользователь должен открывать игру только через эту кнопку — тогда chat_id будет доступен
- Для работы Telegram WebApp API в index.html подключён `<script src="https://telegram.org/js/telegram-web-app.js"></script>`

---

## Переменные окружения (.env)

```
VITE_WEBAPP_URL=https://xxxx.ngrok-free.dev
BOT_TOKEN=ваш_токен_бота
NGROK_AUTHTOKEN=ваш_ngrok_token
PORT=3001
NGINX_PORT=8080
```

---

## Режим разработки (без Docker)

1. Запустите сервер:
```bash
cd server
npm install
npm run dev
```
2. Запустите клиент:
```bash
cd client
npm install
npm run dev -- --host
```
3. Для публичного доступа используйте ngrok вручную:
```bash
ngrok http 8080
```

---

## Особенности
- Hot-reload работает через polling (Vite + Docker + ngrok)
- Все переменные для фронта должны начинаться с VITE_
- Для работы Telegram WebApp API обязателен `<script src="https://telegram.org/js/telegram-web-app.js"></script>`
- В продакшене используйте отдельный compose/nginx-конфиг

---

## Лицензия
MIT
