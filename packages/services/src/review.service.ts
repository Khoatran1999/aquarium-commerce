import { apiClient } from './index';
import type { Review, ApiResponse, PaginatedResponse, CreateReviewPayload } from '@repo/types';

const reviewService = {
  async getReviews(
    productId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedResponse<Review[]>> {
    const { data } = await apiClient.get(`/api/products/${productId}/reviews`, { params });
    return data;
  },

  async createReview(payload: CreateReviewPayload): Promise<ApiResponse<Review>> {
    const { data } = await apiClient.post('/api/reviews', payload);
    return data;
  },

  async deleteReview(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete(`/api/reviews/${id}`);
    return data;
  },
};

export default reviewService;
