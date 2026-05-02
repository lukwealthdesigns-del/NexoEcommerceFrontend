
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
// import { ordersService } from '../../services/orders';
// import { formatCurrency, formatDate } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const loadOrders = async () => {
//     try {
//       const data = await ordersService.getMyOrders();
//       setOrders(data);
//     } catch (error) {
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'delivered':
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'shipped':
//         return <Truck className="h-5 w-5 text-blue-500" />;
//       case 'processing':
//         return <Clock className="h-5 w-5 text-yellow-500" />;
//       case 'cancelled':
//         return <XCircle className="h-5 w-5 text-red-500" />;
//       default:
//         return <Package className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'delivered':
//         return 'bg-green-100 text-green-700';
//       case 'shipped':
//         return 'bg-blue-100 text-blue-700';
//       case 'processing':
//         return 'bg-yellow-100 text-yellow-700';
//       case 'cancelled':
//         return 'bg-red-100 text-red-700';
//       default:
//         return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const filteredOrders = filter === 'all' 
//     ? orders 
//     : orders.filter(order => order.status === filter);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
//         </div>

//         {/* Filters */}
//         <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
//           {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
//             <button
//               key={status}
//               onClick={() => setFilter(status)}
//               className={`px-4 py-2 rounded-lg capitalize transition ${
//                 filter === status
//                   ? 'bg-brand-orange text-white'
//                   : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
//               }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>

//         {filteredOrders.length === 0 ? (
//           <div className="text-center py-16">
//             <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet</p>
//             <Link to="/shop" className="btn-primary inline-block">
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {formatDate(order.created_at)}</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
//                       {getStatusIcon(order.status)}
//                       <span className="capitalize">{order.status}</span>
//                     </span>
//                     <Link
//                       to={`/orders/${order.id}`}
//                       className="flex items-center space-x-1 text-brand-orange hover:underline"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span>View Details</span>
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="p-4">
//                   {order.items?.map((item, index) => (
//                     <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
//                       <img
//                         src={item.product_image || '/placeholder.jpg'}
//                         alt={item.product_title}
//                         className="w-16 h-16 object-cover rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <Link to={`/product/${item.product_id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange">
//                           {item.product_title}
//                         </Link>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Total: {formatCurrency(item.price * item.quantity)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Footer */}
//                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Total Items: {order.total_items}</p>
//                     {order.tracking_number && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Tracking: {order.tracking_number}</p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
//                     <p className="text-2xl font-bold text-brand-orange">{formatCurrency(order.total_amount)}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserOrders;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ordersService } from '../../services/orders';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersService.getMyOrders();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Safe filtering
  const getFilteredOrders = () => {
    if (!Array.isArray(orders)) return [];
    if (filter === 'all') return orders;
    return orders.filter(order => order && order.status === filter);
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                filter === status
                  ? 'bg-brand-orange text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet</p>
            <Link to="/shop" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id || Math.random()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id || 'N/A'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {formatDate(order.created_at) || 'Unknown date'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status || 'pending'}</span>
                    </span>
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center space-x-1 text-brand-orange hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <img
                          src={item.product_image || '/placeholder.jpg'}
                          alt={item.product_title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${item.product_id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange">
                            {item.product_title}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total: {formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4 text-center">No items found</p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Items: {order.total_items || (order.items?.length) || 0}
                    </p>
                    {order.tracking_number && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tracking: {order.tracking_number}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
                    <p className="text-2xl font-bold text-brand-orange">
                      {formatCurrency(order.total_amount || order.total_price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;