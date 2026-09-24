



// // src/pages/admin/AdminProducts.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Eye, 
//   CheckCircle, 
//   XCircle, 
//   Clock, 
//   RefreshCw,
//   Image,
//   DollarSign,
//   User,
//   Tag,
//   Filter,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { formatDate, formatCurrency } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// // Helper function to get full image URL
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
//   if (imagePath.startsWith('http')) return imagePath;
//   if (imagePath.startsWith('data:')) return imagePath;
//   return `http://localhost:8080${imagePath}`;
// };

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('pending');
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [stats, setStats] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     total: 0,
//   });

//   const itemsPerPage = 10;

//   useEffect(() => {
//     loadProducts();
//   }, [currentPage, filter]);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const data = await adminService.getAllProducts({ 
//         page: currentPage, 
//         limit: itemsPerPage,
//         status: filter !== 'all' ? filter : undefined
//       });
      
//       const productsList = data.products || data.data || [];
//       setProducts(productsList);
//       setTotalPages(Math.ceil((data.total || productsList.length) / itemsPerPage));
      
//       setStats({
//         pending: productsList.filter(p => p.status === 'pending').length,
//         approved: productsList.filter(p => p.status === 'approved').length,
//         rejected: productsList.filter(p => p.status === 'rejected').length,
//         total: productsList.length,
//       });
//     } catch (error) {
//       console.error('Failed to load products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveProduct = async (product) => {
//     if (!confirm(`Approve "${product.title}"?`)) return;
    
//     try {
//       await adminService.approveProduct(product.id);
//       toast.success(`${product.title} has been approved`);
//       loadProducts();
//     } catch (error) {
//       toast.error('Failed to approve product');
//     }
//   };

//   const handleRejectProduct = async () => {
//     if (!selectedProduct) return;
    
//     try {
//       await adminService.rejectProduct(selectedProduct.id, rejectReason);
//       toast.success(`${selectedProduct.title} has been rejected`);
//       setShowRejectModal(false);
//       setRejectReason('');
//       setSelectedProduct(null);
//       loadProducts();
//     } catch (error) {
//       toast.error('Failed to reject product');
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case 'approved':
//         return (
//           <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Approved
//           </span>
//         );
//       case 'rejected':
//         return (
//           <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
//             <XCircle className="h-3 w-3 mr-1" />
//             Rejected
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </span>
//         );
//     }
//   };

//   const statCards = [
//     { title: 'Pending Approval', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
//     { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500' },
//     { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500' },
//     { title: 'Total Products', value: stats.total, icon: Tag, color: 'bg-blue-500' },
//   ];

//   const filteredProducts = products.filter(product => 
//     product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (product.seller_name || product.seller?.username || '')?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Approve or reject product listings</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {statCards.map((stat, index) => (
//             <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
//                 </div>
//                 <div className={`${stat.color} p-3 rounded-xl`}>
//                   <stat.icon className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by product name, category or seller..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               />
//             </div>
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//             >
//               <option value="pending">Pending Approval</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//               <option value="all">All Products</option>
//             </select>
//             <button
//               onClick={() => loadProducts()}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
//             >
//               <RefreshCw className="h-4 w-4" />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Products Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Seller</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Submitted</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProducts.map((product) => {
//                   // Get the correct image URL
//                   const imageUrl = product.images && product.images[0] ? getImageUrl(product.images[0]) : null;
//                   // Get seller name
//                   const sellerName = product.seller_name || product.seller?.username || product.seller?.name || 'Unknown Seller';
                  
//                   return (
//                     <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
//                       <td className="py-4 px-6">
//                         <div className="flex items-center space-x-3">
//                           {imageUrl ? (
//                             <img 
//                               src={imageUrl}
//                               alt={product.title}
//                               className="w-12 h-12 rounded-lg object-cover"
//                               onError={(e) => {
//                                 e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
//                               }}
//                             />
//                           ) : (
//                             <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//                               <Image className="h-6 w-6 text-gray-400" />
//                             </div>
//                           )}
//                           <div>
//                             <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">{product.description?.substring(0, 60)}...</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                           {formatCurrency(product.price / 100)}
//                         </span>
//                        </td>
//                       <td className="py-4 px-6">
//                         <div className="flex items-center space-x-2">
//                           <User className="h-4 w-4 text-gray-400" />
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             {sellerName}
//                           </span>
//                         </div>
//                        </td>
//                       <td className="py-4 px-6">
//                         <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
//                           {product.category}
//                         </span>
//                        </td>
//                       <td className="py-4 px-6">
//                         <span className="text-sm text-gray-500 dark:text-gray-400">
//                           {formatDate(product.created_at)}
//                         </span>
//                        </td>
//                       <td className="py-4 px-6">
//                         {getStatusBadge(product.status)}
//                        </td>
//                       <td className="py-4 px-6">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => {
//                               setSelectedProduct(product);
//                               setShowProductModal(true);
//                             }}
//                             className="p-1.5 text-blue-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
//                             title="View Details"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           {product.status === 'pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleApproveProduct(product)}
//                                 className="p-1.5 text-green-500 hover:text-green-600 rounded-lg hover:bg-green-50"
//                                 title="Approve"
//                               >
//                                 <CheckCircle className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedProduct(product);
//                                   setShowRejectModal(true);
//                                 }}
//                                 className="p-1.5 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50"
//                                 title="Reject"
//                               >
//                                 <XCircle className="h-4 w-4" />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                        </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredProducts.length === 0 && (
//             <div className="text-center py-12">
//               <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500 dark:text-gray-400">No products found</p>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center space-x-2 py-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </button>
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Product Details Modal */}
//       {showProductModal && selectedProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Details</h2>
//               <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-gray-700">
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {/* Product Images */}
//               {selectedProduct.images && selectedProduct.images.length > 0 && (
//                 <div className="flex space-x-2 overflow-x-auto">
//                   {selectedProduct.images.map((img, idx) => (
//                     <img 
//                       key={idx} 
//                       src={getImageUrl(img)} 
//                       alt="" 
//                       className="w-24 h-24 rounded-lg object-cover"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
              
//               {/* Product Info */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProduct.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedProduct.description}</p>
//               </div>
              
//               {/* Seller Info in Modal */}
//               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Seller Information</p>
//                 <div className="flex items-center space-x-2 mt-1">
//                   <User className="h-4 w-4 text-brand-orange" />
//                   <span className="text-gray-900 dark:text-white font-medium">
//                     {selectedProduct.seller_name || selectedProduct.seller?.username || 'Unknown Seller'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
//                   <p className="text-lg font-bold text-brand-orange">{formatCurrency(selectedProduct.price / 100)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
//                   <p>{selectedProduct.category}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
//                   <p>{selectedProduct.condition || 'New'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
//                   <p>{selectedProduct.stock_qty || 0} units</p>
//                 </div>
//               </div>
              
//               {selectedProduct.status === 'pending' && (
//                 <div className="flex space-x-3 pt-4">
//                   <button
//                     onClick={() => {
//                       handleApproveProduct(selectedProduct);
//                       setShowProductModal(false);
//                     }}
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
//                   >
//                     Approve Product
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowProductModal(false);
//                       setSelectedProduct(selectedProduct);
//                       setShowRejectModal(true);
//                     }}
//                     className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
//                   >
//                     Reject Product
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reject Modal */}
//       {showRejectModal && selectedProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Product</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">
//               Reject "{selectedProduct.title}"?
//             </p>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Reason (Optional)
//               </label>
//               <textarea
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 rows="3"
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                 placeholder="Enter reason for rejection..."
//               />
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 border rounded-xl">
//                 Cancel
//               </button>
//               <button onClick={handleRejectProduct} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl">
//                 Reject Product
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProducts;
// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Image,
  DollarSign,
  User,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { formatDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath;
  return `http://localhost:8080${imagePath}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadProducts();
  }, [currentPage, filter]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllProducts({ 
        page: currentPage, 
        limit: itemsPerPage,
        status: filter !== 'all' ? filter : undefined
      });
      
      const productsList = data.products || data.data || [];
      setProducts(productsList);
      setTotalPages(data.total_pages || Math.ceil((data.total || productsList.length) / itemsPerPage));
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // FIX: real counts across ALL products, not just whatever happens to be
  // on the current page. This is what the top stat cards should reflect —
  // they used to be derived from `productsList`, which only ever held up
  // to 10 items, so the numbers were wrong/misleadingly "not live".
  const loadStats = async () => {
    try {
      const data = await adminService.getProductStats();
      setStats({
        pending: data.pending || 0,
        approved: data.approved || 0,
        rejected: data.rejected || 0,
        total: data.total || 0,
      });
    } catch (error) {
      console.error('Failed to load product stats:', error);
    }
  };

  const handleApproveProduct = async (product) => {
    if (!confirm(`Approve "${product.title}"?`)) return;
    
    try {
      await adminService.approveProduct(product.id);
      toast.success(`${product.title} has been approved`);
      loadProducts();
      loadStats();
    } catch (error) {
      toast.error('Failed to approve product');
    }
  };

  const handleRejectProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await adminService.rejectProduct(selectedProduct.id, rejectReason);
      toast.success(`${selectedProduct.title} has been rejected`);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedProduct(null);
      loadProducts();
      loadStats();
    } catch (error) {
      toast.error('Failed to reject product');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const statCards = [
    { title: 'Pending Approval', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
    { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500' },
    { title: 'Total Products', value: stats.total, icon: Tag, color: 'bg-blue-500' },
  ];

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.seller_name || product.seller?.username || '')?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Approve or reject product listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, category or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Products</option>
            </select>
            <button
              onClick={() => { loadProducts(); loadStats(); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Seller</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Submitted</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  // Get the correct image URL
                  const imageUrl = product.images && product.images[0] ? getImageUrl(product.images[0]) : null;
                  // Get seller name
                  const sellerName = product.seller_name || product.seller?.username || product.seller?.name || 'Unknown Seller';
                  
                  return (
                    <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {imageUrl ? (
                            <img 
                              src={imageUrl}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.description?.substring(0, 60)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(product.price / 100)}
                        </span>
                       </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {sellerName}
                          </span>
                        </div>
                       </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                          {product.category}
                        </span>
                       </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(product.created_at)}
                        </span>
                       </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(product.status)}
                       </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductModal(true);
                            }}
                            className="p-1.5 text-blue-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveProduct(product)}
                                className="p-1.5 text-green-500 hover:text-green-600 rounded-lg hover:bg-green-50"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowRejectModal(true);
                                }}
                                className="p-1.5 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Details</h2>
              <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {selectedProduct.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={getImageUrl(img)} 
                      alt="" 
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Product Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProduct.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedProduct.description}</p>
              </div>
              
              {/* Seller Info in Modal */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Seller Information</p>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-brand-orange" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedProduct.seller_name || selectedProduct.seller?.username || 'Unknown Seller'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg font-bold text-brand-orange">{formatCurrency(selectedProduct.price / 100)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                  <p>{selectedProduct.condition || 'New'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                  <p>{selectedProduct.stock_qty || 0} units</p>
                </div>
              </div>
              
              {selectedProduct.status === 'pending' && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleApproveProduct(selectedProduct);
                      setShowProductModal(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
                  >
                    Approve Product
                  </button>
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setSelectedProduct(selectedProduct);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                  >
                    Reject Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Product</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Reject "{selectedProduct.title}"?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 border rounded-xl">
                Cancel
              </button>
              <button onClick={handleRejectProduct} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                Reject Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;