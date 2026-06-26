import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Import Node's path utility

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Map the '@' symbol directly to your Frontend/src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})