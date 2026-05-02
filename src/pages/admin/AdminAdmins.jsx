


// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, UserCog, RefreshCw } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { formatDate } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const AdminAdmins = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ 
//     email: '', 
//     password: '',      // Keep this
//     full_name: '',     // Use full_name (matches your table display)
//     role: 'admin' 
//   });

//   useEffect(() => {
//     loadAdmins();
//   }, []);

//   const loadAdmins = async () => {
//     setLoading(true);
//     try {
//       const data = await adminService.getAllAdmins();
//       setAdmins(data);
//     } catch (error) {
//       console.error('Failed to load admins:', error);
//       toast.error('Failed to load admins');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAdmin = async () => {
//     // Validate required fields
//     if (!newAdmin.email || !newAdmin.password || !newAdmin.full_name) {
//       toast.error('Please fill in all fields (Full Name, Email, Password)');
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(newAdmin.email)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     // Password validation
//     if (newAdmin.password.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }

//     try {
//       // Send exactly what the backend expects
//       const payload = {
//         email: newAdmin.email,
//         full_name: newAdmin.full_name,  // Keep as full_name
//         password: newAdmin.password,     // Add password
//         role: newAdmin.role
//       };
      
//       console.log('Sending payload:', payload);
      
//       const response = await adminService.createAdmin(payload);
      
//       // Show success with temporary password if returned
//       const tempPassword = response.temp_password || newAdmin.password;
//       alert(`✅ Admin Created Successfully!\n\nName: ${newAdmin.full_name}\nEmail: ${newAdmin.email}\nPassword: ${tempPassword}\n\n⚠️ Please save this password and share it with the new admin.`);
      
//       toast.success('Admin created successfully!', { duration: 5000 });
      
//       setShowModal(false);
//       setNewAdmin({ email: '', password: '', full_name: '', role: 'admin' });
//       loadAdmins();
//     } catch (error) {
//       console.error('Create admin error:', error);
      
//       // Better error handling
//       let errorMessage = 'Failed to create admin';
//       if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       toast.error(errorMessage);
      
//       if (errorMessage.toLowerCase().includes('already exists') || 
//           errorMessage.toLowerCase().includes('duplicate')) {
//         toast.error('This email is already registered. Please use a different email.');
//       }
//     }
//   };

//   const handleDeleteAdmin = async (adminId, adminEmail) => {
//     if (!confirm(`Are you sure you want to delete ${adminEmail}? This action cannot be undone.`)) return;
//     try {
//       await adminService.deleteAdmin(adminId);
//       toast.success('Admin deleted successfully');
//       loadAdmins();
//     } catch (error) {
//       toast.error('Failed to delete admin');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Administrators</h1>
//         <div className="flex space-x-3 w-full sm:w-auto">
//           <button 
//             onClick={loadAdmins} 
//             className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//             aria-label="Refresh"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-brand-orange text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors flex-1 sm:flex-none"
//           >
//             <Plus className="h-4 w-4" />
//             <span>Add Admin</span>
//           </button>
//         </div>
//       </div>

//       {/* Responsive Table Container */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[640px]">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Name</th>
//                 <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Email</th>
//                 <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Role</th>
//                 <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold hidden sm:table-cell">Created</th>
//                 <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {admins.map((admin) => (
//                 <tr key={admin.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                   <td className="py-3 px-3 sm:px-4">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
//                         <UserCog className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                       </div>
//                       <span className="font-medium text-sm sm:text-base break-words">
//                         {admin.full_name || admin.name || 'N/A'}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-3 sm:px-4">
//                     <span className="text-sm break-all">{admin.email}</span>
//                   </td>
//                   <td className="py-3 px-3 sm:px-4">
//                     <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
//                       admin.role === 'super_admin' 
//                         ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
//                         : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                     }`}>
//                       {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
//                     </span>
//                   </td>
//                   <td className="py-3 px-3 sm:px-4 text-sm hidden sm:table-cell">
//                     {formatDate(admin.created_at)}
//                   </td>
//                   <td className="py-3 px-3 sm:px-4">
//                     {admin.role !== 'super_admin' && (
//                       <button
//                         onClick={() => handleDeleteAdmin(admin.id, admin.email)}
//                         className="p-1 text-red-500 hover:text-red-600 transition-colors"
//                         aria-label="Delete admin"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//         {admins.length === 0 && (
//           <div className="text-center py-12 text-gray-500">
//             No admins found. Click "Add Admin" to create one.
//           </div>
//         )}
//       </div>

//       {/* Create Admin Modal - Responsive */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={newAdmin.full_name}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
//                   placeholder="John Doe"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={newAdmin.email}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
//                   placeholder="admin@example.com"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   value={newAdmin.password}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
//                   placeholder="Minimum 6 characters"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   value={newAdmin.role}
//                   onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
//               <button 
//                 onClick={() => setShowModal(false)} 
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors sm:flex-1"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleCreateAdmin} 
//                 className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors sm:flex-1"
//               >
//                 Create Admin
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAdmins;
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCog, RefreshCw, Copy } from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ 
    email: '', 
    password: '',     
    full_name: '',     
    role: 'admin' 
  });

  // Get user from localStorage or auth store
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      console.error('Error parsing user:', e);
    }
    return null;
  };

  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admins');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('ID copied to clipboard!');
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.full_name || !newAdmin.email || !newAdmin.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        full_name: newAdmin.full_name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role
      };
      
      await adminService.createAdmin(payload);
      
      toast.success('Admin created successfully!');
      setShowModal(false);
      setNewAdmin({ email: '', password: '', full_name: '', role: 'admin' });
      loadAdmins();
    } catch (error) {
      console.error('Create admin error:', error);
      let errorMessage = 'Failed to create admin';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (!confirm(`Are you sure you want to delete ${adminEmail}?`)) return;
    try {
      await adminService.deleteAdmin(adminId);
      toast.success('Admin deleted successfully');
      loadAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Administrators
          {!isSuperAdmin && <span className="text-sm font-normal text-gray-500 ml-2">(View Only)</span>}
        </h1>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={loadAdmins} 
            className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          
          {isSuperAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              <span>Add Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Email</th>
                <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Role</th>
                <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold hidden sm:table-cell">Created</th>
                {isSuperAdmin && <th className="text-left py-3 px-3 sm:px-4 text-sm font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {admin.id ? admin.id.slice(0, 8) : 'N/A'}...
                      </code>
                      {isSuperAdmin && admin.id && (
                        <button
                          onClick={() => copyToClipboard(admin.id)}
                          className="text-gray-400 hover:text-brand-orange transition-colors"
                          title="Copy full ID"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <UserCog className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-sm sm:text-base break-words">
                        {admin.full_name || admin.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className="text-sm break-all">{admin.email}</span>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      admin.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-sm hidden sm:table-cell">
                    {formatDate(admin.created_at)}
                  </td>
                  {isSuperAdmin && (
                    <td className="py-3 px-3 sm:px-4">
                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                          className="p-1 text-red-500 hover:text-red-600 transition-colors"
                          aria-label="Delete admin"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {admins.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No admins found. Click "Add Admin" to create one.
          </div>
        )}
      </div>

      {/* Create Admin Modal - Only for Super Admin */}
      {isSuperAdmin && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Minimum 6 characters"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors sm:flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateAdmin} 
                className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors sm:flex-1"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmins;