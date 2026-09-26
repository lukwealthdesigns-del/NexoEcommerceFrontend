import api from './api';

export const ordersService = {
  // ============================================================
  // CREATE SINGLE ORDER
  // ============================================================
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // ============================================================
  // GET MY ORDERS
  // Backend response:
  // {
  //   orders: [...],
  //   total,
  //   page,
  //   limit,
  //   total_pages
  // }
  // ============================================================
  async getMyOrders(params = {}) {
    try {
      const response = await api.get('/orders/my-orders', {
        params,
      });

      return response.data?.orders || [];
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    }
  },

  // ============================================================
  // GET SINGLE ORDER
  // ============================================================
  async getOrder(id) {
    try {
      const response = await api.get(`/orders/verify/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get order:', error);
      throw error;
    }
  },

  // ============================================================
  // CANCEL ORDER
  // ============================================================
  async cancelOrder(id) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  // ============================================================
  // TRACK ORDER
  // Backend tracking endpoint is POST
  // ============================================================
  async trackOrder(id) {
    const response = await api.post(`/orders/${id}/track`);
    return response.data;
  },

  // ============================================================
  // SELLER EARNINGS
  // ============================================================
  async getSellerEarnings() {
    try {
      const response = await api.get('/orders/earnings');
      return response.data;
    } catch (error) {
      console.error('Failed to get earnings:', error);

      return {
        total_sales: 0,
        total_earnings: 0,
        total_customers: 0,
        average_order_value: 0,
      };
    }
  },

  // ============================================================
  // SELLER ORDERS
  // IMPORTANT:
  // Backend endpoint is /seller-orders, NOT /my-sales
  // ============================================================
  async getMySales(params = {}) {
    try {
      const response = await api.get('/orders/seller-orders', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get sales:', error);

      return {
        orders: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 1,
      };
    }
  },

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================
  async updateOrderStatus(orderId, status) {
    const response = await api.put(
      `/orders/${orderId}/status`,
      { status }
    );

    return response.data;
  },

  // ============================================================
  // REQUEST REFUND
  // ============================================================
  async requestRefund(orderId, reason) {
    const response = await api.post(
      `/orders/${orderId}/refund-request`,
      { reason }
    );

    return response.data;
  },
};