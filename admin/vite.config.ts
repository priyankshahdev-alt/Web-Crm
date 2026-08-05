import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the backend during development. This avoids CORS
      // and keeps `BASE_URL` relative so the same build works in production
      // behind a reverse proxy.
      '/api': {
        target: 'https://web-crm-green.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
