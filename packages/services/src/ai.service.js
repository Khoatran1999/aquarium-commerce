import { apiClient } from './index';
const aiService = {
    // ── Sessions ───────────────────────────────
    async getSessions() {
        const { data } = await apiClient.get('/api/ai/sessions');
        return data;
    },
    async createSession(title) {
        const { data } = await apiClient.post('/api/ai/sessions', { title });
        return data;
    },
    async deleteSession(id) {
        const { data } = await apiClient.delete(`/api/ai/sessions/${id}`);
        return data;
    },
    // ── Messages ───────────────────────────────
    async getMessages(sessionId) {
        const { data } = await apiClient.get(`/api/ai/sessions/${sessionId}/messages`);
        return data;
    },
    async sendMessage(sessionId, content) {
        const { data } = await apiClient.post(`/api/ai/sessions/${sessionId}/messages`, { content });
        return data;
    },
    // ── Recommendations ────────────────────────
    async getRecommendations(productId) {
        const { data } = await apiClient.get(`/api/ai/recommendations/${productId}`);
        return data;
    },
};
export default aiService;
