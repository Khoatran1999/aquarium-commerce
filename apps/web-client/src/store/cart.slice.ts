import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '@repo/services';
import type { CartItem } from '@repo/types';

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

/* ── Thunks ─────────────────────────────── */
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue((err as { message?: string })?.message ?? 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
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
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
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
  async (itemId: string, { rejectWithValue }) => {
    try {
      const res = await cartService.removeItem(itemId);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as { message?: string })?.message ?? 'Failed to remove item');
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
  },
});

export const { clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
