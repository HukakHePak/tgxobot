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
  plugins: [react({ jsxRuntime: 'classic' })],
  resolve: {},
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  server: {
    host: true,
    allowedHosts,
    watch: {
      usePolling: true,
      interval: 300
    }
    ,
    proxy: {
      // forward /api requests to backend during local development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
