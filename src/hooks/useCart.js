import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export const useCart = () => {
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, syncCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated]);

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};