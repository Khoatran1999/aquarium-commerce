import { apiClient } from './index';
import type {
  Product,
  Order,
  OrderStatus,
  FishSpecies,
  User,
  InventoryLog,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
} from '@repo/types';

const adminService = {
  // ── Dashboard ──────────────────────────────
  async getStats(period?: '7d' | '30d' | '12m'): Promise<ApiResponse<DashboardStats>> {
    const { data } = await apiClient.get('/api/admin/stats', {
      params: period ? { period } : undefined,
    });
    return data;
  },

  // ── Products ───────────────────────────────
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Product[]>> {
    const { data } = await apiClient.get('/api/admin/products', { params });
    return data;
  },

  async createProduct(payload: Record<string, unknown>): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.post('/api/admin/products', payload);
    return data;
  },

  async updateProduct(id: string, payload: Record<string, unknown>): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.put(`/api/admin/products/${id}`, payload);
    return data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete(`/api/admin/products/${id}`);
    return data;
  },

  // ── Species ────────────────────────────────
  async getSpecies(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<FishSpecies[]>> {
    const { data } = await apiClient.get('/api/admin/species', { params });
    return data;
  },

  async createSpecies(payload: Record<string, unknown>): Promise<ApiResponse<FishSpecies>> {
    const { data } = await apiClient.post('/api/admin/species', payload);
    return data;
  },

  async updateSpecies(
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<FishSpecies>> {
    const { data } = await apiClient.put(`/api/admin/species/${id}`, payload);
    return data;
  },

  // ── Orders ─────────────────────────────────
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
  }): Promise<PaginatedResponse<Order[]>> {
    const { data } = await apiClient.get('/api/admin/orders', { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const { data } = await apiClient.get(`/api/admin/orders/${id}`);
    return data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const { data } = await apiClient.put(`/api/admin/orders/${id}/status`, { status });
    return data;
  },

  // ── Inventory ──────────────────────────────
  async getInventoryLogs(params?: {
    page?: number;
    limit?: number;
    productId?: string;
    action?: string;
  }): Promise<PaginatedResponse<InventoryLog[]>> {
    const { data } = await apiClient.get('/api/admin/inventory-logs', { params });
    return data;
  },

  async restockProduct(productId: string, quantity: number): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.post(`/api/admin/products/${productId}/restock`, { quantity });
    return data;
  },

  // ── Users ──────────────────────────────────
  async getUsers(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<User[]>> {
    const { data } = await apiClient.get('/api/admin/users', { params });
    return data;
  },
};

export default adminService;
