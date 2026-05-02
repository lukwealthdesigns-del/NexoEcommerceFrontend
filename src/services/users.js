
// import api from './api';

// // ==================== FOLLOW SYSTEM ====================

// // Follow a user
// export const followUser = async (userId) => {
//   const response = await api.post(`/users/${userId}/follow`);
//   return response.data;
// };

// // Unfollow a user
// export const unfollowUser = async (userId) => {
//   const response = await api.delete(`/users/${userId}/follow`);
//   return response.data;
// };

// // Check if following a user
// export const checkFollowStatus = async (userId) => {
//   const response = await api.get(`/users/${userId}/follow-status`);
//   return response.data;
// };

// // Get followers list
// export const getFollowers = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/followers`, { params });
//   return response.data;
// };

// // Get following list
// export const getFollowing = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/following`, { params });
//   return response.data;
// };

// // ==================== USER PROFILE ====================

// // Get current user profile
// export const getProfile = async () => {
//   const response = await api.get('/users/me');
//   return response.data;
// };

// // Update profile
// export const updateProfile = async (data) => {
//   const response = await api.put('/users/me', data);
//   return response.data;
// };

// // Upload avatar
// export const uploadAvatar = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const response = await api.post('/users/me/avatar', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// // Delete avatar
// export const deleteAvatar = async () => {
//   const response = await api.delete('/users/me/avatar');
//   return response.data;
// };

// // Change password
// export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
//   const response = await api.post('/users/me/change-password', null, {
//     params: {
//       current_password: currentPassword,
//       new_password: newPassword,
//       confirm_password: confirmPassword
//     }
//   });
//   return response.data;
// };

// // ==================== USER PRODUCTS ====================

// // Get user's products
// export const getMyProducts = async (params = {}) => {
//   const response = await api.get('/users/me/products', { params });
//   return response.data;
// };

// // Get user's orders
// export const getMyOrders = async (params = {}) => {
//   const response = await api.get('/users/me/orders', { params });
//   return response.data;
// };

// // Get user's sales
// export const getMySales = async (params = {}) => {
//   const response = await api.get('/users/me/sales', { params });
//   return response.data;
// };

// // Get user stats
// export const getUserStats = async () => {
//   const response = await api.get('/users/me/stats');
//   return response.data;
// };

// // ==================== PUBLIC USER ====================

// // Get public user profile
// export const getPublicProfile = async (userId) => {
//   const response = await api.get(`/users/${userId}`);
//   return response.data;
// };

// // Get user's public products
// export const getUserProducts = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/products`, { params });
//   return response.data;
// };

// // ==================== SELLER VERIFICATION ====================

// // Request seller verification
// export const requestSellerVerification = async () => {
//   const response = await api.post('/users/me/verify-seller');
//   return response.data;
// };

// // ==================== SERVICE OBJECT (for compatibility with existing imports) ====================

// export const usersService = {
//   // Follow system
//   followUser,
//   unfollowUser,
//   checkFollowStatus,
//   getFollowers,
//   getFollowing,
//   // User profile
//   getProfile,
//   updateProfile,
//   uploadAvatar,
//   deleteAvatar,
//   changePassword,
//   // User products
//   getMyProducts,
//   getMyOrders,
//   getMySales,
//   getUserStats,
//   // Public user
//   getPublicProfile,
//   getUserProducts,
//   // Seller verification
//   requestSellerVerification,
// };

// // Default export for convenience
// export default usersService;

// import api from './api';

// // ==================== FOLLOW SYSTEM ====================

// // Follow a user
// export const followUser = async (userId) => {
//   const response = await api.post(`/users/${userId}/follow`);
//   return response.data;
// };

// // Unfollow a user
// export const unfollowUser = async (userId) => {
//   const response = await api.delete(`/users/${userId}/follow`);
//   return response.data;
// };

// // Check if following a user
// export const checkFollowStatus = async (userId) => {
//   const response = await api.get(`/users/${userId}/follow-status`);
//   return response.data;
// };

// // Get followers list
// export const getFollowers = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/followers`, { params });
//   return response.data;
// };

// // Get following list
// export const getFollowing = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/following`, { params });
//   return response.data;
// };

// // ==================== USER PROFILE ====================

// // Get current user profile
// export const getProfile = async () => {
//   const response = await api.get('/users/me');
//   return response.data;
// };

// // Update profile
// export const updateProfile = async (data) => {
//   const response = await api.put('/users/me', data);
//   return response.data;
// };

// // Upload avatar
// export const uploadAvatar = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const response = await api.post('/users/me/avatar', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// // Delete avatar
// export const deleteAvatar = async () => {
//   const response = await api.delete('/users/me/avatar');
//   return response.data;
// };

// // Change password
// export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
//   const response = await api.post('/users/me/change-password', null, {
//     params: {
//       current_password: currentPassword,
//       new_password: newPassword,
//       confirm_password: confirmPassword
//     }
//   });
//   return response.data;
// };

// // ==================== USER PRODUCTS ====================

// // Get user's products
// export const getMyProducts = async (params = {}) => {
//   const response = await api.get('/users/me/products', { params });
//   return response.data;
// };

// // Get user's orders
// export const getMyOrders = async (params = {}) => {
//   const response = await api.get('/users/me/orders', { params });
//   return response.data;
// };

// // Get user's sales
// export const getMySales = async (params = {}) => {
//   const response = await api.get('/users/me/sales', { params });
//   return response.data;
// };

// // Get user stats
// export const getUserStats = async () => {
//   const response = await api.get('/users/me/stats');
//   return response.data;
// };

// // ==================== PUBLIC USER ====================

// // Get public user profile
// export const getPublicProfile = async (userId) => {
//   const response = await api.get(`/users/${userId}`);
//   return response.data;
// };

// // Get user's public products
// export const getUserProducts = async (userId, params = {}) => {
//   const response = await api.get(`/users/${userId}/products`, { params });
//   return response.data;
// };

// // ==================== SEARCH USERS ====================

// // Search for users to start a new chat
// export const searchUsers = async (query) => {
//   const response = await api.get('/users/search', { 
//     params: { q: query, limit: 20 }
//   });
//   return response.data;
// };

// // ==================== SELLER VERIFICATION ====================

// // Request seller verification
// export const requestSellerVerification = async () => {
//   const response = await api.post('/users/me/verify-seller');
//   return response.data;
// };

// // ==================== SERVICE OBJECT (for compatibility with existing imports) ====================

// export const usersService = {
//   // Follow system
//   followUser,
//   unfollowUser,
//   checkFollowStatus,
//   getFollowers,
//   getFollowing,
//   // User profile
//   getProfile,
//   updateProfile,
//   uploadAvatar,
//   deleteAvatar,
//   changePassword,
//   // User products
//   getMyProducts,
//   getMyOrders,
//   getMySales,
//   getUserStats,
//   // Public user
//   getPublicProfile,
//   getUserProducts,
//   // Search users
//   searchUsers,
//   // Seller verification
//   requestSellerVerification,
// };

// // Default export for convenience
// export default usersService;

import api from './api';

// ==================== FOLLOW SYSTEM ====================

// Follow a user
export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

// Check if following a user
export const checkFollowStatus = async (userId) => {
  const response = await api.get(`/users/${userId}/follow-status`);
  return response.data;
};

// Get followers list
export const getFollowers = async (userId, params = {}) => {
  const response = await api.get(`/users/${userId}/followers`, { params });
  return response.data;
};

// Get following list
export const getFollowing = async (userId, params = {}) => {
  const response = await api.get(`/users/${userId}/following`, { params });
  return response.data;
};

// ==================== USER PROFILE ====================

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Update profile
export const updateProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

// Upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete avatar
export const deleteAvatar = async () => {
  const response = await api.delete('/users/me/avatar');
  return response.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.post('/users/me/change-password', null, {
    params: {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }
  });
  return response.data;
};

// ==================== USER PRODUCTS (FIXED) ====================

// FIXED: Get user's products - using correct products endpoint
export const getMyProducts = async (params = {}) => {
  try {
    // Use the products endpoint instead of users endpoint
    const response = await api.get('/products/users/me/products', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get user products:', error);
    return { pending: [], approved: [], rejected: [] };
  }
};

// Get user's orders
export const getMyOrders = async (params = {}) => {
  const response = await api.get('/users/me/orders', { params });
  return response.data;
};

// Get user's sales
export const getMySales = async (params = {}) => {
  const response = await api.get('/users/me/sales', { params });
  return response.data;
};

// Get user stats
export const getUserStats = async () => {
  const response = await api.get('/users/me/stats');
  return response.data;
};

// ==================== USER LIKES (NEW) ====================

// Get user's liked products
export const getLikedProducts = async () => {
  try {
    const response = await api.get('/users/me/likes');
    return response.data;
  } catch (error) {
    console.error('Failed to get liked products:', error);
    return [];
  }
};

// ==================== USER WISHLIST (NEW) ====================

// Get user's wishlist/saved products
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Failed to get wishlist:', error);
    return [];
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist', { product_id: productId });
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Check if product is in wishlist
export const checkWishlistStatus = async (productId) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data.is_saved;
  } catch (error) {
    return false;
  }
};

// ==================== PUBLIC USER ====================

// Get public user profile
export const getPublicProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Get user's public products
export const getUserProducts = async (userId, params = {}) => {
  const response = await api.get(`/users/${userId}/products`, { params });
  return response.data;
};

// ==================== SEARCH USERS ====================

// Search for users to start a new chat
export const searchUsers = async (query) => {
  const response = await api.get('/users/search', { 
    params: { q: query, limit: 20 }
  });
  return response.data;
};

// ==================== SELLER VERIFICATION ====================

// Request seller verification
export const requestSellerVerification = async () => {
  const response = await api.post('/users/me/verify-seller');
  return response.data;
};

// ==================== SERVICE OBJECT (for compatibility with existing imports) ====================

export const usersService = {
  // Follow system
  followUser,
  unfollowUser,
  checkFollowStatus,
  getFollowers,
  getFollowing,
  // User profile
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  // User products (FIXED)
  getMyProducts,
  getMyOrders,
  getMySales,
  getUserStats,
  // User likes (NEW)
  getLikedProducts,
  // User wishlist (NEW)
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  // Public user
  getPublicProfile,
  getUserProducts,
  // Search users
  searchUsers,
  // Seller verification
  requestSellerVerification,
};

// Default export for convenience
export default usersService;