
// import api from './api';

// export const notificationsService = {
//   async getNotifications(params = {}) {
//     try {
//       const response = await api.get('/notifications', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Get notifications error:', error);
//       return { notifications: [], data: [] };
//     }
//   },
  
//   async getUnreadCount() {
//     try {
//       const response = await api.get('/notifications/unread/count');
//       return response.data.count || 0;
//     } catch (error) {
//       console.error('Get unread count error:', error);
//       return 0;
//     }
//   },
  
//   async markAsRead(notificationId) {
//     try {
//       const response = await api.post(`/notifications/${notificationId}/read`);
//       return response.data;
//     } catch (error) {
//       console.error('Mark as read error:', error);
//       return null;
//     }
//   },
  
//   async markAllAsRead() {
//     try {
//       const response = await api.post('/notifications/mark-all-read');
//       return response.data;
//     } catch (error) {
//       console.error('Mark all as read error:', error);
//       return null;
//     }
//   },
// };

import api from './api';

export const notificationsService = {
  async getNotifications(params = {}) {
    try {
      const response = await api.get('/users/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      return { notifications: [], total: 0, unread_count: 0 };
    }
  },
  
  async getUnreadCount() {
    try {
      const response = await api.get('/users/notifications/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  },
  
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      return null;
    }
  },
  
  async markAllAsRead() {
    try {
      const response = await api.put('/users/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      return null;
    }
  },
  
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/users/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      return null;
    }
  },
};