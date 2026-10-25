import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const DEFAULT_BASE = '/vue/'
const APP_BASE = process.env.VITE_BASE_PATH || process.env.BASE_PATH || DEFAULT_BASE
const API_BASE = (process.env.VITE_API_BASE || '/newklms/api').replace(/\/$/, '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // 支援 Markdown
    }),
    Markdown(),
    vueDevTools(),
  ],
  base: APP_BASE,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/newklms/api': {
        target: 'https://etuser2.hopto.org',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[Proxy 轉發中]:', req.method, req.url, '=>', options.target + req.url)
          })
        }
      }
    },
  },
  define: {
    __APP_API_BASE__: JSON.stringify(API_BASE),
  },
})
