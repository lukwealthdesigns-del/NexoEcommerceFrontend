
// import api from './api';

// export const adminService = {
//   // ============================================================
//   // DASHBOARD
//   // ============================================================

//   async getDashboardStats() {
//     const response = await api.get('/admin/dashboard');

//     return {
//       totalUsers: response.data.total_users || 0,
//       totalProducts: response.data.total_products || 0,
//       totalOrders: response.data.total_orders || 0,
//       totalRevenue: response.data.total_revenue || 0,
//       pendingProducts: response.data.pending_products || 0,
//       pendingOrders: response.data.pending_orders || 0,
//       totalAdmins: response.data.total_admins || 0,
//       suspendedUsers: response.data.suspended_users || 0,
//       premiumUsers: response.data.premium_users || 0,
//     };
//   },

//   async getRecentActivities() {
//     try {
//       const response = await api.get('/admin/activities/recent');
//       return response.data;
//     } catch (error) {
//       return [
//         {
//           type: 'user',
//           message: 'New user registered',
//           time: '2 minutes ago',
//         },
//         {
//           type: 'product',
//           message: 'New product listed',
//           time: '15 minutes ago',
//         },
//         {
//           type: 'order',
//           message: 'New order placed',
//           time: '1 hour ago',
//         },
//       ];
//     }
//   },

//   async getRecentOrders() {
//     try {
//       const response = await api.get('/admin/orders/recent');
//       return response.data;
//     } catch (error) {
//       return [];
//     }
//   },

//   // ============================================================
//   // USER MANAGEMENT
//   // ============================================================

//   async getAllUsers(params = {}) {
//     const response = await api.get('/admin/users', { params });

//     return {
//       users: response.data.users || [],
//       total:
//         response.data.total ||
//         response.data.users?.length ||
//         0,
//       page: response.data.page || 1,
//       limit: response.data.limit || 20,
//     };
//   },

//   async getUser(id) {
//     const response = await api.get(`/admin/users/${id}`);
//     return response.data;
//   },

//   async suspendUser(id, reason = '') {
//     const response = await api.post(
//       `/admin/users/${id}/suspend`,
//       { reason }
//     );

//     return response.data;
//   },

//   async unsuspendUser(id) {
//     const response = await api.post(
//       `/admin/users/${id}/unsuspend`
//     );

//     return response.data;
//   },

//   async banUser(id) {
//     return this.suspendUser(
//       id,
//       'Permanently banned'
//     );
//   },

//   async deleteUser(id) {
//     const response = await api.delete(
//       `/admin/users/${id}`
//     );

//     return response.data;
//   },

//   async resetUserPassword(id, newPassword) {
//     const response = await api.post(
//       `/admin/users/${id}/reset-password`,
//       {
//         new_password: newPassword,
//       }
//     );

//     return response.data;
//   },

//   // ============================================================
//   // ADMIN MANAGEMENT
//   // ============================================================

//   async getAllAdmins() {
//     const response = await api.get('/admin/admins');
//     return response.data || [];
//   },

//   async createAdmin(adminData) {
//     const response = await api.post(
//       '/admin/create-admin-frontend',
//       {
//         full_name: adminData.full_name,
//         email: adminData.email,
//         password: adminData.password,
//         role: adminData.role || 'admin',
//       }
//     );

//     return response.data;
//   },

//   async updateAdmin(id, adminData) {
//     const response = await api.put(
//       `/admin/admins/${id}`,
//       adminData
//     );

//     return response.data;
//   },

//   async deleteAdmin(id) {
//     const response = await api.delete(
//       `/admin/admins/${id}`
//     );

//     return response.data;
//   },

//   // ============================================================
//   // SETTINGS
//   // ============================================================

//   async getSettings() {
//     try {
//       const response = await api.get(
//         '/admin/settings'
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'Failed to get settings:',
//         error
//       );

//       return {
//         site_name: 'Nexoleolite',
//         site_description:
//           'Buy and sell everything anywhere',
//         contact_email:
//           'support@nexoleolite.com',
//         support_phone:
//           '+2348012345678',
//         currency: 'NGN',
//         tax_rate: 7.5,
//         shipping_fee: 2000,
//         free_shipping_threshold: 50000,
//         enable_registration: true,
//         enable_guest_checkout: true,
//         maintenance_mode: false,
//         email_verification: true,
//         max_upload_size: 5,
//         allowed_image_types: [
//           'jpg',
//           'png',
//           'webp',
//           'gif',
//         ],
//         allowed_video_types: [
//           'mp4',
//           'mov',
//           'avi',
//           'webm',
//         ],
//       };
//     }
//   },

//   async updateSettings(settings) {
//     const response = await api.put(
//       '/admin/settings',
//       settings
//     );

//     return response.data;
//   },

//   // ============================================================
//   // PREMIUM MANAGEMENT
//   // ============================================================

//   /*
//    * Backend routes (database-backed, app/routers/premium.py):
//    *
//    * GET    /premium/admin/plans
//    * POST   /premium/admin/plans
//    * PUT    /premium/admin/plans/{planKey}
//    * DELETE /premium/admin/plans/{planKey}
//    *
//    * These write to the PremiumPlan DB table, which is what the
//    * public GET /premium/plans endpoint reads from.
//    *
//    * Do NOT use /admin/premium/plans (app/routers/admin.py) for
//    * plan CRUD — that writes to a JSON file on disk that the
//    * public-facing site never reads, so edits made through it
//    * will never show up for users.
//    */

//   async getPremiumPlans() {
//     const response = await api.get(
//       '/premium/admin/plans'
//     );

//     return response.data;
//   },

//   async getAllPremiumSubscriptions() {
//     try {
//       const response = await api.get(
//         '/admin/premium/subscriptions'
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'Failed to get premium subscriptions:',
//         error
//       );

//       return {
//         subscriptions: [],
//         total_active: 0,
//         total_revenue: 0,
//         total_subscribers: 0,
//       };
//     }
//   },

//   async getPremiumStats() {
//     try {
//       const response = await api.get(
//         '/admin/premium/stats'
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'Failed to get premium stats:',
//         error
//       );

//       return {
//         totalPremiumUsers: 0,
//         totalRevenue: 0,
//         activeSubscriptions: 0,
//         expiringSoon: 0,
//       };
//     }
//   },

//   async getPremiumUsers() {
//     try {
//       const response = await api.get(
//         '/admin/premium/users'
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'Failed to get premium users:',
//         error
//       );

//       return [];
//     }
//   },

//   // ------------------------------------------------------------
//   // CREATE PREMIUM PLAN
//   // ------------------------------------------------------------

//   async createPremiumPlan(planData) {
//     const response = await api.post(
//       '/premium/admin/plans',
//       {
//         plan_key:
//           planData.plan_key
//             .toLowerCase()
//             .trim(),

//         name: planData.name,

//         price:
//           Number(planData.price) || 0,

//         duration_days:
//           Number(
//             planData.duration_days
//           ) || 30,

//         boost_multiplier:
//           Number(
//             planData.boost_multiplier
//           ) || 1,

//         features:
//           Array.isArray(planData.features)
//             ? planData.features
//             : [],

//         is_active:
//           planData.is_active !== undefined
//             ? Boolean(planData.is_active)
//             : true,
//       }
//     );

//     return response.data;
//   },

//   // ------------------------------------------------------------
//   // UPDATE PREMIUM PLAN
//   // ------------------------------------------------------------

//   async updatePremiumPlan(
//     planKey,
//     planData
//   ) {
//     if (!planKey) {
//       throw new Error(
//         'Premium plan key is required'
//       );
//     }

//     const response = await api.put(
//       `/premium/admin/plans/${encodeURIComponent(
//         planKey
//       )}`,
//       {
//         name: planData.name,

//         price:
//           Number(planData.price) || 0,

//         duration_days:
//           Number(
//             planData.duration_days
//           ) || 30,

//         boost_multiplier:
//           Number(
//             planData.boost_multiplier
//           ) || 1,

//         features:
//           Array.isArray(planData.features)
//             ? planData.features
//             : [],

//         is_active:
//           planData.is_active !== undefined
//             ? Boolean(planData.is_active)
//             : true,
//       }
//     );

//     return response.data;
//   },

//   // ------------------------------------------------------------
//   // DELETE PREMIUM PLAN
//   // ------------------------------------------------------------

//   async deletePremiumPlan(planKey) {
//     const response = await api.delete(
//       `/premium/admin/plans/${encodeURIComponent(
//         planKey
//       )}`
//     );

//     return response.data;
//   },

//   // ------------------------------------------------------------
//   // PREMIUM ACTIVATION
//   // ------------------------------------------------------------

//   async activatePremium(
//     userId,
//     plan,
//     duration = null
//   ) {
//     const payload = {
//       user_id: userId,
//       plan: plan,
//     };

//     if (
//       duration !== null &&
//       duration !== undefined
//     ) {
//       payload.duration = Number(
//         duration
//       );
//     }

//     const response = await api.post(
//       '/admin/premium/activate',
//       payload
//     );

//     return response.data;
//   },

//   // ------------------------------------------------------------
//   // PREMIUM DEACTIVATION
//   // ------------------------------------------------------------

//   async removePremium(userId) {
//     const response = await api.delete(
//       `/premium/users/${userId}`
//     );

//     return response.data;
//   },

//   async deactivatePremium(
//     subscriptionId
//   ) {
//     const response = await api.post(
//       `/admin/premium/${subscriptionId}/deactivate`
//     );

//     return response.data;
//   },

//   async extendSubscription(
//     subscriptionId,
//     days
//   ) {
//     const response = await api.post(
//       `/premium/admin/subscriptions/${subscriptionId}/extend`,
//       null,
//       {
//         params: {
//           days,
//         },
//       }
//     );

//     return response.data;
//   },

//   // ============================================================
//   // PROMO CODES
//   // ============================================================

//   async createPromoCode(promoData) {
//     const response = await api.post(
//       '/admin/premium/promo',
//       promoData
//     );

//     return response.data;
//   },

//   async getAllPromoCodes() {
//     const response = await api.get(
//       '/admin/premium/promos'
//     );

//     return response.data;
//   },

//   async deletePromoCode(code) {
//     const response = await api.delete(
//       `/admin/premium/promo/${encodeURIComponent(
//         code
//       )}`
//     );

//     return response.data;
//   },

//   // ============================================================
//   // PRODUCT MANAGEMENT
//   // ============================================================

//   async getAllProducts(params = {}) {
//     try {
//       const response = await api.get(
//         '/admin/products',
//         { params }
//       );

//       return response.data;
//     } catch (error) {
//       return {
//         products: [],
//         total: 0,
//       };
//     }
//   },

//   async getPendingProducts() {
//     try {
//       const response = await api.get(
//         '/admin/products/pending'
//       );

//       return response.data;
//     } catch (error) {
//       return {
//         products: [],
//         total: 0,
//       };
//     }
//   },

//   async approveProduct(id) {
//     const response = await api.put(
//       `/admin/products/${id}/approve`
//     );

//     return response.data;
//   },

//   async rejectProduct(id, reason) {
//     const response = await api.put(
//       `/admin/products/${id}/reject`,
//       null,
//       {
//         params: {
//           reason,
//         },
//       }
//     );

//     return response.data;
//   },

//   async adjustProductViews(
//     id,
//     views
//   ) {
//     const response = await api.post(
//       `/admin/products/${id}/adjust-views`,
//       { views }
//     );

//     return response.data;
//   },

//   async deleteProduct(id) {
//     const response = await api.delete(
//       `/admin/products/${id}`
//     );

//     return response.data;
//   },

//   // ============================================================
//   // ORDER MANAGEMENT
//   // ============================================================

//   async getAllOrders(params = {}) {
//     try {
//       const response = await api.get(
//         '/admin/orders',
//         { params }
//       );

//       return response.data;
//     } catch (error) {
//       return {
//         orders: [],
//         total: 0,
//       };
//     }
//   },

//   async updateOrderStatus(
//     id,
//     orderStatus
//   ) {
//     const response = await api.put(
//       `/admin/orders/${id}/status`,
//       {
//         status: orderStatus,
//       }
//     );

//     return response.data;
//   },

//   async processRefund(orderId) {
//     const response = await api.post(
//       `/admin/orders/${orderId}/refund`
//     );

//     return response.data;
//   },

//   // ============================================================
//   // REVIEW MANAGEMENT
//   // ============================================================

//   async getAllReviews(params = {}) {
//     try {
//       const response = await api.get(
//         '/admin/reviews',
//         { params }
//       );

//       return response.data;
//     } catch (error) {
//       return {
//         reviews: [],
//         total: 0,
//       };
//     }
//   },

//   async deleteReview(id) {
//     const response = await api.delete(
//       `/admin/reviews/${id}`
//     );

//     return response.data;
//   },

//   // ============================================================
//   // AUDIT LOGS
//   // ============================================================

//   async getAuditLogs(params = {}) {
//     try {
//       const response = await api.get(
//         '/admin/audit-logs',
//         { params }
//       );

//       return response.data.logs || [];
//     } catch (error) {
//       console.error(
//         'Failed to get audit logs:',
//         error
//       );

//       return [];
//     }
//   },

//   // ============================================================
//   // MESSAGING
//   // ============================================================

//   async sendMessageToUser(
//     userId,
//     subject,
//     message
//   ) {
//     const response = await api.post(
//       '/admin/messages/send',
//       {
//         user_id: userId,
//         subject,
//         message,
//       }
//     );

//     return response.data;
//   },

//   async getUsersList() {
//     try {
//       const response = await api.get(
//         '/admin/users/list'
//       );

//       return response.data;
//     } catch (error) {
//       return [];
//     }
//   },

//   // ============================================================
//   // ANALYTICS
//   // ============================================================

//   async getAnalytics() {
//     try {
//       const response = await api.get(
//         '/admin/analytics'
//       );

//       return response.data;
//     } catch (error) {
//       return {
//         totalRevenue: 0,
//         totalOrders: 0,
//         totalUsers: 0,
//         totalProducts: 0,
//         monthlyRevenue: [],
//         topProducts: [],
//       };
//     }
//   },

//   // ============================================================
//   // NOTIFICATIONS
//   // ============================================================

//   async sendNotification(data) {
//     const response = await api.post(
//       '/admin/notifications/send',
//       {
//         title: data.title,
//         message: data.message,
//         type: data.user_type,
//       }
//     );

//     return response.data;
//   },

//   async getRecentNotifications(
//     limit = 20
//   ) {
//     try {
//       const response = await api.get(
//         '/admin/notifications/recent',
//         {
//           params: {
//             limit,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         'Failed to get notifications:',
//         error
//       );

//       return [];
//     }
//   },

//   async deleteNotification(
//     notificationId
//   ) {
//     const response = await api.delete(
//       `/admin/notifications/${notificationId}`
//     );

//     return response.data;
//   },
// };

// export default adminService;
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
        {
          type: 'user',
          message: 'New user registered',
          time: '2 minutes ago',
        },
        {
          type: 'product',
          message: 'New product listed',
          time: '15 minutes ago',
        },
        {
          type: 'order',
          message: 'New order placed',
          time: '1 hour ago',
        },
      ];
    }
  },

  async getRecentOrders() {
    try {
      const response = await api.get('/admin/orders/recent');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // ============================================================
  // USER MANAGEMENT
  // ============================================================

  async getAllUsers(params = {}) {
    const response = await api.get('/admin/users', { params });

    return {
      users: response.data.users || [],
      total:
        response.data.total ||
        response.data.users?.length ||
        0,
      page: response.data.page || 1,
      limit: response.data.limit || 20,
    };
  },

  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async suspendUser(id, reason = '') {
    const response = await api.post(
      `/admin/users/${id}/suspend`,
      { reason }
    );

    return response.data;
  },

  async unsuspendUser(id) {
    const response = await api.post(
      `/admin/users/${id}/unsuspend`
    );

    return response.data;
  },

  async banUser(id) {
    return this.suspendUser(
      id,
      'Permanently banned'
    );
  },

  async deleteUser(id) {
    const response = await api.delete(
      `/admin/users/${id}`
    );

    return response.data;
  },

  async resetUserPassword(id, newPassword) {
    const response = await api.post(
      `/admin/users/${id}/reset-password`,
      {
        new_password: newPassword,
      }
    );

    return response.data;
  },

  // ============================================================
  // ADMIN MANAGEMENT
  // ============================================================

  async getAllAdmins() {
    const response = await api.get('/admin/admins');
    return response.data || [];
  },

  async createAdmin(adminData) {
    const response = await api.post(
      '/admin/create-admin-frontend',
      {
        full_name: adminData.full_name,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role || 'admin',
      }
    );

    return response.data;
  },

  async updateAdmin(id, adminData) {
    const response = await api.put(
      `/admin/admins/${id}`,
      adminData
    );

    return response.data;
  },

  async deleteAdmin(id) {
    const response = await api.delete(
      `/admin/admins/${id}`
    );

    return response.data;
  },

  // ============================================================
  // SETTINGS
  // ============================================================

  async getSettings() {
    try {
      const response = await api.get(
        '/admin/settings'
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get settings:',
        error
      );

      return {
        site_name: 'Nexoleolite',
        site_description:
          'Buy and sell everything anywhere',
        contact_email:
          'support@nexoleolite.com',
        support_phone:
          '+2348012345678',
        currency: 'NGN',
        tax_rate: 7.5,
        shipping_fee: 2000,
        free_shipping_threshold: 50000,
        enable_registration: true,
        enable_guest_checkout: true,
        maintenance_mode: false,
        email_verification: true,
        max_upload_size: 5,
        allowed_image_types: [
          'jpg',
          'png',
          'webp',
          'gif',
        ],
        allowed_video_types: [
          'mp4',
          'mov',
          'avi',
          'webm',
        ],
      };
    }
  },

  async updateSettings(settings) {
    const response = await api.put(
      '/admin/settings',
      settings
    );

    return response.data;
  },

  // ============================================================
  // PREMIUM MANAGEMENT
  // ============================================================

  /*
   * Backend routes (database-backed, app/routers/premium.py):
   *
   * GET    /premium/admin/plans
   * POST   /premium/admin/plans
   * PUT    /premium/admin/plans/{planKey}
   * DELETE /premium/admin/plans/{planKey}
   * POST   /premium/activate/{userId}?plan=...
   * DELETE /premium/users/{userId}
   * GET    /premium/admin/stats
   * GET    /premium/admin/subscriptions
   *
   * These read/write the PremiumPlan and PremiumSubscription DB
   * tables, which is what the public GET /premium/plans endpoint
   * (and everything users actually see) reads from.
   *
   * Do NOT use /admin/premium/* (app/routers/admin.py) for plan
   * CRUD or activation — that reads/writes a JSON file on disk
   * (premium_plans.json) that the public-facing site never reads.
   * Using it caused activated prices to silently mismatch the
   * prices shown in the admin UI. activatePremium() below has
   * been fixed to use the correct DB-backed route; do not point
   * it back at /admin/premium/activate.
   */

  async getPremiumPlans() {
    const response = await api.get(
      '/premium/admin/plans'
    );

    return response.data;
  },

  async getAllPremiumSubscriptions() {
    try {
      const response = await api.get(
        '/premium/admin/subscriptions'
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get premium subscriptions:',
        error
      );

      return {
        subscriptions: [],
        total_active: 0,
        total_revenue: 0,
        total_subscribers: 0,
      };
    }
  },

  async getPremiumStats() {
    try {
      const response = await api.get(
        '/premium/admin/stats'
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get premium stats:',
        error
      );

      return {
        totalPremiumUsers: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        expiringSoon: 0,
      };
    }
  },

  async getPremiumUsers() {
    try {
      const response = await api.get(
        '/premium/admin/users'
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get premium users:',
        error
      );

      return [];
    }
  },

  // ------------------------------------------------------------
  // CREATE PREMIUM PLAN
  // ------------------------------------------------------------

  async createPremiumPlan(planData) {
    const response = await api.post(
      '/premium/admin/plans',
      {
        plan_key:
          planData.plan_key
            .toLowerCase()
            .trim(),

        name: planData.name,

        price:
          Number(planData.price) || 0,

        duration_days:
          Number(
            planData.duration_days
          ) || 30,

        boost_multiplier:
          Number(
            planData.boost_multiplier
          ) || 1,

        features:
          Array.isArray(planData.features)
            ? planData.features
            : [],

        is_active:
          planData.is_active !== undefined
            ? Boolean(planData.is_active)
            : true,
      }
    );

    return response.data;
  },

  // ------------------------------------------------------------
  // UPDATE PREMIUM PLAN
  // ------------------------------------------------------------

  async updatePremiumPlan(
    planKey,
    planData
  ) {
    if (!planKey) {
      throw new Error(
        'Premium plan key is required'
      );
    }

    const response = await api.put(
      `/premium/admin/plans/${encodeURIComponent(
        planKey
      )}`,
      {
        name: planData.name,

        price:
          Number(planData.price) || 0,

        duration_days:
          Number(
            planData.duration_days
          ) || 30,

        boost_multiplier:
          Number(
            planData.boost_multiplier
          ) || 1,

        features:
          Array.isArray(planData.features)
            ? planData.features
            : [],

        is_active:
          planData.is_active !== undefined
            ? Boolean(planData.is_active)
            : true,
      }
    );

    return response.data;
  },

  // ------------------------------------------------------------
  // DELETE PREMIUM PLAN
  // ------------------------------------------------------------

  async deletePremiumPlan(planKey) {
    const response = await api.delete(
      `/premium/admin/plans/${encodeURIComponent(
        planKey
      )}`
    );

    return response.data;
  },

  // ------------------------------------------------------------
  // PREMIUM ACTIVATION
  // ------------------------------------------------------------

  // FIX: now calls the DB-backed route in premium.py
  // (POST /premium/activate/{user_id}?plan=...) instead of the
  // JSON-file-backed /admin/premium/activate in admin.py. The old
  // route read prices from premium_plans.json, which could silently
  // differ from the PremiumPlan DB table shown everywhere else in
  // the admin UI — so a user could be charged/credited a stale price
  // that didn't match what the admin saw on screen. This route reads
  // plan.price directly from the same PremiumPlan table used by
  // getPremiumPlans() above, so displayed price and applied price
  // are now guaranteed to match.
  //
  // Note: this endpoint takes `plan` as a query param (not a JSON
  // body) and does not support a duration override — it always uses
  // the plan's own duration_days, so the `duration` argument is
  // intentionally no longer sent.
  async activatePremium(userId, plan) {
    const response = await api.post(
      `/premium/activate/${encodeURIComponent(userId)}`,
      null,
      {
        params: { plan },
      }
    );

    return response.data;
  },

  // ------------------------------------------------------------
  // PREMIUM DEACTIVATION
  // ------------------------------------------------------------

  async removePremium(userId) {
    const response = await api.delete(
      `/premium/users/${userId}`
    );

    return response.data;
  },

  async deactivatePremium(
    subscriptionId
  ) {
    const response = await api.post(
      `/premium/admin/subscriptions/${subscriptionId}/cancel`
    );

    return response.data;
  },

  async extendSubscription(
    subscriptionId,
    days
  ) {
    const response = await api.post(
      `/premium/admin/subscriptions/${subscriptionId}/extend`,
      null,
      {
        params: {
          days,
        },
      }
    );

    return response.data;
  },

  // ============================================================
  // PROMO CODES
  // ============================================================

  async createPromoCode(promoData) {
    const response = await api.post(
      '/admin/premium/promo',
      promoData
    );

    return response.data;
  },

  async getAllPromoCodes() {
    const response = await api.get(
      '/admin/premium/promos'
    );

    return response.data;
  },

  async deletePromoCode(code) {
    const response = await api.delete(
      `/admin/premium/promo/${encodeURIComponent(
        code
      )}`
    );

    return response.data;
  },

  // ============================================================
  // PRODUCT MANAGEMENT
  // ============================================================

  async getAllProducts(params = {}) {
    try {
      const response = await api.get(
        '/admin/products',
        { params }
      );

      return response.data;
    } catch (error) {
      return {
        products: [],
        total: 0,
      };
    }
  },

  // Real counts across ALL products, not just the current page.
  // Backs the stat cards on AdminProducts.jsx — see admin.py's
  // GET /admin/products/stats.
  async getProductStats() {
    try {
      const response = await api.get(
        '/admin/products/stats'
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get product stats:',
        error
      );

      return {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      };
    }
  },

  async getPendingProducts() {
    try {
      const response = await api.get(
        '/admin/products/pending'
      );

      return response.data;
    } catch (error) {
      return {
        products: [],
        total: 0,
      };
    }
  },

  async approveProduct(id) {
    const response = await api.put(
      `/admin/products/${id}/approve`
    );

    return response.data;
  },

  async rejectProduct(id, reason) {
    const response = await api.put(
      `/admin/products/${id}/reject`,
      null,
      {
        params: {
          reason,
        },
      }
    );

    return response.data;
  },

  async adjustProductViews(
    id,
    views
  ) {
    const response = await api.post(
      `/admin/products/${id}/adjust-views`,
      { views }
    );

    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(
      `/admin/products/${id}`
    );

    return response.data;
  },

  // ============================================================
  // ORDER MANAGEMENT
  // ============================================================

  async getAllOrders(params = {}) {
    try {
      const response = await api.get(
        '/admin/orders',
        { params }
      );

      return response.data;
    } catch (error) {
      return {
        orders: [],
        total: 0,
      };
    }
  },

  async updateOrderStatus(
    id,
    orderStatus
  ) {
    const response = await api.put(
      `/admin/orders/${id}/status`,
      {
        status: orderStatus,
      }
    );

    return response.data;
  },

  async processRefund(orderId) {
    const response = await api.post(
      `/admin/orders/${orderId}/refund`
    );

    return response.data;
  },

  // ============================================================
  // REVIEW MANAGEMENT
  // ============================================================

  async getAllReviews(params = {}) {
    try {
      const response = await api.get(
        '/admin/reviews',
        { params }
      );

      return response.data;
    } catch (error) {
      return {
        reviews: [],
        total: 0,
      };
    }
  },

  async deleteReview(id) {
    const response = await api.delete(
      `/admin/reviews/${id}`
    );

    return response.data;
  },

  // ============================================================
  // AUDIT LOGS
  // ============================================================

  async getAuditLogs(params = {}) {
    try {
      const response = await api.get(
        '/admin/audit-logs',
        { params }
      );

      return response.data.logs || [];
    } catch (error) {
      console.error(
        'Failed to get audit logs:',
        error
      );

      return [];
    }
  },

  // ============================================================
  // MESSAGING
  // ============================================================

  async sendMessageToUser(
    userId,
    subject,
    message
  ) {
    const response = await api.post(
      '/admin/messages/send',
      {
        user_id: userId,
        subject,
        message,
      }
    );

    return response.data;
  },

  async getUsersList() {
    try {
      const response = await api.get(
        '/admin/users/list'
      );

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
      const response = await api.get(
        '/admin/analytics'
      );

      return response.data;
    } catch (error) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        topProducts: [],
      };
    }
  },

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  async sendNotification(data) {
    const response = await api.post(
      '/admin/notifications/send',
      {
        title: data.title,
        message: data.message,
        type: data.user_type,
      }
    );

    return response.data;
  },

  async getRecentNotifications(
    limit = 20
  ) {
    try {
      const response = await api.get(
        '/admin/notifications/recent',
        {
          params: {
            limit,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to get notifications:',
        error
      );

      return [];
    }
  },

  async deleteNotification(
    notificationId
  ) {
    const response = await api.delete(
      `/admin/notifications/${notificationId}`
    );

    return response.data;
  },
};

export default adminService;