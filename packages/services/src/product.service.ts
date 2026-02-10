import { apiClient } from './index';
import type { Product, ProductFilter, PaginatedResponse, ApiResponse } from '@repo/types';

const productService = {
  async getProducts(filter?: ProductFilter): Promise<PaginatedResponse<Product[]>> {
    const { data } = await apiClient.get('/api/products', { params: filter });
    return data;
  },

  async getProduct(slug: string): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.get(`/api/products/${slug}`);
    return data;
  },
};

export default productService;
