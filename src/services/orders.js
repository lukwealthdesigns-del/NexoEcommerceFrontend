

import api from './api';

export const ordersService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  async getMyOrders(params = {}) {
    try {
      const response = await api.get('/orders/my-orders', { params });
      // Ensure we return an array
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Failed to get orders:', error);
      return [];
    }
  },
  
  async getOrder(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get order:', error);
      return null;
    }
  },
  
  async cancelOrder(id) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
  
  async trackOrder(id) {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },
  
  async getSellerEarnings() {
    try {
      const response = await api.get('/orders/earnings');
      return response.data;
    } catch (error) {
      console.error('Failed to get earnings:', error);
      return { total_sales: 0, total_earnings: 0, total_customers: 0, average_order_value: 0 };
    }
  },
  
  async getMySales(params = {}) {
    try {
      const response = await api.get('/orders/my-sales', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get sales:', error);
      return { orders: [], total_sales: 0, total_revenue: 0, total_customers: 0, average_order_value: 0 };
    }
  },
  
  async updateOrderStatus(orderId, status) {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  
  async requestRefund(orderId, reason) {
    const response = await api.post(`/orders/${orderId}/refund-request`, { reason });
    return response.data;
  },
};