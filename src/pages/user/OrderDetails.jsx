import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { ordersService } from '../../services/orders';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const data = await ordersService.getOrder(id);

      if (!data) {
        toast.error('Order not found');
        navigate('/dashboard/orders');
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
      navigate('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();

    switch (s) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;

      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;

      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;

      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;

      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

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

      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);

      const updatedOrder = await ordersService.cancelOrder(id);

      setOrder(
        updatedOrder || {
          ...order,
          status: 'cancelled',
        }
      );

      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel order:', error);

      toast.error(
        error?.response?.data?.detail ||
          'Failed to cancel order'
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const totalAmount =
    order.total_amount ??
    order.total_price ??
    items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const status = (order.status || 'pending').toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-orange mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to My Orders
        </button>

        {/* Order Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">

          <div className="p-6 border-b border-gray-100 dark:border-gray-700">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order
                </p>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-all">
                  #{order.id || 'N/A'}
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Placed on{' '}
                  {formatDate(order.created_at) ||
                    'Unknown date'}
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  status
                )}`}
              >
                {getStatusIcon(status)}

                <span className="capitalize">
                  {order.status || 'pending'}
                </span>
              </div>

            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Items
            </h2>

            {items.length > 0 ? (
              <div className="space-y-4">

                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex flex-wrap items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <img
                      src={
                        item.product_image ||
                        '/placeholder.jpg'
                      }
                      alt={
                        item.product_title ||
                        'Product'
                      }
                      className="w-20 h-20 object-cover rounded-xl"
                    />

                    <div className="flex-1 min-w-[180px]">

                      {item.product_id ? (
                        <Link
                          to={`/product/${item.product_id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange"
                        >
                          {item.product_title ||
                            'Product'}
                        </Link>
                      ) : (
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.product_title ||
                            'Product'}
                        </p>
                      )}

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Quantity: {item.quantity || 0}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(
                          item.price || 0
                        )}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total:{' '}
                        {formatCurrency(
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </p>

                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                No items found for this order.
              </p>
            )}

          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Delivery Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

            <div className="flex items-center gap-2 mb-4">

              <MapPin className="h-5 w-5 text-brand-orange" />

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delivery Information
              </h2>

            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">

              {order.shipping_address ? (
                <p className="whitespace-pre-line">
                  {typeof order.shipping_address ===
                  'string'
                    ? order.shipping_address
                    : JSON.stringify(
                        order.shipping_address,
                        null,
                        2
                      )}
                </p>
              ) : (
                <p>
                  No delivery address available.
                </p>
              )}

              {order.tracking_number && (
                <p className="pt-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Tracking:
                  </span>{' '}
                  {order.tracking_number}
                </p>
              )}

            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

            <div className="flex items-center gap-2 mb-4">

              <CreditCard className="h-5 w-5 text-brand-orange" />

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Information
              </h2>

            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">

              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Payment Method:
                </span>{' '}
                {order.payment_method || 'N/A'}
              </p>

              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Payment Reference:
                </span>{' '}
                {order.payment_reference || 'N/A'}
              </p>

              {order.payment_status && (
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Payment Status:
                  </span>{' '}
                  <span className="capitalize">
                    {order.payment_status}
                  </span>
                </p>
              )}

            </div>
          </div>
        </div>

        {/* Total and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Items
              </p>

              <p className="font-semibold text-gray-900 dark:text-white">
                {order.total_items ||
                  items.length ||
                  0}
              </p>
            </div>

            <div className="text-right">

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order Total
              </p>

              <p className="text-3xl font-bold text-brand-orange">
                {formatCurrency(totalAmount)}
              </p>

            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">

            {status === 'shipped' && (
              <button
                onClick={() => {
                  toast.info(
                    'Your order is currently being shipped.'
                  );
                }}
                className="px-5 py-2.5 rounded-lg bg-brand-orange text-white hover:opacity-90 transition"
              >
                Track Order
              </button>
            )}

            {['pending', 'processing'].includes(
              status
            ) && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </button>
            )}

            <button
              onClick={() =>
                navigate('/dashboard/orders')
              }
              className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Back to Orders
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;