// src/pages/admin/AdminNotifications.jsx
// import React, { useState } from 'react';
// import { Bell, Send, Users, Megaphone, Trash2, CheckCircle } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import toast from 'react-hot-toast';

// const AdminNotifications = () => {
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');
//   const [notificationType, setNotificationType] = useState('all');
//   const [sending, setSending] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, title: 'Welcome Offer', message: 'New users get 10% off', type: 'promotion', createdAt: '2024-01-15' },
//     { id: 2, title: 'System Update', message: 'Platform maintenance on Sunday', type: 'system', createdAt: '2024-01-14' },
//   ]);

//   const handleSendNotification = async () => {
//     if (!title || !message) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     setSending(true);
//     try {
//       // Add to local list
//       const newNotification = {
//         id: Date.now(),
//         title,
//         message,
//         type: notificationType,
//         createdAt: new Date().toISOString().split('T')[0],
//       };
//       setNotifications([newNotification, ...notifications]);
      
//       toast.success('Notification sent successfully');
//       setTitle('');
//       setMessage('');
//       setNotificationType('all');
//     } catch (error) {
//       toast.error('Failed to send notification');
//     } finally {
//       setSending(false);
//     }
//   };

//   const getTypeColor = (type) => {
//     switch(type) {
//       case 'promotion': return 'bg-yellow-100 text-yellow-700';
//       case 'system': return 'bg-blue-100 text-blue-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Notifications</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Send Notification Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
//             <Megaphone className="h-5 w-5 text-brand-orange" />
//             <span>Create Notification</span>
//           </h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Notification Type</label>
//               <select
//                 value={notificationType}
//                 onChange={(e) => setNotificationType(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange"
//               >
//                 <option value="all">All Users</option>
//                 <option value="users">Regular Users</option>
//                 <option value="premium">Premium Users</option>
//                 <option value="sellers">Sellers</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange"
//                 placeholder="Notification title..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Message</label>
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows="4"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange"
//                 placeholder="Notification message..."
//               />
//             </div>

//             <button
//               onClick={handleSendNotification}
//               disabled={sending}
//               className="w-full bg-brand-orange text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 disabled:opacity-50"
//             >
//               <Send className="h-4 w-4" />
//               <span>{sending ? 'Sending...' : 'Send Notification'}</span>
//             </button>
//           </div>
//         </div>

//         {/* Recent Notifications */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
//             <Bell className="h-5 w-5 text-brand-orange" />
//             <span>Recent Notifications</span>
//           </h2>

//           <div className="space-y-3">
//             {notifications.map((notif) => (
//               <div key={notif.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2 mb-1">
//                       <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notif.type)}`}>
//                         {notif.type}
//                       </span>
//                       <span className="text-xs text-gray-500">{notif.createdAt}</span>
//                     </div>
//                     <p className="font-semibold">{notif.title}</p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
//                   </div>
//                   <button className="p-1 text-gray-400 hover:text-red-500">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminNotifications;
import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Megaphone, Trash2, CheckCircle, Loader2, UserCheck, Crown, Package } from 'lucide-react';
import { adminService } from '../../services/admin';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('all');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load recent notifications from backend
  useEffect(() => {
    loadRecentNotifications();
  }, []);

  const loadRecentNotifications = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRecentNotifications();
      setNotifications(response || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      // Send notification through backend API
      await adminService.sendNotification({
        title,
        message,
        user_type: notificationType,
        admin_id: user?.id
      });
      
      toast.success(`Notification sent to ${getTargetText()} successfully`);
      setTitle('');
      setMessage('');
      setNotificationType('all');
      
      // Refresh the notification list
      loadRecentNotifications();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error(error.response?.data?.detail || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getTargetText = () => {
    switch(notificationType) {
      case 'all': return 'all users';
      case 'users': return 'regular users';
      case 'premium': return 'premium users';
      case 'sellers': return 'sellers';
      default: return 'users';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'all': return 'All Users';
      case 'users': return 'Regular Users';
      case 'premium': return 'Premium Users';
      case 'sellers': return 'Sellers';
      default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'all': return <Users className="h-4 w-4" />;
      case 'users': return <UserCheck className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'sellers': return <Package className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Notifications</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Broadcast messages to all users or specific groups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Megaphone className="h-5 w-5 text-brand-orange" />
            <span>Create Notification</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Audience
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">📢 All Users</option>
                <option value="users">👤 Regular Users</option>
                <option value="premium">👑 Premium Users</option>
                <option value="sellers">📦 Sellers</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Notification will be sent to all {getTargetText()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Special Offer, System Update, etc."
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Type your notification message here..."
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {title ? <span className="font-semibold">{title}</span> : 'Title will appear here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message || 'Message content will appear here...'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendNotification}
              disabled={sending || !title || !message}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>{sending ? 'Sending...' : 'Send Notification'}</span>
            </button>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-brand-orange" />
            <span>Recent Notifications</span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No notifications sent yet</p>
              <p className="text-sm text-gray-400 mt-1">Send your first notification above</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
                          {getTypeIcon(notif.user_type || 'all')}
                          <span>{getTypeLabel(notif.user_type || 'all')}</span>
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(notif.created_at)}</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                      {notif.sent_count && (
                        <p className="text-xs text-gray-400 mt-2">Sent to {notif.sent_count} users</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;