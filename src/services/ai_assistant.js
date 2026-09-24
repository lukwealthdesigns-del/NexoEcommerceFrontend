// services/ai_assistant.js
import api from './api';

const extractReply = (data) => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  return (
    data.response ||
    data.reply ||
    data.message ||
    data.answer ||
    data.text ||
    data.content ||
    data.result?.reply ||
    data.data?.reply ||
    data.data?.message ||
    ''
  );
};

export const aiService = {
  async chat(message, context = {}) {
    const response = await api.post('/ai/chat', { message, context });
    const reply = extractReply(response.data);
    return { ...response.data, reply };
  },

  async getChatHistory() {
    const response = await api.get('/ai/history');
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.messages || data?.data || [];
  },

  async clearHistory() {
    const response = await api.delete('/ai/history');
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/ai/recommendations');
    return response.data;
  },

  async searchProducts(query) {
    const response = await api.post('/ai/search', { query });
    return response.data;
  },
};