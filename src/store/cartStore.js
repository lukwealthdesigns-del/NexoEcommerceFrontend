
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import api from '../services/api';

// export const useCartStore = create(
//   (set, get) => ({
//     items: [],
//     totalItems: 0,
//     totalPrice: 0,
    
//     // ✅ Add this action
//     setTotalItems: (count) => set({ totalItems: count }),
    
//     calculateTotals: () => {
//       const items = get().items;
//       const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
//       const totalPrice = items.reduce((sum, item) => sum + ((item.product_price || item.price) * (item.quantity || 1)), 0);
//       set({ totalItems, totalPrice });
//     },
    
//     // Fetch cart from backend API
//     fetchCart: async () => {
//       try {
//         const response = await api.get('/cart');
//         const cartItems = response.data || [];
//         const items = cartItems.map(item => ({
//           id: item.id,
//           product_id: item.product_id,
//           title: item.product_title,
//           price: item.product_price,
//           image: item.product_image,
//           quantity: item.quantity,
//           product_price: item.product_price
//         }));
//         set({ items });
//         get().calculateTotals();
//         return items;
//       } catch (error) {
//         console.error('Failed to fetch cart:', error);
//         return [];
//       }
//     },
    
//     // Add item to backend cart
//     addToCart: async (productId, quantity = 1) => {
//       try {
//         const response = await api.post('/cart/add', {
//           product_id: productId,
//           quantity: quantity
//         });
//         await get().fetchCart();
//         return response.data;
//       } catch (error) {
//         console.error('Failed to add to cart:', error);
//         throw error;
//       }
//     },
    
//     // Update item quantity in backend
//     updateCartItem: async (itemId, quantity) => {
//       try {
//         await api.put(`/cart/update/${itemId}?quantity=${quantity}`);
//         await get().fetchCart();
//       } catch (error) {
//         console.error('Failed to update cart:', error);
//         throw error;
//       }
//     },
    
//     // Remove item from backend cart
//     removeFromCart: async (itemId) => {
//       try {
//         await api.delete(`/cart/remove/${itemId}`);
//         await get().fetchCart();
//       } catch (error) {
//         console.error('Failed to remove from cart:', error);
//         throw error;
//       }
//     },
    
//     // Clear entire cart
//     clearCart: async () => {
//       try {
//         await api.delete('/cart/clear');
//         set({ items: [], totalItems: 0, totalPrice: 0 });
//       } catch (error) {
//         console.error('Failed to clear cart:', error);
//         throw error;
//       }
//     },
    
//     // Legacy methods for compatibility
//     addItem: (product, quantity = 1) => {
//       get().addToCart(product.id, quantity);
//     },
    
//     removeItem: (productId) => {
//       const item = get().items.find(i => i.id === productId || i.product_id === productId);
//       if (item) {
//         get().removeFromCart(item.id);
//       }
//     },
    
//     updateQuantity: (productId, quantity) => {
//       const item = get().items.find(i => i.id === productId || i.product_id === productId);
//       if (item) {
//         get().updateCartItem(item.id, quantity);
//       }
//     },
    
//     syncCart: async () => {
//       await get().fetchCart();
//     },
//   })
// );

import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  setTotalItems: (count) => set({ totalItems: count }),

  // ============================================================
  // PRICE HELPERS
  // ============================================================

  getEffectivePrice: (item) => {
    const regularPrice = Number(
      item.regular_price ??
      item.product_regular_price ??
      item.product_price ??
      item.price ??
      0
    );

    const promotionActive =
      item.is_promotion_active === true ||
      item.product_is_promotion_active === true;

    const effectivePrice =
      item.effective_price ??
      item.product_effective_price ??
      item.discounted_price ??
      item.product_discounted_price;

    if (
      promotionActive &&
      effectivePrice !== undefined &&
      effectivePrice !== null
    ) {
      return Number(effectivePrice) || 0;
    }

    return regularPrice;
  },

  calculateTotals: () => {
    const items = get().items;

    const totalItems = items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    );

    const totalPrice = items.reduce((sum, item) => {
      const price = get().getEffectivePrice(item);
      const quantity = Number(item.quantity) || 1;

      return sum + price * quantity;
    }, 0);

    set({ totalItems, totalPrice });
  },

  // ============================================================
  // FETCH CART FROM BACKEND
  // ============================================================

  fetchCart: async () => {
    try {
      const response = await api.get('/cart');

      const responseData = response.data;

      const cartItems = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.items)
          ? responseData.items
          : [];

      const items = cartItems.map((item) => {
        const regularPrice = Number(
          item.regular_price ??
          item.product_regular_price ??
          item.product_price ??
          item.price ??
          0
        );

        const promotionActive =
          item.is_promotion_active === true ||
          item.product_is_promotion_active === true;

        const effectivePrice =
          item.effective_price ??
          item.product_effective_price ??
          item.discounted_price ??
          item.product_discounted_price;

        const finalPrice =
          promotionActive &&
          effectivePrice !== undefined &&
          effectivePrice !== null
            ? Number(effectivePrice)
            : regularPrice;

        return {
          ...item,

          id: item.id,
          product_id: item.product_id,

          title:
            item.product_title ||
            item.title ||
            item.product?.title ||
            'Product',

          product_title:
            item.product_title ||
            item.title ||
            item.product?.title ||
            'Product',

          image:
            item.product_image ||
            item.image ||
            item.product?.images?.[0] ||
            '',

          product_image:
            item.product_image ||
            item.image ||
            item.product?.images?.[0] ||
            '',

          quantity: Number(item.quantity) || 1,

          // Keep original price separately.
          regular_price: regularPrice,
          product_regular_price: regularPrice,

          // Effective price is used for cart and checkout display.
          price: finalPrice,
          product_price: finalPrice,
          effective_price: finalPrice,

          // Preserve promotion information.
          is_promotion_active: promotionActive,
          product_is_promotion_active: promotionActive,

          discount_percent:
            item.discount_percent ??
            item.product_discount_percent ??
            null,

          promotion_name:
            item.promotion_name ??
            item.product_promotion_name ??
            null,

          promotion_start_at:
            item.promotion_start_at ??
            item.product_promotion_start_at ??
            null,

          promotion_end_at:
            item.promotion_end_at ??
            item.product_promotion_end_at ??
            null,

          promotion_status:
            item.promotion_status ??
            item.product_promotion_status ??
            null,
        };
      });

      set({ items });
      get().calculateTotals();

      return items;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    }
  },

  // ============================================================
  // ADD ITEM TO BACKEND CART
  // ============================================================

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', {
        product_id: productId,
        quantity,
      });

      await get().fetchCart();

      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  },

  // ============================================================
  // UPDATE CART ITEM QUANTITY
  // ============================================================

  updateCartItem: async (itemId, quantity) => {
    try {
      await api.put(`/cart/update/${itemId}?quantity=${quantity}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  },

  // ============================================================
  // REMOVE ITEM FROM CART
  // ============================================================

  removeFromCart: async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },

  // ============================================================
  // CLEAR ENTIRE CART
  // ============================================================

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');

      set({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  },

  // ============================================================
  // LEGACY METHODS FOR COMPATIBILITY
  // ============================================================

  addItem: (product, quantity = 1) => {
    return get().addToCart(product.id, quantity);
  },

  removeItem: (productId) => {
    const item = get().items.find(
      (i) => i.id === productId || i.product_id === productId
    );

    if (item) {
      return get().removeFromCart(item.id);
    }
  },

  updateQuantity: (productId, quantity) => {
    const item = get().items.find(
      (i) => i.id === productId || i.product_id === productId
    );

    if (item) {
      return get().updateCartItem(item.id, quantity);
    }
  },

  syncCart: async () => {
    return await get().fetchCart();
  },
}));
