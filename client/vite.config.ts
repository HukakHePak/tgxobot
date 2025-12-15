import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const webAppUrl = process.env.VITE_WEBAPP_URL || '';

let allowedHosts = [] as string[];
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
    allowedHosts,
    watch: {
      usePolling: true,
      interval: 300
    }
  }
})
