

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Edit2, Trash2, Eye, Clock, CheckCircle, XCircle, 
  Plus, Search, Filter, Video, Heart, MessageCircle, TrendingUp,
  ChevronRight, Grid, List, Rocket, Loader2, Zap
} from 'lucide-react';
import { productsService } from '../../services/products';
import { premiumService } from '../../services/premium';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8080${imagePath}`;
};

const UserListings = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [boosting, setBoosting] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  // FORCE RE-RENDER AFTER PRODUCTS LOAD
  useEffect(() => {
    if (products.length > 0) {
      const timer = setTimeout(() => {
        setProducts(prev => [...prev]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [products]);

  const loadProducts = async () => {
    try {
      const data = await productsService.getMyProducts();
      if (data.pending || data.approved || data.rejected) {
        const allProducts = [
          ...(data.pending || []).map(p => ({ ...p, status: 'pending' })),
          ...(data.approved || []).map(p => ({ ...p, status: 'approved' })),
          ...(data.rejected || []).map(p => ({ ...p, status: 'rejected' }))
        ];
        setProducts([...allProducts]);
      } else {
        setProducts([...(data.products || data.data || [])]);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBoostProduct = async (product) => {
    if (!user?.is_premium) {
      toast.error('Premium membership required to boost products');
      return;
    }
    
    setBoosting(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await premiumService.boostProduct(product.id);
      toast.success(`🚀 ${product.title} has been boosted! It will appear as an ad.`);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to boost product');
    } finally {
      setBoosting(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleImageError = (productId) => {
    if (!imageErrors[productId]) {
      setImageErrors(prev => ({ ...prev, [productId]: true }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { 
          color: 'bg-emerald-500/15 text-emerald-400', 
          icon: CheckCircle, 
          text: 'Approved', 
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/10'
        };
      case 'pending':
        return { 
          color: 'bg-amber-500/15 text-amber-400', 
          icon: Clock, 
          text: 'Pending Review', 
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/10'
        };
      case 'rejected':
        return { 
          color: 'bg-rose-500/15 text-rose-400', 
          icon: XCircle, 
          text: 'Rejected', 
          border: 'border-rose-500/30',
          bg: 'bg-rose-500/10'
        };
      default:
        return { 
          color: 'bg-gray-500/15 text-gray-400', 
          icon: Clock, 
          text: status || 'Draft', 
          border: 'border-gray-500/30',
          bg: 'bg-gray-500/10'
        };
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter !== 'all' && product.status !== filter) return false;
    if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Listings</h1>
            <p className="text-gray-400">Manage and track all your products</p>
          </div>
          <Link 
            to="/dashboard/upload" 
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-brand-orange/20"
          >
            <Plus className="h-5 w-5" />
            <span>Upload New Product</span>
          </Link>
        </div>
      </div>

      {/* Premium Boost Banner */}
      {user?.is_premium && (
        <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-2xl p-4 mb-6 border border-yellow-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-white">Premium Member Benefits</h3>
                <p className="text-sm text-gray-400">Boost your approved products to appear as ads</p>
              </div>
            </div>
            <span className="text-xs text-yellow-500">Click the 🚀 button on any approved product</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl p-5 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <Package className="h-8 w-8 text-brand-orange opacity-70" />
            <span className="text-3xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Products</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl p-5 border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-8 w-8 text-amber-400 opacity-70" />
            <span className="text-3xl font-bold text-white">{stats.pending}</span>
          </div>
          <p className="text-gray-400 text-sm">Pending Review</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="h-8 w-8 text-emerald-400 opacity-70" />
            <span className="text-3xl font-bold text-white">{stats.approved}</span>
          </div>
          <p className="text-gray-400 text-sm">Approved</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 rounded-2xl p-5 border border-rose-500/20">
          <div className="flex items-center justify-between mb-3">
            <XCircle className="h-8 w-8 text-rose-400 opacity-70" />
            <span className="text-3xl font-bold text-white">{stats.rejected}</span>
          </div>
          <p className="text-gray-400 text-sm">Rejected</p>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-brand-orange text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 bg-gray-900/50 rounded-xl p-1">
        {[
          { value: 'all', label: 'All Products', count: stats.total, icon: Package },
          { value: 'pending', label: 'Pending', count: stats.pending, icon: Clock },
          { value: 'approved', label: 'Approved', count: stats.approved, icon: CheckCircle },
          { value: 'rejected', label: 'Rejected', count: stats.rejected, icon: XCircle }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab.value 
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              filter === tab.value ? 'bg-white/20' : 'bg-gray-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No {filter !== 'all' ? filter : ''} products found</h3>
          <p className="text-gray-400 mb-6">Get started by uploading your first product</p>
          {filter === 'all' && (
            <Link 
              to="/dashboard/upload" 
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              <Plus className="h-5 w-5" />
              Upload Your First Product
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, index) => {
            const StatusIcon = getStatusBadge(product.status).icon;
            const statusStyle = getStatusBadge(product.status);
            const imageUrl = product.images?.[0];
            let displayImage = 'https://via.placeholder.com/400x400?text=No+Image';
            
            if (imageUrl && !imageErrors[product.id]) {
              displayImage = getImageUrl(imageUrl);
            }
            
            return (
              <div key={`${product.id}-${index}`} className="group bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  <img 
                    key={`img-${product.id}-${imageUrl}`}
                    src={displayImage} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    onError={() => handleImageError(product.id)}
                  />
                  
                  {/* Boosted Badge */}
                  {product.is_boosted && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                      <Zap className="h-3 w-3" />
                      Boosted
                    </div>
                  )}
                  
                  {product.has_video && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                      <Video className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  <div className={`absolute top-3 right-3 ${statusStyle.bg} backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 border ${statusStyle.border}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">{statusStyle.text}</span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-around">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Heart className="h-3 w-3" />
                        <span>{product.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <MessageCircle className="h-3 w-3" />
                        <span>{product.comments_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Eye className="h-3 w-3" />
                        <span>{product.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-base truncate mb-1">{product.title}</h3>
                  <p className="text-brand-orange font-bold text-lg">{formatPrice(product.price)}</p>
                  <p className="text-gray-400 text-xs line-clamp-2 mt-2">{product.description}</p>
                  
                  {product.rejection_reason && product.status === 'rejected' && (
                    <div className="mt-3 p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                      <p className="text-rose-400 text-xs font-medium mb-0.5">Rejection Reason:</p>
                      <p className="text-rose-300 text-xs">{product.rejection_reason}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                    <div className="flex gap-2">
                      <Link 
                        to={`/product/${product.id}`}
                        target="_blank"
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition group"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4 text-gray-400 group-hover:text-white transition" />
                      </Link>
                      {product.status !== 'approved' && (
                        <Link 
                          to={`/dashboard/listings/edit/${product.id}`}
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition group"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4 text-gray-400 group-hover:text-white transition" />
                        </Link>
                      )}
                      
                      {/* BOOST BUTTON - Only for premium users with approved products */}
                      {user?.is_premium && product.status === 'approved' && (
                        <button
                          onClick={() => handleBoostProduct(product)}
                          disabled={boosting[product.id]}
                          className="p-2 bg-gray-800 rounded-lg hover:bg-yellow-500/20 transition group"
                          title="Boost Product (Appears as Ad)"
                        >
                          {boosting[product.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                          ) : (
                            <Rocket className="h-4 w-4 text-gray-400 group-hover:text-yellow-500 transition" />
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-rose-500/20 transition group"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-rose-400 transition" />
                      </button>
                    </div>
                    
                    {product.views > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        <span>{product.views} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product, index) => {
            const StatusIcon = getStatusBadge(product.status).icon;
            const statusStyle = getStatusBadge(product.status);
            const imageUrl = product.images?.[0];
            let displayImage = 'https://via.placeholder.com/100x100?text=No+Image';
            
            if (imageUrl && !imageErrors[product.id]) {
              displayImage = getImageUrl(imageUrl);
            }
            
            return (
              <div key={`${product.id}-${index}`} className="group bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300 p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-800">
                    <img 
                      key={`img-${product.id}-${imageUrl}`}
                      src={displayImage} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={() => handleImageError(product.id)}
                    />
                    {product.has_video && (
                      <div className="absolute top-1 left-1 bg-black/60 rounded px-1 py-0.5">
                        <Video className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-white font-semibold text-base truncate">{product.title}</h3>
                          <div className={`flex items-center gap-1 ${statusStyle.color} text-xs px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{statusStyle.text}</span>
                          </div>
                        </div>
                        <p className="text-brand-orange font-bold text-lg">{formatPrice(product.price)}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{product.description}</p>
                        
                        {product.rejection_reason && product.status === 'rejected' && (
                          <p className="text-rose-400 text-xs mt-1">Reason: {product.rejection_reason}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Link>
                        {product.status !== 'approved' && (
                          <Link 
                            to={`/dashboard/listings/edit/${product.id}`}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                          >
                            <Edit2 className="h-4 w-4 text-gray-400" />
                          </Link>
                        )}
                        
                        {/* BOOST BUTTON - Only for premium users with approved products */}
                        {user?.is_premium && product.status === 'approved' && (
                          <button
                            onClick={() => handleBoostProduct(product)}
                            disabled={boosting[product.id]}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-yellow-500/20 transition"
                          >
                            {boosting[product.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                            ) : (
                              <Rocket className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-gray-800 rounded-lg hover:bg-rose-500/20 transition"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-rose-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {product.likes_count || 0} likes</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {product.views || 0} views</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserListings;