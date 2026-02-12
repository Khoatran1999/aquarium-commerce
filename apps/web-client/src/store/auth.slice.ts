import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService, type LoginPayload, type RegisterPayload } from '@repo/services';
import type { User } from '@repo/types';

/* ── State ──────────────────────────────── */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  loading: false,
  error: null,
};

import { syncGuestCart } from './cart.slice';

/* ── Thunks ─────────────────────────────── */
export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await authService.login(payload);
      authService.setToken(res.data.token);
      // Sync guest cart to server after login
      dispatch(syncGuestCart());
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await authService.register(payload);
      authService.setToken(res.data.token);
      // Sync guest cart to server after register
      dispatch(syncGuestCart());
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? 'Registration failed';
      return rejectWithValue(message);
    }
  },
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);
      if (res.data.user.role !== 'ADMIN') {
        return rejectWithValue('Access denied. Admin privileges required.');
      }
      authService.setToken(res.data.token);
      return res.data;
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data;
  } catch (err: unknown) {
    authService.removeToken();
    const message = (err as { message?: string })?.message ?? 'Session expired';
    return rejectWithValue(message);
  }
});

/* ── Slice ──────────────────────────────── */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.removeToken();
    },
    clearAuthError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Admin Login
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Fetch me
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
