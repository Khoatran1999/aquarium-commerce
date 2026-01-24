import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../api/supabase'

export const signIn = createAsyncThunk('user/signIn', async ({ email, password }, thunkAPI) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return thunkAPI.rejectWithValue(error.message)
  return data.user
})

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => { state.status = 'loading' })
      .addCase(signIn.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload })
      .addCase(signIn.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export default userSlice.reducer
