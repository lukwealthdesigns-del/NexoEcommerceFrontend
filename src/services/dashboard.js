// src/services/dashboard.js
import api from './api';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return {
        success: false,
        data: {
          products: 0,
          orders: 0,
          sales: 0,
          earnings: 0,
          messages: 0,
          wishlist: 0,
          followers: 0,
          following: 0
        }
      };
    }
  },
  
  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return { success: true, activities: [] };
    }
  }
};