import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';
import { prisma } from './config/prisma.js';

// Load .env file from the api-server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3001;

const app = createApp();

/**
 * Vercel Serverless Handler
 * This is the entry point for Vercel. It ensures the DB is connected
 * before handling the request.
 */
export default async function handler(req: any, res: any) {
  // Ensure DB connection on each serverless invocation (handles cold starts)
  await prisma.$connect();
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
