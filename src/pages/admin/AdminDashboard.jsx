

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Package, ShoppingBag, DollarSign, TrendingUp,
  Clock, CheckCircle, AlertCircle, Eye, MessageCircle,
  Star, FileText, Crown, Shield, BarChart3, Settings,
  LogOut, ChevronRight, PlusCircle, Search, Filter,
  Home, ArrowLeft
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';

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
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
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
      {/* Top Navigation Bar with Home Button */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Home Button */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">User Dashboard</span>
              </Link>
            </div>

            {/* Right side - Admin Badge */}
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {user?.role === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 h-14">
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
            <div className="flex space-x-3">
              <Link 
                to="/" 
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <Link 
                to="/admin/users" 
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition"
              >
                + Quick Action
              </Link>
            </div>
          </div>
        </div>

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

        {/* Main Content Grid */}
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