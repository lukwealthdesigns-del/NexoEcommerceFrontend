import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleUpdateQuantity = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      removeItem(productId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link to="/shop" className="btn-primary inline-flex items-center">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="sm:w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange">
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Category: {item.category || 'General'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-4 gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand-orange">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-600 dark:text-gray-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-600 dark:text-gray-400">Included</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-brand-orange">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {!isAuthenticated && (
                <div className="mt-4 text-center">
                  <Link to="/signin" className="text-sm text-brand-orange hover:underline">
                    Sign in for faster checkout
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Secure payment powered by Paystack
                </p>
                <div className="flex justify-center space-x-2 mt-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://paystack.com/assets/img/favicon.png" alt="Paystack" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;