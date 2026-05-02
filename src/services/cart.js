// import api from './api';

// export const cartService = {
//   async getCart() {
//     const response = await api.get('/cart');
//     return response.data;
//   },
  
//   async addToCart(productId, quantity) {
//     const response = await api.post('/cart/items', { product_id: productId, quantity });
//     return response.data;
//   },
  
//   async updateCartItem(itemId, quantity) {
//     const response = await api.put(`/cart/items/${itemId}`, { quantity });
//     return response.data;
//   },
  
//   async removeFromCart(itemId) {
//     const response = await api.delete(`/cart/items/${itemId}`);
//     return response.data;
//   },
  
//   async clearCart() {
//     const response = await api.delete('/cart');
//     return response.data;
//   },
  
//   async syncCart(items) {
//     const response = await api.post('/cart/sync', { items });
//     return response.data;
//   },
  
//   async applyCoupon(code) {
//     const response = await api.post('/cart/coupon', { code });
//     return response.data;
//   },
// };

import api from './api';

export const cartService = {
  // Get cart items
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },
  
  // Add item to cart
  async addToCart(productId, quantity) {
    const response = await api.post('/cart/add', { 
      product_id: productId, 
      quantity: quantity 
    });
    return response.data;
  },
  
  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    const response = await api.put(`/cart/update/${itemId}?quantity=${quantity}`);
    return response.data;
  },
  
  // Remove item from cart
  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },
  
  // Clear entire cart
  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
  
  // Sync guest cart with user account after login
  async syncCart(items) {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  },
  
  // Apply coupon to cart (if implemented)
  async applyCoupon(code) {
    const response = await api.post('/cart/coupon', { code });
    return response.data;
  },
};

export default cartService;