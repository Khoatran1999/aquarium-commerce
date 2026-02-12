import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cartService, authService } from '@repo/services';
import type { CartItem, Product } from '@repo/types';
import type { RootState } from './index';

/* ── State ──────────────────────────────── */
interface CartState {
  items: CartItem[];
  itemCount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  loading: false,
};

/* ── Helpers ────────────────────────────── */
function calcCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function isAuthenticated(): boolean {
  return !!authService.getToken();
}

/* ── Thunks ─────────────────────────────── */
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue, getState }) => {
    if (!isAuthenticated()) {
      // Guest: return items from persisted state
      return { items: (getState() as RootState).cart.items };
    }
    try {
      const res = await cartService.getCart();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to fetch cart');
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (
    { productId, quantity, product }: { productId: string; quantity: number; product?: Product },
    { rejectWithValue, getState },
  ) => {
    if (!isAuthenticated()) {
      // Guest: add to local cart
      const state = getState() as RootState;
      const items = [...state.cart.items];
      const existingIdx = items.findIndex((i) => i.productId === productId);

      if (existingIdx >= 0) {
        const existing = items[existingIdx];
        items[existingIdx] = { ...existing, quantity: existing.quantity + quantity };
      } else {
        items.push({
          id: `guest_${productId}_${Date.now()}`,
          cartId: 'guest',
          productId,
          quantity,
          price: product?.price ?? 0,
          createdAt: new Date().toISOString(),
          product,
        });
      }
      return { items };
    }
    try {
      const res = await cartService.addItem(productId, quantity);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to add to cart');
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue, getState },
  ) => {
    if (!isAuthenticated()) {
      const state = getState() as RootState;
      const items = state.cart.items
        .map((i) => (i.id === itemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      return { items };
    }
    try {
      const res = await cartService.updateItem(itemId, quantity);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to update item');
    }
  },
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { rejectWithValue, getState }) => {
    if (!isAuthenticated()) {
      const state = getState() as RootState;
      const items = state.cart.items.filter((i) => i.id !== itemId);
      return { items };
    }
    try {
      const res = await cartService.removeItem(itemId);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to remove item');
    }
  },
);

/**
 * Sync guest cart items to server after login
 * Adds each guest item to the server cart, then fetches the merged result
 */
export const syncGuestCart = createAsyncThunk(
  'cart/syncGuest',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const guestItems = state.cart.items.filter((i) => i.id.startsWith('guest_'));

    if (guestItems.length === 0) {
      // No guest items, just fetch server cart
      const res = await cartService.getCart();
      return res.data;
    }

    try {
      // Add each guest item to server cart
      for (const item of guestItems) {
        await cartService.addItem(item.productId, item.quantity);
      }
      // Fetch merged cart from server
      const res = await cartService.getCart();
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to sync cart');
    }
  },
);

/* ── Slice ──────────────────────────────── */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.itemCount = 0;
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.itemCount = calcCount(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.itemCount = calcCount(state.items);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.itemCount = calcCount(state.items);
      })
      .addCase(addToCart.rejected, (state) => {
        state.loading = false;
      });

    // Update item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.itemCount = calcCount(state.items);
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.loading = false;
      });

    // Remove item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.itemCount = calcCount(state.items);
      })
      .addCase(removeCartItem.rejected, (state) => {
        state.loading = false;
      });

    // Sync guest cart after login
    builder
      .addCase(syncGuestCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.itemCount = calcCount(state.items);
      })
      .addCase(syncGuestCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
