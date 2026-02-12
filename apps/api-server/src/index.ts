import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';
import { prisma } from './config/prisma.js';

// Only load .env for local development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Don't load .env in production (Vercel provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const PORT = process.env.PORT || 3001;

// Create Express app
const app = createApp();

/**
 * Vercel Serverless Handler
 * Vercel expects this exact export pattern for Express apps
 */
export default app;

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
