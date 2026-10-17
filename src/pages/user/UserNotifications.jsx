// import React, { useState, useEffect } from 'react';
// import { notificationsService } from '../../services/notifications';
// import { Bell } from 'lucide-react';

// const UserNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       const data = await notificationsService.getNotifications();
//       setNotifications(data.notifications || data.data || []);
//     } catch (error) {
//       console.error('Failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-12 text-white">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
//       {notifications.length === 0 ? (
//         <div className="text-center py-12 bg-gray-900 rounded-xl">
//           <Bell className="h-12 w-12 mx-auto text-gray-600 mb-3" />
//           <p className="text-gray-400">No notifications yet</p>
//         </div>
//       ) : (
//         notifications.map((n) => (
//           <div key={n.id} className="bg-gray-900 rounded-xl p-4 mb-3 border border-gray-800">
//             <p className="text-white">{n.message}</p>
//             <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default UserNotifications;

// src/pages/user/UserNotifications.jsx
// import React, { useState, useEffect } from 'react';
// import { notificationsService } from '../../services/notifications';
// import { Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

// const UserNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       const data = await notificationsService.getNotifications();
//       setNotifications(data.notifications || data.data || []);
//     } catch (error) {
//       console.error('Failed to load notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
//       default: return <Bell className="h-5 w-5 text-brand-orange" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
      
//       {notifications.length === 0 ? (
//         <div className="text-center py-12 bg-gray-900 rounded-2xl">
//           <Bell className="h-16 w-16 mx-auto text-gray-600 mb-4" />
//           <p className="text-gray-400">No notifications yet</p>
//           <p className="text-gray-500 text-sm mt-1">When you get notifications, they'll show up here</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {notifications.map((notif) => (
//             <div key={notif.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:bg-gray-800 transition">
//               <div className="flex gap-3">
//                 <div className="flex-shrink-0">
//                   {getNotificationIcon(notif.type)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-white">{notif.message}</p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Clock className="h-3 w-3 text-gray-500" />
//                     <p className="text-xs text-gray-500">
//                       {new Date(notif.created_at).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserNotifications;
import React, { useState, useEffect, useMemo } from 'react';
import { notificationsService } from '../../services/notifications';
import { Bell, CheckCircle, XCircle, Clock, Trash2, Package, Wallet, Crown, ShieldCheck } from 'lucide-react';

// ------------------------------------------------------------
// Category display settings (colour + icon + label per tab)
// ------------------------------------------------------------
const CATEGORY_STYLES = {
  approved: { label: 'Approved', icon: CheckCircle, iconClass: 'text-green-500', badge: 'bg-green-500/15 text-green-400' },
  rejected: { label: 'Rejected', icon: XCircle, iconClass: 'text-red-500', badge: 'bg-red-500/15 text-red-400' },
  pending: { label: 'Pending review', icon: Clock, iconClass: 'text-yellow-500', badge: 'bg-yellow-500/15 text-yellow-400' },
  deleted: { label: 'Removed', icon: Trash2, iconClass: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-300' },
  order: { label: 'Orders', icon: Package, iconClass: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-300' },
  payout: { label: 'Payouts', icon: Wallet, iconClass: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300' },
  premium: { label: 'Premium', icon: Crown, iconClass: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-300' },
  admin: { label: 'Admin', icon: ShieldCheck, iconClass: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-300' },
  other: { label: 'General', icon: Bell, iconClass: 'text-brand-orange', badge: 'bg-orange-500/15 text-orange-300' },
};

const TAB_ORDER = ['approved', 'rejected', 'pending', 'deleted', 'order', 'payout', 'premium', 'admin', 'other'];

// Fallback if the backend has not been updated yet (no `category` field).
const guessCategory = (n) => {
  const key = `${n.type || ''} ${n.data?.event || ''}`.toLowerCase();
  const blob = `${key} ${n.title || ''} ${n.message || n.body || ''}`.toLowerCase();
  if (key.includes('payout')) return 'payout';
  if (key.includes('premium')) return 'premium';
  if (key.trim().startsWith('order') || key.includes('order_')) return 'order';
  if (['reject', 'not allowed', 'not approved', 'does not contain enough', 'blocked', 'violat', 'declined'].some((w) => blob.includes(w))) return 'rejected';
  if (blob.includes('approved')) return 'approved';
  if (['removed', 'deleted'].some((w) => blob.includes(w))) return 'deleted';
  if (['pending', 'manual review', 'under review', 'received', 'safety checks'].some((w) => blob.includes(w))) return 'pending';
  if (key.includes('admin')) return 'admin';
  return 'other';
};

const getCategory = (n) => n.category || guessCategory(n);

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data.notifications || data.data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tells the sidebar bell to refresh its unread badge.
  const announceChange = () => {
    window.dispatchEvent(new Event('notifications:changed'));
  };

  const markAsRead = async (notif) => {
    if (notif.is_read) return;

    // Update the screen immediately.
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
    );

    try {
      // Adjust the method name if your service uses a different one.
      await notificationsService.markAsRead?.(notif.id);
      announceChange();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      // Adjust the method name if your service uses a different one.
      await notificationsService.markAllAsRead?.();
      announceChange();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const counts = useMemo(() => {
    const total = {};
    const unread = {};
    notifications.forEach((n) => {
      const cat = getCategory(n);
      total[cat] = (total[cat] || 0) + 1;
      if (!n.is_read) unread[cat] = (unread[cat] || 0) + 1;
    });
    return { total, unread };
  }, [notifications]);

  const unreadTotal = notifications.filter((n) => !n.is_read).length;

  const visible = useMemo(
    () => (activeTab === 'all' ? notifications : notifications.filter((n) => getCategory(n) === activeTab)),
    [notifications, activeTab]
  );

  const tabs = [
    { key: 'all', label: 'All', total: notifications.length, unread: unreadTotal },
    ...TAB_ORDER.filter((key) => counts.total[key]).map((key) => ({
      key,
      label: CATEGORY_STYLES[key].label,
      total: counts.total[key],
      unread: counts.unread[key] || 0,
    })),
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Notifications
          {unreadTotal > 0 && (
            <span className="ml-3 align-middle text-xs font-semibold bg-brand-orange text-white rounded-full px-2 py-0.5">
              {unreadTotal} unread
            </span>
          )}
        </h1>

        {unreadTotal > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-sm text-brand-orange hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-2xl">
          <Bell className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-1">When you get notifications, they'll show up here</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-3" role="tablist">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? 'bg-brand-orange border-brand-orange text-white'
                      : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs ${active ? 'text-white/80' : 'text-gray-500'}`}>{tab.total}</span>
                  {tab.unread > 0 && (
                    <span className="h-2 w-2 rounded-full bg-brand-orange ring-2 ring-gray-900" aria-label={`${tab.unread} unread`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          {visible.length === 0 ? (
            <div className="text-center py-10 bg-gray-900 rounded-2xl text-gray-400 text-sm">
              Nothing in this category yet.
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((notif) => {
                const category = getCategory(notif);
                const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.other;
                const Icon = style.icon;
                const text = notif.message || notif.body || '';

                return (
                  <div
                    key={notif.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => markAsRead(notif)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && markAsRead(notif)}
                    className={`bg-gray-900 rounded-xl p-4 border hover:bg-gray-800 transition cursor-pointer ${
                      notif.is_read ? 'border-gray-800' : 'border-brand-orange/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 pt-0.5">
                        <Icon className={`h-5 w-5 ${style.iconClass}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${style.badge}`}>
                            {notif.category_label || style.label}
                          </span>
                          {notif.title && (
                            <p className={`text-white ${notif.is_read ? 'font-medium' : 'font-semibold'}`}>
                              {notif.title}
                            </p>
                          )}
                          {!notif.is_read && (
                            <span className="h-2 w-2 rounded-full bg-brand-orange" aria-label="Unread" />
                          )}
                        </div>

                        {text && text !== notif.title && (
                          <p className="text-gray-300 text-sm mt-1">{text}</p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <p className="text-xs text-gray-500">
                            {notif.created_at ? new Date(notif.created_at).toLocaleString() : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserNotifications;