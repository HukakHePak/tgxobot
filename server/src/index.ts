


import express from 'express';
import cors from 'cors';
import './bot/telegramBot';
import { sendResultHandler } from './api/sendResult';


// --- Express API ---
const app = express();
const corsOrigin = process.env.VITE_WEBAPP_URL || undefined;
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Лог всех входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post('/api/send-result', sendResultHandler);


const PORT = Number(process.env.PORT) || 3001;
console.log('Starting server...');
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
