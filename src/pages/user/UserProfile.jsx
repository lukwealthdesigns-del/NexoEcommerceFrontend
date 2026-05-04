// src/pages/user/UserProfile.jsx - WORKING AVATAR UPLOAD
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usersService } from '../../services/users';
import { productsService } from '../../services/products';
import { cloudinaryService } from '../../services/cloudinary';
import { 
  Camera, Loader2, Heart, Bookmark, Settings, 
  MessageCircle, UserPlus, UserCheck, 
  Package, TrendingUp, Crown,
  MapPin, Calendar, Edit2,
  Plus, Rocket, Eye, Cloud
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
    loadUserProducts();
    loadLikedProducts();
    loadSavedProducts();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await usersService.getProfile();
      setProfile(data);
      setFollowersCount(data.followers_count || 0);
      setFollowingCount(data.following_count || 0);
      
      if (data?.avatar_url && data.avatar_url !== user?.avatar_url) {
        updateUser({ avatar_url: data.avatar_url });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const loadUserProducts = async () => {
    try {
      const data = await productsService.getMyProducts();
      console.log('User products loaded:', data);
      
      let productsList = [];
      if (data && Array.isArray(data)) {
        productsList = data;
      } else if (data && data.approved) {
        productsList = data.approved;
      } else if (data && data.products) {
        productsList = data.products;
      } else if (data && typeof data === 'object') {
        productsList = [
          ...(data.approved || []),
          ...(data.pending || []),
          ...(data.rejected || [])
        ];
      }
      
      setProducts(productsList);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLikedProducts = async () => {
    setLoadingLikes(true);
    try {
      const data = await productsService.getLikedProducts();
      console.log('Liked products loaded:', data);
      setLikedProducts(data || []);
    } catch (error) {
      console.error('Failed to load liked products:', error);
      setLikedProducts([]);
    } finally {
      setLoadingLikes(false);
    }
  };

  const loadSavedProducts = async () => {
    setLoadingSaved(true);
    try {
      const data = await productsService.getSavedProducts();
      console.log('Saved products loaded:', data);
      setSavedProducts(data || []);
    } catch (error) {
      console.error('Failed to load saved products:', error);
      setSavedProducts([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleLike = async (productId, isLiked) => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }
    
    try {
      if (isLiked) {
        await productsService.unlikeProduct(productId);
        setLikedProducts(prev => prev.filter(p => p.id !== productId));
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p
        ));
        toast.success('Removed from likes');
      } else {
        await productsService.likeProduct(productId);
        await loadLikedProducts();
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
        ));
        toast.success('Added to likes');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update like');
    }
  };

  const handleSave = async (productId, isSaved) => {
    if (!user) {
      toast.error('Please login to save');
      return;
    }
    
    try {
      if (isSaved) {
        await productsService.unsaveProduct(productId);
        setSavedProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Removed from saved');
      } else {
        await productsService.saveProduct(productId);
        await loadSavedProducts();
        toast.success('Saved to wishlist');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  // ============================================================
  // FIXED: AVATAR UPLOAD - Using usersService (works with your backend)
  // ============================================================
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB');
      return;
    }
    
    setUploadingAvatar(true);
    const toastId = toast.loading('Uploading profile picture...');
    
    try {
      // Use the usersService.uploadAvatar method (already configured)
      const result = await usersService.uploadAvatar(file);
      console.log('Upload result:', result);
      
      // Update profile with new avatar URL
      setProfile(prev => ({ ...prev, avatar_url: result.avatar_url }));
      updateUser({ avatar_url: result.avatar_url });
      
      toast.success('Profile picture updated!', { id: toastId });
      
    } catch (error) {
      console.error('Upload error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      // Show detailed error message
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to upload avatar';
      toast.error(errorMsg, { id: toastId, duration: 5000 });
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Helper function to get media URL (for non-Cloudinary images)
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Use the correct backend URL
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${backendUrl}${path}`;
  };

  // Get optimized image URL for Cloudinary images
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    // Only optimize if it's a Cloudinary URL
    if (typeof url === 'string' && url.includes('cloudinary')) {
      return cloudinaryService.getProductThumbnail(url);
    }
    return getMediaUrl(url);
  };

  // Get avatar URL with optimization (only for Cloudinary URLs)
  const getAvatarUrl = () => {
    const avatarUrl = profile?.avatar_url || user?.avatar_url;
    if (!avatarUrl) return null;
    
    // If it's a Cloudinary URL, optimize it
    if (typeof avatarUrl === 'string' && avatarUrl.includes('cloudinary')) {
      return cloudinaryService.getAvatarUrl(avatarUrl, 128);
    }
    // Otherwise return as-is (might be local URL)
    return getMediaUrl(avatarUrl);
  };

  const totalLikes = products.reduce((sum, product) => sum + (product.likes_count || 0), 0);
  const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);

  // Product Card Component
  const ProductCard = ({ product, showLikeButton = false, showSaveButton = false, isLiked = false, isSaved = false }) => {
    const productImage = product.images?.[0] 
      ? getOptimizedImageUrl(product.images[0]) 
      : 'https://via.placeholder.com/300x300?text=No+Image';
    
    const isCloudinaryImage = product.images?.[0]?.includes('cloudinary');
    
    return (
      <div className="group relative">
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img 
              src={productImage} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
            {isCloudinaryImage && (
              <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                <Cloud className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.title}</h3>
            <p className="text-brand-orange font-bold text-sm">₦{(product.price || 0).toLocaleString()}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {product.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {product.views || 0}
              </span>
            </div>
          </div>
        </Link>
        
        {/* Action Buttons Overlay */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          {showLikeButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLike(product.id, isLiked);
              }}
              className={`p-1.5 rounded-full backdrop-blur-sm ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-white hover:bg-red-500 hover:text-white'
              } transition shadow-md`}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          )}
          {showSaveButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSave(product.id, isSaved);
              }}
              className={`p-1.5 rounded-full backdrop-blur-sm ${
                isSaved ? 'bg-brand-orange text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-white hover:bg-brand-orange hover:text-white'
              } transition shadow-md`}
            >
              <Bookmark className={`h-3 w-3 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>
        
        {/* Boost Badge */}
        {product.is_boosted && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <Rocket className="h-3 w-3" />
            Boosted
          </div>
        )}
        
        {/* Status Badge for non-approved products */}
        {product.status === 'pending' && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
            Pending
          </div>
        )}
        {product.status === 'rejected' && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Rejected
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 p-0.5">
                {getAvatarUrl() ? (
                  <img 
                    src={getAvatarUrl()} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/128x128?text=User';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-3xl font-bold text-brand-orange">
                    {profile?.first_name?.[0] || user?.first_name?.[0] || profile?.username?.[0] || 'U'}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-brand-orange text-white p-1.5 rounded-full shadow-md hover:bg-orange-600 transition disabled:opacity-50"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
              </button>
              <input 
                ref={avatarInputRef} 
                type="file" 
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif" 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.first_name || user?.first_name} {profile?.last_name || user?.last_name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{profile?.username || user?.username}</p>
                  {profile?.bio && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 max-w-lg">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                    {profile?.location && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {profile.location}
                      </p>
                    )}
                    {profile?.created_at && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Joined {new Date(profile.created_at).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
                {user?.is_premium && (
                  <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs self-center md:self-auto">
                    <Crown className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center md:justify-start gap-3 mt-4">
                <Link 
                  to="/dashboard/settings" 
                  className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>
                <Link 
                  to="/dashboard/upload" 
                  className="px-5 py-2 rounded-full bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition">
            <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
              <Package className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{products.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition">
            <div className="bg-pink-500 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(followersCount)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition">
            <div className="bg-purple-500 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(followingCount)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md transition">
            <div className="bg-yellow-500 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Likes</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(totalLikes)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'products' 
                  ? 'text-brand-orange border-b-2 border-brand-orange' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              My Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'likes' 
                  ? 'text-brand-orange border-b-2 border-brand-orange' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              Liked Products ({likedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'saved' 
                  ? 'text-brand-orange border-b-2 border-brand-orange' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <Bookmark className="h-4 w-4 inline mr-2" />
              Saved Products ({savedProducts.length})
            </button>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No products yet</p>
                    <Link to="/dashboard/upload" className="inline-block mt-3 text-brand-orange hover:underline">
                      Upload Your First Product
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        showLikeButton={true}
                        showSaveButton={true}
                        isLiked={likedProducts.some(p => p.id === product.id)}
                        isSaved={savedProducts.some(p => p.id === product.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Likes Tab */}
            {activeTab === 'likes' && (
              <>
                {loadingLikes ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
                  </div>
                ) : likedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No liked products yet</p>
                    <Link to="/shop" className="inline-block mt-3 text-brand-orange hover:underline">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {likedProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        showLikeButton={true}
                        showSaveButton={true}
                        isLiked={true}
                        isSaved={savedProducts.some(p => p.id === product.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Saved Tab */}
            {activeTab === 'saved' && (
              <>
                {loadingSaved ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
                  </div>
                ) : savedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No saved products yet</p>
                    <Link to="/shop" className="inline-block mt-3 text-brand-orange hover:underline">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {savedProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        showLikeButton={true}
                        showSaveButton={true}
                        isLiked={likedProducts.some(p => p.id === product.id)}
                        isSaved={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;