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
import React, { useState, useEffect } from 'react';
import { notificationsService } from '../../services/notifications';
import { Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-brand-orange" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-2xl">
          <Bell className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-1">When you get notifications, they'll show up here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:bg-gray-800 transition">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="text-xs text-gray-500">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;