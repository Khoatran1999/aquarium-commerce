import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'node:http';

/**
 * Proxy /admin/* to the admin-panel Vite dev server (port 3002).
 * Registered via configureServer so it runs BEFORE Vite's SPA fallback.
 */
function adminProxy(): PluginOption {
  return {
    name: 'admin-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/admin')) return next();

        const proxyReq = http.request(
          {
            hostname: 'localhost',
            port: 3002,
            path: req.url,
            method: req.method,
            headers: { ...req.headers, host: 'localhost:3002' },
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          },
        );
        proxyReq.on('error', () => {
          res.writeHead(502);
          res.end('Admin panel not available. Start it with: pnpm --filter admin-panel dev');
        });
        req.pipe(proxyReq, { end: true });
      });
    },
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [adminProxy(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
