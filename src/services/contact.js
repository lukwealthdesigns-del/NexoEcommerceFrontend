import api from './api';

export const contactService = {
  async sendMessage(data) {
    const response = await api.post('/contact', data);
    return response.data;
  },
  
  async getContactInfo() {
    const response = await api.get('/contact/info');
    return response.data;
  },
};