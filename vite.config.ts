import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  preview: {
    port: 443,
    host: 'kvatum.online',
    https: {
      key: '/etc/letsencrypt/archive/kvatum.online/privkey2.pem',
      cert: '/etc/letsencrypt/archive/kvatum.online/fullchain2.pem',
    },
  },
  server: {
    port: 443,
    https: {
      key: '/etc/letsencrypt/archive/kvatum.online/privkey2.pem',
      cert: '/etc/letsencrypt/archive/kvatum.online/fullchain2.pem',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})
