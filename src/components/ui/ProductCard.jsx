// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
// import { useCartStore } from '../../store/cartStore';
// import { useAuthStore } from '../../store/authStore';
// import { wishlistService } from '../../services/wishlist';
// import toast from 'react-hot-toast';

// const ProductCard = ({ product }) => {
//   const [isLiked, setIsLiked] = useState(product?.is_liked || false);
//   const [likesCount, setLikesCount] = useState(product?.likes_count || 0);
//   const { addItem } = useCartStore();
//   const { isAuthenticated } = useAuthStore();

//   const handleLike = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isAuthenticated) {
//       toast.error('Please login to like products');
//       return;
//     }
    
//     try {
//       if (isLiked) {
//         await wishlistService.removeFromWishlist(product.id);
//         setLikesCount(prev => prev - 1);
//       } else {
//         await wishlistService.addToWishlist(product.id);
//         setLikesCount(prev => prev + 1);
//       }
//       setIsLiked(!isLiked);
//     } catch (error) {
//       toast.error('Failed to update wishlist');
//     }
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addItem({
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.images?.[0],
//     });
//     toast.success('Added to cart');
//   };

//   // Format price with fallback
//   const formattedPrice = product?.price ? `₦${product.price.toLocaleString()}` : '₦0';

//   return (
//     <Link to={`/product/${product.id}`} className="product-card group">
//       <div className="relative">
//         {/* Product Image */}
//         <div className="relative overflow-hidden h-48">
//           {product.images?.[0] ? (
//             <img
//               src={product.images[0]}
//               alt={product.title || 'Product'}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//               <span className="text-gray-400">No image</span>
//             </div>
//           )}
          
//           {/* Like Button */}
//           <button
//             onClick={handleLike}
//             className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition z-10"
//           >
//             <Heart
//               className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
//             />
//           </button>
          
//           {/* Views Badge */}
//           <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
//             <Eye className="h-3 w-3" />
//             <span>{product.views || 0}</span>
//           </div>
//         </div>
        
//         {/* Product Info */}
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs text-gray-500 dark:text-gray-400">{product.category || 'General'}</span>
//             <div className="flex items-center">
//               <Star className="h-3 w-3 text-yellow-400 fill-current" />
//               <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
//                 {product.rating || 0}
//               </span>
//             </div>
//           </div>
          
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
//             {product.title || 'Product'}
//           </h3>
          
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//             by {product.seller_name || 'Seller'}
//           </p>
          
//           <div className="flex items-center justify-between mt-2">
//             <span className="text-lg font-bold text-brand-orange">
//               {formattedPrice}
//             </span>
//             <button
//               onClick={handleAddToCart}
//               className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange hover:bg-brand-orange hover:text-white transition"
//             >
//               <ShoppingCart className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { wishlistService } from '../../services/wishlist';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath;
  return `http://localhost:8080${imagePath}`;
};

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(product?.is_liked || false);
  const [likesCount, setLikesCount] = useState(product?.likes_count || 0);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to like products');
      return;
    }
    
    try {
      if (isLiked) {
        await wishlistService.removeFromWishlist(product.id);
        setLikesCount(prev => prev - 1);
      } else {
        await wishlistService.addToWishlist(product.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: getImageUrl(product.images?.[0]),
    });
    toast.success('Added to cart');
  };

  // Format price with fallback
  const formattedPrice = product?.price ? `₦${product.price.toLocaleString()}` : '₦0';
  
  // Get the correct image URL
  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <Link to={`/product/${product.id}`} className="product-card group">
      <div className="relative">
        {/* Product Image */}
        <div className="relative overflow-hidden h-48">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title || 'Product'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
          
          {/* Views Badge */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
            <Eye className="h-3 w-3" />
            <span>{product.views || 0}</span>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{product.category || 'General'}</span>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                {product.rating || 0}
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {product.title || 'Product'}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {product.seller_name || 'Seller'}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-brand-orange">
              {formattedPrice}
            </span>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange hover:bg-brand-orange hover:text-white transition"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;