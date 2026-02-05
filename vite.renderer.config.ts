import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        src: resolve(__dirname, 'src/renderer/src')
      }
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: resolve(__dirname, 'dist-web')
    },
    // Make env variables available
    define: {
      'import.meta.env.VITE_API_PROTOCOL': JSON.stringify(env.VITE_API_PROTOCOL || 'http://'),
      'import.meta.env.VITE_API_HOST': JSON.stringify(env.VITE_API_HOST || 'localhost'),
      'import.meta.env.VITE_API_PORT': JSON.stringify(env.VITE_API_PORT || ':3000'),
      'import.meta.env.VITE_API_PREFIX': JSON.stringify(env.VITE_API_PREFIX || '/api'),
      'import.meta.env.VITE_API_VERSION1': JSON.stringify(env.VITE_API_VERSION1 || '/v1'),
      'import.meta.env.VITE_FALLBACK_LNG': JSON.stringify(env.VITE_FALLBACK_LNG || 'ar'),
      'import.meta.env.VITE_GOOGLE_MAP_KEY': JSON.stringify(env.VITE_GOOGLE_MAP_KEY || '')
    }
  }
})
