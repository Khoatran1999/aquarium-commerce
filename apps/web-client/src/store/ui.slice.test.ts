import { describe, it, expect, vi, beforeEach } from 'vitest';
import uiReducer, { toggleTheme, setTheme, toggleMobileMenu, closeMobileMenu } from './ui.slice';

// Mock localStorage and document for SSR-safe slice
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const classListMock = { toggle: vi.fn(), add: vi.fn(), remove: vi.fn() };
Object.defineProperty(document.documentElement, 'classList', { value: classListMock });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ui slice', () => {
  const lightState = { theme: 'light' as const, mobileMenuOpen: false };

  describe('toggleTheme', () => {
    it('switches from light to dark', () => {
      const state = uiReducer(lightState, toggleTheme());
      expect(state.theme).toBe('dark');
    });

    it('switches from dark to light', () => {
      const darkState = { ...lightState, theme: 'dark' as const };
      const state = uiReducer(darkState, toggleTheme());
      expect(state.theme).toBe('light');
    });

    it('persists to localStorage', () => {
      uiReducer(lightState, toggleTheme());
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('toggles dark class on documentElement', () => {
      uiReducer(lightState, toggleTheme());
      expect(classListMock.toggle).toHaveBeenCalledWith('dark', true);
    });
  });

  describe('setTheme', () => {
    it('sets theme to dark', () => {
      const state = uiReducer(lightState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('sets theme to light', () => {
      const darkState = { ...lightState, theme: 'dark' as const };
      const state = uiReducer(darkState, setTheme('light'));
      expect(state.theme).toBe('light');
    });
  });

  describe('toggleMobileMenu', () => {
    it('opens when closed', () => {
      const state = uiReducer(lightState, toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(true);
    });

    it('closes when open', () => {
      const openState = { ...lightState, mobileMenuOpen: true };
      const state = uiReducer(openState, toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(false);
    });
  });

  describe('closeMobileMenu', () => {
    it('closes the menu', () => {
      const openState = { ...lightState, mobileMenuOpen: true };
      const state = uiReducer(openState, closeMobileMenu());
      expect(state.mobileMenuOpen).toBe(false);
    });

    it('stays closed if already closed', () => {
      const state = uiReducer(lightState, closeMobileMenu());
      expect(state.mobileMenuOpen).toBe(false);
    });
  });
});
