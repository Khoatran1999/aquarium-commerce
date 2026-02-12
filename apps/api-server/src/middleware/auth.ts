import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api-error.js';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
// eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function getJwtSecret(): string {
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'development') {
      return 'dev-secret-change-in-production';
    }
    throw new Error(
      'FATAL: JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 64',
    );
  }
  return process.env.JWT_SECRET;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, getJwtSecret()) as unknown as AuthPayload;
}

/**
 * Middleware: requires valid JWT
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token not provided'));
  }
  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

/**
 * Middleware: optional auth — attaches user if token present but doesn't reject
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // ignore invalid token
    }
  }
  next();
}

/**
 * Middleware: requires specific role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Access denied'));
    }
    next();
  };
}
