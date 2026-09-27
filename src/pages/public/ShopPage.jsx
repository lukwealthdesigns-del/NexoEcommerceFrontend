
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Heart, MessageCircle, Filter, Search, Grid, List,
  ChevronDown, Loader2, ShoppingBag, Eye, Play, User
} from 'lucide-react';
import { productsService } from '../../services/products';
import { useAuthStore } from '../../store/authStore';
import AdsCarousel from '../../components/common/AdsCarousel';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;
  return `http://localhost:8080${path}`;
};

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // searchQuery = what's actually in the input box (updates instantly, never blocked)
  // debouncedSearch = what we actually send to the API (updates 500ms after typing stops)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sort: 'newest'
  });
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [imageErrors, setImageErrors] = useState({});

  // Only true before the very first fetch ever completes.
  // Used to show the full-page spinner ONCE, on initial mount only —
  // never again on later searches/filter changes, so the header/search
  // bar stay mounted (and typing never gets interrupted).
  const [initialLoading, setInitialLoading] = useState(true);

  // Total matching count from the server, if it provides one.
  // Falls back to null when the API doesn't send a total.
  const [totalCount, setTotalCount] = useState(null);

  // Guards against race conditions: if the user types "sh" then "shoe",
  // two requests are in flight. Networks don't guarantee order, so the
  // "sh" response can arrive AFTER the "shoe" response and overwrite it —
  // that's the "results bounce back" bug. Each call to loadProducts stamps
  // a unique id; when a response comes back, we only apply it if it's
  // still the most recent request. Older/stale responses are discarded.
  const latestRequestId = useRef(0);

  const categories = [
    'All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 
    'Sports', 'Toys', 'Books', 'Jewelry', 'Art', 'Other'
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'Brand New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Debounce the search box: only update `debouncedSearch` once the user
  // has stopped typing for 500ms. The user can keep typing freely the
  // whole time — nothing here blocks the input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer); // cancels the pending update if they keep typing
  }, [searchQuery]);

  // Whenever the debounced search term or filters actually change,
  // reset back to page 1 for a fresh result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  // Load products whenever the page, filters, or debounced search changes.
  // This now fires once per "finished" search term instead of once per keystroke.
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, debouncedSearch]);

  const loadProducts = async () => {
    // Stamp this call as the newest one. Any response that comes back
    // once a *newer* call has already started gets thrown away below.
    const requestId = ++latestRequestId.current;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        skip: (page - 1) * 20,
        limit: 20,
        ...(filters.category && filters.category !== 'All' && { category: filters.category }),
        ...(filters.minPrice && { min_price: filters.minPrice }),
        ...(filters.maxPrice && { max_price: filters.maxPrice }),
        ...(filters.condition && { condition: filters.condition }),
        sort: filters.sort,
        ...(debouncedSearch && { search: debouncedSearch })
      };

      const response = await productsService.getProducts(params);

      // A newer request was fired while this one was in flight — this
      // response is stale (belongs to an older search term/page). Drop it
      // so it can't overwrite the newer, correct results.
      if (requestId !== latestRequestId.current) {
        return;
      }

      let newProducts = [];
      if (Array.isArray(response)) {
        newProducts = response;
      } else if (response.products) {
        newProducts = response.products;
      } else if (response.data) {
        newProducts = response.data;
      } else {
        newProducts = response;
      }

      // Try to pick up a real total count from the API response, checking
      // the common shapes backends use for this. If none is present,
      // we just don't claim to know the total (see the label in the JSX).
      const apiTotal =
        response?.total ??
        response?.total_count ??
        response?.count ??
        response?.meta?.total ??
        null;
      setTotalCount(typeof apiTotal === 'number' ? apiTotal : null);

      if (page === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === 20);
    } catch (error) {
      // Stale errors (e.g. an aborted/superseded call) shouldn't toast either.
      if (requestId !== latestRequestId.current) {
        return;
      }
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoading(false);
      }
    }
  };

  const handleLike = async (productId) => {
    if (!user) {
      toast.error('Please login to like products');
      return;
    }

    try {
      if (likedProducts.has(productId)) {
        await productsService.unlikeProduct(productId);
        setLikedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) }
            : p
        ));
      } else {
        await productsService.likeProduct(productId);
        setLikedProducts(prev => new Set([...prev, productId]));
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, likes_count: (p.likes_count || 0) + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Failed to like/unlike:', error);
      toast.error('Action failed');
    }
  };

  const handleImageError = (productId) => {
    if (!imageErrors[productId]) {
      setImageErrors(prev => ({ ...prev, [productId]: true }));
    }
  };

  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      setPage(prev => prev + 1);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const applyFilters = () => {
    setShowFilters(false);
    // page reset to 1 happens automatically via the filters/debouncedSearch effect above
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sort: 'newest'
    });
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Full-page spinner ONLY on the very first load ever (nothing rendered yet).
  // Every later load (search, filters) keeps the header/search bar mounted
  // and shows an inline indicator instead — see `loading` usage below.
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
                Shop
              </h1>
              <div className="flex items-center space-x-2">
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
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setDebouncedSearch(searchQuery)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
                {searchQuery !== debouncedSearch && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                )}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 rounded-xl text-white hover:bg-gray-800 transition w-full lg:w-auto justify-center"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-900 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {conditions.map(cond => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Min Price (₦)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Max Price (₦)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    placeholder="Any"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-400 hover:text-white transition"
                >
                  Reset All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ads Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdsCarousel />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Inline loading overlay for page-1 reloads (search/filter changes).
            Dims the existing grid instead of unmounting the whole page,
            so the header and search input never disappear. */}
        {loading && page === 1 && products.length > 0 && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-16 bg-black/40">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          </div>
        )}

        {loading && page === 1 && products.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {totalCount !== null
                ? `Showing ${products.length} of ${totalCount} products`
                : hasMore
                  ? `Showing ${products.length}+ products`
                  : `Showing ${products.length} products`}
            </p>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
              : "space-y-4"
            }>
              {products.map((product) => {
                const imagePath = product.images && product.images.length > 0 ? product.images[0] : null;
                let displayImage = 'https://via.placeholder.com/400x500?text=No+Image';
                
                if (imagePath && !imageErrors[product.id]) {
                  displayImage = getImageUrl(imagePath);
                }
                
                const sellerName = product.seller_name || 'Seller';
                const sellerId = product.seller_id;
                
                return (
                  <div key={product.id} className="group">
                    {viewMode === 'grid' ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-gray-900">
                        <Link to={`/product/${product.id}`}>
                          <img 
                            src={displayImage}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="eager"
                            onError={() => handleImageError(product.id)}
                          />
                        </Link>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                                {product.title}
                              </h3>
                              <p className="text-brand-orange font-bold text-sm">
                                {formatPrice(product.price)}
                              </p>
                            </Link>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleLike(product.id)}
                                  className="flex items-center space-x-1 text-white hover:text-red-500 transition"
                                >
                                  <Heart className={`h-4 w-4 ${likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                  <span className="text-xs">{product.likes_count || 0}</span>
                                </button>
                                <Link to={`/product/${product.id}#comments`} className="flex items-center space-x-1 text-white hover:text-brand-orange transition">
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="text-xs">{product.comments_count || 0}</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/profile/${sellerId}`}
                          className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1"
                        >
                          <User className="h-3 w-3 text-white" />
                          <span className="text-white text-xs">{sellerName}</span>
                        </Link>
                        
                        {product.condition && product.condition !== 'new' && (
                          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-white text-xs capitalize">{product.condition}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link to={`/product/${product.id}`} className="block bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img 
                              src={displayImage} 
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                              loading="eager"
                              onError={() => handleImageError(product.id)}
                            />
                          </div>
                          <div className="flex-1">
                            <div>
                              <h3 className="text-white font-semibold">{product.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-brand-orange font-bold">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-gray-500 text-sm capitalize">
                                  • {product.condition || 'New'}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Heart className="h-3 w-3" />
                                  <span className="text-xs">{product.likes_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <MessageCircle className="h-3 w-3" />
                                  <span className="text-xs">{product.comments_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Eye className="h-3 w-3" />
                                  <span className="text-xs">{product.views || 0}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <User className="h-3 w-3" />
                                <span>by {sellerName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;