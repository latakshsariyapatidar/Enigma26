import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: "/headstart/",
  server: {
    proxy: {
      '/api': {
        target: 'http://10.195.250.151:2312',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})