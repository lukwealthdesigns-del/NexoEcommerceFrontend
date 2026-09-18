import api from './api';

export const adminService = {
  // ============================================================
  // DASHBOARD
  // ============================================================
  
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return {
      totalUsers: response.data.total_users || 0,
      totalProducts: response.data.total_products || 0,
      totalOrders: response.data.total_orders || 0,
      totalRevenue: response.data.total_revenue || 0,
      pendingProducts: response.data.pending_products || 0,
      pendingOrders: response.data.pending_orders || 0,
      totalAdmins: response.data.total_admins || 0,
      suspendedUsers: response.data.suspended_users || 0,
      premiumUsers: response.data.premium_users || 0,
    };
  },
  
  async getRecentActivities() {
    try {
      const response = await api.get('/admin/activities/recent');
      return response.data;
    } catch (error) {
      return [
        { type: 'user', message: 'New user registered', time: '2 minutes ago' },
        { type: 'product', message: 'New product listed', time: '15 minutes ago' },
        { type: 'order', message: 'New order placed', time: '1 hour ago' },
      ];
    }
  },
  
  async getRecentOrders() {
    try {
      const response = await api.get('/admin/orders/recent');
      return response.data;
    } catch (error) {
      return [
        { id: 'ORD001', customer_name: 'John Doe', amount: 50000, status: 'pending', date: '2024-01-15' },
        { id: 'ORD002', customer_name: 'Jane Smith', amount: 75000, status: 'shipped', date: '2024-01-14' },
      ];
    }
  },
  
  // ============================================================
  // USER MANAGEMENT
  // ============================================================
  
  async getAllUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return {
      users: response.data.users || [],
      total: response.data.total || response.data.users?.length || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 20,
    };
  },
  
  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  
  async suspendUser(id, reason = '') {
    const response = await api.post(`/admin/users/${id}/suspend`, { reason });
    return response.data;
  },
  
  async unsuspendUser(id) {
    const response = await api.post(`/admin/users/${id}/unsuspend`);
    return response.data;
  },
  
  async banUser(id) {
    return this.suspendUser(id, 'Permanently banned');
  },
  
  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  async resetUserPassword(id, newPassword) {
    const response = await api.post(`/admin/users/${id}/reset-password`, { new_password: newPassword });
    return response.data;
  },
  
  // ============================================================
  // ADMIN MANAGEMENT (Super Admin only)
  // ============================================================
  
  async getAllAdmins() {
    const response = await api.get('/admin/admins');
    return response.data || [];
  },
  
  async createAdmin(adminData) {
    const response = await api.post('/admin/create-admin-frontend', {
      full_name: adminData.full_name,
      email: adminData.email,
      password: adminData.password,  // ← FIXED: Added password field
      role: adminData.role || 'admin'
    });
    return response.data;
  },
  
  async updateAdmin(id, adminData) {
    const response = await api.put(`/admin/admins/${id}`, adminData);
    return response.data;
  },
  
  async deleteAdmin(id) {
    const response = await api.delete(`/admin/admins/${id}`);
    return response.data;
  },
  
  // ============================================================
  // SETTINGS MANAGEMENT (Super Admin only)
  // ============================================================
  
  async getSettings() {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {
        site_name: 'NexoLeolite',
        site_description: 'Buy and sell everything anywhere',
        contact_email: 'support@nexoelite.com',
        support_phone: '+2348012345678',
        currency: 'NGN',
        tax_rate: 7.5,
        shipping_fee: 2000,
        free_shipping_threshold: 50000,
        enable_registration: true,
        enable_guest_checkout: true,
        maintenance_mode: false,
        email_verification: true,
        max_upload_size: 5,
        allowed_image_types: ['jpg', 'png', 'webp', 'gif'],
        allowed_video_types: ['mp4', 'mov', 'avi', 'webm']
      };
    }
  },
  
  async updateSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },
  
  // ============================================================
  // PREMIUM MANAGEMENT - PERMANENT FIX WITH FORCE-UPDATE
  // ============================================================
  
  async getPremiumPlans() {
    try {
      const response = await api.get('/premium/plans');
      return response.data;
    } catch (error) {
      console.error('Failed to get premium plans:', error);
      return null;
    }
  },
  
  async getAllPremiumSubscriptions() {
    try {
      const response = await api.get('/premium/admin/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Failed to get premium subscriptions:', error);
      return { subscriptions: [], total_active: 0, total_revenue: 0, total_subscribers: 0 };
    }
  },
  
  async getPremiumStats() {
    try {
      const response = await api.get('/premium/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get premium stats:', error);
      return { totalPremiumUsers: 0, totalRevenue: 0, activeSubscriptions: 0, expiringSoon: 0 };
    }
  },
  
  async getPremiumUsers() {
    try {
      const response = await api.get('/premium/admin/users');
      return response.data;
    } catch (error) {
      console.error('Failed to get premium users:', error);
      return [];
    }
  },
  
  // FIXED: Using force-update endpoint for guaranteed persistence
  async updatePremiumPlan(planKey, planData) {
    const response = await api.post(`/premium/admin/plans/${planKey}/force-update`, {
      name: planData.name,
      price: planData.price,
      duration_days: planData.duration_days,
      boost_multiplier: planData.boost_multiplier,
      features: planData.features,
      is_active: planData.is_active !== undefined ? planData.is_active : true
    });
    return response.data;
  },
  
  async createPremiumPlan(planData) {
    const response = await api.post('/premium/admin/plans', {
      plan_key: planData.plan_key,
      name: planData.name,
      price: planData.price,
      duration_days: planData.duration_days,
      boost_multiplier: planData.boost_multiplier,
      features: planData.features,
      is_active: true
    });
    return response.data;
  },
  
  async deletePremiumPlan(planKey) {
    const response = await api.delete(`/premium/admin/plans/${planKey}`);
    return response.data;
  },
  
  async createPromoCode(promoData) {
    const response = await api.post('/premium/admin/promo-codes', promoData);
    return response.data;
  },
  
  async getAllPromoCodes() {
    const response = await api.get('/premium/admin/promo-codes');
    return response.data;
  },
  
  async deletePromoCode(code) {
    const response = await api.delete(`/premium/admin/promo-codes/${code}`);
    return response.data;
  },
  
  async activatePremium(userId, plan) {
    const response = await api.post(`/premium/activate/${userId}?plan=${plan}`);
    return response.data;
  },
  
  async removePremium(userId) {
    const response = await api.delete(`/premium/users/${userId}`);
    return response.data;
  },
  
  async deactivatePremium(subscriptionId) {
    const response = await api.post(`/premium/admin/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  },
  
  async extendSubscription(subscriptionId, days) {
    const response = await api.post(`/premium/admin/subscriptions/${subscriptionId}/extend?days=${days}`);
    return response.data;
  },
  
  // ============================================================
  // PRODUCT MANAGEMENT
  // ============================================================
  
  async getAllProducts(params = {}) {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      return { products: [], total: 0 };
    }
  },
  
  async getPendingProducts() {
    try {
      const response = await api.get('/admin/products/pending');
      return response.data;
    } catch (error) {
      return { products: [], total: 0 };
    }
  },
  
  async approveProduct(id) {
    const response = await api.put(`/admin/products/${id}/approve`);
    return response.data;
  },
  
  async rejectProduct(id, reason) {
    const response = await api.put(`/admin/products/${id}/reject`, null, { params: { reason } });
    return response.data;
  },
  
  async adjustProductViews(id, views) {
    const response = await api.post(`/admin/products/${id}/adjust-views`, { views });
    return response.data;
  },
  
  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
  
  // ============================================================
  // ORDER MANAGEMENT
  // ============================================================
  
  async getAllOrders(params = {}) {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      return { orders: [], total: 0 };
    }
  },
  
  async updateOrderStatus(id, status) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
  
  async processRefund(orderId) {
    const response = await api.post(`/admin/orders/${orderId}/refund`);
    return response.data;
  },
  
  // ============================================================
  // REVIEW MANAGEMENT
  // ============================================================
  
  async getAllReviews(params = {}) {
    try {
      const response = await api.get('/admin/reviews', { params });
      return response.data;
    } catch (error) {
      return { reviews: [], total: 0 };
    }
  },
  
  async deleteReview(id) {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },
  
  // ============================================================
  // AUDIT LOGS
  // ============================================================
  
  async getAuditLogs(params = {}) {
    try {
      const response = await api.get('/admin/audit-logs', { params });
      return response.data.logs || [];
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  },
  
  // ============================================================
  // MESSAGING
  // ============================================================
  
  async sendMessageToUser(userId, subject, message) {
    const response = await api.post('/admin/messages/send', { 
      user_id: userId, 
      subject, 
      message 
    });
    return response.data;
  },
  
  async getUsersList() {
    try {
      const response = await api.get('/admin/users/list');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  // ============================================================
  // ANALYTICS
  // ============================================================
  
  async getAnalytics() {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        topProducts: []
      };
    }
  },
  
  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  async sendNotification(data) {
    const response = await api.post('/admin/notifications/send', {
      title: data.title,
      message: data.message,
      type: data.user_type
    });
    return response.data;
  },

  async getRecentNotifications(limit = 20) {
    try {
      const response = await api.get('/admin/notifications/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  },

  async deleteNotification(notificationId) {
    const response = await api.delete(`/admin/notifications/${notificationId}`);
    return response.data;
  },
};

export default adminService;