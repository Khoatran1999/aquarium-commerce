import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@repo/services';
const initialState = {
    user: null,
    token: authService.getToken(),
    isAuthenticated: !!authService.getToken(),
    loading: false,
    error: null,
};
export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
    try {
        const res = await authService.login(payload);
        if (res.data.user.role !== 'ADMIN') {
            authService.removeToken();
            return rejectWithValue('Access denied. Admin privileges required.');
        }
        authService.setToken(res.data.token);
        return res.data;
    }
    catch (err) {
        const message = err?.message ?? 'Login failed';
        return rejectWithValue(message);
    }
});
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const res = await authService.getMe();
        if (res.data.role !== 'ADMIN') {
            authService.removeToken();
            return rejectWithValue('Access denied');
        }
        return res.data;
    }
    catch {
        authService.removeToken();
        return rejectWithValue('Session expired');
    }
});
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
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
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
            state.error = action.payload;
        });
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
