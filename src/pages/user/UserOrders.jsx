import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ImageOff,
} from 'lucide-react';
import { ordersService } from '../../services/orders';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  // ============================================================
  // IMAGE URL HELPER
  // Handles both full URLs and backend relative paths.
  // ============================================================
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('data:')
    ) {
      return imagePath;
    }

    const baseUrl = (
      import.meta.env.VITE_API_URL ||
      ''
    ).replace(/\/$/, '');

    if (imagePath.startsWith('/')) {
      return baseUrl ? `${baseUrl}${imagePath}` : imagePath;
    }

    return baseUrl
      ? `${baseUrl}/${imagePath}`
      : `/${imagePath}`;
  };

  // ============================================================
  // LOAD ORDERS
  // ============================================================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await ordersService.getMyOrders();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);

      toast.error(
        error?.response?.data?.detail ||
        'Failed to load orders'
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // STATUS ICON
  // ============================================================
  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();

    switch (s) {
      case 'delivered':
        return (
          <CheckCircle className="h-4 w-4 text-green-500" />
        );

      case 'shipped':
        return (
          <Truck className="h-4 w-4 text-blue-500" />
        );

      case 'processing':
        return (
          <Clock className="h-4 w-4 text-yellow-500" />
        );

      case 'cancelled':
        return (
          <XCircle className="h-4 w-4 text-red-500" />
        );

      default:
        return (
          <Package className="h-4 w-4 text-gray-500" />
        );
    }
  };

  // ============================================================
  // STATUS COLOR
  // ============================================================
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();

    switch (s) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';

      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

      case 'refunded':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';

      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // ============================================================
  // FILTER ORDERS
  // ============================================================
  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter(
          (order) =>
            (order?.status || '').toLowerCase() === filter
        );

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and track your orders
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-orange text-white hover:bg-orange-600 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'all',
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                filter === status
                  ? 'bg-brand-orange text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {orders.length === 0
                ? 'No orders found'
                : 'No orders in this category'}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : 'Try selecting another order status.'}
            </p>

            {orders.length === 0 && (
              <Link
                to="/shop"
                className="inline-block bg-brand-orange text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          /* ====================================================
             ORDERS
          ==================================================== */
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const imageUrl = getImageUrl(
                order.product_image
              );

              const productTotal =
                Number(order.total_price || 0);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* =================================================
                      ORDER HEADER
                  ================================================= */}
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Order Number
                        </p>

                        <p className="font-semibold text-gray-900 dark:text-white break-all">
                          #{order.order_number || order.id}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Placed on{' '}
                          {order.created_at
                            ? formatDate(order.created_at)
                            : 'Unknown date'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}

                          <span className="capitalize">
                            {order.status || 'pending'}
                          </span>
                        </span>

                        <Link
                          to={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white transition"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      PRODUCT
                  ================================================= */}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* Product Image */}
                      <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              order.product_title ||
                              'Product'
                            }
                            className="w-full h-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                'none';

                              const fallback =
                                event.currentTarget
                                  .parentElement
                                  ?.querySelector(
                                    '[data-image-fallback]'
                                  );

                              if (fallback) {
                                fallback.classList.remove(
                                  'hidden'
                                );
                              }
                            }}
                          />
                        ) : null}

                        <div
                          data-image-fallback
                          className={`${
                            imageUrl ? 'hidden' : 'flex'
                          } items-center justify-center`}
                        >
                          <ImageOff className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>

                      {/* Product Information */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${order.product_id || ''}`}
                          className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-orange transition"
                        >
                          {order.product_title ||
                            'Product'}
                        </Link>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Quantity:{' '}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {order.quantity || 0}
                          </span>
                        </p>

                        {order.tracking_number && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Tracking:{' '}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {order.tracking_number}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Order Total
                        </p>

                        <p className="text-2xl font-bold text-brand-orange mt-1">
                          {formatCurrency(productTotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      FOOTER
                  ================================================= */}
                  <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">

                      <div className="text-gray-500 dark:text-gray-400">
                        <span>
                          Quantity:{' '}
                          <strong className="text-gray-700 dark:text-gray-300">
                            {order.quantity || 0}
                          </strong>
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/orders/${order.id}`}
                        className="text-brand-orange font-medium hover:underline"
                      >
                        View order details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;