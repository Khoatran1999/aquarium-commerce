import { apiClient } from './index';
import type { WishlistItem, ApiResponse, PaginatedResponse } from '@repo/types';

const wishlistService = {
  /** Get user's wishlist (paginated) */
  async getWishlist(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WishlistItem[]>> {
    const { data } = await apiClient.get('/api/wishlist', { params });
    return data;
  },

  /** Get all wishlisted product IDs (for batch UI checking) */
  async getWishlistIds(): Promise<ApiResponse<string[]>> {
    const { data } = await apiClient.get('/api/wishlist/ids');
    return data;
  },

  /** Check if a product is in wishlist */
  async checkWishlist(productId: string): Promise<ApiResponse<{ isWishlisted: boolean }>> {
    const { data } = await apiClient.get(`/api/wishlist/check/${productId}`);
    return data;
  },

  /** Add product to wishlist */
  async addToWishlist(productId: string): Promise<ApiResponse<WishlistItem>> {
    const { data } = await apiClient.post('/api/wishlist', { productId });
    return data;
  },

  /** Remove product from wishlist */
  async removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete(`/api/wishlist/${productId}`);
    return data;
  },
};

export default wishlistService;
