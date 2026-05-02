export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
  },
  PRODUCTS: {
    BASE: '/products',
    FEATURED: '/products/featured',
    TRENDING: '/products/trending',
    SEARCH: '/products/search',
    SIMILAR: (id) => `/products/${id}/similar`,
    REVIEWS: (id) => `/products/${id}/reviews`,
    LIKE: (id) => `/products/${id}/like`,
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    TRACK: (id) => `/orders/${id}/track`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    EARNINGS: '/orders/earnings',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    REVIEWS: '/admin/reviews',
    PREMIUM: '/admin/premium',
    ADMINS: '/admin/admins',
    AUDIT_LOGS: '/admin/audit-logs',
  },
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const PRODUCT_CONDITIONS = {
  NEW: 'new',
  USED: 'used',
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  USSD: 'ussd',
  WALLET: 'wallet',
};

export const PREMIUM_PLANS = {
  BASIC: { name: 'Basic', price: 5000, duration: 30, visibility: 'low' },
  STANDARD: { name: 'Standard', price: 15000, duration: 90, visibility: 'medium' },
  PRO: { name: 'Pro', price: 50000, duration: 365, visibility: 'high' },
};