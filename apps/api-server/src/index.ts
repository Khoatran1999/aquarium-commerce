import { createApp } from './app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Create Express app
const app = createApp();

/**
 * Vercel Serverless Handler
 * Simple handler that delegates to Express app
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Delegate to Express app
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', message: (error as Error).message });
  }
}
