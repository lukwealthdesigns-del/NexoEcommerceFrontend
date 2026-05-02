

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Users, DollarSign, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ordersService } from '../../services/orders';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserSales = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const data = await ordersService.getMySales();
      setSales(data.orders || []);
      setStats({
        totalSales: data.total_sales || 0,
        totalRevenue: data.total_revenue || 0,
        totalCustomers: data.total_customers || 0,
        averageOrderValue: data.average_order_value || 0,
      });
    } catch (error) {
      console.error('Failed to load sales data:', error);
      toast.error(error.response?.data?.detail || 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      
      setSales(sales.map(sale => 
        sale.id === orderId ? { ...sale, status: newStatus } : sale
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.detail || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const statCards = [
    { title: 'Total Sales', value: stats.totalSales, icon: TrendingUp, color: 'bg-blue-500' },
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-purple-500' },
    { title: 'Avg Order Value', value: formatCurrency(stats.averageOrderValue), icon: Package, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Sales</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your sales and manage orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Table */}
        {sales.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No sales yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">When customers buy your products, they'll appear here</p>
            <Link to="/listings/new" className="btn-primary inline-block">
              List a Product
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Quantity</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">#{sale.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{sale.buyer_name || 'Customer'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{sale.buyer_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={sale.product_image || '/placeholder.jpg'}
                            alt={sale.product_title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {sale.product_title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{sale.quantity}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-brand-orange">
                          {formatCurrency(sale.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(sale.created_at)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <select
                            value={sale.status}
                            onChange={(e) => handleUpdateStatus(sale.id, e.target.value)}
                            disabled={updatingStatus === sale.id}
                            className={`text-sm border rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange ${getStatusColor(sale.status)} ${updatingStatus === sale.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            {getStatusIcon(sale.status)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/orders/${sale.id}`}
                          className="flex items-center space-x-1 text-brand-orange hover:text-brand-orange/80 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSales;