import api from './api';

export const aiService = {
  async chat(message, context = {}) {
    const response = await api.post('/ai/chat', {
      message,
      context,
    });
    return response.data;
  },
  
  async getChatHistory() {
    const response = await api.get('/ai/history');
    return response.data;
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