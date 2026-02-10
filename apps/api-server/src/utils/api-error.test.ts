import { describe, it, expect } from 'vitest';
import { ApiError } from './api-error';

describe('ApiError', () => {
  it('creates an error with statusCode and message', () => {
    const err = new ApiError(400, 'Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
    expect(err.name).toBe('ApiError');
    expect(err).toBeInstanceOf(Error);
  });

  it('includes optional errors map', () => {
    const errors = { email: ['Invalid email'] };
    const err = new ApiError(400, 'Validation failed', errors);
    expect(err.errors).toEqual(errors);
  });

  describe('static factories', () => {
    it('badRequest returns 400', () => {
      const err = ApiError.badRequest();
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Bad request');
    });

    it('badRequest accepts custom message and errors', () => {
      const err = ApiError.badRequest('Invalid input', { name: ['too short'] });
      expect(err.message).toBe('Invalid input');
      expect(err.errors).toEqual({ name: ['too short'] });
    });

    it('unauthorized returns 401', () => {
      const err = ApiError.unauthorized();
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Unauthorized');
    });

    it('forbidden returns 403', () => {
      const err = ApiError.forbidden();
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Forbidden');
    });

    it('notFound returns 404', () => {
      const err = ApiError.notFound();
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Not found');
    });

    it('conflict returns 409', () => {
      const err = ApiError.conflict();
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('Conflict');
    });

    it('internal returns 500', () => {
      const err = ApiError.internal();
      expect(err.statusCode).toBe(500);
      expect(err.message).toBe('Internal server error');
    });

    it('each factory accepts a custom message', () => {
      expect(ApiError.unauthorized('Token expired').message).toBe('Token expired');
      expect(ApiError.forbidden('Admin only').message).toBe('Admin only');
      expect(ApiError.notFound('Product not found').message).toBe('Product not found');
      expect(ApiError.conflict('Email taken').message).toBe('Email taken');
      expect(ApiError.internal('DB down').message).toBe('DB down');
    });
  });
});
