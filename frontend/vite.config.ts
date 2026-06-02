import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      // Socket.IO (WebSocket + long-poll fallback) must be proxied too,
      // otherwise the handshake hits the Vite server and real-time chat breaks.
      "/socket.io": { target: "http://localhost:3000", ws: true },
    },
  },
})
