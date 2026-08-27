import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        timeout: 15000,
        proxyTimeout: 15000,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            const r = res as unknown as { writeHead?: (code: number) => void; end?: (msg: string) => void }
            if (r && !res.headersSent && r.writeHead && r.end) {
              r.writeHead(502)
              r.end(JSON.stringify({ success: false, message: 'Backend unavailable', data: null, errors: [{ code: 'BAD_GATEWAY' }] }))
            }
          })
        },
      },
      '/static': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
