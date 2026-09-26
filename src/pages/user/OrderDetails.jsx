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
  User,
  Phone,
  Home,
  FileText,
  ImageOff,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Ban,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { ordersService } from '../../services/orders';
import {
  formatCurrency,
  formatDate,
} from '../../utils/formatters';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // ============================================================
  // IMAGE URL HELPER
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
  // LOAD ORDER
  // ============================================================
  useEffect(() => {
    if (!id) {
      setError('Order ID is missing.');
      setLoading(false);
      return;
    }

    loadOrder(id);
  }, [id]);

  const loadOrder = async (orderId) => {
    try {
      setLoading(true);
      setError('');

      const data = await ordersService.getOrder(orderId);

      // Backend returns the order object directly.
      const normalizedOrder =
        data?.order ||
        data?.data ||
        data;

      if (!normalizedOrder?.id) {
        throw new Error(
          'Order information could not be found.'
        );
      }

      setOrder(normalizedOrder);
    } catch (err) {
      console.error('Failed to load order:', err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Could not load your order.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CANCEL ORDER
  // ============================================================
  const handleCancelOrder = async () => {
    if (!order?.id || cancelling) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      await ordersService.cancelOrder(order.id);

      toast.success(
        'Order cancelled successfully.'
      );

      await loadOrder(order.id);
    } catch (err) {
      console.error('Failed to cancel order:', err);

      toast.error(
        err?.response?.data?.detail ||
        'Failed to cancel order.'
      );
    } finally {
      setCancelling(false);
    }
  };

  // ============================================================
  // STATUS HELPERS
  // ============================================================
  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
        return (
          <CheckCircle className="h-5 w-5" />
        );

      case 'shipped':
        return (
          <Truck className="h-5 w-5" />
        );

      case 'processing':
        return (
          <Clock className="h-5 w-5" />
        );

      case 'cancelled':
        return (
          <XCircle className="h-5 w-5" />
        );

      case 'refunded':
        return (
          <Ban className="h-5 w-5" />
        );

      default:
        return (
          <Package className="h-5 w-5" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
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
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />

        <p className="text-gray-500 dark:text-gray-400">
          Loading your order...
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center">

          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-5" />

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            We couldn't load your order
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-3 mb-7">
            {error || 'Order not found.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Go Back
            </button>

            <Link
              to="/dashboard/orders"
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white hover:bg-orange-600 transition"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ORDER VALUES
  // ============================================================
  const product = order.product || {};

  const productTitle =
    order.product_title ||
    product.title ||
    'Product';

  const productImage =
    order.product_image ||
    product.image ||
    product.images?.[0] ||
    null;

  const productImageUrl =
    getImageUrl(productImage);

  const quantity =
    Number(order.quantity || 0);

  const unitPrice =
    Number(
      order.unit_price ??
      product.price ??
      0
    );

  const deliveryFee =
    Number(order.delivery_fee || 0);

  const orderTotal =
    Number(order.total_price || 0);

  const productSubtotal =
    unitPrice * quantity;

  const shippingAddress =
    order.shipping_address || {};

  const isCancelled =
    ['cancelled', 'refunded'].includes(
      (order.status || '').toLowerCase()
    );

  const canCancel =
    ['pending', 'processing'].includes(
      (order.status || '').toLowerCase()
    );

  // ============================================================
  // STATUS STEPS
  // ============================================================
  const status =
    (order.status || 'pending').toLowerCase();

  const statusSteps = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: Package,
    },
    {
      key: 'processing',
      label: 'Processing',
      icon: Clock,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: Truck,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: CheckCircle,
    },
  ];

  const statusIndex = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };

  const currentStatusIndex =
    statusIndex[status] ?? 0;

  // ============================================================
  // PAGE
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            BACK BUTTON
        ====================================================== */}
        <div className="mb-6">
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to My Orders</span>
          </Link>
        </div>

        {/* ======================================================
            HEADER
        ====================================================== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Order
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-all">
                #{order.order_number || order.id}
              </h1>

              {order.created_at && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Placed on {formatDate(order.created_at)}
                </p>
              )}
            </div>

            <div
              className={`inline-flex self-start lg:self-auto items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}

              <span className="capitalize">
                {order.status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================
            STATUS TRACKER
        ====================================================== */}
        {!isCancelled && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-7">
              Order Status
            </h2>

            <div className="relative">

              {/* Connecting line */}
              <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

              <div
                className="absolute top-5 left-[12.5%] h-1 bg-brand-orange rounded-full transition-all duration-500"
                style={{
                  width: `${
                    Math.min(
                      currentStatusIndex / 3,
                      1
                    ) * 75
                  }%`,
                }}
              />

              <div className="relative grid grid-cols-4 gap-2">

                {statusSteps.map((step, index) => {
                  const active =
                    index <= currentStatusIndex;

                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className="text-center"
                    >
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                          active
                            ? 'bg-brand-orange text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            CANCELLED / REFUNDED NOTICE
        ====================================================== */}
        {isCancelled && (
          <div
            className={`rounded-2xl p-5 mb-6 ${
              status === 'refunded'
                ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-3">

              <XCircle
                className={`h-6 w-6 flex-shrink-0 ${
                  status === 'refunded'
                    ? 'text-purple-600'
                    : 'text-red-600'
                }`}
              />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Order {status}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This order is no longer being processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ====================================================
              LEFT / MAIN COLUMN
          ==================================================== */}
          <div className="lg:col-span-2 space-y-6">

            {/* ==================================================
                ORDER PRODUCT
            ================================================== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag className="h-5 w-5 text-brand-orange" />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Item
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">

                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">

                  {productImageUrl ? (
                    <img
                      src={productImageUrl}
                      alt={productTitle}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          'none';

                        const fallback =
                          event.currentTarget
                            .parentElement
                            ?.querySelector(
                              '[data-product-fallback]'
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
                    data-product-fallback
                    className={`${
                      productImageUrl
                        ? 'hidden'
                        : 'flex'
                    } items-center justify-center`}
                  >
                    <ImageOff className="h-10 w-10 text-gray-400" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1">

                  <Link
                    to={`/product/${
                      order.product_id ||
                      product.id ||
                      ''
                    }`}
                    className="text-xl font-semibold text-gray-900 dark:text-white hover:text-brand-orange transition"
                  >
                    {productTitle}
                  </Link>

                  {product.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Quantity
                      </p>

                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unit Price
                      </p>

                      <p className="font-semibold text-gray-900 dark:text-white mt-1">
                        {formatCurrency(unitPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                DELIVERY INFORMATION
            ================================================== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-2 mb-5">
                <MapPin className="h-5 w-5 text-brand-orange" />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delivery Information
                </h2>
              </div>

              <div className="space-y-4">

                {shippingAddress.full_name && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recipient
                      </p>

                      <p className="text-gray-900 dark:text-white font-medium">
                        {shippingAddress.full_name}
                      </p>
                    </div>
                  </div>
                )}

                {shippingAddress.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Phone
                      </p>

                      <p className="text-gray-900 dark:text-white font-medium">
                        {shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Address
                    </p>

                    <p className="text-gray-900 dark:text-white">
                      {[
                        shippingAddress.address_line1,
                        shippingAddress.address_line2,
                        shippingAddress.street,
                        shippingAddress.city,
                        shippingAddress.state,
                        shippingAddress.postal_code,
                        shippingAddress.country,
                      ]
                        .filter(Boolean)
                        .join(', ') ||
                        'Delivery address not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                TRACKING
            ================================================== */}
            {order.tracking_number && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-brand-orange" />

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tracking Information
                  </h2>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tracking Number
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1 break-all">
                    {order.tracking_number}
                  </p>
                </div>
              </div>
            )}

            {/* ==================================================
                NOTES
            ================================================== */}
            {order.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-brand-orange" />

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Notes
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* ====================================================
              RIGHT / SUMMARY COLUMN
          ==================================================== */}
          <div className="space-y-6">

            {/* ==================================================
                PAYMENT INFORMATION
            ================================================== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-brand-orange" />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>

                  <p className="text-gray-900 dark:text-white font-medium capitalize mt-1">
                    {order.payment_method || 'Not available'}
                  </p>
                </div>

                {order.payment_reference && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment Reference
                    </p>

                    <p className="text-sm text-gray-900 dark:text-white font-medium mt-1 break-all">
                      {order.payment_reference}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-2 mb-5">
                <Package className="h-5 w-5 text-brand-orange" />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Item
                  </span>

                  <span className="text-gray-900 dark:text-white font-medium text-right">
                    {formatCurrency(productSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Delivery
                  </span>

                  <span className="text-gray-900 dark:text-white font-medium text-right">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">

                  <div className="flex justify-between gap-4">

                    <span className="text-gray-900 dark:text-white font-semibold">
                      Order Total
                    </span>

                    <span className="text-xl font-bold text-brand-orange">
                      {formatCurrency(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="space-y-3">

                {canCancel && (
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Cancel Order
                      </>
                    )}
                  </button>
                )}

                <Link
                  to="/dashboard/orders"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-orange text-white hover:bg-orange-600 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            UPDATED INFORMATION
        ====================================================== */}
        {order.updated_at && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Last updated:{' '}
            {formatDate(order.updated_at)}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;