import { createApp } from './app.js';
import { prisma } from './config/prisma.js';

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
