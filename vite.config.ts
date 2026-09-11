import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Same-origin proxy to the Spring Boot API avoids CORS in development.
      '/api': {
        target: 'https://ddbakes-erp-production.up.railway.app',
        changeOrigin: true,
        configure: (proxy) => {
          // The API rejects requests whose Origin header is not allowed
          // ("Invalid CORS request"). Rewrite Origin to match the target so
          // the dev proxy works without backend CORS changes.
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://ddbakes-erp-production.up.railway.app')
          })
        },
      },
    },
  },
})
