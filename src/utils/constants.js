// src/utils/constants.js - UPDATED WITH CLOUDINARY SUPPORT

// ============================================================
// CLOUDINARY CONFIGURATION (NEW)
// ============================================================

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nexoecommerce',
  API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  DEFAULT_FOLDER: 'nexoecommerce',
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_FILES: 5,
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary')) return url;
  
  const { width = 500, height = 500, crop = 'fill', quality = 'auto', fetch_format = 'auto' } = options;
  
  try {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${fetch_format}/`;
      return `${parts[0]}/upload/${transformations}${parts[1]}`;
    }
  } catch (error) {
    console.error('Error formatting Cloudinary URL:', error);
  }
  
  return url;
};

// Get product thumbnail (small image for listings)
export const getProductThumbnail = (url) => {
  return getCloudinaryUrl(url, { width: 200, height: 200, crop: 'fill' });
};

// Get product detail image (larger for product page)
export const getProductDetailImage = (url) => {
  return getCloudinaryUrl(url, { width: 800, height: 800, crop: 'limit', quality: 'auto' });
};

// Get avatar with specific size and face detection
export const getAvatarUrl = (url, size = 100) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary')) return url;
  
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    const transformations = `w_${size},h_${size},c_fill,g_face,r_max/`;
    return `${parts[0]}/upload/${transformations}${parts[1]}`;
  }
  
  return url;
};

// Get video thumbnail from Cloudinary video URL
export const getVideoThumbnail = (videoUrl, startSeconds = 2) => {
  if (!videoUrl || typeof videoUrl !== 'string') return null;
  if (!videoUrl.includes('cloudinary')) return null;
  
  const parts = videoUrl.split('/upload/');
  if (parts.length === 2) {
    const videoPath = parts[1].replace(/\.[^/.]+$/, '');
    return `${parts[0]}/video/upload/so_${startSeconds}/${videoPath}.jpg`;
  }
  
  return null;
};

// ============================================================
// YOUR EXISTING CONSTANTS (COMPLETELY PRESERVED)
// ============================================================

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

// ============================================================
// ADDITIONAL HELPER FUNCTIONS (Keep from your original if any)
// ============================================================

// If you had these in your original, they're preserved. If not, they're added.
export const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
    shipped: 'text-blue-600 bg-blue-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};