import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Injects the GA measurement ID into index.html at build time */
function gaInjectPlugin(gaId: string): Plugin {
  return {
    name: 'ga-inject',
    transformIndexHtml(html) {
      return html.replace(/%VITE_GA_ID%/g, gaId || '');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gaId = env.VITE_GA_MEASUREMENT_ID || '';

  return {
    plugins: [react(), tailwindcss(), gaInjectPlugin(gaId)],
    server: {
      proxy: {
        "/api": "http://localhost:3000",
        "/socket.io": { target: "http://localhost:3000", ws: true },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("socket.io-client") || id.includes("engine.io-client")) {
              return "vendor-socket";
            }
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router")) {
              return "vendor-react";
            }
          },
        },
      },
    },
  };
})
