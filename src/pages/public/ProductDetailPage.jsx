
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Send,
//   UserPlus,
//   UserCheck,
//   Play,
//   ArrowLeft,
//   Eye,
//   ShoppingCart,
//   Minus,
//   Plus,
//   Rocket,
// } from 'lucide-react';

// import { productsService } from '../../services/products';
// import { usersService } from '../../services/users';
// import {
//   followUser,
//   unfollowUser,
//   checkFollowStatus,
// } from '../../services/users';

// import { useAuthStore } from '../../store/authStore';
// import { useCartStore } from '../../store/cartStore';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const getMediaUrl = (path) => {
//   if (!path) return null;

//   if (path.startsWith('http')) return path;
//   if (path.startsWith('data:')) return path;

//   return `http://localhost:8080${path}`;
// };

// // A boost is active only when its expiry date is still in the future.
// const isProductBoostActive = (product) => {
//   if (product?.is_boosted !== true || !product?.boosted_until) {
//     return false;
//   }

//   const expiryTime = new Date(product.boosted_until).getTime();

//   return Number.isFinite(expiryTime) && expiryTime > Date.now();
// };

// const ProductDetailPage = () => {
//   const { id } = useParams();
//   const { user } = useAuthStore();
//   const { addToCart } = useCartStore();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [liked, setLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [autoPlay, setAutoPlay] = useState(true);
//   const [followersCount, setFollowersCount] = useState(0);
//   const [sellerInfo, setSellerInfo] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [isBoosting, setIsBoosting] = useState(false);

//   useEffect(() => {
//     loadProduct();
//     loadComments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const loadProduct = async () => {
//     try {
//       setLoading(true);

//       const data = await productsService.getProduct(id);

//       setProduct(data);
//       setLikesCount(data.likes_count || 0);
//       setQuantity(1);

//       if (data.seller_id) {
//         try {
//           const seller = await usersService.getPublicProfile(data.seller_id);

//           setSellerInfo(seller);
//           setFollowersCount(seller.followers_count || 0);

//           if (user && data.seller_id !== user.id) {
//             const followStatus = await checkFollowStatus(data.seller_id);
//             setIsFollowing(Boolean(followStatus.is_following));
//           } else {
//             setIsFollowing(false);
//           }
//         } catch (error) {
//           console.error('Failed to load seller info:', error);

//           setSellerInfo({
//             id: data.seller_id,
//             name: data.seller_name || 'Seller',
//             avatar: data.seller_avatar,
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load product:', error);
//       toast.error('Product not found');
//       setProduct(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadComments = async () => {
//     try {
//       const data = await productsService.getComments(id);
//       setComments(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Failed to load comments:', error);
//       setComments([]);
//     }
//   };

//   const handleLike = async () => {
//     if (!user) {
//       toast.error('Login to like');
//       return;
//     }

//     try {
//       if (liked) {
//         await productsService.unlikeProduct(id);
//         setLikesCount((prev) => Math.max(0, prev - 1));
//         setLiked(false);
//       } else {
//         await productsService.likeProduct(id);
//         setLikesCount((prev) => prev + 1);
//         setLiked(true);
//       }
//     } catch (error) {
//       console.error('Like error:', error);
//       toast.error('Failed to like');
//     }
//   };

//   const handleShare = async () => {
//     const url = window.location.href;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: product?.title,
//           url,
//         });

//         await productsService.shareProduct(id);
//         toast.success('Shared!');
//       } catch (error) {
//         // Sharing may be cancelled by the user.
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(url);
//         await productsService.shareProduct(id);
//         toast.success('Link copied!');
//       } catch (error) {
//         toast.error('Could not copy the product link');
//       }
//     }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast.error('Login to comment');
//       return;
//     }

//     if (!newComment.trim()) return;

//     try {
//       const result = await productsService.addComment(id, newComment);

//       setComments((prev) => [result, ...prev]);
//       setNewComment('');
//       toast.success('Comment posted');
//     } catch (error) {
//       toast.error('Failed to post comment');
//     }
//   };

//   const handleFollow = async () => {
//     if (!user) {
//       toast.error('Login to follow');
//       return;
//     }

//     const sellerId = product?.seller_id;

//     if (!sellerId) {
//       toast.error('Cannot find seller');
//       return;
//     }

//     if (user.id === sellerId) {
//       toast.error('You cannot follow yourself');
//       return;
//     }

//     try {
//       if (isFollowing) {
//         await unfollowUser(sellerId);

//         setIsFollowing(false);
//         setFollowersCount((prev) => Math.max(0, prev - 1));

//         toast.success(`Unfollowed ${sellerInfo?.name || 'seller'}`);
//       } else {
//         await followUser(sellerId);

//         setIsFollowing(true);
//         setFollowersCount((prev) => prev + 1);

//         toast.success(`Following ${sellerInfo?.name || 'seller'}`);
//       }
//     } catch (error) {
//       console.error('Follow error:', error);
//       toast.error(error.response?.data?.detail || 'Action failed');
//     }
//   };

//   const handleBoost = async () => {
//     if (!user) {
//       toast.error('Please login to boost products');
//       return;
//     }

//     if (!user.is_premium) {
//       toast.error('Premium membership required to boost products. Upgrade now!');
//       return;
//     }

//     if (user.id !== product?.seller_id) {
//       toast.error('You can only boost your own products');
//       return;
//     }

//     if (product?.status !== 'approved') {
//       toast.error('Only approved products can be boosted');
//       return;
//     }

//     // Check the expiry date, not just the database boolean.
//     if (isProductBoostActive(product)) {
//       toast.error('This product already has an active boost!');
//       return;
//     }

//     setIsBoosting(true);

//     try {
//       const token = localStorage.getItem('access_token');

//       const response = await axios.post(
//         `http://localhost:8080/premium/boost/${product.id}`,
//         {},
//         {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : {},
//         }
//       );

//       if (response.data?.is_boosted) {
//         setProduct((prev) => ({
//           ...prev,
//           is_boosted: true,
//           boosted_at: response.data.boosted_at || new Date().toISOString(),
//           boosted_until: response.data.boosted_until,
//         }));

//         toast.success(
//           'Product boosted successfully! It will appear in the ads carousel.'
//         );
//       } else {
//         toast.error('The server did not confirm that the product was boosted');
//       }
//     } catch (error) {
//       console.error('Boost error:', error);

//       const errorMsg =
//         error.response?.data?.detail || 'Failed to boost product';

//       toast.error(
//         typeof errorMsg === 'string' ? errorMsg : 'Failed to boost product'
//       );
//     } finally {
//       setIsBoosting(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!product) return;

//     setAddingToCart(true);

//     try {
//       await addToCart(product.id, quantity);

//       toast.success(`Added ${quantity} × ${product.title} to cart!`);
//       setQuantity(1);
//     } catch (error) {
//       console.error('Failed to add to cart:', error);

//       if (error.response?.status === 401) {
//         toast.error('Please login to add to cart');
//       } else {
//         toast.error(
//           error.response?.data?.detail || 'Failed to add to cart'
//         );
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const updateQuantity = (newQuantity) => {
//     if (newQuantity < 1) return;

//     if (product?.stock_qty != null && newQuantity > product.stock_qty) {
//       toast.error(`Only ${product.stock_qty} items in stock`);
//       return;
//     }

//     setQuantity(newQuantity);
//   };

//   const allMedia = [
//     ...(product?.images || []).map((img) => ({
//       type: 'image',
//       url: img,
//     })),
//     ...(product?.videos || []).map((vid) => ({
//       type: 'video',
//       url: vid,
//     })),
//   ];

//   // Automatically advance media every 4 seconds; pause on hover.
//   useEffect(() => {
//     if (allMedia.length <= 1 || !autoPlay) return;

//     const interval = setInterval(() => {
//       setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [allMedia.length, autoPlay]);

//   // Recalculate when the product is loaded or updated.
//   const isBoostActive = isProductBoostActive(product);

//   const showBoostButton =
//     Boolean(user) &&
//     user.id === product?.seller_id &&
//     user.is_premium &&
//     product?.status === 'approved' &&
//     !isBoostActive;

//   const showPremiumUpgrade =
//     Boolean(user) &&
//     user.id === product?.seller_id &&
//     !user.is_premium &&
//     product?.status === 'approved' &&
//     !isBoostActive;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-black">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-white text-xl mb-4">Product not found</p>
//           <Link
//             to="/shop"
//             className="text-brand-orange hover:underline"
//           >
//             Back to Shop
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const sellerId = product.seller_id;

//   const sellerName =
//     sellerInfo?.name ||
//     sellerInfo?.username ||
//     product.seller_name ||
//     product.seller?.name ||
//     'Seller';

//   const sellerAvatar =
//     sellerInfo?.avatar_url ||
//     sellerInfo?.avatar ||
//     product.seller_avatar ||
//     product.seller?.avatar ||
//     null;

//   const totalPrice = (product.price || 0) * quantity;

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         <Link
//           to="/shop"
//           className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
//         >
//           <ArrowLeft className="h-5 w-5" />
//           Back to Shop
//         </Link>

//         {/* Boost banner only appears while the boost is active */}
//         {isBoostActive && (
//           <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/20 to-brand-orange/20 border border-brand-orange/50 rounded-xl">
//             <div className="flex items-center justify-between flex-wrap gap-2">
//               <div className="flex items-center gap-2">
//                 <Rocket className="h-5 w-5 text-brand-orange" />
//                 <span className="text-white font-semibold">
//                   This product is BOOSTED!
//                 </span>
//               </div>

//               <span className="text-gray-400 text-sm">
//                 Boosted until:{' '}
//                 {new Date(product.boosted_until).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Media Section */}
//           <div className="bg-gray-900 rounded-2xl overflow-hidden">
//             <div
//               className="relative aspect-square"
//               onMouseEnter={() => setAutoPlay(false)}
//               onMouseLeave={() => setAutoPlay(true)}
//             >
//               {allMedia[currentMediaIndex]?.type === 'video' ? (
//                 <video
//                   src={getMediaUrl(allMedia[currentMediaIndex].url)}
//                   controls
//                   className="w-full h-full object-contain"
//                   poster={getMediaUrl(product.images?.[0])}
//                 />
//               ) : (
//                 <img
//                   src={getMediaUrl(
//                     allMedia[currentMediaIndex]?.url ||
//                       product.images?.[0]
//                   )}
//                   alt={product.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.onerror = null;
//                     e.currentTarget.src =
//                       'https://via.placeholder.com/500x500?text=No+Image';
//                   }}
//                 />
//               )}

//               {/* Previous / Next arrows */}
//               {allMedia.length > 1 && (
//                 <>
//                   <button
//                     type="button"
//                     aria-label="Previous media"
//                     onClick={() =>
//                       setCurrentMediaIndex(
//                         (prev) =>
//                           (prev - 1 + allMedia.length) % allMedia.length
//                       )
//                     }
//                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
//                   >
//                     <ArrowLeft className="h-5 w-5" />
//                   </button>

//                   <button
//                     type="button"
//                     aria-label="Next media"
//                     onClick={() =>
//                       setCurrentMediaIndex(
//                         (prev) => (prev + 1) % allMedia.length
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 rotate-180 transition"
//                   >
//                     <ArrowLeft className="h-5 w-5" />
//                   </button>
//                 </>
//               )}

//               {/* Media indicators */}
//               {allMedia.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
//                   {allMedia.map((_, idx) => (
//                     <button
//                       key={idx}
//                       type="button"
//                       aria-label={`View media ${idx + 1}`}
//                       onClick={() => setCurrentMediaIndex(idx)}
//                       className={`h-2 rounded-full transition-all ${
//                         idx === currentMediaIndex
//                           ? 'bg-brand-orange w-6'
//                           : 'bg-gray-500 w-2'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Image counter */}
//               {allMedia.length > 1 && (
//                 <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1 text-xs text-white">
//                   {currentMediaIndex + 1} / {allMedia.length}
//                 </div>
//               )}

//               {/* Seller profile link */}
//               {sellerId && (
//                 <Link
//                   to={`/profile/${sellerId}`}
//                   className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 rounded-full px-3 py-1 text-xs text-white transition"
//                 >
//                   View {sellerName}'s profile
//                 </Link>
//               )}
//             </div>

//             {/* Thumbnail strip */}
//             {allMedia.length > 1 && (
//               <div className="flex gap-2 p-3 overflow-x-auto bg-gray-900">
//                 {allMedia.map((media, idx) => (
//                   <button
//                     key={idx}
//                     type="button"
//                     aria-label={`Select media ${idx + 1}`}
//                     onClick={() => setCurrentMediaIndex(idx)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
//                       idx === currentMediaIndex
//                         ? 'border-brand-orange'
//                         : 'border-transparent opacity-60 hover:opacity-100'
//                     }`}
//                   >
//                     {media.type === 'video' ? (
//                       <div className="w-full h-full bg-gray-800 flex items-center justify-center">
//                         <Play className="h-5 w-5 text-white" />
//                       </div>
//                     ) : (
//                       <img
//                         src={getMediaUrl(media.url)}
//                         alt={`${product.title} ${idx + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Information */}
//           <div>
//             {/* Seller Information */}
//             <div className="flex items-center justify-between mb-4 p-4 bg-gray-900 rounded-2xl">
//               {sellerId ? (
//                 <Link
//                   to={`/profile/${sellerId}`}
//                   className="flex items-center gap-3 flex-1"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center overflow-hidden">
//                     {sellerAvatar ? (
//                       <img
//                         src={getMediaUrl(sellerAvatar)}
//                         alt={sellerName}
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-white font-bold text-lg">
//                         {sellerName?.[0]?.toUpperCase() || 'U'}
//                       </span>
//                     )}
//                   </div>

//                   <div>
//                     <p className="text-white font-semibold">
//                       {sellerName}
//                     </p>
//                     <p className="text-gray-400 text-sm">
//                       {followersCount}{' '}
//                       {followersCount === 1 ? 'follower' : 'followers'}
//                     </p>
//                   </div>
//                 </Link>
//               ) : (
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center">
//                     <span className="text-white font-bold text-lg">
//                       {sellerName?.[0]?.toUpperCase() || 'U'}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-white font-semibold">
//                       {sellerName}
//                     </p>
//                     <p className="text-gray-400 text-sm">Seller</p>
//                   </div>
//                 </div>
//               )}

//               {user && sellerId && user.id !== sellerId && (
//                 <button
//                   type="button"
//                   onClick={handleFollow}
//                   className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
//                     isFollowing
//                       ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
//                       : 'bg-brand-orange text-white hover:bg-orange-600'
//                   }`}
//                 >
//                   {isFollowing ? (
//                     <UserCheck className="h-4 w-4" />
//                   ) : (
//                     <UserPlus className="h-4 w-4" />
//                   )}

//                   {isFollowing ? 'Following' : 'Follow'}
//                 </button>
//               )}
//             </div>

//             {/* Product Details */}
//             <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
//               <h1 className="text-2xl font-bold text-white mb-2">
//                 {product.title}
//               </h1>

//               <p className="text-3xl font-bold text-brand-orange">
//                 ₦{Number(product.price || 0).toLocaleString()}
//               </p>

//               {product.old_price != null && (
//                 <p className="text-gray-400 line-through text-sm">
//                   ₦{Number(product.old_price).toLocaleString()}
//                 </p>
//               )}

//               <p className="text-gray-400 mt-3">
//                 {product.description}
//               </p>

//               <div className="flex flex-wrap gap-2 mt-3">
//                 {product.category && (
//                   <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
//                     {product.category}
//                   </span>
//                 )}

//                 {product.condition && (
//                   <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400 capitalize">
//                     {product.condition}
//                   </span>
//                 )}
//               </div>

//               <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <Eye className="h-3 w-3" />
//                   {product.views || 0} views
//                 </span>

//                 <span>Stock: {product.stock_qty ?? 0}</span>
//               </div>
//             </div>

//             {/* Boost Button */}
//             {showBoostButton && (
//               <div className="mb-4 p-4 bg-gradient-to-r from-orange-500/10 to-brand-orange/10 border border-brand-orange/30 rounded-2xl">
//                 <div className="flex items-center justify-between flex-wrap gap-3">
//                   <div>
//                     <h3 className="text-white font-semibold flex items-center gap-2">
//                       <Rocket className="h-5 w-5 text-brand-orange" />
//                       Boost This Product
//                     </h3>

//                     <p className="text-gray-400 text-sm mt-1">
//                       Get more visibility! Boosted products appear in the
//                       ads carousel and get priority placement.
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={handleBoost}
//                     disabled={isBoosting}
//                     className="px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl font-semibold transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
//                   >
//                     {isBoosting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//                         Boosting...
//                       </>
//                     ) : (
//                       <>
//                         <Rocket className="h-5 w-5" />
//                         Boost Now
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Premium Upgrade Prompt */}
//             {showPremiumUpgrade && (
//               <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
//                 <div className="text-center">
//                   <p className="text-gray-300 mb-2">
//                     ✨ Want to boost this product?
//                   </p>

//                   <Link
//                     to="/premium"
//                     className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
//                   >
//                     Upgrade to Premium
//                   </Link>
//                 </div>
//               </div>
//             )}

//             {/* Quantity Selector */}
//             <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
//               <p className="text-white text-sm mb-2">Quantity:</p>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() => updateQuantity(quantity - 1)}
//                   className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white"
//                   disabled={quantity <= 1}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>

//                 <span className="text-white text-lg font-semibold w-12 text-center">
//                   {quantity}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => updateQuantity(quantity + 1)}
//                   className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white"
//                   disabled={
//                     product.stock_qty != null &&
//                     quantity >= product.stock_qty
//                   }
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>

//                 <span className="text-gray-400 text-sm ml-4">
//                   Total: ₦{totalPrice.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* Add to Cart */}
//             <button
//               type="button"
//               onClick={handleAddToCart}
//               disabled={addingToCart || product.stock_qty === 0}
//               className="w-full mb-4 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {addingToCart ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//               ) : (
//                 <ShoppingCart className="h-5 w-5" />
//               )}

//               {product.stock_qty === 0
//                 ? 'Out of Stock'
//                 : `Add to Cart • ₦${totalPrice.toLocaleString()}`}
//             </button>

//             {/* Action Buttons */}
//             <div className="flex gap-6 p-4 bg-gray-900 rounded-2xl mb-4">
//               <button
//                 type="button"
//                 onClick={handleLike}
//                 className="flex items-center gap-2 text-white hover:text-red-500 transition"
//               >
//                 <Heart
//                   className={`h-6 w-6 ${
//                     liked ? 'fill-red-500 text-red-500' : ''
//                   }`}
//                 />
//                 <span>{likesCount}</span>
//               </button>

//               <div className="flex items-center gap-2 text-white">
//                 <MessageCircle className="h-6 w-6" />
//                 <span>{comments.length}</span>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleShare}
//                 className="flex items-center gap-2 text-white hover:text-brand-orange transition"
//               >
//                 <Share2 className="h-6 w-6" />
//                 <span>Share</span>
//               </button>
//             </div>

//             {/* Comments */}
//             <div className="bg-gray-900 rounded-2xl p-4">
//               <h3 className="text-white font-semibold mb-3">
//                 Comments ({comments.length})
//               </h3>

//               <form
//                 onSubmit={handleComment}
//                 className="flex gap-2 mb-4"
//               >
//                 <input
//                   type="text"
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Add a comment..."
//                   className="flex-1 px-4 py-2 bg-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-orange"
//                 />

//                 <button
//                   type="submit"
//                   className="p-2 bg-brand-orange rounded-full hover:bg-orange-600 transition"
//                   aria-label="Post comment"
//                 >
//                   <Send className="h-5 w-5 text-white" />
//                 </button>
//               </form>

//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {comments.length === 0 ? (
//                   <p className="text-gray-500 text-center py-4">
//                     No comments yet. Be the first!
//                   </p>
//                 ) : (
//                   comments.map((comment) => {
//                     const commenterName =
//                       comment.user?.name || 'Unknown';

//                     const commenterAvatar = comment.user?.avatar;

//                     return (
//                       <div key={comment.id} className="flex gap-3">
//                         <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                           {commenterAvatar ? (
//                             <img
//                               src={getMediaUrl(commenterAvatar)}
//                               alt={commenterName}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = 'none';
//                               }}
//                             />
//                           ) : (
//                             <span className="text-white text-xs">
//                               {commenterName[0]?.toUpperCase() || 'U'}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex-1">
//                           <p className="text-white text-sm">
//                             <span className="font-semibold">
//                               {commenterName}
//                             </span>{' '}
//                             {comment.content}
//                           </p>

//                           <p className="text-gray-500 text-xs mt-0.5">
//                             {new Date(
//                               comment.created_at
//                             ).toLocaleDateString()}
//                           </p>

//                           {/* Replies */}
//                           {comment.replies?.length > 0 && (
//                             <div className="mt-2 space-y-2 pl-3 border-l border-gray-700">
//                               {comment.replies.map((reply) => {
//                                 const replyName =
//                                   reply.user?.name || 'Unknown';

//                                 const replyAvatar = reply.user?.avatar;

//                                 return (
//                                   <div
//                                     key={reply.id}
//                                     className="flex gap-2"
//                                   >
//                                     <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                                       {replyAvatar ? (
//                                         <img
//                                           src={getMediaUrl(replyAvatar)}
//                                           alt={replyName}
//                                           className="w-full h-full object-cover"
//                                           onError={(e) => {
//                                             e.currentTarget.style.display = 'none';
//                                           }}
//                                         />
//                                       ) : (
//                                         <span className="text-white text-xs">
//                                           {replyName[0]?.toUpperCase() || 'U'}
//                                         </span>
//                                       )}
//                                     </div>

//                                     <div>
//                                       <p className="text-white text-xs">
//                                         <span className="font-semibold">
//                                           {replyName}
//                                         </span>{' '}
//                                         {reply.content}
//                                       </p>

//                                       <p className="text-gray-500 text-xs">
//                                         {new Date(
//                                           reply.created_at
//                                         ).toLocaleDateString()}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  UserPlus,
  UserCheck,
  Play,
  ArrowLeft,
  Eye,
  ShoppingCart,
  Minus,
  Plus,
  Rocket,
  Tag,
  Calendar,
  Percent,
  Edit2,
  Save,
  X,
  Trash2,
} from 'lucide-react';

import { productsService } from '../../services/products';
import { usersService } from '../../services/users';
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from '../../services/users';

import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const getMediaUrl = (path) => {
  if (!path) return null;

  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;

  return `http://localhost:8080${path}`;
};

const isProductBoostActive = (product) => {
  if (product?.is_boosted !== true || !product?.boosted_until) {
    return false;
  }

  const expiryTime = new Date(product.boosted_until).getTime();

  return Number.isFinite(expiryTime) && expiryTime > Date.now();
};

const formatDateTimeLocal = (value) => {
  if (!value) return '';

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return '';

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  // Promotion editor
  const [showPromotionEditor, setShowPromotionEditor] = useState(false);
  const [savingPromotion, setSavingPromotion] = useState(false);
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  const [promotionName, setPromotionName] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [promotionStartAt, setPromotionStartAt] = useState('');
  const [promotionEndAt, setPromotionEndAt] = useState('');

  useEffect(() => {
    loadProduct();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const data = await productsService.getProduct(id);

      setProduct(data);
      setLikesCount(data.likes_count || 0);
      setQuantity(1);

      setPromotionEnabled(Boolean(data.promotion_is_active));
      setPromotionName(data.promotion_name || '');
      setDiscountPercent(
        data.discount_percent != null
          ? String(data.discount_percent)
          : ''
      );
      setPromotionStartAt(
        formatDateTimeLocal(data.promotion_start_at)
      );
      setPromotionEndAt(
        formatDateTimeLocal(data.promotion_end_at)
      );

      if (data.seller_id) {
        try {
          const seller = await usersService.getPublicProfile(data.seller_id);

          setSellerInfo(seller);
          setFollowersCount(seller.followers_count || 0);

          if (user && String(data.seller_id) !== String(user.id)) {
            const followStatus = await checkFollowStatus(data.seller_id);
            setIsFollowing(Boolean(followStatus.is_following));
          } else {
            setIsFollowing(false);
          }
        } catch (error) {
          console.error('Failed to load seller info:', error);

          setSellerInfo({
            id: data.seller_id,
            name: data.seller_name || 'Seller',
            avatar: data.seller_avatar,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await productsService.getComments(id);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Login to like');
      return;
    }

    try {
      if (liked) {
        await productsService.unlikeProduct(id);
        setLikesCount((prev) => Math.max(0, prev - 1));
        setLiked(false);
      } else {
        await productsService.likeProduct(id);
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          url,
        });

        await productsService.shareProduct(id);
        toast.success('Shared!');
      } catch (error) {
        // Sharing may be cancelled by the user.
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        await productsService.shareProduct(id);
        toast.success('Link copied!');
      } catch (error) {
        toast.error('Could not copy the product link');
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Login to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const result = await productsService.addComment(id, newComment);

      setComments((prev) => [result, ...prev]);
      setNewComment('');
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Login to follow');
      return;
    }

    const sellerId = product?.seller_id;

    if (!sellerId) {
      toast.error('Cannot find seller');
      return;
    }

    if (String(user.id) === String(sellerId)) {
      toast.error('You cannot follow yourself');
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser(sellerId);

        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));

        toast.success(`Unfollowed ${sellerInfo?.name || 'seller'}`);
      } else {
        await followUser(sellerId);

        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);

        toast.success(`Following ${sellerInfo?.name || 'seller'}`);
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error(error.response?.data?.detail || 'Action failed');
    }
  };

  const handleBoost = async () => {
    if (!user) {
      toast.error('Please login to boost products');
      return;
    }

    if (!user.is_premium) {
      toast.error('Premium membership required to boost products. Upgrade now!');
      return;
    }

    if (String(user.id) !== String(product?.seller_id)) {
      toast.error('You can only boost your own products');
      return;
    }

    if (product?.status !== 'approved') {
      toast.error('Only approved products can be boosted');
      return;
    }

    if (isProductBoostActive(product)) {
      toast.error('This product already has an active boost!');
      return;
    }

    setIsBoosting(true);

    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.post(
        `http://localhost:8080/premium/boost/${product.id}`,
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      if (response.data?.is_boosted) {
        setProduct((prev) => ({
          ...prev,
          is_boosted: true,
          boosted_at: response.data.boosted_at || new Date().toISOString(),
          boosted_until: response.data.boosted_until,
        }));

        toast.success(
          'Product boosted successfully! It will appear in the ads carousel.'
        );
      } else {
        toast.error('The server did not confirm that the product was boosted');
      }
    } catch (error) {
      console.error('Boost error:', error);

      const errorMsg =
        error.response?.data?.detail || 'Failed to boost product';

      toast.error(
        typeof errorMsg === 'string' ? errorMsg : 'Failed to boost product'
      );
    } finally {
      setIsBoosting(false);
    }
  };

  // Save or update the owner's promotion.
  const handleSavePromotion = async (e) => {
    e.preventDefault();

    if (!user || String(user.id) !== String(product?.seller_id)) {
      toast.error('You can only edit your own product promotion');
      return;
    }

    const discount = Number(discountPercent);

    if (promotionEnabled) {
      if (
        !Number.isInteger(discount) ||
        discount < 1 ||
        discount > 99
      ) {
        toast.error('Enter a whole-number discount between 1% and 99%');
        return;
      }

      if (promotionStartAt && promotionEndAt) {
        const start = new Date(promotionStartAt).getTime();
        const end = new Date(promotionEndAt).getTime();

        if (
          !Number.isFinite(start) ||
          !Number.isFinite(end) ||
          start >= end
        ) {
          toast.error('Promotion end date must be after the start date');
          return;
        }
      }
    }

    const payload = {
      promotion_is_active: Boolean(promotionEnabled),
      promotion_name: promotionName.trim() || null,
      discount_percent: promotionEnabled ? discount : null,
      promotion_start_at:
        promotionStartAt
          ? new Date(promotionStartAt).toISOString()
          : null,
      promotion_end_at:
        promotionEndAt
          ? new Date(promotionEndAt).toISOString()
          : null,
    };

    setSavingPromotion(true);

    try {
      await productsService.updateProduct(product.id, payload);

      toast.success(
        promotionEnabled
          ? 'Promotion saved successfully!'
          : 'Promotion settings updated!'
      );

      setShowPromotionEditor(false);
      await loadProduct();
    } catch (error) {
      console.error('Failed to save promotion:', error);

      const detail = error.response?.data?.detail;

      toast.error(
        typeof detail === 'string'
          ? detail
          : 'Failed to save promotion. Please try again.'
      );
    } finally {
      setSavingPromotion(false);
    }
  };

  const handleRemovePromotion = async () => {
    if (!user || String(user.id) !== String(product?.seller_id)) {
      toast.error('You can only edit your own product promotion');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this promotion?')) {
      return;
    }

    setSavingPromotion(true);

    try {
      await productsService.updateProduct(product.id, {
        promotion_is_active: false,
        promotion_name: null,
        discount_percent: null,
        promotion_start_at: null,
        promotion_end_at: null,
      });

      toast.success('Promotion removed successfully');

      setPromotionEnabled(false);
      setPromotionName('');
      setDiscountPercent('');
      setPromotionStartAt('');
      setPromotionEndAt('');
      setShowPromotionEditor(false);

      await loadProduct();
    } catch (error) {
      console.error('Failed to remove promotion:', error);

      const detail = error.response?.data?.detail;

      toast.error(
        typeof detail === 'string'
          ? detail
          : 'Failed to remove promotion'
      );
    } finally {
      setSavingPromotion(false);
    }
  };

  // Manual availability is independent of stock_qty.
  const isManuallyOutOfStock = Boolean(product?.is_out_of_stock);

  const isUnavailable =
    isManuallyOutOfStock || product?.stock_qty === 0;

  const handleAddToCart = async () => {
    if (!product) return;

    // Prevent adding manually unavailable products.
    if (Boolean(product.is_out_of_stock)) {
      toast.error('This product is currently out of stock');
      return;
    }

    // Preserve the existing stock quantity protection.
    if (product.stock_qty === 0) {
      toast.error('This product is currently out of stock');
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart(product.id, quantity);

      toast.success(`Added ${quantity} × ${product.title} to cart!`);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);

      if (error.response?.status === 401) {
        toast.error('Please login to add to cart');
      } else {
        toast.error(
          error.response?.data?.detail || 'Failed to add to cart'
        );
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const updateQuantity = (newQuantity) => {
    if (isUnavailable) {
      toast.error('This product is currently unavailable');
      return;
    }

    if (newQuantity < 1) return;

    if (product?.stock_qty != null && newQuantity > product.stock_qty) {
      toast.error(`Only ${product.stock_qty} items in stock`);
      return;
    }

    setQuantity(newQuantity);
  };

  const allMedia = [
    ...(product?.images || []).map((img) => ({
      type: 'image',
      url: img,
    })),
    ...(product?.videos || []).map((vid) => ({
      type: 'video',
      url: vid,
    })),
  ];

  useEffect(() => {
    if (allMedia.length <= 1 || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [allMedia.length, autoPlay]);

  const isBoostActive = isProductBoostActive(product);

  const isOwner =
    Boolean(user) &&
    Boolean(product) &&
    String(user.id) === String(product.seller_id);

  const showBoostButton =
    Boolean(user) &&
    String(user.id) === String(product?.seller_id) &&
    user.is_premium &&
    product?.status === 'approved' &&
    !isBoostActive;

  const showPremiumUpgrade =
    Boolean(user) &&
    String(user.id) === String(product?.seller_id) &&
    !user.is_premium &&
    product?.status === 'approved' &&
    !isBoostActive;

  const isPromotionActive = product?.is_promotion_active === true;

  const regularPrice = Number(
    product?.regular_price ?? product?.price ?? 0
  );

  const effectivePrice = Number(
    product?.effective_price ??
      product?.discounted_price ??
      product?.price ??
      0
  );

  const displayPrice = isPromotionActive
    ? effectivePrice
    : regularPrice;

  const totalPrice = displayPrice * quantity;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Product not found</p>
          <Link
            to="/shop"
            className="text-brand-orange hover:underline"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const sellerId = product.seller_id;

  const sellerName =
    sellerInfo?.name ||
    sellerInfo?.username ||
    product.seller_name ||
    product.seller?.name ||
    'Seller';

  const sellerAvatar =
    sellerInfo?.avatar_url ||
    sellerInfo?.avatar ||
    product.seller_avatar ||
    product.seller?.avatar ||
    null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Shop
        </Link>

        {isManuallyOutOfStock && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/40 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <p className="text-red-400 font-bold text-lg">
                  OUT OF STOCK
                </p>
                <p className="text-gray-300 text-sm">
                  This product is currently unavailable for purchase.
                </p>
              </div>
            </div>
          </div>
        )}

        {isBoostActive && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/20 to-brand-orange/20 border border-brand-orange/50 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-brand-orange" />
                <span className="text-white font-semibold">
                  This product is BOOSTED!
                </span>
              </div>

              <span className="text-gray-400 text-sm">
                Boosted until:{' '}
                {new Date(product.boosted_until).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {isPromotionActive && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-green-400">
              <Tag className="h-5 w-5" />
              <span className="font-semibold">
                {product.promotion_name || 'Special Promotion'}
              </span>
              {product.discount_percent != null && (
                <span className="ml-auto bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount_percent}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-300 text-sm mt-2">
              This product is currently on promotion.
            </p>
            {product.promotion_end_at && (
              <p className="text-gray-400 text-xs mt-1">
                Promotion ends:{' '}
                {new Date(product.promotion_end_at).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div
              className="relative aspect-square"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              {allMedia[currentMediaIndex]?.type === 'video' ? (
                <video
                  src={getMediaUrl(allMedia[currentMediaIndex].url)}
                  controls
                  className="w-full h-full object-contain"
                  poster={getMediaUrl(product.images?.[0])}
                />
              ) : (
                <img
                  src={getMediaUrl(
                    allMedia[currentMediaIndex]?.url ||
                      product.images?.[0]
                  )}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
              )}

              {isManuallyOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  OUT OF STOCK
                </div>
              )}

              {allMedia.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous media"
                    onClick={() =>
                      setCurrentMediaIndex(
                        (prev) =>
                          (prev - 1 + allMedia.length) % allMedia.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Next media"
                    onClick={() =>
                      setCurrentMediaIndex(
                        (prev) => (prev + 1) % allMedia.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 rotate-180 transition"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </>
              )}

              {allMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {allMedia.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`View media ${idx + 1}`}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentMediaIndex
                          ? 'bg-brand-orange w-6'
                          : 'bg-gray-500 w-2'
                      }`}
                    />
                  ))}
                </div>
              )}

              {allMedia.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1 text-xs text-white">
                  {currentMediaIndex + 1} / {allMedia.length}
                </div>
              )}

              {sellerId && (
                <Link
                  to={`/profile/${sellerId}`}
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 rounded-full px-3 py-1 text-xs text-white transition"
                >
                  View {sellerName}'s profile
                </Link>
              )}
            </div>

            {allMedia.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-gray-900">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Select media ${idx + 1}`}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentMediaIndex
                        ? 'border-brand-orange'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <img
                        src={getMediaUrl(media.url)}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            {/* Seller Information */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-900 rounded-2xl">
              {sellerId ? (
                <Link
                  to={`/profile/${sellerId}`}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center overflow-hidden">
                    {sellerAvatar ? (
                      <img
                        src={getMediaUrl(sellerAvatar)}
                        alt={sellerName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {sellerName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {sellerName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {followersCount}{' '}
                      {followersCount === 1 ? 'follower' : 'followers'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {sellerName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {sellerName}
                    </p>
                    <p className="text-gray-400 text-sm">Seller</p>
                  </div>
                </div>
              )}

              {user && sellerId && String(user.id) !== String(sellerId) && (
                <button
                  type="button"
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                      : 'bg-brand-orange text-white hover:bg-orange-600'
                  }`}
                >
                  {isFollowing ? (
                    <UserCheck className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}

                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Product Details */}
            <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
              <h1 className="text-2xl font-bold text-white mb-2">
                {product.title}
              </h1>

              {isManuallyOutOfStock && (
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  This product is out of stock
                </div>
              )}

              <div className="flex items-center flex-wrap gap-3">
                <p className="text-3xl font-bold text-brand-orange">
                  ₦{Number(displayPrice).toLocaleString()}
                </p>

                {isPromotionActive && (
                  <>
                    <p className="text-gray-400 line-through text-sm">
                      ₦{Number(regularPrice).toLocaleString()}
                    </p>

                    {product.discount_percent != null && (
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                        Save {product.discount_percent}%
                      </span>
                    )}
                  </>
                )}

                {!isPromotionActive && product.old_price != null && (
                  <p className="text-gray-400 line-through text-sm">
                    ₦{Number(product.old_price).toLocaleString()}
                  </p>
                )}
              </div>

              <p className="text-gray-400 mt-3">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {product.category && (
                  <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                    {product.category}
                  </span>
                )}

                {product.condition && (
                  <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400 capitalize">
                    {product.condition}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {product.views || 0} views
                </span>

                <span>Stock: {product.stock_qty ?? 0}</span>
              </div>
            </div>

            {/* Owner Promotion Management */}
            {isOwner && (
              <div className="mb-4 p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Tag className="h-5 w-5 text-brand-orange" />
                      Product Promotion
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Create or manage a discount for this product.
                    </p>

                    {product.promotion_name && (
                      <p className="text-gray-300 text-sm mt-2">
                        Current promotion: {product.promotion_name}
                      </p>
                    )}

                    {product.discount_percent != null && (
                      <p className="text-gray-400 text-sm">
                        Discount: {product.discount_percent}%
                      </p>
                    )}

                    <p className="text-xs mt-1">
                      {isPromotionActive ? (
                        <span className="text-green-400">
                          Promotion currently active
                        </span>
                      ) : product.promotion_is_active ? (
                        <span className="text-yellow-400">
                          Promotion enabled but not currently active
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          No active promotion
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPromotionEditor((prev) => !prev)}
                    className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-orange-600 text-white font-semibold flex items-center gap-2"
                  >
                    {showPromotionEditor ? (
                      <>
                        <X className="h-4 w-4" />
                        Close
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Edit Promotion
                      </>
                    )}
                  </button>
                </div>

                {showPromotionEditor && (
                  <form
                    onSubmit={handleSavePromotion}
                    className="mt-5 pt-5 border-t border-gray-800 space-y-4"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={promotionEnabled}
                        onChange={(e) =>
                          setPromotionEnabled(e.target.checked)
                        }
                        className="w-5 h-5 accent-orange-500"
                      />
                      <span className="text-white font-medium">
                        Enable this promotion
                      </span>
                    </label>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Promotion name
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={promotionName}
                        onChange={(e) =>
                          setPromotionName(e.target.value)
                        }
                        placeholder="e.g. Black Friday Sale"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Discount percentage
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                          type="number"
                          min="1"
                          max="99"
                          step="1"
                          value={discountPercent}
                          onChange={(e) =>
                            setDiscountPercent(e.target.value)
                          }
                          disabled={!promotionEnabled}
                          placeholder="Enter discount (1 - 99)"
                          className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Start date (optional)
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="datetime-local"
                            value={promotionStartAt}
                            onChange={(e) =>
                              setPromotionStartAt(e.target.value)
                            }
                            disabled={!promotionEnabled}
                            className="w-full pl-10 pr-2 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          End date (optional)
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="datetime-local"
                            value={promotionEndAt}
                            onChange={(e) =>
                              setPromotionEndAt(e.target.value)
                            }
                            disabled={!promotionEnabled}
                            className="w-full pl-10 pr-2 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-brand-orange disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    {promotionEnabled && discountPercent && (
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-sm">
                          Estimated promotional price
                        </p>
                        <p className="text-green-400 text-xl font-bold mt-1">
                          ₦
                          {Number(
                            regularPrice *
                              (1 - Number(discountPercent) / 100)
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Based on the regular product price. The backend
                          calculates the final checkout price.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={savingPromotion}
                        className="px-5 py-3 rounded-lg bg-brand-orange hover:bg-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingPromotion ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {savingPromotion ? 'Saving...' : 'Save Promotion'}
                      </button>

                      {(product.promotion_name ||
                        product.discount_percent != null ||
                        product.promotion_is_active) && (
                        <button
                          type="button"
                          onClick={handleRemovePromotion}
                          disabled={savingPromotion}
                          className="px-5 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Promotion
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Boost Button */}
            {showBoostButton && (
              <div className="mb-4 p-4 bg-gradient-to-r from-orange-500/10 to-brand-orange/10 border border-brand-orange/30 rounded-2xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-brand-orange" />
                      Boost This Product
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Get more visibility! Boosted products appear in the
                      ads carousel and get priority placement.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBoost}
                    disabled={isBoosting}
                    className="px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl font-semibold transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
                  >
                    {isBoosting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Boosting...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-5 w-5" />
                        Boost Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Premium Upgrade Prompt */}
            {showPremiumUpgrade && (
              <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
                <div className="text-center">
                  <p className="text-gray-300 mb-2">
                    ✨ Want to boost this product?
                  </p>

                  <Link
                    to="/premium"
                    className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
              <p className="text-white text-sm mb-2">Quantity:</p>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => updateQuantity(quantity - 1)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white disabled:opacity-40"
                  disabled={isUnavailable || quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="text-white text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => updateQuantity(quantity + 1)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white disabled:opacity-40"
                  disabled={
                    isUnavailable ||
                    (
                      product.stock_qty != null &&
                      quantity >= product.stock_qty
                    )
                  }
                >
                  <Plus className="h-4 w-4" />
                </button>

                <span className="text-gray-400 text-sm ml-4">
                  Total: ₦{totalPrice.toLocaleString()}
                </span>
              </div>

              {isUnavailable && (
                <p className="text-red-400 text-sm mt-3">
                  This product cannot currently be purchased.
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || isUnavailable}
              className="w-full mb-4 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}

              {addingToCart
                ? 'Adding to Cart...'
                : isUnavailable
                  ? 'Out of Stock'
                  : `Add to Cart • ₦${totalPrice.toLocaleString()}`}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-6 p-4 bg-gray-900 rounded-2xl mb-4">
              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-2 text-white hover:text-red-500 transition"
              >
                <Heart
                  className={`h-6 w-6 ${
                    liked ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span>{likesCount}</span>
              </button>

              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="h-6 w-6" />
                <span>{comments.length}</span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 text-white hover:text-brand-orange transition"
              >
                <Share2 className="h-6 w-6" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments */}
            <div className="bg-gray-900 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3">
                Comments ({comments.length})
              </h3>

              <form
                onSubmit={handleComment}
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />

                <button
                  type="submit"
                  className="p-2 bg-brand-orange rounded-full hover:bg-orange-600 transition"
                  aria-label="Post comment"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </form>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  comments.map((comment) => {
                    const commenterName =
                      comment.user?.name || 'Unknown';

                    const commenterAvatar = comment.user?.avatar;

                    return (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {commenterAvatar ? (
                            <img
                              src={getMediaUrl(commenterAvatar)}
                              alt={commenterName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-white text-xs">
                              {commenterName[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-white text-sm">
                            <span className="font-semibold">
                              {commenterName}
                            </span>{' '}
                            {comment.content}
                          </p>

                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(
                              comment.created_at
                            ).toLocaleDateString()}
                          </p>

                          {comment.replies?.length > 0 && (
                            <div className="mt-2 space-y-2 pl-3 border-l border-gray-700">
                              {comment.replies.map((reply) => {
                                const replyName =
                                  reply.user?.name || 'Unknown';

                                const replyAvatar = reply.user?.avatar;

                                return (
                                  <div
                                    key={reply.id}
                                    className="flex gap-2"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      {replyAvatar ? (
                                        <img
                                          src={getMediaUrl(replyAvatar)}
                                          alt={replyName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <span className="text-white text-xs">
                                          {replyName[0]?.toUpperCase() || 'U'}
                                        </span>
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-white text-xs">
                                        <span className="font-semibold">
                                          {replyName}
                                        </span>{' '}
                                        {reply.content}
                                      </p>

                                      <p className="text-gray-500 text-xs">
                                        {new Date(
                                          reply.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
