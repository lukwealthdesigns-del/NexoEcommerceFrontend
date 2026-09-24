

// PublicProfilePage.jsx - COMPLETE WORKING VERSION
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usersService } from '../../services/users';
import { productsService } from '../../services/products';
import { Heart, Package, UserPlus, UserCheck, ArrowLeft, MapPin, Calendar, Eye, MessageCircle, Share2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading profile for userId:', userId);
      
      // Get user profile
      const data = await usersService.getPublicProfile(userId);
      console.log('Profile data:', data);
      
      setProfile(data);
      setFollowersCount(data.followers_count || 0);
      setFollowingCount(data.following_count || 0);
      setSalesCount(data.sales_count || 0);
      
      // Check follow status
      const followingStatus = data.is_following === true;
      setIsFollowing(followingStatus);
      console.log('Is following from API:', followingStatus);
      
      // Get user products - try multiple methods
      let userProducts = [];
      try {
        // Method 1: Direct user products endpoint
        userProducts = await usersService.getUserProducts(userId);
        console.log('Products loaded method 1:', userProducts);
      } catch (error1) {
        console.log('Method 1 failed, trying method 2...', error1);
        try {
          // Method 2: Products endpoint with seller filter
          const allProducts = await productsService.getProducts({ seller_id: userId });
          userProducts = Array.isArray(allProducts) ? allProducts : [];
        } catch (error2) {
          console.log('Method 2 failed, trying method 3...', error2);
          try {
            // Method 3: Get all products and filter
            const allProducts = await productsService.getProducts({ limit: 100 });
            userProducts = allProducts.filter(p => p.seller_id === userId || p.seller_id === parseInt(userId));
          } catch (error3) {
            console.error('All methods failed:', error3);
            userProducts = [];
          }
        }
      }
      
      setProducts(userProducts || []);
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Login to follow');
      navigate('/signin');
      return;
    }
    
    const targetUserId = userId;
    
    if (user.id === targetUserId || user.id === parseInt(targetUserId)) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      if (isFollowing) {
        await usersService.unfollowUser(targetUserId);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        toast.success(`Unfollowed ${profile?.first_name || profile?.username}`);
      } else {
        await usersService.followUser(targetUserId);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success(`Now following ${profile?.first_name || profile?.username}`);
      }
    } catch (error) {
      console.error('Follow error:', error);
      
      if (error.response?.data?.detail === 'Already following this user') {
        setIsFollowing(true);
        toast.info('You are already following this user');
      } else if (error.response?.data?.detail === 'You cannot follow yourself') {
        toast.error('You cannot follow yourself');
      } else {
        toast.error(error.response?.data?.detail || 'Action failed');
      }
      
      await loadUserProfile();
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error('Login to send message');
      navigate('/signin');
      return;
    }
    
    if (user.id === userId || user.id === parseInt(userId)) {
      toast.error('You cannot message yourself');
      return;
    }
    
    // Navigate to messages page with user parameter
    navigate(`/dashboard/messages?user=${userId}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.first_name || profile?.username} | Profile`,
          url: url,
        });
        toast.success('Shared!');
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">User not found</p>
          <Link to="/shop" className="text-brand-orange hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && (user.id === userId || user.id === parseInt(userId));
  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile.username;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/shop" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button onClick={handleShare} className="text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 p-0.5 mx-auto mb-3">
            {profile.avatar_url ? (
              <img 
                src={getImageUrl(profile.avatar_url)} 
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/96x96?text=User';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-brand-orange">
                {displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-xl font-bold text-white">{displayName}</h1>
          
          {/* Username */}
          <p className="text-gray-400 text-sm mb-3">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-3">{profile.bio}</p>
          )}

          {/* Location & Join Date */}
          <div className="flex flex-wrap gap-3 justify-center text-gray-400 text-xs">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.location}
              </span>
            )}
            {profile.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Joined {new Date(profile.created_at).getFullYear()}
              </span>
            )}
          </div>

          {/* Follow & Message Buttons */}
          {user && !isOwnProfile && (
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={handleFollow}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                  isFollowing 
                    ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600' 
                    : 'bg-brand-orange text-white hover:bg-orange-600'
                }`}
              >
                {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={handleMessage}
                className="px-5 py-1.5 rounded-full bg-gray-700 text-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-600 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
            </div>
          )}
          
          {/* Login prompt for non-logged in users */}
          {!user && (
            <div className="mt-4">
              <Link 
                to="/signin" 
                className="text-sm text-brand-orange hover:underline"
              >
                Sign in to follow or message
              </Link>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-white">{products.length}</p>
              <p className="text-gray-400 text-xs mt-1">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{followersCount}</p>
              <p className="text-gray-400 text-xs mt-1">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{followingCount}</p>
              <p className="text-gray-400 text-xs mt-1">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{salesCount}</p>
              <p className="text-gray-400 text-xs mt-1">Sales</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-white font-semibold mb-3">Products ({products.length})</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl">
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {products.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <img 
                      src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/300x300?text=No+Image'} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  <p className="text-gray-300 text-xs mt-1 truncate">{product.title}</p>
                  <p className="text-brand-orange text-xs font-semibold">₦{(product.price || 0).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;