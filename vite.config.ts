import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 8000, host: true, allowedHosts: ['halovisionai.cloud', 'www.halovisionai.cloud'] },
  preview: { port: 8081, host: true, allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
        }
      }
    }
  }
})
