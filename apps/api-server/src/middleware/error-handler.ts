import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(`[Error] ${err.message}`, err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Prisma known request error
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Resource already exists',
        errors: { fields: prismaErr.meta?.target || [] },
      });
    }
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
  }

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
