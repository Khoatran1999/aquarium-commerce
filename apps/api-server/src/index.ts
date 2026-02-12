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
