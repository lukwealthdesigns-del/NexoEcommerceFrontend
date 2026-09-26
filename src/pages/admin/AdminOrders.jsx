// src/pages/admin/AdminOrders.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Search,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Package,
  CreditCard,
  User,
  Store,
  MapPin,
  ExternalLink,
  Copy,
  ChevronRight,
  ChevronDown,
  Calendar,
  Hash,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CircleDollarSign,
  Box,
  X,
} from 'lucide-react';

import { adminService } from '../../services/admin';
import {
  formatCurrency,
  formatDate,
} from '../../utils/formatters';

import toast from 'react-hot-toast';


const STATUSES = [
  'pending',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
];


const STATUS_META = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className:
      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
  },

  processing: {
    label: 'Processing',
    icon: Package,
    className:
      'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20',
  },

  shipped: {
    label: 'Shipped',
    icon: Truck,
    className:
      'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20',
  },

  out_for_delivery: {
    label: 'Out for delivery',
    icon: Truck,
    className:
      'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-400/10 dark:text-purple-300 dark:ring-purple-400/20',
  },

  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    className:
      'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  },

  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className:
      'bg-red-50 text-red-700 ring-red-200 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20',
  },

  refunded: {
    label: 'Refunded',
    icon: RotateCcw,
    className:
      'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20',
  },
};


const getStatusMeta = (status) => {
  return (
    STATUS_META[status] || {
      label: status || 'Unknown',
      icon: Clock,
      className:
        'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-400/10 dark:text-gray-300 dark:ring-gray-400/20',
    }
  );
};


const formatStatus = (status) => {
  return getStatusMeta(status).label;
};


const formatDateTime = (value) => {
  if (!value) return '—';

  try {
    return new Date(value).toLocaleString(
      undefined,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    );
  } catch {
    return value;
  }
};


const formatAddress = (address) => {
  if (!address) {
    return 'No address provided';
  }

  if (typeof address === 'string') {
    return address;
  }

  try {
    return Object.entries(address)
      .filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ''
      )
      .map(([, value]) => String(value))
      .join(', ');
  } catch {
    return String(address);
  }
};


const getProductImage = (order) => {
  return (
    order?.product?.image ||
    order?.product?.images?.[0] ||
    null
  );
};


const getProductImages = (order) => {
  const images =
    order?.product?.images || [];

  if (
    Array.isArray(images) &&
    images.length
  ) {
    return images;
  }

  const single =
    getProductImage(order);

  return single ? [single] : [];
};


const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);

  const Icon = meta.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ring-1
        ring-inset
        whitespace-nowrap
        ${meta.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      {meta.label}
    </span>
  );
};


const PaymentBadge = ({
  status,
}) => {
  const paid =
    status === 'paid' ||
    status === 'success' ||
    status === 'successful';

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${
          paid
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
        }
      `}
    >
      {status || 'pending'}
    </span>
  );
};


const CopyButton = ({
  value,
  label = 'Copy',
}) => {
  if (!value) return null;

  const copy = async (event) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(
        String(value)
      );

      toast.success(`${label} copied`);
    } catch {
      toast.error('Unable to copy');
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${label}`}
      className="
        inline-flex
        items-center
        justify-center
        rounded-lg
        p-1.5
        text-gray-400
        transition
        hover:bg-gray-100
        hover:text-gray-700
        dark:hover:bg-gray-700
        dark:hover:text-gray-200
      "
    >
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
};


const SummaryCard = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        dark:border-gray-800
        dark:bg-gray-800
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gray-100
            text-gray-700
            dark:bg-gray-700
            dark:text-gray-200
          "
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};


const InfoRow = ({
  icon: Icon,
  label,
  value,
  copy,
}) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-gray-400">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <div className="mt-0.5 flex min-w-0 items-center gap-1">
          <p className="min-w-0 break-words text-sm font-medium text-gray-900 dark:text-gray-100">
            {value || '—'}
          </p>

          {copy && (
            <CopyButton
              value={value}
              label={label}
            />
          )}
        </div>
      </div>
    </div>
  );
};


const OrderProduct = ({
  order,
  compact = false,
}) => {
  const image =
    getProductImage(order);

  const product =
    order?.product;

  return (
    <div
      className={`
        flex
        min-w-0
        gap-3
        ${compact ? '' : 'rounded-xl border border-gray-200 p-3 dark:border-gray-700'}
      `}
    >
      <div
        className="
          h-16
          w-16
          shrink-0
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-gray-100
          dark:border-gray-700
          dark:bg-gray-700
        "
      >
        {image ? (
          <img
            src={image}
            alt={
              product?.name ||
              'Product'
            }
            className="
              h-full
              w-full
              object-cover
            "
            loading="lazy"
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              text-gray-400
            "
          >
            <Box className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {product?.name ||
            product?.title ||
            'Product unavailable'}
        </p>

        {product?.sku && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            SKU: {product.sku}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Qty: {order.quantity || 0}
          </span>

          <span>
            {formatCurrency(
              order.unit_price || 0
            )}{' '}
            each
          </span>
        </div>
      </div>
    </div>
  );
};


const Timeline = ({ history = [] }) => {
  if (!history.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No status history is available for this order.
      </div>
    );
  }

  return (
    <div className="relative ml-2">
      {history.map(
        (item, index) => {
          const last =
            index ===
            history.length - 1;

          return (
            <div
              key={
                item.id ||
                `${item.created_at}-${index}`
              }
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!last && (
                <div
                  className="
                    absolute
                    left-[7px]
                    top-5
                    h-full
                    w-px
                    bg-gray-200
                    dark:bg-gray-700
                  "
                />
              )}

              <div
                className="
                  relative
                  mt-1
                  h-4
                  w-4
                  shrink-0
                  rounded-full
                  border-2
                  border-white
                  bg-brand-orange
                  shadow
                  dark:border-gray-800
                "
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={
                      item.new_status
                    }
                  />

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(
                      item.created_at
                    )}
                  </span>
                </div>

                {item.old_status && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    From{' '}
                    <strong>
                      {formatStatus(
                        item.old_status
                      )}
                    </strong>
                  </p>
                )}

                {item.note && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {item.note}
                  </p>
                )}

                {item.tracking_number && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Tracking:{' '}
                    {item.tracking_number}
                  </p>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};


const AdminOrders = () => {
  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    status,
    setStatus,
  ] = useState('all');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalOrders,
    setTotalOrders,
  ] = useState(0);

  const [
    savingId,
    setSavingId,
  ] = useState(null);

  const [
    tracking,
    setTracking,
  ] = useState({});

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(null);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    expandedMobile,
    setExpandedMobile,
  ] = useState(null);

  const limit = 20;


  const loadOrders = async () => {
    setLoading(true);

    try {
      const data =
        await adminService.getAllOrders({
          page,
          limit,
          status:
            status === 'all'
              ? undefined
              : status,
        });

      setOrders(
        data.orders || []
      );

      setTotalOrders(
        data.total || 0
      );

      setTotalPages(
        data.total_pages ||
          Math.max(
            1,
            Math.ceil(
              (data.total || 0) /
                limit
            )
          )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          'Failed to load orders'
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadOrders();
  }, [page, status]);


  const openOrder = async (order) => {
    setSelectedOrder(order);

    setDetailLoading(true);

    try {
      const fresh =
        await adminService.getOrder(
          order.id
        );

      setSelectedOrder(fresh);
    } catch (error) {
      console.error(error);

      // Keep the order already loaded in the table.
    } finally {
      setDetailLoading(false);
    }
  };


  const updateStatus = async (
    order,
    nextStatus,
    extra = {}
  ) => {
    setSavingId(order.id);

    try {
      const updated =
        await adminService.updateOrderStatus(
          order.id,
          nextStatus,
          {
            tracking_number:
              tracking[order.id]
                ?.tracking_number ??
              order.tracking_number ??
              extra.tracking_number ??
              null,

            tracking_url:
              tracking[order.id]
                ?.tracking_url ??
              order.tracking_url ??
              extra.tracking_url ??
              null,

            note:
              extra.note ?? null,

            cancellation_reason:
              extra.cancellation_reason ??
              null,
          }
        );

      toast.success(
        `Order ${
          order.order_number ||
          order.id
        } updated`
      );

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? updated
            : item
        )
      );

      setSelectedOrder(
        updated
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          'Failed to update order'
      );
    } finally {
      setSavingId(null);
    }
  };


  const refund = async (order) => {
    const confirmed =
      window.confirm(
        `Process a real Paystack refund for ${
          order.order_number ||
          order.id
        }?`
      );

    if (!confirmed) {
      return;
    }

    setSavingId(order.id);

    try {
      const updated =
        await adminService.processRefund(
          order.id
        );

      toast.success(
        'Refund processed successfully'
      );

      if (updated) {
        setOrders((current) =>
          current.map((item) =>
            item.id === order.id
              ? {
                  ...item,
                  ...updated,
                }
              : item
          )
        );

        setSelectedOrder(
          updated
        );
      } else {
        await loadOrders();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          'Refund failed'
      );
    } finally {
      setSavingId(null);
    }
  };


  const visibleOrders =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      if (!q) {
        return orders;
      }

      return orders.filter(
        (order) =>
          [
            order.order_number,
            order.customer_name,
            order.customer_email,
            order.id,
            order.product?.name,
            order.product?.title,
            order.seller_name,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(q)
            )
      );
    }, [orders, search]);


  const pageStats =
    useMemo(() => {
      const paid = orders.filter(
        (order) =>
          order.payment_status ===
            'paid' ||
          order.payment_status ===
            'success'
      ).length;

      const delivered =
        orders.filter(
          (order) =>
            order.status ===
            'delivered'
        ).length;

      const pending =
        orders.filter(
          (order) =>
            order.status ===
            'pending'
        ).length;

      const revenue =
        orders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.total_price || 0
            ),
          0
        );

      return {
        paid,
        delivered,
        pending,
        revenue,
      };
    }, [orders]);


  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        px-3
        py-4
        sm:px-5
        sm:py-6
        lg:px-8
        dark:bg-gray-950
      "
    >
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange">
              <Package className="h-4 w-4" />
              Marketplace operations
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-950
                sm:text-3xl
                dark:text-white
              "
            >
              Order Management
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                leading-6
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage orders, products,
              payments, fulfillment,
              delivery, tracking and
              refunds from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              shadow-sm
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-gray-200
              dark:hover:bg-gray-750
            "
          >
            <RefreshCw
              className={`
                h-4 w-4
                ${
                  loading
                    ? 'animate-spin'
                    : ''
                }
              `}
            />

            Refresh
          </button>
        </div>


        {/* SUMMARY */}

        <div
          className="
            mb-6
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >
          <SummaryCard
            title="Total orders"
            value={totalOrders}
            icon={Package}
            description="Across all pages"
          />

          <SummaryCard
            title="Paid"
            value={pageStats.paid}
            icon={CreditCard}
            description="On current page"
          />

          <SummaryCard
            title="Pending"
            value={pageStats.pending}
            icon={Clock}
            description="On current page"
          />

          <SummaryCard
            title="Delivered"
            value={pageStats.delivered}
            icon={CheckCircle}
            description="On current page"
          />
        </div>


        {/* FILTERS */}

        <div
          className="
            mb-5
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-3
            shadow-sm
            sm:p-4
            dark:border-gray-800
            dark:bg-gray-800
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
            "
          >
            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="
                  Search order, customer,
                  product, seller or ID...
                "
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-brand-orange
                  focus:ring-2
                  focus:ring-brand-orange/10
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(
                  event.target.value
                );
              }}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-3
                text-sm
                font-medium
                text-gray-700
                outline-none
                focus:border-brand-orange
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-200
                sm:w-52
              "
            >
              <option value="all">
                All statuses
              </option>

              {STATUSES.map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {formatStatus(
                      value
                    )}
                  </option>
                )
              )}
            </select>
          </div>
        </div>


        {/* DESKTOP TABLE */}

        <div
          className="
            hidden
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            lg:block
            dark:border-gray-800
            dark:bg-gray-800
          "
        >
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-b-brand-orange
                "
              />
            </div>
          ) : visibleOrders.length ===
            0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <Package className="mb-3 h-10 w-10 text-gray-300" />

              <h3 className="font-semibold text-gray-900 dark:text-white">
                No orders found
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
                Try changing your
                search or status
                filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        onClick={() =>
                          openOrder(
                            order
                          )
                        }
                        className="
                          cursor-pointer
                          border-b
                          border-gray-100
                          transition
                          hover:bg-gray-50
                          dark:border-gray-700
                          dark:hover:bg-gray-750
                        "
                      >
                        <td className="px-5 py-4 align-top">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                              <Hash className="h-4 w-4 text-gray-500" />
                            </div>

                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {order.order_number ||
                                  order.id}
                              </div>

                              <div className="mt-1 text-xs text-gray-500">
                                {formatDate(
                                  order.created_at
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[320px] px-5 py-4 align-top">
                          <OrderProduct
                            order={
                              order
                            }
                            compact
                          />
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {order.customer_name ||
                              'Unknown'}
                          </div>

                          {order.customer_email && (
                            <div className="mt-1 max-w-[190px] truncate text-xs text-gray-500">
                              {
                                order.customer_email
                              }
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 align-top">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(
                              order.total_price ||
                                0
                            )}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            Qty:{' '}
                            {order.quantity ||
                              0}
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <PaymentBadge
                            status={
                              order.payment_status
                            }
                          />

                          <div className="mt-2 text-xs capitalize text-gray-500">
                            {order.payment_method ||
                              '—'}
                          </div>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <StatusBadge
                            status={
                              order.status
                            }
                          />

                          {order.tracking_number && (
                            <div className="mt-2 max-w-[150px] truncate text-xs text-gray-500">
                              {order.tracking_number}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right align-top">
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              openOrder(
                                order
                              );
                            }}
                            className="
                              inline-flex
                              items-center
                              gap-1
                              rounded-lg
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-brand-orange
                              hover:bg-orange-50
                              dark:hover:bg-orange-400/10
                            "
                          >
                            Details

                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* MOBILE / TABLET CARDS */}

        <div className="space-y-3 lg:hidden">
          {loading ? (
            <div
              className="
                flex
                min-h-[360px]
                items-center
                justify-center
                rounded-2xl
                border
                border-gray-200
                bg-white
                dark:border-gray-800
                dark:bg-gray-800
              "
            >
              <div
                className="
                  h-9
                  w-9
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-b-brand-orange
                "
              />
            </div>
          ) : visibleOrders.length ===
            0 ? (
            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-16
                text-center
                dark:border-gray-800
                dark:bg-gray-800
              "
            >
              <Package className="mx-auto mb-3 h-10 w-10 text-gray-300" />

              <p className="font-semibold text-gray-900 dark:text-white">
                No orders found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another search
                or status.
              </p>
            </div>
          ) : (
            visibleOrders.map(
              (order) => {
                const expanded =
                  expandedMobile ===
                  order.id;

                return (
                  <div
                    key={order.id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      dark:border-gray-800
                      dark:bg-gray-800
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMobile(
                          expanded
                            ? null
                            : order.id
                        )
                      }
                      className="
                        flex
                        w-full
                        items-start
                        gap-3
                        p-4
                        text-left
                      "
                    >
                      <div
                        className="
                          h-14
                          w-14
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                          dark:bg-gray-700
                        "
                      >
                        {getProductImage(
                          order
                        ) ? (
                          <img
                            src={getProductImage(
                              order
                            )}
                            alt={
                              order.product
                                ?.name ||
                              'Product'
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Box className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-bold text-gray-900 dark:text-white">
                              {order.order_number ||
                                order.id}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-500">
                              {order.product
                                ?.name ||
                                order.product
                                  ?.title ||
                                'Product unavailable'}
                            </p>
                          </div>

                          {expanded ? (
                            <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge
                            status={
                              order.status
                            }
                          />

                          <PaymentBadge
                            status={
                              order.payment_status
                            }
                          />
                        </div>
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-gray-100 px-4 pb-4 pt-4 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Customer
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                              {order.customer_name ||
                                'Unknown'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                              {formatCurrency(
                                order.total_price ||
                                  0
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <OrderProduct
                            order={
                              order
                            }
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openOrder(
                              order
                            )
                          }
                          className="
                            mt-4
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-gray-900
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-gray-800
                            dark:bg-white
                            dark:text-gray-900
                          "
                        >
                          View full order

                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
            )
          )}
        </div>


        {/* PAGINATION */}

        {!loading &&
          totalPages > 1 && (
            <div
              className="
                mt-5
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                dark:border-gray-800
                dark:bg-gray-800
              "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page{' '}
                <strong className="text-gray-900 dark:text-white">
                  {page}
                </strong>{' '}
                of{' '}
                <strong className="text-gray-900 dark:text-white">
                  {totalPages}
                </strong>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                    )
                  }
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-gray-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:border-gray-700
                    dark:text-gray-200
                  "
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                  className="
                    rounded-xl
                    bg-gray-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:bg-white
                    dark:text-gray-900
                  "
                >
                  Next
                </button>
              </div>
            </div>
          )}
      </div>


      {/* ORDER DETAIL DRAWER */}

      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            justify-end
          "
        >
          <button
            type="button"
            aria-label="Close order details"
            onClick={() =>
              setSelectedOrder(null)
            }
            className="
              absolute
              inset-0
              cursor-default
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          <aside
            className="
              relative
              flex
              h-full
              w-full
              max-w-2xl
              flex-col
              bg-white
              shadow-2xl
              dark:bg-gray-900
            "
          >
            {/* DRAWER HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-gray-200
                px-5
                py-4
                sm:px-6
                dark:border-gray-800
              "
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-gray-950 dark:text-white">
                    {selectedOrder.order_number ||
                      selectedOrder.id}
                  </h2>

                  <StatusBadge
                    status={
                      selectedOrder.status
                    }
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Created{' '}
                  {formatDateTime(
                    selectedOrder.created_at
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="
                  shrink-0
                  rounded-xl
                  p-2
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-gray-700
                  dark:hover:bg-gray-800
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>


            {/* DRAWER BODY */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-5
                py-5
                sm:px-6
              "
            >
              {detailLoading && (
                <div className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                  Refreshing order
                  details...
                </div>
              )}


              {/* PRODUCT */}

              <section>
                <SectionHeading
                  icon={Package}
                  title="Product"
                />

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex gap-4">
                    <ProductGallery
                      images={getProductImages(
                        selectedOrder
                      )}
                      productName={
                        selectedOrder.product
                          ?.name ||
                        selectedOrder.product
                          ?.title ||
                        'Product'
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {selectedOrder.product
                          ?.name ||
                          selectedOrder.product
                            ?.title ||
                          'Product unavailable'}
                      </h3>

                      {selectedOrder.product
                        ?.sku && (
                        <p className="mt-1 text-xs text-gray-500">
                          SKU:{' '}
                          {
                            selectedOrder
                              .product
                              .sku
                          }
                        </p>
                      )}

                      {selectedOrder.product
                        ?.brand && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Brand:{' '}
                          {
                            selectedOrder
                              .product
                              .brand
                          }
                        </p>
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <MiniValue
                          label="Quantity"
                          value={
                            selectedOrder.quantity
                          }
                        />

                        <MiniValue
                          label="Unit price"
                          value={formatCurrency(
                            selectedOrder.unit_price ||
                              0
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedOrder.product
                    ?.description && (
                    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Product description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {
                          selectedOrder
                            .product
                            .description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </section>


              {/* CUSTOMER + SELLER */}

              <section className="mt-6">
                <SectionHeading
                  icon={User}
                  title="People"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    icon={User}
                    title="Customer"
                  >
                    <InfoRow
                      icon={User}
                      label="Name"
                      value={
                        selectedOrder.customer_name
                      }
                    />

                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={
                        selectedOrder.customer_email
                      }
                      copy
                    />

                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={
                        selectedOrder.customer_phone
                      }
                      copy
                    />
                  </InfoCard>

                  <InfoCard
                    icon={Store}
                    title="Seller"
                  >
                    <InfoRow
                      icon={Store}
                      label="Name"
                      value={
                        selectedOrder.seller_name
                      }
                    />

                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={
                        selectedOrder.seller
                          ?.email
                      }
                      copy
                    />

                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={
                        selectedOrder.seller
                          ?.phone
                      }
                      copy
                    />
                  </InfoCard>
                </div>
              </section>


              {/* PRICING */}

              <section className="mt-6">
                <SectionHeading
                  icon={CircleDollarSign}
                  title="Order summary"
                />

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <PriceRow
                    label="Subtotal"
                    value={formatCurrency(
                      selectedOrder.subtotal ||
                        0
                    )}
                  />

                  <PriceRow
                    label="Delivery"
                    value={formatCurrency(
                      selectedOrder.delivery_fee ||
                        0
                    )}
                  />

                  <PriceRow
                    label="Tax"
                    value={formatCurrency(
                      selectedOrder.tax ||
                        0
                    )}
                  />

                  <PriceRow
                    label="Discount"
                    value={`-${formatCurrency(
                      selectedOrder.discount ||
                        0
                    )}`}
                  />

                  <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

                  <PriceRow
                    label="Total"
                    value={formatCurrency(
                      selectedOrder.total_price ||
                        0
                    )}
                    strong
                  />
                </div>
              </section>


              {/* PAYMENT */}

              <section className="mt-6">
                <SectionHeading
                  icon={CreditCard}
                  title="Payment"
                />

                <InfoCard>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow
                      icon={CreditCard}
                      label="Payment status"
                      value={
                        selectedOrder.payment_status
                      }
                    />

                    <InfoRow
                      icon={CreditCard}
                      label="Method"
                      value={
                        selectedOrder.payment_method
                      }
                    />

                    <InfoRow
                      icon={Hash}
                      label="Reference"
                      value={
                        selectedOrder.payment_reference
                      }
                      copy
                    />
                  </div>
                </InfoCard>
              </section>


              {/* SHIPPING */}

              <section className="mt-6">
                <SectionHeading
                  icon={MapPin}
                  title="Addresses"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <AddressCard
                    title="Shipping address"
                    address={
                      selectedOrder.shipping_address
                    }
                  />

                  <AddressCard
                    title="Billing address"
                    address={
                      selectedOrder.billing_address
                    }
                  />
                </div>
              </section>


              {/* TRACKING */}

              <section className="mt-6">
                <SectionHeading
                  icon={Truck}
                  title="Fulfillment & tracking"
                />

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow
                      icon={Truck}
                      label="Tracking number"
                      value={
                        selectedOrder.tracking_number
                      }
                      copy
                    />

                    <InfoRow
                      icon={Calendar}
                      label="Estimated delivery"
                      value={formatDateTime(
                        selectedOrder.estimated_delivery
                      )}
                    />

                    <InfoRow
                      icon={CheckCircle}
                      label="Delivered"
                      value={formatDateTime(
                        selectedOrder.delivered_at
                      )}
                    />

                    <InfoRow
                      icon={XCircle}
                      label="Cancelled"
                      value={formatDateTime(
                        selectedOrder.cancelled_at
                      )}
                    />
                  </div>

                  {selectedOrder.tracking_url && (
                    <a
                      href={
                        selectedOrder.tracking_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-gray-100
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-gray-800
                        hover:bg-gray-200
                        dark:bg-gray-800
                        dark:text-gray-100
                        dark:hover:bg-gray-700
                      "
                    >
                      Open tracking page

                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </section>


              {/* UPDATE */}

              <section className="mt-6">
                <SectionHeading
                  icon={RefreshCw}
                  title="Update order"
                />

                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                      Order status
                    </label>

                    <select
                      disabled={
                        savingId ===
                        selectedOrder.id
                      }
                      value={
                        selectedOrder.status
                      }
                      onChange={(
                        event
                      ) =>
                        updateStatus(
                          selectedOrder,
                          event.target.value
                        )
                      }
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-3
                        text-sm
                        font-medium
                        outline-none
                        focus:border-brand-orange
                        dark:border-gray-700
                        dark:bg-gray-800
                        dark:text-white
                      "
                    >
                      {STATUSES.map(
                        (value) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {formatStatus(
                              value
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Tracking number
                      </label>

                      <input
                        value={
                          tracking[
                            selectedOrder
                              .id
                          ]
                            ?.tracking_number ??
                          selectedOrder.tracking_number ??
                          ''
                        }
                        onChange={(
                          event
                        ) =>
                          setTracking(
                            (current) => ({
                              ...current,

                              [selectedOrder.id]:
                                {
                                  ...(current[
                                    selectedOrder
                                      .id
                                  ] || {}),

                                  tracking_number:
                                    event
                                      .target
                                      .value,
                                },
                            })
                          )
                        }
                        placeholder="Enter tracking number"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          px-3
                          text-sm
                          outline-none
                          focus:border-brand-orange
                          dark:border-gray-700
                          dark:bg-gray-800
                          dark:text-white
                        "
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                        Tracking URL
                      </label>

                      <input
                        value={
                          tracking[
                            selectedOrder
                              .id
                          ]
                            ?.tracking_url ??
                          selectedOrder.tracking_url ??
                          ''
                        }
                        onChange={(
                          event
                        ) =>
                          setTracking(
                            (current) => ({
                              ...current,

                              [selectedOrder.id]:
                                {
                                  ...(current[
                                    selectedOrder
                                      .id
                                  ] || {}),

                                  tracking_url:
                                    event
                                      .target
                                      .value,
                                },
                            })
                          )
                        }
                        placeholder="https://..."
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          px-3
                          text-sm
                          outline-none
                          focus:border-brand-orange
                          dark:border-gray-700
                          dark:bg-gray-800
                          dark:text-white
                        "
                      />
                    </div>

                    <button
                      type="button"
                      disabled={
                        savingId ===
                        selectedOrder.id
                      }
                      onClick={() =>
                        updateStatus(
                          selectedOrder,
                          selectedOrder.status
                        )
                      }
                      className="
                        mt-1
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-brand-orange
                        px-4
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {savingId ===
                      selectedOrder.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}

                      Save tracking
                    </button>
                  </div>
                </div>
              </section>


              {/* HISTORY */}

              <section className="mt-6">
                <SectionHeading
                  icon={Clock}
                  title="Order timeline"
                />

                <Timeline
                  history={
                    selectedOrder.history ||
                    []
                  }
                />
              </section>


              {/* CANCELLATION */}

              {selectedOrder.cancellation_reason && (
                <section className="mt-6">
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-400/20 dark:bg-red-400/10">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-300">
                          Cancellation reason
                        </p>

                        <p className="mt-1 text-sm text-red-700 dark:text-red-300/80">
                          {
                            selectedOrder.cancellation_reason
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>


            {/* DRAWER FOOTER */}

            <div
              className="
                border-t
                border-gray-200
                bg-white
                px-5
                py-4
                dark:border-gray-800
                dark:bg-gray-900
                sm:px-6
              "
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                {[
                  'pending',
                  'processing',
                ].includes(
                  selectedOrder.status
                ) && (
                  <button
                    type="button"
                    disabled={
                      savingId ===
                      selectedOrder.id
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder,
                        'cancelled'
                      )
                    }
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-red-200
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-red-600
                      hover:bg-red-50
                      disabled:opacity-50
                      dark:border-red-400/20
                      dark:hover:bg-red-400/10
                    "
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                )}

                {selectedOrder.payment_status ===
                  'paid' &&
                  ![
                    'refunded',
                    'cancelled',
                  ].includes(
                    selectedOrder.status
                  ) && (
                    <button
                      type="button"
                      disabled={
                        savingId ===
                        selectedOrder.id
                      }
                      onClick={() =>
                        refund(
                          selectedOrder
                        )
                      }
                      className="
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-50
                        disabled:opacity-50
                        dark:border-gray-700
                        dark:text-gray-200
                        dark:hover:bg-gray-800
                      "
                    >
                      <RotateCcw className="h-4 w-4" />
                      Refund
                    </button>
                  )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};


/* ---------------------------------- */
/* Supporting components */
/* ---------------------------------- */


const SectionHeading = ({
  icon: Icon,
  title,
}) => (
  <div className="mb-3 flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand-orange dark:bg-orange-400/10">
      <Icon className="h-4 w-4" />
    </div>

    <h3 className="font-bold text-gray-900 dark:text-white">
      {title}
    </h3>
  </div>
);


const InfoCard = ({
  icon: Icon,
  title,
  children,
}) => (
  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
    {title && (
      <div className="mb-4 flex items-center gap-2">
        {Icon && (
          <Icon className="h-4 w-4 text-gray-400" />
        )}

        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </h4>
      </div>
    )}

    <div className="space-y-4">
      {children}
    </div>
  </div>
);


const MiniValue = ({
  label,
  value,
}) => (
  <div>
    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
      {value ?? '—'}
    </p>
  </div>
);


const PriceRow = ({
  label,
  value,
  strong = false,
}) => (
  <div
    className={`
      flex
      items-center
      justify-between
      gap-4
      py-1.5
      ${
        strong
          ? 'text-base font-bold text-gray-950 dark:text-white'
          : 'text-sm text-gray-600 dark:text-gray-300'
      }
    `}
  >
    <span>{label}</span>

    <span>{value}</span>
  </div>
);


const AddressCard = ({
  title,
  address,
}) => (
  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-gray-400" />

      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
        {title}
      </h4>
    </div>

    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300">
      {formatAddress(
        address
      )}
    </p>
  </div>
);


const ProductGallery = ({
  images,
  productName,
}) => {
  const [
    active,
    setActive,
  ] = useState(0);

  const validImages =
    Array.isArray(images)
      ? images.filter(Boolean)
      : [];

  if (!validImages.length) {
    return (
      <div
        className="
          flex
          h-24
          w-24
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-gray-100
          text-gray-400
          dark:bg-gray-800
        "
      >
        <Box className="h-8 w-8" />
      </div>
    );
  }

  const current =
    validImages[
      Math.min(
        active,
        validImages.length - 1
      )
    ];

  return (
    <div className="w-24 shrink-0">
      <div className="h-24 w-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <img
          src={current}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>

      {validImages.length > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto">
          {validImages
            .slice(0, 5)
            .map(
              (image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() =>
                    setActive(
                      index
                    )
                  }
                  className={`
                    h-8
                    w-8
                    shrink-0
                    overflow-hidden
                    rounded-md
                    border
                    ${
                      active ===
                      index
                        ? 'border-brand-orange'
                        : 'border-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              )
            )}
        </div>
      )}
    </div>
  );
};


export default AdminOrders;