import { apiClient } from './index';
const reviewService = {
    async getReviews(productId, params) {
        const { data } = await apiClient.get(`/api/products/${productId}/reviews`, { params });
        return data;
    },
    async createReview(payload) {
        const { data } = await apiClient.post('/api/reviews', payload);
        return data;
    },
    async deleteReview(id) {
        const { data } = await apiClient.delete(`/api/reviews/${id}`);
        return data;
    },
};
export default reviewService;
