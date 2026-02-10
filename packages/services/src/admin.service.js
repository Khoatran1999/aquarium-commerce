import { apiClient } from './index';
const adminService = {
    // ── Dashboard ──────────────────────────────
    async getStats(period) {
        const { data } = await apiClient.get('/api/admin/stats', {
            params: period ? { period } : undefined,
        });
        return data;
    },
    // ── Products ───────────────────────────────
    async getProducts(params) {
        const { data } = await apiClient.get('/api/admin/products', { params });
        return data;
    },
    async createProduct(payload) {
        const { data } = await apiClient.post('/api/admin/products', payload);
        return data;
    },
    async updateProduct(id, payload) {
        const { data } = await apiClient.put(`/api/admin/products/${id}`, payload);
        return data;
    },
    async deleteProduct(id) {
        const { data } = await apiClient.delete(`/api/admin/products/${id}`);
        return data;
    },
    // ── Species ────────────────────────────────
    async getSpecies(params) {
        const { data } = await apiClient.get('/api/admin/species', { params });
        return data;
    },
    async createSpecies(payload) {
        const { data } = await apiClient.post('/api/admin/species', payload);
        return data;
    },
    async updateSpecies(id, payload) {
        const { data } = await apiClient.put(`/api/admin/species/${id}`, payload);
        return data;
    },
    // ── Orders ─────────────────────────────────
    async getOrders(params) {
        const { data } = await apiClient.get('/api/admin/orders', { params });
        return data;
    },
    async getOrder(id) {
        const { data } = await apiClient.get(`/api/admin/orders/${id}`);
        return data;
    },
    async updateOrderStatus(id, status) {
        const { data } = await apiClient.put(`/api/admin/orders/${id}/status`, { status });
        return data;
    },
    // ── Inventory ──────────────────────────────
    async getInventoryLogs(params) {
        const { data } = await apiClient.get('/api/admin/inventory-logs', { params });
        return data;
    },
    async restockProduct(productId, quantity) {
        const { data } = await apiClient.post(`/api/admin/products/${productId}/restock`, { quantity });
        return data;
    },
    // ── Users ──────────────────────────────────
    async getUsers(params) {
        const { data } = await apiClient.get('/api/admin/users', { params });
        return data;
    },
};
export default adminService;
