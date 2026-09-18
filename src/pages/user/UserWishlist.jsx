// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Trash2, ShoppingCart } from 'lucide-react';
// import { wishlistService } from '../../services/wishlist';
// import { useCartStore } from '../../store/cartStore';
// import { formatCurrency } from '../../utils/formatters';
// import toast from 'react-hot-toast';

// const UserWishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { addItem } = useCartStore();

//   useEffect(() => {
//     loadWishlist();
//   }, []);

//   const loadWishlist = async () => {
//     try {
//       const data = await wishlistService.getWishlist();
//       setWishlist(data);
//     } catch (error) {
//       toast.error('Failed to load wishlist');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (productId) => {
//     try {
//       await wishlistService.removeFromWishlist(productId);
//       setWishlist(wishlist.filter(item => item.id !== productId));
//       toast.success('Removed from wishlist');
//     } catch (error) {
//       toast.error('Failed to remove item');
//     }
//   };

//   const handleAddToCart = (product) => {
//     addItem({
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.images?.[0],
//     });
//     toast.success('Added to cart');
//   };

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
//         <div className="flex items-center space-x-3 mb-8">
//           <Heart className="h-8 w-8 text-brand-orange fill-current" />
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
//         </div>

//         {wishlist.length === 0 ? (
//           <div className="text-center py-16">
//             <Heart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">Save your favorite items here</p>
//             <Link to="/shop" className="btn-primary inline-block">
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlist.map((product) => (
//               <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden group">
//                 <Link to={`/product/${product.id}`}>
//                   <div className="relative h-48 overflow-hidden">
//                     <img
//                       src={product.images?.[0] || '/placeholder.jpg'}
//                       alt={product.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleRemove(product.id);
//                       }}
//                       className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 transition"
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </button>
//                   </div>
//                 </Link>
                
//                 <div className="p-4">
//                   <Link to={`/product/${product.id}`}>
//                     <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-brand-orange">
//                       {product.title}
//                     </h3>
//                   </Link>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-bold text-brand-orange">
//                       {formatCurrency(product.price)}
//                     </span>
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange hover:bg-brand-orange hover:text-white transition"
//                     >
//                       <ShoppingCart className="h-5 w-5" />
//                     </button>
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

// export default UserWishlist;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Heart, ShoppingCart, RefreshCw, ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const UserWishlist = () => {
  const { user } = useAuthStore();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      console.log('Wishlist API Response:', response.data);
      
      let items = [];
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && response.data.items) {
        items = response.data.items;
      }
      
      // Log each item to see the structure
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, item);
        if (item.product) {
          console.log(`  Product object:`, item.product);
        }
      });
      
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view wishlist');
      } else {
        toast.error('Failed to load wishlist');
      }
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      setRemoving(true);
      await api.delete(`/wishlist/remove/${wishlistId}`);
      await loadWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemoving(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Extract product info from wishlist item (handles nested product object)
  const getProductInfo = (item) => {
    // If item has a nested product object, use that
    if (item.product) {
      return {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.images?.[0] || item.product.image,
        wishlistId: item.id
      };
    }
    // Otherwise use flat fields
    return {
      id: item.product_id || item.id,
      title: item.product_title || item.title,
      price: item.product_price || item.price,
      image: item.product_image || item.image,
      wishlistId: item.id
    };
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:8080${imagePath}`;
    }
    return `http://localhost:8080/uploads/products/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
            <span className="text-sm text-gray-500">
              ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadWishlist}
              className="text-gray-500 text-sm hover:text-brand-orange transition flex items-center gap-1"
              disabled={removing}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {!user ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Please login to view your wishlist</p>
            <Link to="/signin" className="inline-block mt-6 bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
              Login to Continue
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mt-1">Save your favorite items here</p>
            <Link to="/shop" className="inline-block mt-6 bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((item) => {
              const product = getProductInfo(item);
              const imageUrl = getImageUrl(product.image);
              const hasError = imageErrors[product.id];
              
              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
                  {/* Product Image */}
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 dark:bg-gray-700">
                    {imageUrl && !hasError ? (
                      <img 
                        src={imageUrl} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing}
                      className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 transition z-10"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-brand-orange line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-brand-orange font-bold text-lg mt-1">
                      ₦{(product.price || 0).toLocaleString()}
                    </p>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full mt-3 py-2 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Help Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need help with NexoLeolite?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Chat with our team or browse our catalogue!</p>
          <div className="flex gap-3 justify-center">
            <Link to="/contact" className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition">
              Chat Admin
            </Link>
            <Link to="/shop" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWishlist;
