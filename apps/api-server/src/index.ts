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

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🐠 API Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
