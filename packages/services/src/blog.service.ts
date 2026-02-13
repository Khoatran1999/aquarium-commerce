import { apiClient } from './index';
import type { BlogPost, BlogFilter, ApiResponse, PaginatedResponse } from '@repo/types';

const blogService = {
  /** List published blog posts (public) */
  async getBlogs(filter?: BlogFilter): Promise<PaginatedResponse<BlogPost[]>> {
    const { data } = await apiClient.get('/api/blogs', { params: filter });
    return data;
  },

  /** Get single blog post by slug (public) */
  async getBlogBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    const { data } = await apiClient.get(`/api/blogs/${slug}`);
    return data;
  },
};

export default blogService;
