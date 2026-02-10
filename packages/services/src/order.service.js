import { apiClient } from './index';
const orderService = {
    async createOrder(orderData) {
        const { data } = await apiClient.post('/api/orders', orderData);
        return data;
    },
    async getOrders(params) {
        const { data } = await apiClient.get('/api/orders', { params });
        return data;
    },
    async getOrder(id) {
        const { data } = await apiClient.get(`/api/orders/${id}`);
        return data;
    },
};
export default orderService;
