import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../apps/api-server/src/app.js';

const app = createApp();

/**
 * Vercel Serverless Function
 * Wraps Express app as a single catch-all handler for /api/* routes
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  const origins = process.env.CORS_ORIGINS || '*';
  res.setHeader('Access-Control-Allow-Origin', origins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Delegate to Express
  app(req, res);
}
