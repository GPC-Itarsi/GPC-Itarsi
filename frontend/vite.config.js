import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://gpc-itarsi-backend-8dod.onrender.com'),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
})
