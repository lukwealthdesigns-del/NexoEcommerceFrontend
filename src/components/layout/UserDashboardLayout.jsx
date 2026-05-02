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
//   const [sidebarOpen, setSidebarOpen] = useState(true);
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
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}>
//         {/* Sidebar Header with Home Link */}
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//           {sidebarOpen && (
//             <Link to="/" className="font-bold text-xl bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
//               NexoElite
//             </Link>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 py-4 overflow-y-auto">
//           {/* Home/Shop Link */}
//           <Link
//             to="/shop"
//             className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-2`}
//           >
//             <Home className="h-5 w-5" />
//             {sidebarOpen && <span className="ml-3">Go to Shop</span>}
//           </Link>
          
//           {/* Divider */}
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

//         {/* User Info & Logout */}
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

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         {/* Top Navigation Bar with Home Button */}
//         <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link 
//               to="/" 
//               className="text-gray-600 dark:text-gray-400 hover:text-brand-orange transition flex items-center gap-2"
//             >
//               <Home className="h-5 w-5" />
//               <span className="hidden sm:inline">Home</span>
//             </Link>
//             <Link 
//               to="/shop" 
//               className="text-gray-600 dark:text-gray-400 hover:text-brand-orange transition flex items-center gap-2"
//             >
//               <ShoppingBag className="h-5 w-5" />
//               <span className="hidden sm:inline">Shop</span>
//             </Link>
//           </div>
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             Dashboard
//           </div>
//         </div>
        
//         <div className="p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboardLayout;
import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
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

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/listings', icon: Package, label: 'My Listings' },
    { path: '/dashboard/upload', icon: Upload, label: 'Upload Product' },
    { path: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
    { path: '/dashboard/sales', icon: DollarSign, label: 'My Sales' },
    { path: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { path: '/dashboard/premium', icon: Crown, label: 'Premium' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent">
          NexoElite
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-brand-orange text-white"
        >
          <Menu className="h-5 w-5" />
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
                NexoElite
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mx-2 rounded-lg transition ${
                      isActive
                        ? 'bg-brand-orange text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{item.label}</span>
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
              NexoElite
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
              className={({ isActive }) =>
                `flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 mx-2 rounded-lg transition ${
                  isActive
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
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

      {/* Main Content - With padding for mobile header */}
      <main className={`lg:flex-1 lg:ml-${sidebarOpen ? '64' : '20'} min-h-screen pt-14 lg:pt-0`}>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;

