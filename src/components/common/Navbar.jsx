

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Bell, 
  MessageCircle, 
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { useNotificationStore } from '../../store/notificationStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();
  const { totalItems, setTotalItems, clearCart } = useCartStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { unreadCount, clearNotifications } = useNotificationStore();
  const navigate = useNavigate();

  // Load cart count from API
  const loadCartCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/cart');
      const items = Array.isArray(response.data) ? response.data : [];
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setTotalItems(total);
    } catch (error) {
      console.error('Failed to load cart count:', error);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [isAuthenticated]);

  const handleLogout = () => {
    // Clear all local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pending_verification_email');
    localStorage.removeItem('reset_password_email');
    
    // Clear stores
    logoutStore();
    clearCart();
    clearNotifications();
    setTotalItems(0);
    
    // Close dropdowns
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to home page
    navigate('/');
  };

  // Get avatar URL with full path
  const getAvatarUrl = () => {
    if (user?.avatar_url) {
      if (user.avatar_url.startsWith('http')) {
        return user.avatar_url;
      }
      return `http://localhost:8080${user.avatar_url}`;
    }
    return null;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsUserDropdownOpen(false)}>
            <ShoppingBag className="h-8 w-8 text-brand-orange" />
            <span className="text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Nexo</span>
              <span className="text-brand-orange">Leolite</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-gray-700 dark:text-gray-300 hover:text-brand-orange transition">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-brand-orange transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-brand-orange transition">
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Dark Mode Toggle - visible on all screens */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart Icon - ALWAYS VISIBLE on all screens */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-orange rounded-full text-xs text-white flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Desktop only items */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* Premium Link */}
                  <Link
                    to="/dashboard/premium"
                    className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-600 transition px-2"
                  >
                    <Crown className="h-5 w-5" />
                    <span className="text-sm font-medium hidden lg:inline">Premium</span>
                  </Link>

                  {/* Post Product Button */}
                  <Link
                    to="/dashboard/upload"
                    className="flex items-center space-x-2 bg-brand-orange text-white px-3 py-2 rounded-lg hover:bg-opacity-90 transition"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Sell</span>
                  </Link>

                  {/* Notifications */}
                  <Link to="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link to="/dashboard/messages" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MessageCircle className="h-5 w-5" />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                    >
                      {getAvatarUrl() ? (
                        <img 
                          src={getAvatarUrl()} 
                          alt="Avatar" 
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32?text=User';
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-semibold">
                          {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                        </div>
                      )}
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                          {user?.is_premium && (
                            <span className="inline-flex items-center space-x-1 mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                              <Crown className="h-3 w-3" />
                              <span>Premium</span>
                            </span>
                          )}
                          {user?.role !== 'user' && (
                            <span className="inline-flex items-center space-x-1 mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              <Shield className="h-3 w-3" />
                              <span className="capitalize">{user?.role}</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Dashboard Links */}
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          to="/dashboard/wishlist"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          <span>Wishlist</span>
                        </Link>
                        
                        <Link
                          to="/dashboard/orders"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>Orders</span>
                        </Link>
                        
                        <Link
                          to="/dashboard/sales"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>My Sales</span>
                        </Link>
                        
                        <Link
                          to="/dashboard/premium"
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-yellow-600"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Crown className="h-4 w-4" />
                          <span>Premium</span>
                        </Link>
                        
                        {/* Admin Links */}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-purple-600"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Shield className="h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        
                        {user?.role === 'super_admin' && (
                          <Link
                            to="/super-admin/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-purple-600"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Shield className="h-4 w-4" />
                            <span>Super Admin Panel</span>
                          </Link>
                        )}
                        
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-brand-orange">
                    Sign In
                  </Link>
                  <Link to="/signup" className="bg-brand-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-3">
            <Link to="/shop" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <hr className="border-gray-200 dark:border-gray-800" />
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/premium" className="block text-yellow-500 py-2" onClick={() => setIsMenuOpen(false)}>⭐ Premium</Link>
                <Link to="/dashboard/upload" className="block text-brand-orange py-2" onClick={() => setIsMenuOpen(false)}>Sell Product</Link>
                <Link to="/dashboard" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/dashboard/profile" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/dashboard/wishlist" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                <Link to="/dashboard/orders" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                <Link to="/dashboard/sales" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>My Sales</Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-purple-600 py-2" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                
                {user?.role === 'super_admin' && (
                  <Link to="/super-admin/dashboard" className="block text-purple-600 py-2" onClick={() => setIsMenuOpen(false)}>
                    Super Admin Panel
                  </Link>
                )}
                
                <button onClick={handleLogout} className="block w-full text-left text-red-600 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="block text-gray-700 dark:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="block bg-brand-orange text-white text-center py-2 rounded-lg" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;