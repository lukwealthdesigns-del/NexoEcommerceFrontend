
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, ShoppingCart, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      console.log('Cart API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else if (response.data && response.data.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view cart');
      } else {
        toast.error('Failed to load cart');
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    try {
      setUpdating(true);
      await api.put(`/cart/update/${itemId}?quantity=${newQuantity}`);
      await loadCart();
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error(error.response?.data?.detail || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(true);
      await api.delete(`/cart/remove/${itemId}`);
      await loadCart();
      toast.success('Item removed');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      setUpdating(true);
      await api.delete('/cart/clear');
      await loadCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.total || (item.product_price * item.quantity)), 0);
  };

  const getDeliveryFee = () => {
    return cartItems.length > 0 ? 2000 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cart</h1>
            <span className="text-sm text-gray-500">
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadCart}
              className="text-gray-500 text-sm hover:text-brand-orange transition flex items-center gap-1"
              disabled={updating}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 text-sm hover:text-red-600 transition"
                disabled={updating}
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {!user ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Please login to view your cart</p>
            <Link to="/signin" className="inline-block mt-6 bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
              Login to Continue
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">Add items from the shop to get started</p>
            <Link to="/shop" className="inline-block mt-6 bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product_image ? (
                        <img 
                          src={getImageUrl(item.product_image)} 
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                          }}
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.product_id}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange">
                            {item.product_title}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition p-1"
                          disabled={updating}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <p className="text-brand-orange font-bold text-lg mt-1">
                        ₦{(item.product_price || 0).toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          disabled={updating}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-gray-900 dark:text-white w-8 text-center font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          disabled={updating}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-sm text-gray-500 ml-2">
                          Total: ₦{((item.product_price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦{getSubtotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦{getDeliveryFee().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <span className="font-bold text-lg text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-lg text-brand-orange">
                  ₦{getTotal().toLocaleString()}
                </span>
              </div>
              
              <Link
                to="/checkout"
                className="w-full mt-4 bg-brand-orange text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <button
                onClick={loadCart}
                className="w-full mt-3 text-gray-500 text-sm hover:text-brand-orange transition text-center"
                disabled={updating}
              >
                Refresh Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;