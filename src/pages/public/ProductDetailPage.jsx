import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, UserPlus, UserCheck, Play, ArrowLeft, Eye, ShoppingCart, Minus, Plus, Rocket } from 'lucide-react';
import { productsService } from '../../services/products';
import { usersService } from '../../services/users';
import { followUser, unfollowUser, checkFollowStatus } from '../../services/users';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:8080${path}`;
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
  const [followersCount, setFollowersCount] = useState(0);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    loadProduct();
    loadComments();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProduct(id);
      setProduct(data);
      setLikesCount(data.likes_count || 0);
      
      if (data.seller_id) {
        try {
          const seller = await usersService.getPublicProfile(data.seller_id);
          setSellerInfo(seller);
          setFollowersCount(seller.followers_count || 0);
          
          if (user && data.seller_id !== user.id) {
            const followStatus = await checkFollowStatus(data.seller_id);
            setIsFollowing(followStatus.is_following);
          }
        } catch (e) {
          console.error('Failed to load seller info:', e);
          setSellerInfo({
            id: data.seller_id,
            name: data.seller_name || 'Seller',
            avatar: data.seller_avatar
          });
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await productsService.getComments(id);
      // FIX: Backend returns a plain array, not { comments: [] }
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
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        await productsService.likeProduct(id);
        setLikesCount(prev => prev + 1);
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
        await navigator.share({ title: product?.title, url });
        await productsService.shareProduct(id);
        toast.success('Shared!');
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
      await productsService.shareProduct(id);
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
      // FIX: Prepend the new comment — backend returns a single comment object
      setComments(prev => [result, ...prev]);
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
    
    if (user.id === sellerId) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      if (isFollowing) {
        await unfollowUser(sellerId);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        toast.success(`Unfollowed ${sellerInfo?.name || 'seller'}`);
      } else {
        await followUser(sellerId);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
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

    if (product.status !== 'approved') {
      toast.error('Only approved products can be boosted');
      return;
    }

    if (product.is_boosted) {
      toast.error('This product is already boosted!');
      return;
    }

    setIsBoosting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `http://localhost:8080/premium/boost/${product.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.is_boosted) {
        setProduct(prev => ({
          ...prev,
          is_boosted: true,
          boosted_until: response.data.boosted_until
        }));
        toast.success('✨ Product boosted successfully! It will appear in ads carousel.');
      }
    } catch (error) {
      console.error('Boost error:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to boost product';
      toast.error(errorMsg);
    } finally {
      setIsBoosting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
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
        toast.error(error.response?.data?.detail || 'Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product?.stock_qty && newQuantity > product.stock_qty) {
      toast.error(`Only ${product.stock_qty} items in stock`);
      return;
    }
    setQuantity(newQuantity);
  };

  const showBoostButton = user && 
    user.id === product?.seller_id && 
    user.is_premium && 
    product?.status === 'approved' && 
    !product?.is_boosted;

  const allMedia = [
    ...(product?.images || []).map(img => ({ type: 'image', url: img })),
    ...(product?.videos || []).map(vid => ({ type: 'video', url: vid }))
  ];

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
          <Link to="/shop" className="text-brand-orange hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const sellerId = product.seller_id;
  const sellerName = sellerInfo?.name || product.seller_name || product.seller?.name || 'Seller';
  const sellerAvatar = sellerInfo?.avatar_url || product.seller_avatar || product.seller?.avatar || null;
  const totalPrice = (product.price || 0) * quantity;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="h-5 w-5" />
          Back to Shop
        </Link>

        {product.is_boosted && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/20 to-brand-orange/20 border border-brand-orange/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-brand-orange" />
                <span className="text-white font-semibold">This product is BOOSTED!</span>
              </div>
              {product.boosted_until && (
                <span className="text-gray-400 text-sm">
                  Boosted until: {new Date(product.boosted_until).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Media Section */}
          {sellerId ? (
            <Link 
              to={`/profile/${sellerId}`} 
              className="bg-gray-900 rounded-2xl overflow-hidden block"
            >
              <div className="relative aspect-square">
                {allMedia[currentMediaIndex]?.type === 'video' ? (
                  <video 
                    src={getMediaUrl(allMedia[currentMediaIndex].url)} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={getMediaUrl(product.images?.[0])}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img 
                    src={getMediaUrl(allMedia[currentMediaIndex]?.url || product.images?.[0])} 
                    alt={product.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                    }}
                  />
                )}
                
                {allMedia.length > 1 && (
                  <div 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"
                    onClick={(e) => e.preventDefault()}
                  >
                    {allMedia.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentMediaIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentMediaIndex ? 'bg-brand-orange w-4' : 'bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 bg-black/50 rounded-full px-2 py-1 text-xs text-white">
                  Click to view {sellerName}'s profile
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="relative aspect-square">
                <img 
                  src={getMediaUrl(allMedia[currentMediaIndex]?.url || product.images?.[0])} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Info Section */}
          <div>
            {/* Seller Info */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-900 rounded-2xl">
              {sellerId ? (
                <Link to={`/profile/${sellerId}`} className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center overflow-hidden">
                    {sellerAvatar ? (
                      <img src={getMediaUrl(sellerAvatar)} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {sellerName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sellerName}</p>
                    <p className="text-gray-400 text-sm">
                      {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{sellerName?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sellerName}</p>
                    <p className="text-gray-400 text-sm">Seller</p>
                  </div>
                </div>
              )}
              
              {user && sellerId && user.id !== sellerId && (
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                    isFollowing 
                      ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700' 
                      : 'bg-brand-orange text-white hover:bg-orange-600'
                  }`}
                >
                  {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Product Info */}
            <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
              <h1 className="text-2xl font-bold text-white mb-2">{product.title}</h1>
              <p className="text-3xl font-bold text-brand-orange">₦{product.price?.toLocaleString()}</p>
              {product.old_price && (
                <p className="text-gray-400 line-through text-sm">₦{product.old_price?.toLocaleString()}</p>
              )}
              <p className="text-gray-400 mt-3">{product.description}</p>
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
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {product.views || 0} views</span>
                <span>Stock: {product.stock_qty || 0}</span>
              </div>
            </div>

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
                      Get more visibility! Boosted products appear in the ads carousel and get priority placement.
                    </p>
                  </div>
                  <button
                    onClick={handleBoost}
                    disabled={isBoosting}
                    className="px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl font-semibold transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isBoosting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Boosting...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-5 w-5" />
                        🚀 Boost Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Premium Upgrade Prompt */}
            {user && user.id === product?.seller_id && !user.is_premium && product?.status === 'approved' && !product?.is_boosted && (
              <div className="mb-4 p-4 bg-gray-900 rounded-2xl">
                <div className="text-center">
                  <p className="text-gray-300 mb-2">✨ Want to boost this product?</p>
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-white text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-white"
                  disabled={product.stock_qty && quantity >= product.stock_qty}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-gray-400 text-sm ml-4">
                  Total: ₦{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock_qty === 0}
              className="w-full mb-4 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              {product.stock_qty === 0 ? 'Out of Stock' : `Add to Cart • ₦${totalPrice.toLocaleString()}`}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-6 p-4 bg-gray-900 rounded-2xl mb-4">
              <button onClick={handleLike} className="flex items-center gap-2 text-white hover:text-red-500 transition">
                <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likesCount}</span>
              </button>
              <button className="flex items-center gap-2 text-white hover:text-brand-orange transition">
                <MessageCircle className="h-6 w-6" />
                <span>{comments.length}</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 text-white hover:text-brand-orange transition">
                <Share2 className="h-6 w-6" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments */}
            <div className="bg-gray-900 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3">Comments ({comments.length})</h3>
              
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <button type="submit" className="p-2 bg-brand-orange rounded-full hover:bg-orange-600 transition">
                  <Send className="h-5 w-5 text-white" />
                </button>
              </form>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => {
                    // FIX: Backend returns comment.user.name and comment.user.avatar,
                    // not comment.user_name — so we read from the nested user object.
                    const commenterName = comment.user?.name || 'Unknown';
                    const commenterAvatar = comment.user?.avatar;

                    return (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {commenterAvatar ? (
                            <img
                              src={getMediaUrl(commenterAvatar)}
                              alt={commenterName}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-white text-xs">
                              {commenterName[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            <span className="font-semibold">{commenterName}</span>{' '}
                            {comment.content}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>

                          {/* Replies */}
                          {comment.replies?.length > 0 && (
                            <div className="mt-2 space-y-2 pl-3 border-l border-gray-700">
                              {comment.replies.map((reply) => {
                                const replyName = reply.user?.name || 'Unknown';
                                const replyAvatar = reply.user?.avatar;
                                return (
                                  <div key={reply.id} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      {replyAvatar ? (
                                        <img
                                          src={getMediaUrl(replyAvatar)}
                                          alt={replyName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                      ) : (
                                        <span className="text-white text-xs">
                                          {replyName[0]?.toUpperCase() || 'U'}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-white text-xs">
                                        <span className="font-semibold">{replyName}</span>{' '}
                                        {reply.content}
                                      </p>
                                      <p className="text-gray-500 text-xs">
                                        {new Date(reply.created_at).toLocaleDateString()}
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