import axios from 'axios';
export const apiClient = axios.create({
    baseURL: typeof window !== 'undefined'
        ? (import.meta.env?.VITE_API_URL ?? '')
        : '',
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});
// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
// Response interceptor — unwrap data & handle errors
apiClient.interceptors.response.use((res) => res, (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Network error';
    return Promise.reject({ status: error.response?.status ?? 500, message });
});
export { default as productService } from './product.service';
export { default as cartService } from './cart.service';
export { default as orderService } from './order.service';
export { default as authService } from './auth.service';
export { default as reviewService } from './review.service';
export { default as speciesService } from './species.service';
export { default as adminService } from './admin.service';
export { default as aiService } from './ai.service';
