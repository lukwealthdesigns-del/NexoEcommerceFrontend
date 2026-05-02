// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const dashboardData = await adminService.getDashboardStats();
      setStats({
        totalRevenue: dashboardData.totalRevenue || 0,
        totalOrders: dashboardData.totalOrders || 0,
        totalUsers: dashboardData.totalUsers || 0,
        totalProducts: dashboardData.totalProducts || 0,
        monthlyRevenue: [
          { month: 'Jan', revenue: 125000 },
          { month: 'Feb', revenue: 150000 },
          { month: 'Mar', revenue: 180000 },
          { month: 'Apr', revenue: 220000 },
          { month: 'May', revenue: 200000 },
          { month: 'Jun', revenue: 250000 },
        ],
        topProducts: [
          { name: 'iPhone 14 Pro', sales: 45, revenue: 54000000 },
          { name: 'Samsung Galaxy', sales: 38, revenue: 36100000 },
          { name: 'Nike Air Max', sales: 52, revenue: 4420000 },
        ],
        recentOrders: []
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <button 
          onClick={loadAnalytics}
          className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h2>
        <div className="h-64 flex items-end space-x-4">
          {stats.monthlyRevenue.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-brand-orange rounded-t-lg transition-all hover:bg-orange-600"
                style={{ height: `${(item.revenue / 300000) * 100}%`, minHeight: '20px' }}
              ></div>
              <p className="text-xs text-gray-500 mt-2">{item.month}</p>
              <p className="text-xs font-semibold">{formatCurrency(item.revenue)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Units Sold</th>
                <th className="text-left py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.sales}</td>
                  <td className="py-3 px-4">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;