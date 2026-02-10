import { apiClient } from './index';
const productService = {
    async getProducts(filter) {
        const { data } = await apiClient.get('/api/products', { params: filter });
        return data;
    },
    async getProduct(slug) {
        const { data } = await apiClient.get(`/api/products/${slug}`);
        return data;
    },
};
export default productService;
