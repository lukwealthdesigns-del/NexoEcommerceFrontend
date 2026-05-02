// import { useState, useEffect } from 'react';
// import { Search, Star, Flag, Trash2, CheckCircle } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { formatRelativeTime } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const AdminReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     loadReviews();
//   }, []);

//   const loadReviews = async () => {
//     try {
//       const data = await adminService.getAllReviews();
//       setReviews(data);
//     } catch (error) {
//       toast.error('Failed to load reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!confirm('Are you sure you want to delete this review?')) return;
//     try {
//       await adminService.deleteReview(reviewId);
//       toast.success('Review deleted successfully');
//       loadReviews();
//     } catch (error) {
//       toast.error('Failed to delete review');
//     }
//   };

//   const handleFlagReview = async (reviewId) => {
//     try {
//       await adminService.flagReview(reviewId);
//       toast.success('Review flagged for moderation');
//       loadReviews();
//     } catch (error) {
//       toast.error('Failed to flag review');
//     }
//   };

//   const filteredReviews = reviews.filter(review =>
//     review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     review.product_title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Management</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and moderate user reviews</p>
//         </div>

//         {/* Search */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search reviews by user, product or content..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input-field pl-10"
//             />
//           </div>
//         </div>

//         {/* Reviews List */}
//         <div className="space-y-4">
//           {filteredReviews.map((review) => (
//             <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex flex-wrap justify-between items-start gap-4">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white font-semibold">
//                       {review.user_name?.[0]}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white">{review.user_name}</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         on <span className="text-brand-orange">{review.product_title}</span>
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-1 mb-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
//                       />
//                     ))}
//                     {review.is_verified_purchase && (
//                       <span className="ml-2 inline-flex items-center space-x-1 text-xs text-green-600">
//                         <CheckCircle className="h-3 w-3" />
//                         <span>Verified Purchase</span>
//                       </span>
//                     )}
//                   </div>
                  
//                   <p className="text-gray-600 dark:text-gray-400">{review.content}</p>
                  
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                     {formatRelativeTime(review.created_at)}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handleFlagReview(review.id)}
//                     className="p-2 text-yellow-500 hover:text-yellow-600 rounded-lg hover:bg-yellow-50"
//                     title="Flag for review"
//                   >
//                     <Flag className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50"
//                     title="Delete review"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {filteredReviews.length === 0 && (
//             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
//               <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminReviews;

// src/pages/admin/AdminReviews.jsx
import React, { useState, useEffect } from 'react';
import { Star, Trash2, RefreshCw, Search } from 'lucide-react';
import adminService from '../../services/admin';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReviews();
  }, [currentPage]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllReviews({ 
        page: currentPage, 
        limit: itemsPerPage 
      });
      setReviews(data.reviews || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await adminService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(review =>
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.product_title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews Management</h1>
        <button 
          onClick={loadReviews}
          className="p-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Rating</th>
              <th className="text-left py-3 px-4">Review</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="py-3 px-4">{review.product_title}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{review.user_name}</p>
                      <p className="text-xs text-gray-500">{review.user_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm">({review.rating})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="max-w-md truncate">{review.content}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">{formatDate(review.created_at)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// MAKE SURE THIS IS AT THE END OF THE FILE
export default AdminReviews;