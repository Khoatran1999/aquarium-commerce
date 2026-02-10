import { apiClient } from './index';
const authService = {
    async login(payload) {
        const { data } = await apiClient.post('/api/auth/login', payload);
        return data;
    },
    async register(payload) {
        const { data } = await apiClient.post('/api/auth/register', payload);
        return data;
    },
    async getMe() {
        const { data } = await apiClient.get('/api/auth/me');
        return data;
    },
    async updateProfile(payload) {
        const { data } = await apiClient.patch('/api/auth/profile', payload);
        return data;
    },
    setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    },
    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    },
    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    },
};
export default authService;
