

// export default UserDashboardLayout;
// import React, { useState } from 'react';
// import { Outlet, NavLink, Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Package, 
//   ShoppingBag, 
//   Heart, 
//   MessageCircle, 
//   Bell, 
//   Settings, 
//   LogOut,
//   Menu,
//   X,
//   DollarSign,
//   Crown,
//   Upload,
//   Home
// } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';

// const UserDashboardLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { user, logout } = useAuthStore();

//   const menuItems = [
//     { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { path: '/dashboard/listings', icon: Package, label: 'My Listings' },
//     { path: '/dashboard/upload', icon: Upload, label: 'Upload Product' },
//     { path: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
//     { path: '/dashboard/sales', icon: DollarSign, label: 'My Sales' },
//     { path: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
//     { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
//     { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
//     { path: '/dashboard/premium', icon: Crown, label: 'Premium' },
//     { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
//   ];

//   const handleLogout = () => {
//     logout();
//     window.location.href = '/signin';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Mobile Header */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
//         <Link to="/" className="font-bold text-lg bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
//           NexoLeolite
//         </Link>
//         <button
//           onClick={() => setMobileMenuOpen(true)}
//           className="p-2 rounded-lg bg-brand-orange text-white"
//         >
//           <Menu className="h-5 w-5" />
//         </button>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {mobileMenuOpen && (
//         <>
//           <div 
//             className="fixed inset-0 bg-black/50 z-50 lg:hidden"
//             onClick={() => setMobileMenuOpen(false)}
//           />
//           <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 z-50 lg:hidden flex flex-col shadow-xl">
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//               <Link to="/" className="font-bold text-xl bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
//                 NexoLeolite
//               </Link>
//               <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             <nav className="flex-1 py-4 overflow-y-auto">
//               <Link
//                 to="/shop"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="flex items-center px-4 py-3 mx-2 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
//               >
//                 <Home className="h-5 w-5" />
//                 <span className="ml-3">Go to Shop</span>
//               </Link>
              
//               <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2"></div>
              
//               {menuItems.map((item) => (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={({ isActive }) =>
//                     `flex items-center px-4 py-3 mx-2 rounded-lg transition ${
//                       isActive
//                         ? 'bg-brand-orange text-white'
//                         : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
//                     }`
//                   }
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span className="ml-3">{item.label}</span>
//                 </NavLink>
//               ))}
//             </nav>

//             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//               {user && (
//                 <div className="mb-3 px-2">
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                     {user.first_name} {user.last_name}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
//                 </div>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
//               >
//                 <LogOut className="h-5 w-5" />
//                 <span className="ml-3">Logout</span>
//               </button>
//             </div>
//           </aside>
//         </>
//       )}

//       {/* Desktop Sidebar */}
//       <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-col fixed h-full z-40`}>
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//           {sidebarOpen && (
//             <Link to="/" className="font-bold text-xl bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
//               NexoLeolite
//             </Link>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </button>
//         </div>

//         <nav className="flex-1 py-4 overflow-y-auto">
//           <Link
//             to="/shop"
//             className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2`}
//           >
//             <Home className="h-5 w-5" />
//             {sidebarOpen && <span className="ml-3">Go to Shop</span>}
//           </Link>
          
//           <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2"></div>
          
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition ${
//                   isActive
//                     ? 'bg-brand-orange text-white'
//                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`
//               }
//             >
//               <item.icon className="h-5 w-5" />
//               {sidebarOpen && <span className="ml-3">{item.label}</span>}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           {sidebarOpen && user && (
//             <div className="mb-3 px-2">
//               <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                 {user.first_name} {user.last_name}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
//             </div>
//           )}
//           <button
//             onClick={handleLogout}
//             className={`flex items-center ${sidebarOpen ? 'px-2' : 'justify-center'} w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition`}
//           >
//             <LogOut className="h-5 w-5" />
//             {sidebarOpen && <span className="ml-3">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content - With padding for mobile header */}
//       <main className={`lg:flex-1 lg:ml-${sidebarOpen ? '64' : '20'} min-h-screen pt-14 lg:pt-0`}>
//         <div className="p-4 sm:p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboardLayout;


import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  DollarSign,
  Crown,
  Upload,
  Home
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { notificationsService } from '../../services/notifications';

const NOTIFICATIONS_PATH = '/dashboard/notifications';

const formatCount = (n) => (n > 99 ? '99+' : String(n));

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/listings', icon: Package, label: 'My Listings' },
    { path: '/dashboard/upload', icon: Upload, label: 'Upload Product' },
    { path: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
    { path: '/dashboard/sales', icon: DollarSign, label: 'My Sales' },
    { path: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
    { path: NOTIFICATIONS_PATH, icon: Bell, label: 'Notifications' },
    { path: '/dashboard/premium', icon: Crown, label: 'Premium' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  // ------------------------------------------------------------
  // UNREAD NOTIFICATION COUNT
  // Refreshes: on load, every 60s, when you change page, when the
  // tab becomes visible again, and when the notifications page
  // marks something as read (it fires "notifications:changed").
  // ------------------------------------------------------------
  const refreshUnread = useCallback(async () => {
    if (!user) return;
    const count = await notificationsService.getUnreadCount();
    setUnreadCount(Number(count) || 0);
  }, [user]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread, location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') refreshUnread();
    }, 60000);

    const onChanged = () => refreshUnread();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshUnread();
    };

    window.addEventListener('notifications:changed', onChanged);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications:changed', onChanged);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshUnread]);

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  // Icon with a small count badge (used when the sidebar is collapsed
  // or on the mobile header menu).
  const renderIcon = (item) => {
    const showBadge = item.path === NOTIFICATIONS_PATH && unreadCount > 0;
    return (
      <span className="relative inline-flex">
        <item.icon className="h-5 w-5" />
        {showBadge && (
          <span
            className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
            aria-label={`${unreadCount} unread notifications`}
          >
            {formatCount(unreadCount)}
          </span>
        )}
      </span>
    );
  };

  // Full-width pill shown at the right of the label when the sidebar is open.
  const renderInlineBadge = (item, isActive) => {
    if (item.path !== NOTIFICATIONS_PATH || unreadCount <= 0) return null;
    return (
      <span
        className={`ml-auto min-w-[22px] h-[20px] px-1.5 flex items-center justify-center rounded-full text-xs font-semibold ${
          isActive ? 'bg-white text-brand-orange' : 'bg-red-500 text-white'
        }`}
      >
        {formatCount(unreadCount)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
          NexoLeolite
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="relative p-2 rounded-lg bg-brand-orange text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 z-50 lg:hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Link to="/" className="font-bold text-xl bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
                NexoLeolite
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 py-4 overflow-y-auto">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 mx-2 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
              >
                <Home className="h-5 w-5" />
                <span className="ml-3">Go to Shop</span>
              </Link>
              
              <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2"></div>
              
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mx-2 rounded-lg transition ${
                      isActive
                        ? 'bg-brand-orange text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="h-5 w-5" />
                      <span className="ml-3">{item.label}</span>
                      {renderInlineBadge(item, isActive)}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {user && (
                <div className="mb-3 px-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-col fixed h-full z-40`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <Link to="/" className="font-bold text-xl bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
              NexoLeolite
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <Link
            to="/shop"
            className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2`}
          >
            <Home className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Go to Shop</span>}
          </Link>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-2"></div>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition ${
                  isActive
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {sidebarOpen ? <item.icon className="h-5 w-5" /> : renderIcon(item)}
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  {sidebarOpen && renderInlineBadge(item, isActive)}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen && user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center ${sidebarOpen ? 'px-2' : 'justify-center'} w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content - With padding for mobile header.
          NOTE: the margin classes are written out in full on purpose.
          Tailwind cannot see classes built like `lg:ml-${...}`, so they
          were never generated and the content sat under the sidebar. */}
      <main className={`lg:flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} min-h-screen pt-14 lg:pt-0 transition-all duration-300`}>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;