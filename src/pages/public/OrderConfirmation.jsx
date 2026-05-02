import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Printer, Download, ShoppingCart } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = () => {
    try {
      // Get order from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find(o => o.id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error('Order not found');
        setOrder(null);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Order not found</h2>
          <Link to="/shop" className="text-brand-orange hover:underline mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusWidth = () => {
    switch(order.status) {
      case 'pending': return '25%';
      case 'processing': return '50%';
      case 'shipped': return '75%';
      case 'delivered': return '100%';
      default: return '25%';
    }
  };

  const isStatusActive = (statusLevel) => {
    const levels = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = levels.indexOf(order.status);
    const levelIndex = levels.indexOf(statusLevel);
    return currentIndex >= levelIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thank you for your order!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your order has been placed successfully. Order #{order.id}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            A confirmation email has been sent to {order.customer_email}
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status</h2>
          <div className="relative">
            <div className="flex justify-between">
              <div className="text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isStatusActive('pending') ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Placed</p>
              </div>
              <div className="text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isStatusActive('processing') ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Truck className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing</p>
              </div>
              <div className="text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isStatusActive('shipped') ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipped</p>
              </div>
              <div className="text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isStatusActive('delivered') ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Home className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivered</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
              <div 
                className="h-full bg-brand-orange transition-all duration-500"
                style={{ width: getStatusWidth() }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.product_id || item.id}`} className="font-medium text-gray-900 dark:text-white hover:text-brand-orange">
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency((item.product_price || item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Address:</span> {order.shipping_address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimated_delivery)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Payment Method:</span> {order.payment_method?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shipping_fee === 0 ? 'Free' : formatCurrency(order.shipping_fee || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax || 0)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-brand-orange">{formatCurrency(order.total_amount || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/shop" className="w-full bg-brand-orange text-white text-center py-2 rounded-xl hover:bg-orange-600 transition block">
                  Continue Shopping
                </Link>
                <div className="flex space-x-3">
                  <button onClick={handlePrint} className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  <button onClick={handleDownloadInvoice} className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="h-4 w-4" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;