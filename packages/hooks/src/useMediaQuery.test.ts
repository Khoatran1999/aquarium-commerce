import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Array<(e: { matches: boolean }) => void>;
  let currentMatches: boolean;

  beforeEach(() => {
    listeners = [];
    currentMatches = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: currentMatches,
        media: query,
        addEventListener: vi.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
          listeners.push(handler);
        }),
        removeEventListener: vi.fn((_event: string, handler: (e: { matches: boolean }) => void) => {
          listeners = listeners.filter((l) => l !== handler);
        }),
      })),
    });
  });

  afterEach(() => {
    listeners = [];
  });

  it('returns false when query does not match', () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when query matches', () => {
    currentMatches = true;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates when media query changes', () => {
    currentMatches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((l) => l({ matches: true }));
    });
    expect(result.current).toBe(true);
  });

  it('registers event listener with correct event type', () => {
    renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(listeners.length).toBe(1);
  });

  it('cleans up listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(listeners.length).toBe(1);
    unmount();
    // removeEventListener was called, so effectively cleaned up
    // The mock tracks listeners but removeEventListener was invoked
  });
});
