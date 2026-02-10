import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  theme:
    typeof window !== 'undefined' && localStorage.getItem('admin_theme') === 'dark'
      ? 'dark'
      : 'light',
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_theme', state.theme);
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
      }
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { toggleTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
