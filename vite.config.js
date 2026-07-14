import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api-ideogram': {
        target: 'https://api.ideogram.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ideogram/, ''),
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  }
})
