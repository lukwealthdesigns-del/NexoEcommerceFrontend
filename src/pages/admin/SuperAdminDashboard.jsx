

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Users, Shield, Activity, DollarSign, Plus, Edit, Trash2,
//   Crown, UserCheck, UserX, Eye, Settings, BarChart3,
//   TrendingUp, ShoppingBag, Package, MessageCircle, Star,
//   FileText, AlertCircle, CheckCircle, Clock, ChevronRight,
//   Search, Filter, Download, RefreshCw, Home, ArrowLeft
// } from 'lucide-react';
// import adminService from '../../services/admin';
// import { useAuthStore } from '../../store/authStore';
// import { formatCurrency, formatDate } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const SuperAdminDashboard = () => {
//   const { user } = useAuthStore();
//   const [admins, setAdmins] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     suspendedUsers: 0,
//     premiumUsers: 0,
//     totalAdmins: 0,
//     totalRevenue: 0,
//     totalOrders: 0,
//   });
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ email: '', full_name: '', role: 'admin' });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [adminsData, usersData, dashboardData] = await Promise.all([
//         adminService.getAllAdmins(),
//         adminService.getAllUsers({ limit: 10 }),
//         adminService.getDashboardStats(),
//       ]);
//       setAdmins(adminsData);
//       setUsers(usersData.users || []);
//       setStats({
//         totalUsers: dashboardData.totalUsers || 0,
//         activeUsers: dashboardData.activeUsers || 0,
//         suspendedUsers: dashboardData.suspendedUsers || 0,
//         premiumUsers: dashboardData.premiumUsers || 0,
//         totalAdmins: adminsData.length,
//         totalRevenue: dashboardData.totalRevenue || 0,
//         totalOrders: dashboardData.totalOrders || 0,
//       });
//     } catch (error) {
//       console.error('Failed to load data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAdmin = async () => {
//     if (!newAdmin.email || !newAdmin.full_name) {
//       toast.error('Please fill in all fields');
//       return;
//     }
//     try {
//       await adminService.createAdmin(newAdmin);
//       toast.success('Admin created successfully');
//       setShowCreateModal(false);
//       setNewAdmin({ email: '', full_name: '', role: 'admin' });
//       loadData();
//     } catch (error) {
//       toast.error('Failed to create admin');
//     }
//   };

//   const statCards = [
//     { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500', path: '/admin/users' },
//     { icon: UserCheck, label: 'Active', value: stats.activeUsers, color: 'bg-green-500', path: '/admin/users?status=active' },
//     { icon: UserX, label: 'Suspended', value: stats.suspendedUsers, color: 'bg-red-500', path: '/admin/users?status=suspended' },
//     { icon: Crown, label: 'Premium', value: stats.premiumUsers, color: 'bg-yellow-500', path: '/admin/premium' },
//     { icon: Shield, label: 'Admins', value: stats.totalAdmins, color: 'bg-purple-500', path: '/admin/users?role=admin' },
//     { icon: DollarSign, label: 'Revenue', value: formatCurrency(stats.totalRevenue), color: 'bg-orange-500', path: '/admin/analytics' },
//   ];

//   const quickActions = [
//     { icon: Plus, label: 'Add Admin', action: () => setShowCreateModal(true), color: 'bg-brand-orange' },
//     { icon: Crown, label: 'Manage Premium', path: '/admin/premium', color: 'bg-yellow-500' },
//     { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs', color: 'bg-gray-500' },
//     { icon: Settings, label: 'Settings', path: '/admin/settings', color: 'bg-purple-500' },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
//       {/* Top Navigation Bar with Home Button */}
//       <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Left side - Logo and Home Button */}
//             <div className="flex items-center space-x-4">
//               <Link 
//                 to="/" 
//                 className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition"
//               >
//                 <Home className="h-5 w-5" />
//                 <span className="hidden sm:inline text-sm font-medium">Back to Home</span>
//               </Link>
//               <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
//               <Link 
//                 to="/dashboard" 
//                 className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//                 <span className="hidden sm:inline text-sm font-medium">User Dashboard</span>
//               </Link>
//             </div>

//             {/* Right side - Super Admin Badge */}
//             <div className="flex items-center space-x-2">
//               <Shield className="h-5 w-5 text-purple-500" />
//               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Super Admin Panel
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center space-x-6 h-14">
//             <button
//               onClick={() => setActiveTab('overview')}
//               className={`text-sm font-medium transition ${
//                 activeTab === 'overview' 
//                   ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//               }`}
//             >
//               Overview
//             </button>
//             <button
//               onClick={() => setActiveTab('admins')}
//               className={`text-sm font-medium transition ${
//                 activeTab === 'admins' 
//                   ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//               }`}
//             >
//               Admins
//             </button>
//             <button
//               onClick={() => setActiveTab('analytics')}
//               className={`text-sm font-medium transition ${
//                 activeTab === 'analytics' 
//                   ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//               }`}
//             >
//               Analytics
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Welcome Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
//               <p className="text-white/90 mt-1">Welcome back, {user?.first_name || 'Super Admin'}! You have full control over the platform.</p>
//             </div>
//             <div className="flex space-x-3">
//               <Link 
//                 to="/" 
//                 className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition flex items-center space-x-2"
//               >
//                 <Home className="h-4 w-4" />
//                 <span>Back to Site</span>
//               </Link>
//               <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
//                 <Shield className="h-5 w-5" />
//                 <span className="text-sm font-semibold">Full Access</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//           {statCards.map((stat, index) => (
//             <Link
//               key={index}
//               to={stat.path}
//               className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition group"
//             >
//               <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
//                 <stat.icon className="h-5 w-5 text-white" />
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
//               <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
//             </Link>
//           ))}
//         </div>

//         {/* Admins Section */}
//         {activeTab === 'admins' && (
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Administrators</h2>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-brand-orange text-white text-sm py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-orange-600"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Add Admin</span>
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200 dark:border-gray-700">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Created</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {admins.map((adminUser) => (
//                     <tr key={adminUser.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                       <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{adminUser.full_name}</td>
//                       <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{adminUser.email}</td>
//                       <td className="py-3 px-4">
//                         <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
//                           adminUser.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
//                         }`}>
//                           {adminUser.role}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-500">{formatDate(adminUser.created_at)}</td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center space-x-2">
//                           <button className="p-1 text-blue-500 hover:text-blue-600">
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           {adminUser.role !== 'super_admin' && (
//                             <button className="p-1 text-red-500 hover:text-red-600">
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Quick Actions */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//           {quickActions.map((action, index) => (
//             action.path ? (
//               <Link
//                 key={index}
//                 to={action.path}
//                 className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition group"
//               >
//                 <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
//                   <action.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
//               </Link>
//             ) : (
//               <button
//                 key={index}
//                 onClick={action.action}
//                 className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition group"
//               >
//                 <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
//                   <action.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
//               </button>
//             )
//           ))}
//         </div>

//         {/* Recent Users */}
//         {activeTab === 'overview' && (
//           <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
//               <Link to="/admin/users" className="text-brand-orange text-sm hover:underline flex items-center">
//                 View All <ChevronRight className="h-4 w-4 ml-1" />
//               </Link>
//             </div>
//             <div className="space-y-3">
//               {users.slice(0, 5).map((userItem) => (
//                 <div key={userItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white font-semibold">
//                       {userItem.first_name?.[0] || userItem.username?.[0] || 'U'}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">{userItem.first_name} {userItem.last_name}</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">@{userItem.username}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{userItem.email}</p>
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${
//                       userItem.is_suspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//                     }`}>
//                       {userItem.is_suspended ? 'Suspended' : 'Active'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Create Admin Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Admin</h2>
//               <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
//                 <input
//                   type="text"
//                   value={newAdmin.full_name}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
//                   placeholder="John Doe"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
//                 <input
//                   type="email"
//                   value={newAdmin.email}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
//                   placeholder="admin@example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
//                 <select
//                   value={newAdmin.role}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
//               <button onClick={handleCreateAdmin} className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600">Create</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminDashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Shield, Activity, DollarSign, Plus, Edit, Trash2,
  Crown, UserCheck, UserX, Eye, Settings, BarChart3,
  TrendingUp, ShoppingBag, Package, MessageCircle, Star,
  FileText, AlertCircle, CheckCircle, Clock, ChevronRight,
  Search, Filter, Download, RefreshCw, Home, ArrowLeft,
  Rocket, Zap, Calendar, Award, Target, X
} from 'lucide-react';
import adminService from '../../services/admin';
import { premiumService } from '../../services/premium';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { user } = useAuthStore();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [boostedProducts, setBoostedProducts] = useState([]);
  const [premiumStats, setPremiumStats] = useState({
    totalPremiumUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    expiringSoon: 0,
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    premiumUsers: 0,
    totalAdmins: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedUserForPremium, setSelectedUserForPremium] = useState(null);
  const [premiumPlan, setPremiumPlan] = useState('basic');
  const [newAdmin, setNewAdmin] = useState({ email: '', full_name: '', role: 'admin' });

  useEffect(() => {
    loadData();
    loadPremiumData();
    loadBoostedProducts();
  }, []);

  const loadData = async () => {
    try {
      const [adminsData, usersData, dashboardData] = await Promise.all([
        adminService.getAllAdmins(),
        adminService.getAllUsers({ limit: 10 }),
        adminService.getDashboardStats(),
      ]);
      setAdmins(adminsData);
      setUsers(usersData.users || []);
      setStats({
        totalUsers: dashboardData.totalUsers || 0,
        activeUsers: dashboardData.activeUsers || 0,
        suspendedUsers: dashboardData.suspendedUsers || 0,
        premiumUsers: dashboardData.premiumUsers || 0,
        totalAdmins: adminsData.length,
        totalRevenue: dashboardData.totalRevenue || 0,
        totalOrders: dashboardData.totalOrders || 0,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const loadPremiumData = async () => {
    try {
      const statsData = await adminService.getPremiumStats();
      setPremiumStats(statsData);
    } catch (error) {
      console.error('Failed to load premium stats:', error);
    }
  };

  const loadBoostedProducts = async () => {
    try {
      const data = await premiumService.getBoostedProducts({ limit: 6 });
      setBoostedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load boosted products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.full_name) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await adminService.createAdmin(newAdmin);
      toast.success('Admin created successfully');
      setShowCreateModal(false);
      setNewAdmin({ email: '', full_name: '', role: 'admin' });
      loadData();
    } catch (error) {
      toast.error('Failed to create admin');
    }
  };

  const handleActivatePremium = async () => {
    if (!selectedUserForPremium) return;
    
    try {
      await adminService.activatePremium(selectedUserForPremium.id, premiumPlan);
      toast.success(`✨ Premium activated for ${selectedUserForPremium.email}`);
      setShowPremiumModal(false);
      setSelectedUserForPremium(null);
      setPremiumPlan('basic');
      loadData();
      loadPremiumData();
    } catch (error) {
      toast.error('Failed to activate premium');
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500', path: '/admin/users' },
    { icon: UserCheck, label: 'Active', value: stats.activeUsers, color: 'bg-green-500', path: '/admin/users?status=active' },
    { icon: UserX, label: 'Suspended', value: stats.suspendedUsers, color: 'bg-red-500', path: '/admin/users?status=suspended' },
    { icon: Crown, label: 'Premium', value: stats.premiumUsers, color: 'bg-yellow-500', path: '/admin/premium' },
    { icon: Shield, label: 'Admins', value: stats.totalAdmins, color: 'bg-purple-500', path: '/admin/users?role=admin' },
    { icon: DollarSign, label: 'Revenue', value: formatCurrency(stats.totalRevenue), color: 'bg-orange-500', path: '/admin/analytics' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Admin', action: () => setShowCreateModal(true), color: 'bg-brand-orange' },
    { icon: Crown, label: 'Manage Premium', path: '/admin/premium', color: 'bg-yellow-500' },
    { icon: Rocket, label: 'Boosted Products', path: '/admin/products?boosted=true', color: 'bg-green-500' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', color: 'bg-purple-500' },
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
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Super Admin Panel
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
              onClick={() => setActiveTab('admins')}
              className={`text-sm font-medium transition ${
                activeTab === 'admins' 
                  ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`text-sm font-medium transition ${
                activeTab === 'premium' 
                  ? 'text-brand-orange border-b-2 border-brand-orange pb-3' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Premium
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-white/90 mt-1">Welcome back, {user?.first_name || 'Super Admin'}! You have full control over the platform.</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                to="/" 
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold">Full Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.path}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition group"
            >
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
            <Crown className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{premiumStats.totalPremiumUsers}</p>
            <p className="text-sm opacity-80">Premium Users</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
            <DollarSign className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{formatCurrency(premiumStats.totalRevenue)}</p>
            <p className="text-sm opacity-80">Premium Revenue</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
            <Activity className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{premiumStats.activeSubscriptions}</p>
            <p className="text-sm opacity-80">Active Subscriptions</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white">
            <Clock className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{premiumStats.expiringSoon}</p>
            <p className="text-sm opacity-80">Expiring Soon</p>
          </div>
        </div>

        {/* Boosted Products Section */}
        {boostedProducts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Rocket className="h-5 w-5 text-yellow-500" />
                Boosted Products (Active Ads)
              </h2>
              <Link to="/admin/products" className="text-brand-orange text-sm hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boostedProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex gap-3 hover:shadow-md transition">
                  <img 
                    src={product.images?.[0] ? `http://localhost:8080${product.images[0]}` : 'https://via.placeholder.com/60x60'}
                    className="w-16 h-16 object-cover rounded-lg"
                    alt={product.title}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/60x60'}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{product.title}</h4>
                    <p className="text-brand-orange font-bold text-sm">₦{product.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {product.views || 0}</span>
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-500" /> Boosted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Users Section with MAKE PREMIUM BUTTON */}
        {activeTab === 'overview' && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
              <Link to="/admin/users" className="text-brand-orange text-sm hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {users.slice(0, 5).map((userItem) => (
                <div key={userItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white font-semibold">
                      {userItem.first_name?.[0] || userItem.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{userItem.first_name} {userItem.last_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">@{userItem.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{userItem.email}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        userItem.is_suspended ? 'bg-red-100 text-red-700' : 
                        userItem.is_premium ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {userItem.is_suspended ? 'Suspended' : userItem.is_premium ? 'Premium' : 'Active'}
                      </span>
                    </div>
                    {/* MAKE PREMIUM BUTTON - CROWN ICON */}
                    <button
                      onClick={() => {
                        setSelectedUserForPremium(userItem);
                        setShowPremiumModal(true);
                      }}
                      className="p-2 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30 transition group"
                      title="Make Premium"
                    >
                      <Crown className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admins Section */}
        {activeTab === 'admins' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Administrators</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-orange text-white text-sm py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                <span>Add Admin</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((adminUser) => (
                    <tr key={adminUser.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{adminUser.full_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{adminUser.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          adminUser.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {adminUser.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(adminUser.created_at)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-500 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          {adminUser.role !== 'super_admin' && (
                            <button className="p-1 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Premium Management Tab */}
        {activeTab === 'premium' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Management</h2>
              <Link to="/admin/premium" className="bg-brand-orange text-white text-sm py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-orange-600">
                <Crown className="h-4 w-4" />
                <span>Manage Premium Plans</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Basic Plan</h3>
                <p className="text-2xl font-bold text-brand-orange">₦5,000</p>
                <p className="text-sm text-gray-500">30 days</p>
                <ul className="mt-3 text-sm text-left space-y-1">
                  <li>✓ 2x view boost</li>
                  <li>✓ Priority support</li>
                  <li>✓ Featured in category</li>
                </ul>
              </div>
              <div className="border-2 border-brand-orange rounded-xl p-4 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">Popular</div>
                <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Standard Plan</h3>
                <p className="text-2xl font-bold text-brand-orange">₦15,000</p>
                <p className="text-sm text-gray-500">90 days</p>
                <ul className="mt-3 text-sm text-left space-y-1">
                  <li>✓ 5x view boost</li>
                  <li>✓ Priority support</li>
                  <li>✓ Featured in category & search</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Pro Plan</h3>
                <p className="text-2xl font-bold text-brand-orange">₦50,000</p>
                <p className="text-sm text-gray-500">365 days</p>
                <ul className="mt-3 text-sm text-left space-y-1">
                  <li>✓ 10x view boost</li>
                  <li>✓ 24/7 priority support</li>
                  <li>✓ Featured on homepage</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-semibold">Premium Stats</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {premiumStats.totalPremiumUsers} premium users • {formatCurrency(premiumStats.totalRevenue)} revenue • {premiumStats.activeSubscriptions} active subscriptions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {quickActions.map((action, index) => (
            action.path ? (
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
            ) : (
              <button
                key={index}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md transition group"
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Admin</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateAdmin} className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Activation Modal - MAKE PREMIUM DIRECTLY */}
      {showPremiumModal && selectedUserForPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activate Premium</h2>
              <button onClick={() => setShowPremiumModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedUserForPremium.first_name?.[0] || selectedUserForPremium.username?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUserForPremium.first_name} {selectedUserForPremium.last_name}
                  </p>
                  <p className="text-sm text-gray-500">@{selectedUserForPremium.username}</p>
                  <p className="text-xs text-gray-400">{selectedUserForPremium.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Premium Plan
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                    premiumPlan === 'basic' ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="premiumPlan"
                        value="basic"
                        checked={premiumPlan === 'basic'}
                        onChange={(e) => setPremiumPlan(e.target.value)}
                        className="text-brand-orange"
                      />
                      <div>
                        <p className="font-semibold">Basic Plan</p>
                        <p className="text-sm text-gray-500">30 days • 2x view boost</p>
                      </div>
                    </div>
                    <p className="font-bold text-brand-orange">₦5,000</p>
                  </label>

                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                    premiumPlan === 'standard' ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="premiumPlan"
                        value="standard"
                        checked={premiumPlan === 'standard'}
                        onChange={(e) => setPremiumPlan(e.target.value)}
                        className="text-brand-orange"
                      />
                      <div>
                        <p className="font-semibold">Standard Plan</p>
                        <p className="text-sm text-gray-500">90 days • 5x view boost</p>
                      </div>
                    </div>
                    <p className="font-bold text-brand-orange">₦15,000</p>
                  </label>

                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                    premiumPlan === 'pro' ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="premiumPlan"
                        value="pro"
                        checked={premiumPlan === 'pro'}
                        onChange={(e) => setPremiumPlan(e.target.value)}
                        className="text-brand-orange"
                      />
                      <div>
                        <p className="font-semibold">Pro Plan</p>
                        <p className="text-sm text-gray-500">365 days • 10x view boost</p>
                      </div>
                    </div>
                    <p className="font-bold text-brand-orange">₦50,000</p>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleActivatePremium}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Activate Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;