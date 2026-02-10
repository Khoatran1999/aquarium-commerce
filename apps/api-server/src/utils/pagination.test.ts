import { describe, it, expect } from 'vitest';
import { parsePagination, slugify } from './pagination';

describe('parsePagination', () => {
  it('returns defaults when no query params', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 12, skip: 0 });
  });

  it('parses page and limit from strings', () => {
    expect(parsePagination({ page: '3', limit: '20' })).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
    });
  });

  it('clamps page to minimum 1', () => {
    const result = parsePagination({ page: '-5' });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it('clamps limit to minimum 1', () => {
    const result = parsePagination({ limit: '0' });
    expect(result.limit).toBe(1);
  });

  it('clamps limit to maximum 100', () => {
    const result = parsePagination({ limit: '999' });
    expect(result.limit).toBe(100);
  });

  it('calculates skip correctly', () => {
    const result = parsePagination({ page: '5', limit: '10' });
    expect(result.skip).toBe(40);
  });

  it('handles NaN values gracefully', () => {
    const result = parsePagination({ page: 'abc', limit: 'xyz' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(12);
  });
});

describe('slugify', () => {
  it('lowercases text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('fish tank setup')).toBe('fish-tank-setup');
  });

  it('removes accents from Vietnamese characters', () => {
    expect(slugify('Cá cảnh đẹp')).toBe('ca-canh-dep');
  });

  it('handles Vietnamese d-stroke (đ)', () => {
    expect(slugify('đồng hồ')).toBe('dong-ho');
  });

  it('removes special characters', () => {
    expect(slugify('fish & chips!')).toBe('fish-chips');
  });

  it('removes leading and trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a   b   c')).toBe('a-b-c');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});
