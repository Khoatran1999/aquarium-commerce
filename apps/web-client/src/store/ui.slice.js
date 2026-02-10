import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    theme: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    mobileMenuOpen: false,
};
const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
                document.documentElement.classList.toggle('dark', state.theme === 'dark');
            }
        },
        setTheme(state, action) {
            state.theme = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
                document.documentElement.classList.toggle('dark', state.theme === 'dark');
            }
        },
        toggleMobileMenu(state) {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        closeMobileMenu(state) {
            state.mobileMenuOpen = false;
        },
    },
});
export const { toggleTheme, setTheme, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
