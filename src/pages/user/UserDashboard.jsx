
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Package, ShoppingBag, Heart, MessageCircle, TrendingUp, 
//   DollarSign, Star, Eye, Camera, ChevronRight, 
//   Users, Clock, CheckCircle, Settings, LogOut,
//   Crown, Zap, Rocket, Gem, Grid, Bookmark, Home, Upload
// } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import { productsService } from '../../services/products';
// import { ordersService } from '../../services/orders';
// import { formatCurrency, formatRelativeTime, formatNumber } from '../../utils/formatters';

// const UserDashboard = () => {
//   const { user, logout } = useAuthStore();
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     totalEarnings: 0,
//     totalFollowers: 0,
//     totalFollowing: 0,
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [recentProducts, setRecentProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
//   const [productsGrid, setProductsGrid] = useState([]);
//   const [imageErrors, setImageErrors] = useState({});

//   useEffect(() => {
//     loadDashboardData();
//     loadProductsGrid();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       const [orders, products, earnings] = await Promise.all([
//         ordersService.getMyOrders({ limit: 5 }),
//         productsService.getProducts({ seller_id: user?.id, limit: 6 }),
//         ordersService.getSellerEarnings(),
//       ]);
      
//       setRecentOrders(orders.data || []);
//       setRecentProducts(products.data || []);
//       setStats({
//         totalProducts: products.total || 0,
//         totalOrders: orders.total || 0,
//         totalSales: earnings.total_sales || 0,
//         totalEarnings: earnings.total_earnings || 0,
//         totalFollowers: user?.followers_count || 0,
//         totalFollowing: user?.following_count || 0,
//       });
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadProductsGrid = async () => {
//     try {
//       const data = await productsService.getMyProducts();
//       const allProducts = [
//         ...(data.approved || []),
//         ...(data.pending || []),
//         ...(data.rejected || [])
//       ];
//       console.log('Loaded products for dashboard:', allProducts);
//       setProductsGrid(allProducts);
//     } catch (error) {
//       console.error('Failed to load products:', error);
//       setProductsGrid([]);
//     }
//   };

//   const handleImageError = (productId) => {
//     if (!imageErrors[productId]) {
//       setImageErrors(prev => ({ ...prev, [productId]: true }));
//     }
//   };

//   const menuItems = [
//     { icon: Package, label: 'My Products', count: stats.totalProducts, path: '/listings', color: 'bg-blue-500' },
//     { icon: ShoppingBag, label: 'Orders', count: stats.totalOrders, path: '/orders', color: 'bg-green-500' },
//     { icon: Heart, label: 'Wishlist', count: 0, path: '/wishlist', color: 'bg-red-500' },
//     { icon: MessageCircle, label: 'Messages', count: 0, path: '/messages', color: 'bg-purple-500' },
//     { icon: DollarSign, label: 'Earnings', count: stats.totalEarnings, path: '/earnings', color: 'bg-yellow-500', isCurrency: true },
//     { icon: TrendingUp, label: 'Sales', count: stats.totalSales, path: '/sales', color: 'bg-orange-500' },
//   ];

//   const quickActions = [
//     { icon: Camera, label: 'Add Product', path: '/upload', color: 'bg-brand-orange' },
//     { icon: ShoppingBag, label: 'Shop Now', path: '/shop', color: 'bg-blue-500' },
//     { icon: Home, label: 'Home', path: '/', color: 'bg-purple-500' },
//     { icon: Settings, label: 'Settings', path: '/settings', color: 'bg-gray-500' },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 pb-20 lg:pb-0">
//       {/* Header Tabs */}
//       <div className="sticky top-0 lg:top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
//           <div className="flex items-center justify-between h-12 sm:h-14">
//             <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide">
//               <Link 
//                 to="/" 
//                 className="flex items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-brand-orange transition text-xs sm:text-sm"
//               >
//                 <Home className="h-3 w-3 sm:h-4 sm:w-4" />
//                 <span className="hidden xs:inline">Home</span>
//               </Link>
              
//               <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
//                   activeTab === 'overview' 
//                     ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
//                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
//                   activeTab === 'products' 
//                     ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
//                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//                 }`}
//               >
//                 Products
//               </button>
//               <button
//                 onClick={() => setActiveTab('orders')}
//                 className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
//                   activeTab === 'orders' 
//                     ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
//                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//                 }`}
//               >
//                 Orders
//               </button>
//             </div>
            
//             <Link 
//               to="/shop" 
//               className="hidden sm:flex items-center gap-2 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition"
//             >
//               <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
//               Shop Now
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
//         {/* Profile Header */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
//             <div className="relative">
//               <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 p-0.5">
//                 {user?.avatar_url ? (
//                   <img 
//                     src={`http://localhost:8080${user.avatar_url}`} 
//                     alt="Profile" 
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl sm:text-3xl font-bold text-brand-orange">
//                     {user?.first_name?.[0] || user?.username?.[0] || 'U'}
//                   </div>
//                 )}
//               </div>
//               <Link 
//                 to="/profile" 
//                 className="absolute bottom-0 right-0 bg-brand-orange text-white p-1 rounded-full shadow-md"
//               >
//                 <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
//               </Link>
//             </div>
            
//             <div className="flex-1 text-center sm:text-left">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                 <div>
//                   <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
//                     {user?.first_name} {user?.last_name}
//                   </h1>
//                   <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
//                 </div>
//                 {user?.is_premium && (
//                   <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm self-center sm:self-auto">
//                     <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
//                     <span>Premium</span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 mt-3 sm:mt-4">
//                 <div className="text-center">
//                   <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalFollowers}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalFollowing}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Premium Benefits Banner */}
//         {user?.is_premium && (
//           <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-2xl p-5 mb-6 border border-yellow-500/30">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
//                   <Rocket className="h-6 w-6 text-yellow-500" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-white text-lg">Premium Member Benefits</h3>
//                   <p className="text-gray-400 text-sm">You can boost your products to appear as ads across the platform</p>
//                 </div>
//               </div>
//               <Link 
//                 to="/dashboard/listings" 
//                 className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold text-sm hover:bg-yellow-400 transition flex items-center gap-2"
//               >
//                 <Zap className="h-4 w-4" />
//                 Boost Your Products
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Stats Cards Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           {menuItems.map((item, index) => (
//             <Link
//               key={index}
//               to={`/dashboard${item.path}`}
//               className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-md transition group"
//             >
//               <div className={`${item.color} w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition`}>
//                 <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
//               <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
//                 {item.isCurrency ? formatCurrency(item.count) : item.count}
//               </p>
//             </Link>
//           ))}
//         </div>

//         {/* Products Grid */}
//         {(activeTab === 'products' || activeTab === 'overview') && productsGrid.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
//             <div className="flex justify-between items-center mb-3 sm:mb-4">
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">My Products</h2>
//               <Link to="/dashboard/listings" className="text-brand-orange text-xs sm:text-sm hover:underline flex items-center">
//                 View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
//               </Link>
//             </div>
            
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
//               {productsGrid.slice(0, 6).map((product, index) => {
//                 const imagePath = product.image || product.images?.[0];
//                 let displayImage = 'https://picsum.photos/300/400';
                
//                 if (imagePath && !imageErrors[product.id]) {
//                   displayImage = `http://localhost:8080${imagePath}`;
//                 }
                
//                 return (
//                   <Link to={`/product/${product.id}`} key={`${product.id}-${index}`} className="relative aspect-[3/4] group cursor-pointer">
//                     <img 
//                       key={`img-${product.id}`}
//                       src={displayImage} 
//                       alt={product.title}
//                       className="w-full h-full object-cover rounded-lg"
//                       loading="eager"
//                       onError={() => handleImageError(product.id)}
//                     />
//                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex flex-col items-center justify-center">
//                       <div className="text-center p-2">
//                         <p className="text-white text-xs font-semibold line-clamp-2">{product.title}</p>
//                         <p className="text-brand-orange font-bold text-xs mt-1">₦{product.price?.toLocaleString()}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Recent Orders */}
//         {(activeTab === 'orders' || activeTab === 'overview') && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
//             <div className="flex justify-between items-center mb-3 sm:mb-4">
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
//               <Link to="/dashboard/orders" className="text-brand-orange text-xs sm:text-sm hover:underline flex items-center">
//                 View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
//               </Link>
//             </div>
            
//             {recentOrders.length === 0 ? (
//               <div className="text-center py-8 sm:py-12">
//                 <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No orders yet</p>
//                 <Link to="/shop" className="inline-block mt-3 sm:mt-4 bg-brand-orange text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
//                   Start Shopping
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-2 sm:space-y-3">
//                 {recentOrders.map((order) => (
//                   <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//                     <div className="flex items-center space-x-2 sm:space-x-3">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
//                         <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
//                       </div>
//                       <div>
//                         <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(order.created_at)}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm sm:text-base font-bold text-brand-orange">{formatCurrency(order.total_amount)}</p>
//                       <span className={`text-xs px-2 py-0.5 rounded-full ${
//                         order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                         order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
//                         order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
//                         'bg-gray-100 text-gray-700'
//                       }`}>
//                         {order.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Quick Actions */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
//           {quickActions.map((action, index) => (
//             <Link
//               key={index}
//               to={`/dashboard${action.path}`}
//               className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition group"
//             >
//               <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
//                 <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//               </div>
//               <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
//             </Link>
//           ))}
//         </div>

//         {/* Premium Upgrade Banner */}
//         {!user?.is_premium && (
//           <div className="mt-4 sm:mt-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
//             <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
//               <div className="flex items-center space-x-3 sm:space-x-4">
//                 <Crown className="h-8 w-8 sm:h-12 sm:w-12" />
//                 <div>
//                   <h3 className="text-base sm:text-xl font-bold">Upgrade to Premium</h3>
//                   <p className="text-white/90 text-xs sm:text-sm">Get 10x more views & premium features</p>
//                 </div>
//               </div>
//               <Link to="/dashboard/premium" className="bg-white text-orange-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 transition shadow-lg">
//                 Upgrade Now
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Floating Action Button for Mobile */}
//       <Link
//         to="/dashboard/upload"
//         className="fixed bottom-6 right-6 bg-brand-orange text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition z-50 lg:hidden"
//       >
//         <Camera className="h-5 w-5" />
//       </Link>
//     </div>
//   );
// };

// export default UserDashboard;

// src/pages/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingBag, Heart, MessageCircle, TrendingUp, 
  DollarSign, Star, Eye, Camera, ChevronRight, 
  Users, Clock, CheckCircle, Settings, LogOut,
  Crown, Zap, Rocket, Gem, Grid, Bookmark, Home, Upload
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { productsService } from '../../services/products';
import { ordersService } from '../../services/orders';
import api from '../../services/api';
import { formatCurrency, formatRelativeTime, formatNumber } from '../../utils/formatters';

const UserDashboard = () => {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalEarnings: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    totalMessages: 0,
    totalWishlist: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [productsGrid, setProductsGrid] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    loadDashboardData();
    loadProductsGrid();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats from our new endpoint
      const statsResponse = await api.get('/dashboard/stats');
      
      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalProducts: data.products || 0,
          totalOrders: data.orders || 0,
          totalSales: data.sales || 0,
          totalEarnings: data.earnings || 0,
          totalFollowers: data.followers || 0,
          totalFollowing: data.following || 0,
          totalMessages: data.messages || 0,
          totalWishlist: data.wishlist || 0,
        });
      }
      
      // Fetch recent orders
      try {
        const ordersResponse = await ordersService.getMyOrders({ limit: 5 });
        setRecentOrders(ordersResponse.data || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setRecentOrders([]);
      }
      
      // Fetch recent products
      try {
        const productsResponse = await productsService.getProducts({ seller_id: user?.id, limit: 6 });
        setRecentProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setRecentProducts([]);
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to individual API calls
      await loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = async () => {
    try {
      // Fallback: Get product count
      const products = await productsService.getMyProducts();
      const allProducts = [
        ...(products.approved || []),
        ...(products.pending || []),
        ...(products.rejected || [])
      ];
      
      // Fallback: Get order count
      const orders = await ordersService.getMyOrders({ limit: 100 });
      
      // Fallback: Get earnings
      const earnings = await ordersService.getSellerEarnings();
      
      setStats(prev => ({
        ...prev,
        totalProducts: allProducts.length,
        totalOrders: orders.total || 0,
        totalSales: earnings.total_sales || 0,
        totalEarnings: earnings.total_earnings || 0,
      }));
    } catch (error) {
      console.error('Fallback data loading failed:', error);
    }
  };

  const loadProductsGrid = async () => {
    try {
      const data = await productsService.getMyProducts();
      const allProducts = [
        ...(data.approved || []),
        ...(data.pending || []),
        ...(data.rejected || [])
      ];
      setProductsGrid(allProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProductsGrid([]);
    }
  };

  const handleImageError = (productId) => {
    if (!imageErrors[productId]) {
      setImageErrors(prev => ({ ...prev, [productId]: true }));
    }
  };

  const menuItems = [
    { icon: Package, label: 'My Products', count: stats.totalProducts, path: '/listings', color: 'bg-blue-500' },
    { icon: ShoppingBag, label: 'Orders', count: stats.totalOrders, path: '/orders', color: 'bg-green-500' },
    { icon: Heart, label: 'Wishlist', count: stats.totalWishlist, path: '/wishlist', color: 'bg-red-500' },
    { icon: MessageCircle, label: 'Messages', count: stats.totalMessages, path: '/messages', color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Earnings', count: stats.totalEarnings, path: '/earnings', color: 'bg-yellow-500', isCurrency: true },
    { icon: TrendingUp, label: 'Sales', count: stats.totalSales, path: '/sales', color: 'bg-orange-500' },
  ];

  const quickActions = [
    { icon: Camera, label: 'Add Product', path: '/upload', color: 'bg-brand-orange' },
    { icon: ShoppingBag, label: 'Shop Now', path: '/shop', color: 'bg-blue-500' },
    { icon: Home, label: 'Home', path: '/', color: 'bg-purple-500' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'bg-gray-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 pb-20 lg:pb-0">
      {/* Header Tabs */}
      <div className="sticky top-0 lg:top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide">
              <Link 
                to="/" 
                className="flex items-center gap-1 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-brand-orange transition text-xs sm:text-sm"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Home</span>
              </Link>
              
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  activeTab === 'overview' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  activeTab === 'products' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  activeTab === 'orders' 
                    ? 'text-brand-orange border-b-2 border-brand-orange pb-2 sm:pb-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </div>
            
            <Link 
              to="/shop" 
              className="hidden sm:flex items-center gap-2 bg-brand-orange text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition"
            >
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 p-0.5">
                {user?.avatar_url ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${user.avatar_url}`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl sm:text-3xl font-bold text-brand-orange">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </div>
                )}
              </div>
              <Link 
                to="/profile" 
                className="absolute bottom-0 right-0 bg-brand-orange text-white p-1 rounded-full shadow-md"
              >
                <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Link>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
                </div>
                {user?.is_premium && (
                  <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm self-center sm:self-auto">
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 mt-3 sm:mt-4">
                <div className="text-center">
                  <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalFollowers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalFollowing}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Benefits Banner */}
        {user?.is_premium && (
          <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-2xl p-5 mb-6 border border-yellow-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Premium Member Benefits</h3>
                  <p className="text-gray-400 text-sm">You can boost your products to appear as ads across the platform</p>
                </div>
              </div>
              <Link 
                to="/dashboard/listings" 
                className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold text-sm hover:bg-yellow-400 transition flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Boost Your Products
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards Grid - NOW SHOWING REAL DATA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/dashboard${item.path}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 hover:shadow-md transition group"
            >
              <div className={`${item.color} w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition`}>
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                {item.isCurrency ? formatCurrency(item.count) : formatNumber(item.count)}
              </p>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {(activeTab === 'products' || activeTab === 'overview') && productsGrid.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">My Products</h2>
              <Link to="/dashboard/listings" className="text-brand-orange text-xs sm:text-sm hover:underline flex items-center">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {productsGrid.slice(0, 6).map((product, index) => {
                const imagePath = product.image || product.images?.[0];
                let displayImage = 'https://picsum.photos/300/400';
                
                if (imagePath && !imageErrors[product.id]) {
                  displayImage = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${imagePath}`;
                }
                
                return (
                  <Link to={`/product/${product.id}`} key={`${product.id}-${index}`} className="relative aspect-[3/4] group cursor-pointer">
                    <img 
                      key={`img-${product.id}`}
                      src={displayImage} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading="eager"
                      onError={() => handleImageError(product.id)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex flex-col items-center justify-center">
                      <div className="text-center p-2">
                        <p className="text-white text-xs font-semibold line-clamp-2">{product.title}</p>
                        <p className="text-brand-orange font-bold text-xs mt-1">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {(activeTab === 'orders' || activeTab === 'overview') && (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <Link to="/dashboard/orders" className="text-brand-orange text-xs sm:text-sm hover:underline flex items-center">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No orders yet</p>
                <Link to="/shop" className="inline-block mt-3 sm:mt-4 bg-brand-orange text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Order #{order.order_number || order.id?.slice(-8)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-bold text-brand-orange">{formatCurrency(order.total_price || order.total_amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={`/dashboard${action.path}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition group"
            >
              <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Premium Upgrade Banner */}
        {!user?.is_premium && (
          <div className="mt-4 sm:mt-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Crown className="h-8 w-8 sm:h-12 sm:w-12" />
                <div>
                  <h3 className="text-base sm:text-xl font-bold">Upgrade to Premium</h3>
                  <p className="text-white/90 text-xs sm:text-sm">Get 10x more views & premium features</p>
                </div>
              </div>
              <Link to="/dashboard/premium" className="bg-white text-orange-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 transition shadow-lg">
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <Link
        to="/dashboard/upload"
        className="fixed bottom-6 right-6 bg-brand-orange text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition z-50 lg:hidden"
      >
        <Camera className="h-5 w-5" />
      </Link>
    </div>
  );
};

export default UserDashboard;
