import { createApp } from './app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Create Express app
const app = createApp();

/**
 * Vercel Serverless Handler
 * Export as named function for Vercel compatibility
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}

/**
 * Standalone Server (Local Dev / Railway / Render)
 * Only runs if this file is the main entry point (not imported).
 */
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  (async () => {
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
      app.listen(PORT, () => {
        console.log(`🐠 API Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    }
  })();
}
