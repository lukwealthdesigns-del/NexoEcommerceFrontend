import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Truck, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-200 text-gray-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savingId, setSavingId] = useState(null);
  const [tracking, setTracking] = useState({});
  const limit = 20;

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders({
        page,
        limit,
        status: status === 'all' ? undefined : status,
      });
      setOrders(data.orders || []);
      setTotalPages(data.total_pages || Math.max(1, Math.ceil((data.total || 0) / limit)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [page, status]);

  const updateStatus = async (order, nextStatus) => {
    setSavingId(order.id);
    try {
      await adminService.updateOrderStatus(order.id, nextStatus, tracking[order.id] || {});
      toast.success(`Order ${order.order_number || order.id} updated`);
      await loadOrders();
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to update order');
    } finally {
      setSavingId(null);
    }
  };

  const refund = async (order) => {
    if (!window.confirm(`Process a real Paystack refund for ${order.order_number || order.id}?`)) return;
    setSavingId(order.id);
    try {
      await adminService.processRefund(order.id);
      toast.success('Refund processed successfully');
      await loadOrders();
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Refund failed');
    } finally {
      setSavingId(null);
    }
  };

  const visibleOrders = orders.filter((order) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [order.order_number, order.customer_name, order.id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
            <p className="text-gray-500 mt-1">Process payments, fulfillment, delivery and refunds from one place.</p>
          </div>
          <button onClick={loadOrders} className="px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order number, customer or ID" className="w-full pl-9 pr-4 py-2 rounded-xl border bg-transparent" />
          </div>
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="px-4 py-2 rounded-xl border bg-white dark:bg-gray-700">
            <option value="all">All statuses</option>
            {STATUSES.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" /></div>
          ) : visibleOrders.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left p-4">Order</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Tracking</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-100 dark:border-gray-700 align-top">
                      <td className="p-4 font-semibold">{order.order_number || order.id}</td>
                      <td className="p-4">{order.customer_name || 'Unknown'}</td>
                      <td className="p-4 font-semibold">{formatCurrency(order.total_price || 0)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.payment_status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4 min-w-[180px]">
                        <select
                          disabled={savingId === order.id}
                          value={order.status}
                          onChange={(e) => updateStatus(order, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${statusStyles[order.status] || ''}`}
                        >
                          {STATUSES.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="p-4 min-w-[230px]">
                        <input placeholder="Tracking number" value={tracking[order.id]?.tracking_number ?? order.tracking_number ?? ''} onChange={(e) => setTracking((v) => ({ ...v, [order.id]: { ...(v[order.id] || {}), tracking_number: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg mb-2 bg-transparent" />
                        <input placeholder="Tracking URL" value={tracking[order.id]?.tracking_url ?? order.tracking_url ?? ''} onChange={(e) => setTracking((v) => ({ ...v, [order.id]: { ...(v[order.id] || {}), tracking_url: e.target.value } }))} className="w-full px-3 py-2 border rounded-lg bg-transparent" />
                      </td>
                      <td className="p-4 whitespace-nowrap">{formatDate(order.created_at)}</td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => updateStatus(order, 'processing')} className="p-2 rounded-lg bg-blue-50 text-blue-600" title="Processing"><Clock className="h-4 w-4" /></button>
                          <button onClick={() => updateStatus(order, 'shipped')} className="p-2 rounded-lg bg-indigo-50 text-indigo-600" title="Shipped"><Truck className="h-4 w-4" /></button>
                          <button onClick={() => updateStatus(order, 'delivered')} className="p-2 rounded-lg bg-green-50 text-green-600" title="Delivered"><CheckCircle className="h-4 w-4" /></button>
                          {['pending', 'processing'].includes(order.status) && <button onClick={() => updateStatus(order, 'cancelled')} className="p-2 rounded-lg bg-red-50 text-red-600" title="Cancel"><XCircle className="h-4 w-4" /></button>}
                          {order.payment_status === 'paid' && !['refunded', 'cancelled'].includes(order.status) && <button onClick={() => refund(order)} className="p-2 rounded-lg bg-gray-100 text-gray-700" title="Refund"><RotateCcw className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded-lg disabled:opacity-40">Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 border rounded-lg disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
