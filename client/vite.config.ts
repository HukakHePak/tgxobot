import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Получаем домен из переменной окружения WEBAPP_URL
const webAppUrl = process.env.WEBAPP_URL || '';
let allowedHosts = [];
try {
  if (webAppUrl) {
    const { hostname } = new URL(webAppUrl);
    allowedHosts = [hostname];
  }
} catch (e) {
  // Если URL некорректен, оставляем allowedHosts пустым
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts
  }
})
