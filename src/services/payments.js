import api from './api';

export const paymentsService = {
  async initializePayment(orderId, amount, email) {
    const response = await api.post('/payments/initialize', {
      order_id: orderId,
      amount,
      email,
    });
    return response.data;
  },
  
  async verifyPayment(reference) {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  },
  
  async getPaymentMethods() {
    const response = await api.get('/payments/methods');
    return response.data;
  },
  
  async saveCard(cardDetails) {
    const response = await api.post('/payments/save-card', cardDetails);
    return response.data;
  },
  
  async getTransactionHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  },
};