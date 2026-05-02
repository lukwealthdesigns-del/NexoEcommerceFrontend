

// import React, { useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { useThemeStore } from './store/themeStore';
// import { useAuthStore } from './store/authStore';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import RootLayout from './components/layout/RootLayout';
// import AuthLayout from './components/layout/AuthLayout';
// import AdminLayout from './components/layout/AdminLayout';
// import UserDashboardLayout from './components/layout/UserDashboardLayout';

// // Public Pages
// import LandingPage from './pages/public/LandingPage';
// import AboutUs from './pages/public/AboutUs';
// import ContactUs from './pages/public/ContactUs';
// import ShopPage from './pages/public/ShopPage';
// import ProductDetailPage from './pages/public/ProductDetailPage';
// import CategoryPage from './pages/public/CategoryPage';
// import CartPage from './pages/public/CartPage';
// import CheckoutPage from './pages/public/CheckoutPage';
// import OrderConfirmation from './pages/public/OrderConfirmation';
// import PublicProfilePage from './pages/public/PublicProfilePage';

// // Auth Pages
// import SignUp from './pages/auth/SignUp';
// import SignIn from './pages/auth/SignIn';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import VerifyResetOTP from './pages/auth/VerifyResetOTP';
// import ResetPassword from './pages/auth/ResetPassword';
// import VerifyOTP from './pages/auth/VerifyOTP';

// // User Pages
// import UserDashboard from './pages/user/UserDashboard';
// import UserListings from './pages/user/UserListings';
// import UserMessages from './pages/user/UserMessages';
// import UserOrders from './pages/user/UserOrders';
// import UserPremium from './pages/user/UserPremium';
// import UserProfile from './pages/user/UserProfile';
// import UserSales from './pages/user/UserSales';
// import UserSettings from './pages/user/UserSettings';
// import UserWishlist from './pages/user/UserWishlist';
// import UserUploadProduct from './pages/user/UserUploadProduct';
// import UserNotifications from './pages/user/UserNotifications';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminAuditLogs from './pages/admin/AdminAuditLogs';
// import AdminOrders from './pages/admin/AdminOrders';
// import AdminPremium from './pages/admin/AdminPremium';
// import AdminProducts from './pages/admin/AdminProducts';
// import AdminReviews from './pages/admin/AdminReviews';
// import AdminSettings from './pages/admin/AdminSettings';
// import AdminUsers from './pages/admin/AdminUsers';
// import AdminAnalytics from './pages/admin/AdminAnalytics';
// import AdminAdmins from './pages/admin/AdminAdmins';
// import AdminMessages from './pages/admin/AdminMessages';
// import AdminNotifications from './pages/admin/AdminNotifications';
// import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
// import SuperAdminSettings from './pages/admin/SuperAdminSettings';

// // Common Components
// import AIChatWidget from './components/common/AIChatWidget';
// import ScrollToTop from './components/common/ScrollToTop';
// import AdminPopup from './components/common/AdminPopup';
// import AdsCarousel from './components/common/AdsCarousel';

// function App() {
//   const { darkMode } = useThemeStore();
//   const { fetchCurrentUser, isLoading } = useAuthStore();

//   // Apply dark/light theme
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   // Check if user has an active session on app load
//   useEffect(() => {
//     fetchCurrentUser();
//   }, [fetchCurrentUser]);

//   // Block rendering until auth state is known
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#1A1A2E',
//             color: '#FFF5EF',
//             borderRadius: '12px',
//             border: '1px solid #E8621A',
//           },
//           success: {
//             duration: 3000,
//             iconTheme: {
//               primary: '#E8621A',
//               secondary: '#FFF5EF',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#ef4444',
//               secondary: '#FFF5EF',
//             },
//           },
//         }}
//       />

//       <Routes>
//         {/* PUBLIC ROUTES */}
//         <Route element={<RootLayout />}>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/shop" element={<ShopPage />} />
//           <Route path="/product/:id" element={<ProductDetailPage />} />
//           <Route path="/category/:category" element={<CategoryPage />} />
//           <Route path="/about" element={<AboutUs />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/checkout" element={<CheckoutPage />} />
//           <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
//           <Route path="/profile/:userId" element={<PublicProfilePage />} />
//         </Route>

//         {/* AUTH ROUTES */}
//         <Route element={<AuthLayout />}>
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/verify-otp" element={<VerifyOTP />} />
//         </Route>

//         {/* USER DASHBOARD ROUTES */}
//         <Route
//           element={
//             <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
//               <UserDashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/dashboard" element={<UserDashboard />} />
//           <Route path="/dashboard/listings" element={<UserListings />} />
//           <Route path="/dashboard/upload" element={<UserUploadProduct />} />
//           <Route path="/dashboard/notifications" element={<UserNotifications />} />
//           <Route path="/dashboard/messages" element={<UserMessages />} />
//           <Route path="/dashboard/orders" element={<UserOrders />} />
//           <Route path="/dashboard/premium" element={<UserPremium />} />
//           <Route path="/dashboard/profile" element={<UserProfile />} />
//           <Route path="/dashboard/sales" element={<UserSales />} />
//           <Route path="/dashboard/settings" element={<UserSettings />} />
//           <Route path="/dashboard/wishlist" element={<UserWishlist />} />
//         </Route>

//         {/* ADMIN ROUTES */}
//         <Route
//           element={
//             <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/admin/users" element={<AdminUsers />} />
//           <Route path="/admin/products" element={<AdminProducts />} />
//           <Route path="/admin/orders" element={<AdminOrders />} />
//           <Route path="/admin/reviews" element={<AdminReviews />} />
//           <Route path="/admin/premium" element={<AdminPremium />} />
//           <Route path="/admin/analytics" element={<AdminAnalytics />} />
//           <Route path="/admin/admins" element={<AdminAdmins />} />
//           <Route path="/admin/messages" element={<AdminMessages />} />
//           <Route path="/admin/notifications" element={<AdminNotifications />} />
//           <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
//           <Route path="/admin/settings" element={<AdminSettings />} />
//         </Route>

//         {/* SUPER ADMIN ROUTES */}
//         <Route
//           element={
//             <ProtectedRoute allowedRoles={['super_admin']}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
//           <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
//         </Route>

//         {/* CATCH ALL */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       {/* Ads Carousel - Middle of the page (between content and global widgets) */}
//       <AdsCarousel />

//       {/* GLOBAL COMPONENTS */}
//       <AIChatWidget />
//       <AdminPopup />
//       <ScrollToTop />
//     </>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import RootLayout from './components/layout/RootLayout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';
import UserDashboardLayout from './components/layout/UserDashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import ShopPage from './pages/public/ShopPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CategoryPage from './pages/public/CategoryPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderConfirmation from './pages/public/OrderConfirmation';
import PublicProfilePage from './pages/public/PublicProfilePage';

// Auth Pages
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyResetOTP from './pages/auth/VerifyResetOTP';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserListings from './pages/user/UserListings';
import UserMessages from './pages/user/UserMessages';
import UserOrders from './pages/user/UserOrders';
import UserPremium from './pages/user/UserPremium';
import UserProfile from './pages/user/UserProfile';
import UserSales from './pages/user/UserSales';
import UserSettings from './pages/user/UserSettings';
import UserWishlist from './pages/user/UserWishlist';
import UserUploadProduct from './pages/user/UserUploadProduct';
import UserNotifications from './pages/user/UserNotifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPremium from './pages/admin/AdminPremium';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAdmins from './pages/admin/AdminAdmins';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNotifications from './pages/admin/AdminNotifications';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import SuperAdminSettings from './pages/admin/SuperAdminSettings';

// Common Components
import AIChatWidget from './components/common/AIChatWidget';
import ScrollToTop from './components/common/ScrollToTop';
import AdminPopup from './components/common/AdminPopup';
import AdsCarousel from './components/common/AdsCarousel';

function App() {
  const { darkMode } = useThemeStore();
  const { fetchCurrentUser, isLoading } = useAuthStore();

  // Apply dark/light theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check if user has an active session on app load
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Block rendering until auth state is known
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A2E',
            color: '#FFF5EF',
            borderRadius: '12px',
            border: '1px solid #E8621A',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#E8621A',
              secondary: '#FFF5EF',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#FFF5EF',
            },
          },
        }}
      />

      <Routes>
        {/* PUBLIC ROUTES - Wrap with layout that includes AdsCarousel */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Route>

        {/* USER DASHBOARD ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/listings" element={<UserListings />} />
          <Route path="/dashboard/upload" element={<UserUploadProduct />} />
          <Route path="/dashboard/notifications" element={<UserNotifications />} />
          <Route path="/dashboard/messages" element={<UserMessages />} />
          <Route path="/dashboard/orders" element={<UserOrders />} />
          <Route path="/dashboard/premium" element={<UserPremium />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/sales" element={<UserSales />} />
          <Route path="/dashboard/settings" element={<UserSettings />} />
          <Route path="/dashboard/wishlist" element={<UserWishlist />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/premium" element={<AdminPremium />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/admins" element={<AdminAdmins />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* SUPER ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* GLOBAL COMPONENTS - These render on every page */}
      <AdsCarousel />
      <AIChatWidget />
      <AdminPopup />
      <ScrollToTop />
    </>
  );
}

export default App;