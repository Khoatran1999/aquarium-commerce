import { apiClient } from './index';
import type { Cart, ApiResponse } from '@repo/types';

const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    const { data } = await apiClient.get('/api/cart');
    return data;
  },

  async addItem(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    const { data } = await apiClient.post('/api/cart/items', { productId, quantity });
    return data;
  },

  async updateItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    const { data } = await apiClient.patch(`/api/cart/items/${itemId}`, { quantity });
    return data;
  },

  async removeItem(itemId: string): Promise<ApiResponse<Cart>> {
    const { data } = await apiClient.delete(`/api/cart/items/${itemId}`);
    return data;
  },
};

export default cartService;
