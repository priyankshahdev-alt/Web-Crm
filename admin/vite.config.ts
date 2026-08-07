import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the shared local backend during development. This
      // avoids CORS and keeps `BASE_URL` relative so the same build works in
      // production behind a reverse proxy. Do not point this at the deployed
      // backend: it opens additional DB connection pools against Supabase and
      // hits the 15-client pooler limit while the local server is running.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
