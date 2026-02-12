import { apiClient } from './index';
import type { User, ApiResponse } from '@repo/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const { data } = await apiClient.post('/api/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const { data } = await apiClient.post('/api/auth/register', payload);
    return data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get('/api/auth/me');
    return data;
  },

  async updateProfile(
    payload: Partial<Pick<User, 'name' | 'phone' | 'address' | 'avatar'>>,
  ): Promise<ApiResponse<User>> {
    const { data } = await apiClient.patch('/api/auth/profile', payload);
    return data;
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_token', token);
    }
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('auth_token');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('auth_token');
    }
    return null;
  },
};

export default authService;
