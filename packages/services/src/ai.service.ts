import { apiClient } from './index';
import type { ChatSession, ChatMessage, AiRecommendation, ApiResponse } from '@repo/types';

const aiService = {
  // ── Sessions ───────────────────────────────
  async getSessions(): Promise<ApiResponse<ChatSession[]>> {
    const { data } = await apiClient.get('/api/ai/sessions');
    return data;
  },

  async createSession(title?: string): Promise<ApiResponse<ChatSession>> {
    const { data } = await apiClient.post('/api/ai/sessions', { title });
    return data;
  },

  async deleteSession(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete(`/api/ai/sessions/${id}`);
    return data;
  },

  // ── Messages ───────────────────────────────
  async getMessages(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    const { data } = await apiClient.get(`/api/ai/sessions/${sessionId}/messages`);
    return data;
  },

  async sendMessage(sessionId: string, content: string): Promise<ApiResponse<ChatMessage>> {
    const { data } = await apiClient.post(`/api/ai/sessions/${sessionId}/messages`, { content });
    return data;
  },

  // ── Recommendations ────────────────────────
  async getRecommendations(productId: string): Promise<ApiResponse<AiRecommendation>> {
    const { data } = await apiClient.get(`/api/ai/recommendations/${productId}`);
    return data;
  },
};

export default aiService;
