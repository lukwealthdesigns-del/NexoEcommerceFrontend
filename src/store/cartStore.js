
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

export const useCartStore = create(
  (set, get) => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    
    // ✅ Add this action
    setTotalItems: (count) => set({ totalItems: count }),
    
    calculateTotals: () => {
      const items = get().items;
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalPrice = items.reduce((sum, item) => sum + ((item.product_price || item.price) * (item.quantity || 1)), 0);
      set({ totalItems, totalPrice });
    },
    
    // Fetch cart from backend API
    fetchCart: async () => {
      try {
        const response = await api.get('/cart');
        const cartItems = response.data || [];
        const items = cartItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          title: item.product_title,
          price: item.product_price,
          image: item.product_image,
          quantity: item.quantity,
          product_price: item.product_price
        }));
        set({ items });
        get().calculateTotals();
        return items;
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        return [];
      }
    },
    
    // Add item to backend cart
    addToCart: async (productId, quantity = 1) => {
      try {
        const response = await api.post('/cart/add', {
          product_id: productId,
          quantity: quantity
        });
        await get().fetchCart();
        return response.data;
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    },
    
    // Update item quantity in backend
    updateCartItem: async (itemId, quantity) => {
      try {
        await api.put(`/cart/update/${itemId}?quantity=${quantity}`);
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to update cart:', error);
        throw error;
      }
    },
    
    // Remove item from backend cart
    removeFromCart: async (itemId) => {
      try {
        await api.delete(`/cart/remove/${itemId}`);
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        throw error;
      }
    },
    
    // Clear entire cart
    clearCart: async () => {
      try {
        await api.delete('/cart/clear');
        set({ items: [], totalItems: 0, totalPrice: 0 });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        throw error;
      }
    },
    
    // Legacy methods for compatibility
    addItem: (product, quantity = 1) => {
      get().addToCart(product.id, quantity);
    },
    
    removeItem: (productId) => {
      const item = get().items.find(i => i.id === productId || i.product_id === productId);
      if (item) {
        get().removeFromCart(item.id);
      }
    },
    
    updateQuantity: (productId, quantity) => {
      const item = get().items.find(i => i.id === productId || i.product_id === productId);
      if (item) {
        get().updateCartItem(item.id, quantity);
      }
    },
    
    syncCart: async () => {
      await get().fetchCart();
    },
  })
);
