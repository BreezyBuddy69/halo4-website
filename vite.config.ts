import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    // fonts.cdnfonts.com serves Anurati (the brand wordmark) — without it the
    // @import in index.css is blocked and HALO/VISION falls back to system sans.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com",
    "font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://n8n.halovisionai.cloud",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8000,
    host: true,
    allowedHosts: ['halovisionai.cloud', 'www.halovisionai.cloud'],
    headers: securityHeaders,
  },
  preview: {
    port: 8081,
    host: true,
    allowedHosts: true,
    headers: securityHeaders,
  },
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
