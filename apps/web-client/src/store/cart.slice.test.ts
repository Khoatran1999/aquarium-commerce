import { describe, it, expect } from 'vitest';
import cartReducer, { clearCart, setCartItems } from './cart.slice';
import type { CartItem } from '@repo/types';

const mockItems: CartItem[] = [
  {
    id: '1',
    cartId: 'cart-1',
    productId: 'p1',
    quantity: 2,
    price: 9.99,
    createdAt: '2024-01-01T00:00:00Z',
    product: {
      id: 'p1',
      name: 'Betta Fish',
      slug: 'betta-fish',
      price: 9.99,
      images: [],
      available: 10,
    },
  } as CartItem,
  {
    id: '2',
    cartId: 'cart-1',
    productId: 'p2',
    quantity: 3,
    price: 2.99,
    createdAt: '2024-01-01T00:00:00Z',
    product: {
      id: 'p2',
      name: 'Neon Tetra',
      slug: 'neon-tetra',
      price: 2.99,
      images: [],
      available: 50,
    },
  } as CartItem,
];

describe('cart slice', () => {
  const initialState = {
    items: [],
    itemCount: 0,
    loading: false,
    pendingOps: {},
    _rollbackItems: null,
  };

  describe('reducers', () => {
    it('has correct initial state', () => {
      const state = cartReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    it('clearCart resets items and count', () => {
      const populated = {
        items: mockItems,
        itemCount: 5,
        loading: false,
        pendingOps: {},
        _rollbackItems: null,
      };
      const state = cartReducer(populated as any, clearCart());
      expect(state.items).toEqual([]);
      expect(state.itemCount).toBe(0);
    });

    it('setCartItems sets items and recalculates count', () => {
      const state = cartReducer(initialState, setCartItems(mockItems));
      expect(state.items).toEqual(mockItems);
      expect(state.itemCount).toBe(5); // 2 + 3
    });

    it('setCartItems with empty array sets count to 0', () => {
      const populated = {
        items: mockItems,
        itemCount: 5,
        loading: false,
        pendingOps: {},
        _rollbackItems: null,
      };
      const state = cartReducer(populated, setCartItems([]));
      expect(state.items).toEqual([]);
      expect(state.itemCount).toBe(0);
    });
  });

  describe('async thunk states', () => {
    it('sets loading=true on fetchCart.pending', () => {
      const state = cartReducer(initialState, { type: 'cart/fetch/pending' });
      expect(state.loading).toBe(true);
    });

    it('sets loading=false on fetchCart.rejected', () => {
      const loadingState = { ...initialState, loading: true };
      const state = cartReducer(loadingState, { type: 'cart/fetch/rejected' });
      expect(state.loading).toBe(false);
    });

    it('sets loading=true on cart/addItem.pending', () => {
      const state = cartReducer(initialState, { type: 'cart/addItem/pending' });
      expect(state.loading).toBe(true);
    });

    it('tracks pending ops on cart/updateItem.pending', () => {
      const action = {
        type: 'cart/updateItem/pending',
        meta: {
          arg: { itemId: '1', quantity: 5 },
          requestId: 'req1',
          requestStatus: 'pending' as const,
        },
      };
      const stateWithItems = { ...initialState, items: mockItems, itemCount: 5 };
      const state = cartReducer(stateWithItems as any, action);
      expect(state.pendingOps['1']).toBe('update');
      // Optimistic quantity update
      expect(state.items.find((i) => i.id === '1')?.quantity).toBe(5);
    });

    it('tracks pending ops on cart/removeItem.pending', () => {
      const action = {
        type: 'cart/removeItem/pending',
        meta: { arg: '1', requestId: 'req1', requestStatus: 'pending' as const },
      };
      const stateWithItems = { ...initialState, items: mockItems, itemCount: 5 };
      const state = cartReducer(stateWithItems as any, action);
      expect(state.pendingOps['1']).toBe('remove');
      // Optimistic removal
      expect(state.items.find((i) => i.id === '1')).toBeUndefined();
    });
  });
});
