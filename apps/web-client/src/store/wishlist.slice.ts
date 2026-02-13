import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '@repo/services';

interface WishlistState {
  /** Set of wishlisted product IDs for O(1) lookup */
  ids: string[];
  loading: boolean;
}

const initialState: WishlistState = {
  ids: [],
  loading: false,
};

/** Fetch all wishlisted product IDs from server */
export const fetchWishlistIds = createAsyncThunk('wishlist/fetchIds', async () => {
  const res = await wishlistService.getWishlistIds();
  return res.data; // string[]
});

/** Add product to wishlist */
export const addWishlistItem = createAsyncThunk('wishlist/add', async (productId: string) => {
  await wishlistService.addToWishlist(productId);
  return productId;
});

/** Remove product from wishlist */
export const removeWishlistItem = createAsyncThunk('wishlist/remove', async (productId: string) => {
  await wishlistService.removeFromWishlist(productId);
  return productId;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchIds
      .addCase(fetchWishlistIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.ids = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlistIds.rejected, (state) => {
        state.loading = false;
      })
      // add — optimistic
      .addCase(addWishlistItem.pending, (state, action) => {
        if (!state.ids.includes(action.meta.arg)) {
          state.ids.push(action.meta.arg);
        }
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.ids = state.ids.filter((id) => id !== action.meta.arg);
      })
      // remove — optimistic
      .addCase(removeWishlistItem.pending, (state, action) => {
        state.ids = state.ids.filter((id) => id !== action.meta.arg);
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.ids.push(action.meta.arg);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
