


import express from 'express';
import cors from 'cors';
import './bot/telegramBot';
import { sendResultHandler } from './api/sendResult';


// --- Express API ---
const app = express();
const corsOrigin = process.env.VITE_WEBAPP_URL || undefined;
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Log incoming request method and URL for debugging (production troubleshooting)
app.use((req, res, next) => {
	// eslint-disable-next-line no-console
	console.log(`[incoming] ${req.method} ${req.url}`);
	next();
});

// Лог всех входящих запросов
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// nginx already routes /api/* -> backend, expose endpoint without the /api prefix
app.post('/send-result', sendResultHandler);

console.log('Starting server...');
app.listen(3001, () => console.log('Server listening on 3001'));
