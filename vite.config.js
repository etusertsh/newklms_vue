import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const normalizeBasePath = (value, fallback = '/vue/') => {
  const raw = String(value ?? fallback).trim()
  if (!raw) return fallback
  if (raw === '/') return '/'
  return raw.startsWith('/') ? raw.replace(/\/+$/, '/') : `/${raw.replace(/\/+$/, '/')}`
}

const normalizeApiBase = (value, fallback = 'https://etuser2.hopto.org/newklms/api') => {
  const raw = String(value ?? fallback).trim()
  if (!raw) return fallback
  return raw.replace(/\/+$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appBase = normalizeBasePath(env.VITE_BASE_PATH || '/vue/', '/vue/')
  const apiBase = normalizeApiBase(env.VITE_API_BASE || 'https://etuser2.hopto.org/newklms/api', 'https://etuser2.hopto.org/newklms/api')

  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // 支援 Markdown
      }),
      Markdown(),
      vueDevTools(),
    ],
    base: appBase,
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
      __APP_BASE__: JSON.stringify(appBase),
      __APP_API_BASE__: JSON.stringify(apiBase),
    },
  }
})
