// import { useState, useEffect } from 'react';
// import { Search, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { formatCurrency, formatDate } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     loadOrders();
//   }, [filter]);

//   const loadOrders = async () => {
//     try {
//       const data = await adminService.getAllOrders({ status: filter });
//       setOrders(data);
//     } catch (error) {
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (orderId, status) => {
//     try {
//       await adminService.updateOrderStatus(orderId, status);
//       toast.success(`Order status updated to ${status}`);
//       loadOrders();
//     } catch (error) {
//       toast.error('Failed to update order status');
//     }
//   };

//   const handleProcessRefund = async (orderId) => {
//     if (!confirm('Are you sure you want to process refund for this order?')) return;
//     try {
//       await adminService.processRefund(orderId);
//       toast.success('Refund processed successfully');
//       loadOrders();
//     } catch (error) {
//       toast.error('Failed to process refund');
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'delivered':
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case 'shipped':
//         return <Truck className="h-4 w-4 text-blue-500" />;
//       case 'processing':
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//       case 'cancelled':
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <Clock className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'delivered':
//         return 'bg-green-100 text-green-700';
//       case 'shipped':
//         return 'bg-blue-100 text-blue-700';
//       case 'processing':
//         return 'bg-yellow-100 text-yellow-700';
//       case 'cancelled':
//         return 'bg-red-100 text-red-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track all customer orders</p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by order ID or customer name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input-field pl-10"
//               />
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-3 py-2 rounded-lg capitalize text-sm transition ${
//                     filter === status
//                       ? 'bg-brand-orange text-white'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Items</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                     <td className="py-4 px-6">
//                       <span className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div>
//                         <p className="text-sm text-gray-900 dark:text-white">{order.customer_name}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_email}</p>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm font-semibold text-brand-orange">{formatCurrency(order.total_amount)}</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm text-gray-600 dark:text-gray-400">{order.total_items} items</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.created_at)}</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="relative">
//                         <select
//                           value={order.status}
//                           onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                           className={`text-sm border rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer ${getStatusColor(order.status)}`}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="processing">Processing</option>
//                           <option value="shipped">Shipped</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                         <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
//                           {getStatusIcon(order.status)}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-2">
//                         <button className="p-1 text-blue-500 hover:text-blue-600" title="View Details">
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         {order.status !== 'cancelled' && order.status !== 'delivered' && (
//                           <button
//                             onClick={() => handleProcessRefund(order.id)}
//                             className="p-1 text-red-500 hover:text-red-600 text-xs"
//                             title="Process Refund"
//                           >
//                             Refund
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {orders.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-500 dark:text-gray-400">No orders found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, DollarSign, TrendingUp,
  Clock, CheckCircle, AlertCircle, Eye, MessageCircle,
  Star, FileText, Crown, Shield, BarChart3, Settings,
  LogOut, ChevronRight, PlusCircle, Search, Filter,
  XCircle, Check
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { productsService } from '../../services/products';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingProducts: 0,
    pendingOrders: 0,
    totalAdmins: 0,
    suspendedUsers: 0,
  });
  const [pendingProducts, setPendingProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadPendingProducts();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, activities, orders] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivities(),
        adminService.getRecentOrders(),
      ]);
      setStats(statsData);
      setRecentActivities(activities);
      setRecentOrders(orders);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingProducts = async () => {
    try {
      const data = await adminService.getPendingProducts();
      setPendingProducts(data.products || []);
      setStats(prev => ({ ...prev, pendingProducts: data.total || 0 }));
    } catch (error) {
      console.error('Failed to load pending products:', error);
    }
  };

  const handleApproveProduct = async (productId) => {
    setApproving(productId);
    try {
      await productsService.approveProduct(productId);
      toast.success('Product approved successfully!');
      loadPendingProducts();
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to approve product');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = prompt('Please enter a reason for rejection:');
    if (!reason) return;
    
    setApproving(productId);
    try {
      await productsService.rejectProduct(productId, reason);
      toast.success('Product rejected');
      loadPendingProducts();
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to reject product');
    } finally {
      setApproving(null);
    }
  };

  const menuItems = [
    { icon: Users, label: 'Users', count: stats.totalUsers, path: '/admin/users', color: 'bg-blue-500' },
    { icon: Package, label: 'Products', count: stats.totalProducts, path: '/admin/products', color: 'bg-green-500' },
    { icon: ShoppingBag, label: 'Orders', count: stats.totalOrders, path: '/admin/orders', color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Revenue', count: stats.totalRevenue, path: '/admin/analytics', color: 'bg-yellow-500', isCurrency: true },
    { icon: Clock, label: 'Pending Products', count: stats.pendingProducts, path: '/admin/products?status=pending', color: 'bg-orange-500' },
    { icon: AlertCircle, label: 'Pending Orders', count: stats.pendingOrders, path: '/admin/orders?status=pending', color: 'bg-red-500' },
  ];

  const quickActions = [
    { icon: PlusCircle, label: 'Add Admin', path: '/admin/users?action=add', color: 'bg-brand-orange' },
    { icon: Eye, label: 'Review Products', path: '/admin/products?status=pending', color: 'bg-blue-500' },
    { icon: Star, label: 'Manage Premium', path: '/admin/premium', color: 'bg-yellow-500' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs', color: 'bg-gray-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-sm font-medium transition ${
                  activeTab === 'overview' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('pending_products')}
                className={`text-sm font-medium transition ${
                  activeTab === 'pending_products' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Pending Products ({stats.pendingProducts})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`text-sm font-medium transition ${
                  activeTab === 'analytics' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`text-sm font-medium transition ${
                  activeTab === 'moderation' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Moderation
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-orange to-orange-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.first_name || 'Admin'}!</h1>
              <p className="text-white/90 mt-1">Here's what's happening on your platform today.</p>
            </div>
            <Link to="/admin/users" className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition">
              + Quick Action
            </Link>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition group"
                >
                  <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.isCurrency ? formatCurrency(item.count) : item.count}
                  </p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
                  <button className="text-brand-orange text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'user' && <Users className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'product' && <Package className="h-5 w-5 text-green-500" />}
                        {activity.type === 'order' && <ShoppingBag className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                  <Link to="/admin/orders" className="text-brand-orange text-sm hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">#{order.id}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-orange">{formatCurrency(order.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition group"
                >
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pending Products Tab */}
        {activeTab === 'pending_products' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Approval</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Pending Products</h3>
                <p className="text-gray-500 dark:text-gray-400">All products have been reviewed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              By {product.seller?.name || 'Unknown Seller'} • {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-brand-orange">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-gray-500">Listed: {new Date(product.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{product.views || 0} views</span>
                          </div>
                          <div className="flex space-x-3">
                            <Link
                              to={`/product/${product.id}`}
                              target="_blank"
                              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleRejectProduct(product.id)}
                              disabled={approving === product.id}
                              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                            >
                              {approving === product.id ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={approving === product.id}
                              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                            >
                              {approving === product.id ? 'Processing...' : 'Approve'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Chart View</span>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <TrendingUp className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Trend View</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Content Moderation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Flagged Reviews</h3>
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No flagged reviews pending</p>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reported Users</h3>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No user reports pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h2>
            <span className="inline-flex items-center space-x-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>All Systems Operational</span>
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">API Response</p>
              <p className="text-green-600 font-semibold">45ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
              <p className="text-green-600 font-semibold">99.9%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-gray-900 dark:text-white font-semibold">{stats.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Server Load</p>
              <p className="text-green-600 font-semibold">23%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;