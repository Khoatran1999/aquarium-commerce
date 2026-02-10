import { apiClient } from './index';
import type { Order, ApiResponse, PaginatedResponse, CreateOrderPayload } from '@repo/types';

const orderService = {
  async createOrder(orderData: CreateOrderPayload): Promise<ApiResponse<Order>> {
    const { data } = await apiClient.post('/api/orders', orderData);
    return data;
  },

  async getOrders(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Order[]>> {
    const { data } = await apiClient.get('/api/orders', { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const { data } = await apiClient.get(`/api/orders/${id}`);
    return data;
  },
};

export default orderService;
