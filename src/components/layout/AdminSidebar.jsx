// src/components/layout/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Star, 
  Crown, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Shield,
  FileText,
  AlertCircle,
  MessageCircle,
  Bell,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services/admin';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [pendingCount, setPendingCount] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    
    const fetchPendingCount = async () => {
      try {
        const data = await adminService.getPendingProducts();
        setPendingCount(data.products?.length || data.total || 0);
      } catch (error) {
        console.error('Failed to fetch pending count:', error);
      }
    };
    fetchPendingCount();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/signin';
  };

  // Menu items based on role
  const getMenuItems = () => {
    const items = [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/users', icon: Users, label: 'Users' },
      { path: '/admin/products', icon: Package, label: 'Products', badge: pendingCount },
      { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
      { path: '/admin/reviews', icon: Star, label: 'Reviews' },
      { path: '/admin/premium', icon: Crown, label: 'Premium' },
      { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ];
    
    // Only show Admins menu for super_admin
    if (userRole === 'super_admin') {
      items.push({ path: '/admin/admins', icon: Shield, label: 'Admins' });
    }
    
    items.push(
      { path: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
      { path: '/admin/messages', icon: MessageCircle, label: 'Messages' },
      { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
      { path: '/admin/settings', icon: Settings, label: 'Settings' }
    );
    
    return items;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col h-full`}>
      {/* Logo */}
      <div className={`h-16 flex items-center ${isOpen ? 'px-6' : 'justify-center'} border-b border-gray-800`}>
        {isOpen ? (
          <Link to="/admin" className="text-xl font-bold">
            Nexo<span className="text-brand-orange">Leolite</span>
            <span className="text-xs text-gray-400 block">Admin Panel</span>
          </Link>
        ) : (
          <Link to="/admin" className="text-xl font-bold text-brand-orange">N</Link>
        )}
      </div>

      {/* User Info (when sidebar is open) */}
      {isOpen && (
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold">
              {JSON.parse(localStorage.getItem('user') || '{}')?.first_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {JSON.parse(localStorage.getItem('user') || '{}')?.first_name} {JSON.parse(localStorage.getItem('user') || '{}')?.last_name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userRole === 'super_admin' ? 'Super Administrator' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center'} py-3 hover:bg-gray-800 transition-colors relative ${
              isActive(item.path) ? 'bg-gray-800 border-l-4 border-brand-orange' : ''
            }`}
            title={!isOpen ? item.label : ''}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && (
              <>
                <span className="ml-3 text-sm">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {!isOpen && item.badge > 0 && (
              <span className="absolute top-1 right-2 bg-yellow-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 py-4">
        <button
          onClick={toggleSidebar}
          className={`flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center'} w-full py-2 hover:bg-gray-800 transition-colors`}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          {isOpen && <span className="ml-3 text-sm">Collapse</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center ${isOpen ? 'justify-start px-6' : 'justify-center'} w-full py-2 mt-2 hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300`}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-3 text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;