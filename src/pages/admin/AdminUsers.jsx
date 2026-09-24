// 


// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   UserCheck, 
//   UserX, 
//   Mail, 
//   Phone, 
//   Calendar, 
//   Eye, 
//   Crown,
//   Clock,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Download,
//   Ban,
//   Users,
//   Trash2
// } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { formatDate } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('all');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showSuspendModal, setShowSuspendModal] = useState(false);
//   const [showPremiumModal, setShowPremiumModal] = useState(false);
//   const [suspendReason, setSuspendReason] = useState('');
//   const [premiumPlan, setPremiumPlan] = useState('basic');
//   const [premiumDuration, setPremiumDuration] = useState(30);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     suspendedUsers: 0,
//     premiumUsers: 0,
//     verifiedUsers: 0,
//   });

//   const itemsPerPage = 10;

//   useEffect(() => {
//     loadUsers();
//   }, [currentPage, filter]);

//   useEffect(() => {
//     filterUsers();
//   }, [searchTerm, users]);

//   const loadUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await adminService.getAllUsers({ 
//         page: currentPage, 
//         limit: itemsPerPage,
//         status: filter !== 'all' ? filter : undefined
//       });
      
//       const usersList = data.users || [];
//       setUsers(usersList);
//       setFilteredUsers(usersList);
//       setTotalPages(Math.ceil((data.total || usersList.length) / itemsPerPage));
      
//       const allUsers = usersList;
//       setStats({
//         totalUsers: allUsers.length,
//         activeUsers: allUsers.filter(u => !u.is_suspended && u.is_verified).length,
//         suspendedUsers: allUsers.filter(u => u.is_suspended).length,
//         premiumUsers: allUsers.filter(u => u.is_premium).length,
//         verifiedUsers: allUsers.filter(u => u.is_verified).length,
//       });
//     } catch (error) {
//       console.error('Failed to load users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterUsers = () => {
//     if (!searchTerm.trim()) {
//       setFilteredUsers(users);
//       return;
//     }
    
//     const filtered = users.filter(user => 
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone?.includes(searchTerm)
//     );
//     setFilteredUsers(filtered);
//   };

//   const handleSuspendUser = async () => {
//     if (!selectedUser) return;
    
//     try {
//       await adminService.suspendUser(selectedUser.id, suspendReason);
//       toast.success(`${selectedUser.email} has been suspended`);
//       setShowSuspendModal(false);
//       setSuspendReason('');
//       setSelectedUser(null);
//       loadUsers();
//     } catch (error) {
//       toast.error('Failed to suspend user');
//     }
//   };

//   const handleUnsuspendUser = async (user) => {
//     if (!confirm(`Are you sure you want to unsuspend ${user.email}?`)) return;
    
//     try {
//       await adminService.unsuspendUser(user.id);
//       toast.success(`${user.email} has been unsuspended`);
//       loadUsers();
//     } catch (error) {
//       toast.error('Failed to unsuspend user');
//     }
//   };

//   const handleDeleteUser = async (user) => {
//     if (!confirm(`⚠️ Are you sure you want to permanently delete ${user.email}?\n\nThis action cannot be undone!`)) return;
    
//     try {
//       await adminService.deleteUser(user.id);
//       toast.success(`${user.email} has been deleted`);
//       loadUsers();
//     } catch (error) {
//       toast.error('Failed to delete user');
//     }
//   };

//   const handleResetPassword = async (user) => {
//     const newPassword = prompt(`Enter new password for ${user.email}:`);
//     if (!newPassword || newPassword.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }
    
//     try {
//       await adminService.resetUserPassword(user.id, newPassword);
//       toast.success(`Password reset for ${user.email}`);
//     } catch (error) {
//       toast.error('Failed to reset password');
//     }
//   };

//   const handleActivatePremium = async () => {
//     if (!selectedUser) return;
    
//     try {
//       await adminService.activatePremium(selectedUser.id, premiumPlan);
//       toast.success(`Premium activated for ${selectedUser.email}`);
//       setShowPremiumModal(false);
//       setSelectedUser(null);
//       loadUsers();
//     } catch (error) {
//       toast.error('Failed to activate premium');
//     }
//   };

//   const handleRemovePremium = async () => {
//     if (!selectedUser) return;
//     if (!confirm(`Remove premium from ${selectedUser.email}?`)) return;
    
//     try {
//       await adminService.removePremium(selectedUser.id);
//       toast.success(`Premium removed from ${selectedUser.email}`);
//       setShowPremiumModal(false);
//       setSelectedUser(null);
//       loadUsers();
//     } catch (error) {
//       toast.error('Failed to remove premium');
//     }
//   };

//   const exportUsers = () => {
//     const csvData = filteredUsers.map(user => ({
//       Email: user.email,
//       Username: user.username,
//       'Full Name': `${user.first_name || ''} ${user.last_name || ''}`,
//       Phone: user.phone,
//       Role: user.role,
//       Status: user.is_suspended ? 'Suspended' : 'Active',
//       Verified: user.is_verified ? 'Yes' : 'No',
//       Premium: user.is_premium ? 'Yes' : 'No',
//       'Joined Date': formatDate(user.created_at),
//     }));
    
//     if (csvData.length === 0) {
//       toast.error('No data to export');
//       return;
//     }
    
//     const headers = Object.keys(csvData[0]);
//     const csv = [headers.join(','), ...csvData.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Users exported successfully');
//   };

//   const getStatusBadge = (user) => {
//     if (user.is_suspended) {
//       return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /><span>Suspended</span></span>;
//     }
//     if (user.is_verified) {
//       return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /><span>Active</span></span>;
//     }
//     return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /><span>Unverified</span></span>;
//   };

//   const statCards = [
//     { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
//     { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'bg-green-500' },
//     { title: 'Suspended', value: stats.suspendedUsers, icon: UserX, color: 'bg-red-500' },
//     { title: 'Premium', value: stats.premiumUsers, icon: Crown, color: 'bg-yellow-500' },
//   ];

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
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Manage, monitor, and control all users on the platform</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {statCards.map((stat, index) => (
//             <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
//                 </div>
//                 <div className={`${stat.color} p-3 rounded-xl`}>
//                   <stat.icon className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, username or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               />
//             </div>
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//             >
//               <option value="all">All Users</option>
//               <option value="active">Active Only</option>
//               <option value="suspended">Suspended</option>
//               <option value="unverified">Unverified</option>
//               <option value="premium">Premium</option>
//             </select>
//             <button
//               onClick={exportUsers}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
//             >
//               <Download className="h-4 w-4" />
//               <span>Export</span>
//             </button>
//             <button
//               onClick={() => loadUsers()}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
//             >
//               <RefreshCw className="h-4 w-4" />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Contact</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Joined</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Premium</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white font-semibold">
//                           {user.first_name?.[0] || user.username?.[0] || 'U'}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900 dark:text-white">
//                             {user.first_name} {user.last_name}
//                           </p>
//                           <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
//                           <Mail className="h-3 w-3 mr-1" /> {user.email}
//                         </p>
//                         {user.phone && (
//                           <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
//                             <Phone className="h-3 w-3 mr-1" /> {user.phone}
//                           </p>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {formatDate(user.created_at)}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       {getStatusBadge(user)}
//                     </td>
//                     <td className="py-4 px-6">
//                       {user.is_premium ? (
//                         <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//                           <Crown className="h-3 w-3" />
//                           <span>{user.premium_plan || 'Premium'}</span>
//                         </span>
//                       ) : (
//                         <span className="text-sm text-gray-500">Free</span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setShowUserModal(true);
//                           }}
//                           className="p-1.5 text-blue-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
//                           title="View Details"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setShowPremiumModal(true);
//                           }}
//                           className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded-lg hover:bg-yellow-50"
//                           title="Manage Premium"
//                         >
//                           <Crown className="h-4 w-4" />
//                         </button>
//                         {!user.is_suspended ? (
//                           <button
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setShowSuspendModal(true);
//                             }}
//                             className="p-1.5 text-orange-500 hover:text-orange-600 rounded-lg hover:bg-orange-50"
//                             title="Suspend"
//                           >
//                             <UserX className="h-4 w-4" />
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => handleUnsuspendUser(user)}
//                             className="p-1.5 text-green-500 hover:text-green-600 rounded-lg hover:bg-green-50"
//                             title="Unsuspend"
//                           >
//                             <UserCheck className="h-4 w-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleResetPassword(user)}
//                           className="p-1.5 text-purple-500 hover:text-purple-600 rounded-lg hover:bg-purple-50"
//                           title="Reset Password"
//                         >
//                           <RefreshCw className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user)}
//                           className="p-1.5 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50"
//                           title="Delete User"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredUsers.length === 0 && (
//             <div className="text-center py-12">
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500 dark:text-gray-400">No users found</p>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center space-x-2 py-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* User Details Modal */}
//       {showUserModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h2>
//               <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex items-center space-x-4">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
//                   {selectedUser.first_name?.[0] || selectedUser.username?.[0] || 'U'}
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                     {selectedUser.first_name} {selectedUser.last_name}
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400">@{selectedUser.username}</p>
//                   {selectedUser.is_premium && (
//                     <span className="inline-flex items-center space-x-1 text-sm text-yellow-600 mt-1">
//                       <Crown className="h-3 w-3" />
//                       <span>Premium User</span>
//                     </span>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
//                   <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
//                   <p className="text-gray-900 dark:text-white">{selectedUser.phone || 'Not provided'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
//                   <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.created_at)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//                   <p className="text-gray-900 dark:text-white">
//                     {selectedUser.is_suspended ? 'Suspended' : selectedUser.is_verified ? 'Active' : 'Unverified'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
//                   <p className="text-gray-900 dark:text-white capitalize">{selectedUser.role || 'User'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Premium Plan</p>
//                   <p className="text-gray-900 dark:text-white capitalize">{selectedUser.premium_plan || 'None'}</p>
//                 </div>
//               </div>
              
//               {selectedUser.bio && (
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
//                   <p className="text-gray-900 dark:text-white">{selectedUser.bio}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Suspend Modal */}
//       {showSuspendModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Suspend User</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">
//               Are you sure you want to suspend <span className="font-semibold">{selectedUser.email}</span>?
//             </p>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Reason (Optional)
//               </label>
//               <textarea
//                 value={suspendReason}
//                 onChange={(e) => setSuspendReason(e.target.value)}
//                 rows="3"
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 placeholder="Enter reason for suspension..."
//               />
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowSuspendModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                 Cancel
//               </button>
//               <button onClick={handleSuspendUser} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition">
//                 Suspend User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Premium Modal */}
//       {showPremiumModal && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Manage Premium</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">
//               User: <span className="font-semibold">{selectedUser.email}</span>
//             </p>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Premium Plan
//                 </label>
//                 <select
//                   value={premiumPlan}
//                   onChange={(e) => setPremiumPlan(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 >
//                   <option value="basic">Basic - ₦5,000 (30 days)</option>
//                   <option value="standard">Standard - ₦15,000 (90 days)</option>
//                   <option value="pro">Pro - ₦50,000 (365 days)</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowPremiumModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                 Cancel
//               </button>
//               <button onClick={handleActivatePremium} className="flex-1 px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-xl transition">
//                 Activate Premium
//               </button>
//             </div>
//             {selectedUser.is_premium && (
//               <button
//                 onClick={handleRemovePremium}
//                 className="w-full mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
//               >
//                 Remove Premium
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Ban,
  Users,
  Trash2
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [premiumPlans, setPremiumPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [premiumPlan, setPremiumPlan] = useState('basic');
  const [premiumDuration, setPremiumDuration] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    premiumUsers: 0,
    verifiedUsers: 0,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, filter]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  useEffect(() => {
    loadPremiumPlans();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers({ 
        page: currentPage, 
        limit: itemsPerPage,
        status: filter !== 'all' ? filter : undefined
      });
      
      const usersList = data.users || [];
      setUsers(usersList);
      setFilteredUsers(usersList);
      setTotalPages(Math.ceil((data.total || usersList.length) / itemsPerPage));
      
      const allUsers = usersList;
      setStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => !u.is_suspended && u.is_verified).length,
        suspendedUsers: allUsers.filter(u => u.is_suspended).length,
        premiumUsers: allUsers.filter(u => u.is_premium).length,
        verifiedUsers: allUsers.filter(u => u.is_verified).length,
      });
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the real, current premium plans from the backend instead of
  // relying on hardcoded prices — keeps this dropdown in sync with
  // whatever was last saved in Premium Plan management.
  const loadPremiumPlans = async () => {
    setPlansLoading(true);
    try {
      const data = await adminService.getPremiumPlans();
      const plans = (data.plans || []).filter(p => p.is_active);
      setPremiumPlans(plans);

      if (plans.length > 0 && !plans.some(p => p.key === premiumPlan)) {
        setPremiumPlan(plans[0].key);
      }
    } catch (error) {
      console.error('Failed to load premium plans:', error);
      toast.error('Failed to load premium plans');
    } finally {
      setPlansLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleSuspendUser = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.suspendUser(selectedUser.id, suspendReason);
      toast.success(`${selectedUser.email} has been suspended`);
      setShowSuspendModal(false);
      setSuspendReason('');
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleUnsuspendUser = async (user) => {
    if (!confirm(`Are you sure you want to unsuspend ${user.email}?`)) return;
    
    try {
      await adminService.unsuspendUser(user.id);
      toast.success(`${user.email} has been unsuspended`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to unsuspend user');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`⚠️ Are you sure you want to permanently delete ${user.email}?\n\nThis action cannot be undone!`)) return;
    
    try {
      await adminService.deleteUser(user.id);
      toast.success(`${user.email} has been deleted`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleResetPassword = async (user) => {
    const newPassword = prompt(`Enter new password for ${user.email}:`);
    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      await adminService.resetUserPassword(user.id, newPassword);
      toast.success(`Password reset for ${user.email}`);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleActivatePremium = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.activatePremium(selectedUser.id, premiumPlan);
      toast.success(`Premium activated for ${selectedUser.email}`);

      // Reflect it immediately in the table instead of waiting on refetch.
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id
            ? { ...u, is_premium: true, premium_plan: premiumPlan }
            : u
        )
      );

      setShowPremiumModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Failed to activate premium');
    }
  };

  const handleRemovePremium = async () => {
    if (!selectedUser) return;
    if (!confirm(`Remove premium from ${selectedUser.email}?`)) return;
    
    try {
      await adminService.removePremium(selectedUser.id);
      toast.success(`Premium removed from ${selectedUser.email}`);

      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id
            ? { ...u, is_premium: false, premium_plan: null }
            : u
        )
      );

      setShowPremiumModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Failed to remove premium');
    }
  };

  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      Email: user.email,
      Username: user.username,
      'Full Name': `${user.first_name || ''} ${user.last_name || ''}`,
      Phone: user.phone,
      Role: user.role,
      Status: user.is_suspended ? 'Suspended' : 'Active',
      Verified: user.is_verified ? 'Yes' : 'No',
      Premium: user.is_premium ? 'Yes' : 'No',
      'Joined Date': formatDate(user.created_at),
    }));
    
    if (csvData.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = Object.keys(csvData[0]);
    const csv = [headers.join(','), ...csvData.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  const getStatusBadge = (user) => {
    if (user.is_suspended) {
      return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /><span>Suspended</span></span>;
    }
    if (user.is_verified) {
      return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /><span>Active</span></span>;
    }
    return <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /><span>Unverified</span></span>;
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'bg-green-500' },
    { title: 'Suspended', value: stats.suspendedUsers, icon: UserX, color: 'bg-red-500' },
    { title: 'Premium', value: stats.premiumUsers, icon: Crown, color: 'bg-yellow-500' },
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage, monitor, and control all users on the platform</p>
        </div>

        {/* Stats Cards */}
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

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, username or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended</option>
              <option value="unverified">Unverified</option>
              <option value="premium">Premium</option>
            </select>
            <button
              onClick={exportUsers}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => loadUsers()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Premium</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white font-semibold">
                          {user.first_name?.[0] || user.username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" /> {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {user.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(user)}
                    </td>
                    <td className="py-4 px-6">
                      {user.is_premium ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                          <Crown className="h-3 w-3" />
                          <span>{user.premium_plan || 'Premium'}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Free</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-1.5 text-blue-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPremiumModal(true);
                          }}
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded-lg hover:bg-yellow-50"
                          title="Manage Premium"
                        >
                          <Crown className="h-4 w-4" />
                        </button>
                        {!user.is_suspended ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowSuspendModal(true);
                            }}
                            className="p-1.5 text-orange-500 hover:text-orange-600 rounded-lg hover:bg-orange-50"
                            title="Suspend"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnsuspendUser(user)}
                            className="p-1.5 text-green-500 hover:text-green-600 rounded-lg hover:bg-green-50"
                            title="Unsuspend"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-1.5 text-purple-500 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                          title="Reset Password"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h2>
              <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.first_name?.[0] || selectedUser.username?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">@{selectedUser.username}</p>
                  {selectedUser.is_premium && (
                    <span className="inline-flex items-center space-x-1 text-sm text-yellow-600 mt-1">
                      <Crown className="h-3 w-3" />
                      <span>Premium User</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedUser.is_suspended ? 'Suspended' : selectedUser.is_verified ? 'Active' : 'Unverified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedUser.role || 'User'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Premium Plan</p>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedUser.premium_plan || 'None'}</p>
                </div>
              </div>
              
              {selectedUser.bio && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-gray-900 dark:text-white">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Suspend User</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to suspend <span className="font-semibold">{selectedUser.email}</span>?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason (Optional)
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter reason for suspension..."
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowSuspendModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button onClick={handleSuspendUser} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition">
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal — now driven by live plan data */}
      {showPremiumModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Manage Premium</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              User: <span className="font-semibold">{selectedUser.email}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Premium Plan
                </label>

                {plansLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-orange"></div>
                  </div>
                ) : premiumPlans.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    No premium plans available. Create one from Premium Plan management first.
                  </p>
                ) : (
                  <select
                    value={premiumPlan}
                    onChange={(e) => setPremiumPlan(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {premiumPlans.map(plan => (
                      <option key={plan.key} value={plan.key}>
                        {plan.name} - {formatCurrency(plan.price)} ({plan.duration_days} days)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowPremiumModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button
                onClick={handleActivatePremium}
                disabled={premiumPlans.length === 0}
                className="flex-1 px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Activate Premium
              </button>
            </div>
            {selectedUser.is_premium && (
              <button
                onClick={handleRemovePremium}
                className="w-full mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
              >
                Remove Premium
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;