import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when localStorage has data', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates state and localStorage on setValue', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('handles objects', () => {
    const obj = { name: 'Fish', count: 5 };
    const { result } = renderHook(() => useLocalStorage('obj-key', obj));

    expect(result.current[0]).toEqual(obj);

    act(() => {
      result.current[1]({ name: 'Crab', count: 2 });
    });

    expect(result.current[0]).toEqual({ name: 'Crab', count: 2 });
    expect(JSON.parse(localStorage.getItem('obj-key')!)).toEqual({ name: 'Crab', count: 2 });
  });

  it('falls back to initial value when JSON.parse fails', () => {
    localStorage.setItem('broken-key', '{invalid json');
    const { result } = renderHook(() => useLocalStorage('broken-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('handles arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('list', []));

    act(() => {
      result.current[1](['a', 'b', 'c']);
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
  });
});
