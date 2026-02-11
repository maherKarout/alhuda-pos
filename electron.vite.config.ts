import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiDefine = {
    'process.env.VITE_API_PROTOCOL': JSON.stringify(env.VITE_API_PROTOCOL ?? ''),
    'process.env.VITE_API_HOST': JSON.stringify(env.VITE_API_HOST ?? ''),
    'process.env.VITE_API_PORT': JSON.stringify(env.VITE_API_PORT ?? ''),
    'process.env.VITE_API_PREFIX': JSON.stringify(env.VITE_API_PREFIX ?? ''),
    'process.env.VITE_API_VERSION1': JSON.stringify(env.VITE_API_VERSION1 ?? '')
  }

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      define: apiDefine
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          src: resolve('src/renderer/src')
        }
      },
      plugins: [react()]
    }
  }
})
