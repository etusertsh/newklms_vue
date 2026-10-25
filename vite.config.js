import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const normalizeBasePath = (value, fallback = '/') => {
  if (!value) return fallback
  const normalized = String(value).trim()
  if (!normalized) return fallback
  return normalized.endsWith('/') ? normalized : `${normalized}/`
}

const normalizeAppPath = (value, fallback = '/newklms/api') => {
  if (!value) return fallback
  const normalized = String(value).trim()
  if (!normalized) return fallback
  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appBase = normalizeBasePath(env.VITE_BASE_PATH || '/vue/', '/vue/')
  const apiBase = normalizeAppPath(env.VITE_API_BASE || 'https://etuser2.hopto.org/newklms/api', 'https://etuser2.hopto.org/newklms/api')
  const adminPath = normalizeAppPath(env.VITE_ADMIN_PATH || '/newklms/admin', '/newklms/admin')

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
      __APP_ADMIN_PATH__: JSON.stringify(adminPath),
    },
  }
})
