import { apiClient } from './index';
const cartService = {
    async getCart() {
        const { data } = await apiClient.get('/api/cart');
        return data;
    },
    async addItem(productId, quantity) {
        const { data } = await apiClient.post('/api/cart/items', { productId, quantity });
        return data;
    },
    async updateItem(itemId, quantity) {
        const { data } = await apiClient.patch(`/api/cart/items/${itemId}`, { quantity });
        return data;
    },
    async removeItem(itemId) {
        const { data } = await apiClient.delete(`/api/cart/items/${itemId}`);
        return data;
    },
};
export default cartService;
