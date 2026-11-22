

// // src/pages/OrderConfirmation.jsx
// import { useState, useEffect } from 'react';
// import { Link, useParams, useSearchParams } from 'react-router-dom';
// import {
//   CheckCircle, Package, Truck, Home, Printer, Download,
//   ShoppingCart, Loader2, AlertCircle
// } from 'lucide-react';
// import { formatCurrency, formatDate } from '../../utils/formatters';
// import api from '../../services/api';
// import toast from 'react-hot-toast';

// const OrderConfirmation = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();

//   // Accept either /order-confirmation/:id OR ?reference=xxx
//   const reference =
//     id ||
//     searchParams.get('reference') ||
//     searchParams.get('trxref');

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!reference) {
//       setError('No order reference provided.');
//       setLoading(false);
//       return;
//     }
//     loadOrder(reference);
//   }, [reference]);

//   const loadOrder = async (ref) => {
//     setLoading(true);
//     setError(null);

//     // 1. Try localStorage first (fast path when the checkout page saved it)
//     try {
//       const cached = JSON.parse(localStorage.getItem('orders') || '[]');
//       const found = cached.find(o => o.id === ref || o.reference === ref);
//       if (found) {
//         setOrder(found);
//         setLoading(false);
//         return;
//       }
//     } catch {
//       /* ignore */
//     }

//     // 2. Fall back to the backend — verify the reference and fetch the order
//     try {
//       const res = await api.get(`/orders/verify/${ref}`);
//       const data = res.data;

//       // Normalize whatever shape the backend returns
//       const normalized = data.order || data.orders?.[0] || data;
//       if (!normalized || !normalized.id) {
//         throw new Error('Order data missing');
//       }

//       setOrder(normalized);
//       // Cache it so a refresh is instant
//       try {
//         const cached = JSON.parse(localStorage.getItem('orders') || '[]');
//         if (!cached.find(o => o.id === normalized.id)) {
//           cached.push(normalized);
//           localStorage.setItem('orders', JSON.stringify(cached));
//         }
//       } catch {
//         /* ignore cache write errors */
//       }
//     } catch (err) {
//       console.error('Failed to load order:', err);
//       setError(
//         err?.response?.data?.detail ||
//         err?.message ||
//         'Could not load your order.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => window.print();

//   const handleDownloadInvoice = () => {
//     toast.success('Invoice downloaded');
//   };

//   // ---- Loading ----
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 gap-3">
//         <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
//         <p className="text-gray-500 dark:text-gray-400">Loading your order…</p>
//       </div>
//     );
//   }

//   // ---- Error ----
//   if (error || !order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
//         <div className="text-center max-w-md">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
//             We couldn't load your order
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
//             {error || 'Order not found.'}
//           </p>
//           <div className="flex gap-3 justify-center">
//             <Link
//               to="/shop"
//               className="bg-brand-orange text-white px-6 py-2.5 rounded-xl hover:bg-orange-600 transition"
//             >
//               Continue Shopping
//             </Link>
//             <Link
//               to="/dashboard/orders"
//               className="border border-gray-300 dark:border-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//             >
//               My Orders
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const statusWidth = {
//     pending: '25%',
//     processing: '50%',
//     shipped: '75%',
//     delivered: '100%',
//   }[order.status] || '25%';

//   const isActive = (level) => {
//     const levels = ['pending', 'processing', 'shipped', 'delivered'];
//     return levels.indexOf(order.status) >= levels.indexOf(level);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Success Message */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="h-10 w-10 text-green-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Thank you for your order!
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Your order has been placed successfully. Order #{order.id}
//           </p>
//           {order.customer_email && (
//             <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//               A confirmation email has been sent to {order.customer_email}
//             </p>
//           )}
//         </div>

//         {/* Status tracker */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//             Order Status
//           </h2>
//           <div className="relative">
//             <div className="flex justify-between">
//               {[
//                 { key: 'pending', label: 'Order Placed', icon: Package },
//                 { key: 'processing', label: 'Processing', icon: Truck },
//                 { key: 'shipped', label: 'Shipped', icon: Package },
//                 { key: 'delivered', label: 'Delivered', icon: Home },
//               ].map((step) => (
//                 <div key={step.key} className="text-center flex-1">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
//                       isActive(step.key)
//                         ? 'bg-brand-orange text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
//                     }`}
//                   >
//                     <step.icon className="h-5 w-5" />
//                   </div>
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {step.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
//               <div
//                 className="h-full bg-brand-orange transition-all duration-500"
//                 style={{ width: statusWidth }}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Items + shipping */}
//           <div className="md:col-span-2">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Order Items
//               </h2>
//               <div className="space-y-4">
//                 {(order.items || []).map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center space-x-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
//                   >
//                     <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.title}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <ShoppingCart className="h-8 w-8 text-gray-400" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <Link
//                         to={`/product/${item.product_id || item.id}`}
//                         className="font-medium text-gray-900 dark:text-white hover:text-brand-orange"
//                       >
//                         {item.title}
//                       </Link>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Quantity: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {formatCurrency(
//                         (item.product_price || item.price || 0) * item.quantity
//                       )}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Shipping Information
//               </h2>
//               <div className="space-y-2 text-sm">
//                 <p className="text-gray-600 dark:text-gray-400">
//                   <span className="font-medium">Address:</span>{' '}
//                   {typeof order.shipping_address === 'string'
//                     ? order.shipping_address
//                     : [order.shipping_address?.street, order.shipping_address?.city, order.shipping_address?.state]
//                         .filter(Boolean)
//                         .join(', ')}
//                 </p>
//                 {order.estimated_delivery && (
//                   <p className="text-gray-600 dark:text-gray-400">
//                     <span className="font-medium">Estimated Delivery:</span>{' '}
//                     {formatDate(order.estimated_delivery)}
//                   </p>
//                 )}
//                 <p className="text-gray-600 dark:text-gray-400">
//                   <span className="font-medium">Payment Method:</span>{' '}
//                   {order.payment_method?.toUpperCase()}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Summary */}
//           <div>
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Order Summary
//               </h2>
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
//                   <span className="text-gray-900 dark:text-white">
//                     {formatCurrency(order.subtotal || 0)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Shipping</span>
//                   <span className="text-gray-900 dark:text-white">
//                     {order.shipping_fee === 0 ? 'Free' : formatCurrency(order.shipping_fee || 0)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Tax</span>
//                   <span className="text-gray-900 dark:text-white">
//                     {formatCurrency(order.tax || 0)}
//                   </span>
//                 </div>
//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
//                   <div className="flex justify-between">
//                     <span className="font-bold text-gray-900 dark:text-white">Total</span>
//                     <span className="text-xl font-bold text-brand-orange">
//                       {formatCurrency(order.total_amount || order.total || 0)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <Link
//                   to="/shop"
//                   className="w-full bg-brand-orange text-white text-center py-2 rounded-xl hover:bg-orange-600 transition block"
//                 >
//                   Continue Shopping
//                 </Link>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={handlePrint}
//                     className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     <Printer className="h-4 w-4" />
//                     <span>Print</span>
//                   </button>
//                   <button
//                     onClick={handleDownloadInvoice}
//                     className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     <Download className="h-4 w-4" />
//                     <span>Invoice</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Printer,
  Download,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ============================================================
// ORDER ITEM HELPERS
// ============================================================

const getOrderItemQuantity = (item) => {
  return Math.max(1, Number(item?.quantity) || 1);
};

const getOrderItemPrice = (item) => {
  const value =
    item?.unit_price ??
    item?.product_price ??
    item?.effective_price ??
    item?.discounted_price ??
    item?.price ??
    item?.product?.unit_price ??
    item?.product?.effective_price ??
    item?.product?.price ??
    0;

  return Math.max(0, Number(value) || 0);
};

const getOrderItemRegularPrice = (item) => {
  const value =
    item?.regular_price ??
    item?.product_regular_price ??
    item?.original_price ??
    item?.product_original_price ??
    item?.product?.regular_price ??
    item?.product?.original_price;

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const price = Number(value);

  return Number.isFinite(price) && price > 0 ? price : null;
};

const getOrderItemPromotion = (item) => {
  const unitPrice = getOrderItemPrice(item);
  const regularPrice = getOrderItemRegularPrice(item);

  // Use the saved order prices to identify a promotion.
  // Do not depend on whether the promotion is still active today.
  const hasPromotion =
    regularPrice !== null &&
    unitPrice > 0 &&
    unitPrice < regularPrice;

  const explicitDiscount = Number(
    item?.discount_percent ??
    item?.product_discount_percent ??
    item?.product?.discount_percent ??
    0
  ) || 0;

  const discountPercent =
    explicitDiscount > 0
      ? explicitDiscount
      : hasPromotion
        ? Math.round(((regularPrice - unitPrice) / regularPrice) * 100)
        : 0;

  return {
    hasPromotion,
    regularPrice,
    unitPrice,
    discountPercent,
    promotionName:
      item?.promotion_name ??
      item?.product_promotion_name ??
      item?.product?.promotion_name ??
      '',
    savings: hasPromotion
      ? (regularPrice - unitPrice) * getOrderItemQuantity(item)
      : 0,
  };
};

const getOrderItemTitle = (item) => {
  return (
    item?.title ||
    item?.product_title ||
    item?.name ||
    item?.product?.title ||
    item?.product?.name ||
    'Product'
  );
};

const getOrderItemImage = (item) => {
  const images = item?.product?.images;

  return (
    item?.image ||
    item?.product_image ||
    item?.product?.image ||
    (Array.isArray(images) ? images[0] : '') ||
    ''
  );
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (Array.isArray(order?.order_items)) {
    return order.order_items;
  }

  return [];
};

const getShippingAddress = (address) => {
  if (!address) return 'No shipping address available.';

  if (typeof address === 'string') {
    return address;
  }

  return [
    address.full_name,
    address.address_line1,
    address.street,
    address.address,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(', ') || 'No shipping address available.';
};

// ============================================================
// ORDER CONFIRMATION
// ============================================================

const OrderConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const reference =
    id ||
    searchParams.get('reference') ||
    searchParams.get('trxref');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // LOAD ORDER
  // ============================================================

  useEffect(() => {
    if (!reference) {
      setError('No order reference provided.');
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadOrder = async (ref) => {
      setLoading(true);
      setError(null);

      // 1. Try localStorage first.
      try {
        const cached = JSON.parse(
          localStorage.getItem('orders') || '[]'
        );

        const found = cached.find(
          (o) =>
            String(o.id) === String(ref) ||
            String(o.reference) === String(ref)
        );

        if (found) {
          if (mounted) {
            setOrder(found);
            setLoading(false);
          }

          return;
        }
      } catch {
        // Ignore localStorage errors.
      }

      // 2. Fall back to backend.
      try {
        const res = await api.get(`/orders/verify/${ref}`);
        const data = res.data;

        const normalized =
          data.order ||
          data.orders?.[0] ||
          data;

        if (!normalized || !normalized.id) {
          throw new Error('Order data missing');
        }

        if (!mounted) return;

        setOrder(normalized);

        // Cache the order for future visits.
        try {
          const cached = JSON.parse(
            localStorage.getItem('orders') || '[]'
          );

          const existingIndex = cached.findIndex(
            (o) => String(o.id) === String(normalized.id)
          );

          if (existingIndex >= 0) {
            cached[existingIndex] = normalized;
          } else {
            cached.push(normalized);
          }

          localStorage.setItem(
            'orders',
            JSON.stringify(cached)
          );
        } catch {
          // Ignore cache write errors.
        }
      } catch (err) {
        console.error('Failed to load order:', err);

        if (mounted) {
          setError(
            err?.response?.data?.detail ||
            err?.message ||
            'Could not load your order.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrder(reference);

    return () => {
      mounted = false;
    };
  }, [reference]);

  // ============================================================
  // PRINT AND INVOICE
  // ============================================================

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.success('Use Print and choose Save as PDF to save your invoice.');
    window.print();
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />

        <p className="text-gray-500 dark:text-gray-400">
          Loading your order…
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            We couldn't load your order
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
            {error || 'Order not found.'}
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/shop"
              className="bg-brand-orange text-white px-6 py-2.5 rounded-xl hover:bg-orange-600 transition"
            >
              Continue Shopping
            </Link>

            <Link
              to="/dashboard/orders"
              className="border border-gray-300 dark:border-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NORMALIZE ORDER DETAILS
  // ============================================================

  const orderItems = getOrderItems(order);

  const totalPromotionSavings = orderItems.reduce(
    (sum, item) => sum + getOrderItemPromotion(item).savings,
    0
  );

  // This is the actual discounted item subtotal.
  // Promotion savings are informational and must NOT be deducted again.
  const calculatedSubtotal = orderItems.reduce(
    (sum, item) =>
      sum + getOrderItemPrice(item) * getOrderItemQuantity(item),
    0
  );

  const subtotal =
    order.subtotal !== undefined && order.subtotal !== null
      ? Number(order.subtotal) || 0
      : calculatedSubtotal;

  const shippingFee = Number(
    order.shipping_fee ?? order.delivery_fee ?? 0
  ) || 0;

  const tax = Number(order.tax || 0);

  // Prefer the amount saved on the order.
  // Only calculate a fallback when the backend did not return a total.
  const savedOrderTotal =
    order.total_amount ??
    order.total_price ??
    order.total;

  const orderTotal =
    savedOrderTotal !== undefined &&
    savedOrderTotal !== null
      ? Number(savedOrderTotal) || 0
      : subtotal + shippingFee + tax;

  const orderStatus = String(
    order.status || 'pending'
  ).toLowerCase();

  // ============================================================
  // ORDER STATUS TRACKER
  // ============================================================

  const statusWidth = {
    pending: '25%',
    processing: '50%',
    shipped: '75%',
    out_for_delivery: '90%',
    delivered: '100%',
  }[orderStatus] || '25%';

  const isActive = (level) => {
    const levels = [
      'pending',
      'processing',
      'shipped',
      'delivered',
    ];

    const currentIndex = levels.indexOf(orderStatus);
    const targetIndex = levels.indexOf(level);

    return (
      currentIndex >= 0 &&
      targetIndex >= 0 &&
      currentIndex >= targetIndex
    );
  };

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SUCCESS MESSAGE */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thank you for your order!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your order has been placed successfully. Order #{order.id}
          </p>

          {order.customer_email && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              A confirmation email has been sent to {order.customer_email}
            </p>
          )}
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Status
          </h2>

          <div className="relative">
            <div className="flex justify-between">
              {[
                {
                  key: 'pending',
                  label: 'Order Placed',
                  icon: Package,
                },
                {
                  key: 'processing',
                  label: 'Processing',
                  icon: Truck,
                },
                {
                  key: 'shipped',
                  label: 'Shipped',
                  icon: Package,
                },
                {
                  key: 'delivered',
                  label: 'Delivered',
                  icon: Home,
                },
              ].map((step) => (
                <div
                  key={step.key}
                  className="text-center flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isActive(step.key)
                        ? 'bg-brand-orange text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
              <div
                className="h-full bg-brand-orange transition-all duration-500"
                style={{ width: statusWidth }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ITEMS AND SHIPPING */}
          <div className="md:col-span-2">

            {/* ORDER ITEMS */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => {
                    const promotion = getOrderItemPromotion(item);
                    const quantity = getOrderItemQuantity(item);
                    const unitPrice = promotion.unitPrice;

                    const productId =
                      item.product_id ||
                      item.product?.id ||
                      item.id;

                    const itemTitle = getOrderItemTitle(item);
                    const itemImage = getOrderItemImage(item);

                    const itemTotal =
                      item.total_price !== undefined &&
                      item.total_price !== null
                        ? Number(item.total_price) || 0
                        : item.total !== undefined &&
                          item.total !== null
                          ? Number(item.total) || 0
                          : unitPrice * quantity;

                    return (
                      <div
                        key={item.id || `${productId}-${index}`}
                        className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        {/* IMAGE */}
                        <div className="w-16 h-16 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={itemTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${productId}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-brand-orange line-clamp-2"
                          >
                            {itemTitle}
                          </Link>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Quantity: {quantity}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {promotion.hasPromotion ? (
                              <>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(unitPrice)}
                                </span>

                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(promotion.regularPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(unitPrice)}
                              </span>
                            )}
                          </div>

                          {promotion.hasPromotion && (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {promotion.discountPercent > 0 && (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                  {promotion.discountPercent}% OFF
                                </span>
                              )}

                              {promotion.promotionName && (
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <Tag className="h-3 w-3" />
                                  {promotion.promotionName}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(itemTotal)}
                          </p>

                          {promotion.hasPromotion && (
                            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                              Saved {formatCurrency(promotion.savings)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No order items were returned.
                  </p>
                )}
              </div>
            </div>

            {/* SHIPPING INFORMATION */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Information
              </h2>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Address:</span>{' '}
                  {getShippingAddress(order.shipping_address)}
                </p>

                {order.estimated_delivery && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      Estimated Delivery:
                    </span>{' '}
                    {formatDate(order.estimated_delivery)}
                  </p>
                )}

                {order.payment_method && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      Payment Method:
                    </span>{' '}
                    {order.payment_method.toUpperCase()}
                  </p>
                )}

                {order.payment_status && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      Payment Status:
                    </span>{' '}
                    {String(order.payment_status).replaceAll('_', ' ').toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">

                {/* SUBTOTAL */}
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>

                  <span className="text-gray-900 dark:text-white text-right">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {/* PROMOTION SAVINGS - INFORMATION ONLY */}
                {totalPromotionSavings > 0 && (
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      You saved with promotions
                    </span>

                    <span className="font-semibold text-green-600 dark:text-green-400 text-right">
                      {formatCurrency(totalPromotionSavings)}
                    </span>
                  </div>
                )}

                {/* SHIPPING */}
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>

                  <span className="text-gray-900 dark:text-white text-right">
                    {shippingFee === 0
                      ? 'Free'
                      : formatCurrency(shippingFee)}
                  </span>
                </div>

                {/* TAX */}
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax
                  </span>

                  <span className="text-gray-900 dark:text-white text-right">
                    {formatCurrency(tax)}
                  </span>
                </div>

                {/* TOTAL */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Total Paid
                    </span>

                    <span className="text-xl font-bold text-brand-orange text-right">
                      {formatCurrency(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="space-y-3">
                <Link
                  to="/shop"
                  className="w-full bg-brand-orange text-white text-center py-2.5 rounded-xl hover:bg-orange-600 transition block"
                >
                  Continue Shopping
                </Link>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadInvoice}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
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
