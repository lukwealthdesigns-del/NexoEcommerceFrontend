
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from 'react';

// import { Link, useSearchParams } from 'react-router-dom';

// import {
//   Heart,
//   MessageCircle,
//   Filter,
//   Search,
//   Grid,
//   List,
//   ChevronDown,
//   Loader2,
//   ShoppingBag,
//   Eye,
//   User,
//   Zap,
// } from 'lucide-react';

// import { productsService } from '../../services/products';
// import { useAuthStore } from '../../store/authStore';
// import AdsCarousel from '../../components/common/AdsCarousel';
// import toast from 'react-hot-toast';

// const PAGE_SIZE = 20;

// const API_BASE_URL = (
//   import.meta.env.VITE_API_URL || 'http://localhost:8080'
// ).replace(/\/+$/, '');

// const getImageUrl = (path) => {
//   if (!path || typeof path !== 'string') return null;

//   if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
//     return path;
//   }

//   if (path.startsWith('//')) {
//     return `${window.location.protocol}${path}`;
//   }

//   return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
// };

// const extractProducts = (response) => {
//   const payload = response?.data ?? response;

//   if (Array.isArray(payload)) {
//     return { products: payload, total: payload.length };
//   }

//   const candidates = [
//     payload?.products,
//     payload?.items,
//     payload?.results,
//     payload?.data,
//   ];

//   const products = candidates.find(Array.isArray) || [];

//   const rawTotal =
//     payload?.total ??
//     payload?.total_count ??
//     payload?.count ??
//     payload?.meta?.total ??
//     payload?.pagination?.total ??
//     null;

//   const total =
//     rawTotal !== null &&
//     rawTotal !== undefined &&
//     rawTotal !== '' &&
//     Number.isFinite(Number(rawTotal))
//       ? Number(rawTotal)
//       : null;

//   return { products, total };
// };

// const ShopPage = () => {
//   const [searchParams] = useSearchParams();
//   const { user } = useAuthStore();

//   const initialProductType =
//     searchParams.get('promoted') === 'true' ||
//     searchParams.get('boosted') === 'true'
//       ? 'boosted'
//       : 'all';

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const [page, setPage] = useState(1);
//   const [viewMode, setViewMode] = useState('grid');
//   const [showFilters, setShowFilters] = useState(false);

//   const initialSearch = searchParams.get('search') || '';

//   const [searchQuery, setSearchQuery] = useState(initialSearch);
//   const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
//   const [productType, setProductType] = useState(initialProductType);

//   const [filters, setFilters] = useState({
//     category: searchParams.get('category') || '',
//     minPrice: '',
//     maxPrice: '',
//     condition: '',
//     sort: 'newest',
//   });

//   const [likedProducts, setLikedProducts] = useState(new Set());
//   const [imageErrors, setImageErrors] = useState({});
//   const [totalCount, setTotalCount] = useState(null);

//   const latestRequestId = useRef(0);
//   const lastQueryKey = useRef(null);

//   const categories = [
//     'All',
//     'Electronics',
//     'Fashion',
//     'Home & Living',
//     'Beauty',
//     'Sports',
//     'Toys',
//     'Books',
//     'Jewelry',
//     'Art',
//     'Other',
//   ];

//   const conditions = [
//     { value: '', label: 'Any Condition' },
//     { value: 'new', label: 'Brand New' },
//     { value: 'like_new', label: 'Like New' },
//     { value: 'good', label: 'Good' },
//     { value: 'fair', label: 'Fair' },
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Newest First' },
//     { value: 'price_asc', label: 'Price: Low to High' },
//     { value: 'price_desc', label: 'Price: High to Low' },
//     { value: 'popular', label: 'Most Popular' },
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchQuery.trim());
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const formatPrice = (price) => {
//     const amount = Number(price);

//     if (!Number.isFinite(amount)) {
//       return 'Price unavailable';
//     }

//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const loadProducts = useCallback(async () => {
//     const requestId = ++latestRequestId.current;
//     const requestedPage = page;

//     if (requestedPage === 1) {
//       setLoading(true);
//       setLoadingMore(false);
//     } else {
//       setLoadingMore(true);
//     }

//     try {
//       let fetchedProducts = [];
//       let total = null;

//       if (productType === 'boosted') {
//         /*
//          * IMPORTANT:
//          * The backend endpoint already selects boosted products.
//          * Do not filter its response again by is_boosted,
//          * is_promoted, or boosted flags because older product
//          * records may not contain those fields.
//          */
//         const response = await productsService.getBoostedProducts();

//         const extracted = extractProducts(response);

//         // Trust the dedicated boosted endpoint.
//         let filteredProducts = extracted.products;

//         // Remove duplicate products if the API happens to return any.
//         const uniqueProducts = [];
//         const seenIds = new Set();

//         for (const product of filteredProducts) {
//           const key = product?.id ?? product?.product_id;

//           if (key !== undefined && key !== null) {
//             if (seenIds.has(String(key))) continue;
//             seenIds.add(String(key));
//           }

//           uniqueProducts.push(product);
//         }

//         filteredProducts = uniqueProducts;

//         // Category filter.
//         if (filters.category && filters.category !== 'All') {
//           filteredProducts = filteredProducts.filter(
//             (product) =>
//               String(product.category || '').toLowerCase() ===
//               filters.category.toLowerCase()
//           );
//         }

//         // Search filter.
//         if (debouncedSearch) {
//           const query = debouncedSearch.toLowerCase();

//           filteredProducts = filteredProducts.filter((product) =>
//             [
//               product.title,
//               product.description,
//               product.category,
//               product.seller_name,
//             ]
//               .filter(Boolean)
//               .join(' ')
//               .toLowerCase()
//               .includes(query)
//           );
//         }

//         // Minimum price filter.
//         if (filters.minPrice !== '') {
//           filteredProducts = filteredProducts.filter(
//             (product) =>
//               Number(product.price) >= Number(filters.minPrice)
//           );
//         }

//         // Maximum price filter.
//         if (filters.maxPrice !== '') {
//           filteredProducts = filteredProducts.filter(
//             (product) =>
//               Number(product.price) <= Number(filters.maxPrice)
//           );
//         }

//         // Condition filter.
//         if (filters.condition) {
//           filteredProducts = filteredProducts.filter(
//             (product) =>
//               String(product.condition || '').toLowerCase() ===
//               filters.condition.toLowerCase()
//           );
//         }

//         // Sorting.
//         if (filters.sort === 'price_asc') {
//           filteredProducts.sort(
//             (a, b) => Number(a.price) - Number(b.price)
//           );
//         } else if (filters.sort === 'price_desc') {
//           filteredProducts.sort(
//             (a, b) => Number(b.price) - Number(a.price)
//           );
//         } else if (filters.sort === 'popular') {
//           filteredProducts.sort((a, b) => {
//             const popularityA =
//               Number(a.views || 0) +
//               Number(a.likes_count || 0) * 10;

//             const popularityB =
//               Number(b.views || 0) +
//               Number(b.likes_count || 0) * 10;

//             return popularityB - popularityA;
//           });
//         } else {
//           // Newest first when a usable date exists.
//           filteredProducts.sort((a, b) => {
//             const dateA = new Date(
//               a.boosted_at || a.created_at || 0
//             ).getTime();

//             const dateB = new Date(
//               b.boosted_at || b.created_at || 0
//             ).getTime();

//             return dateB - dateA;
//           });
//         }

//         total = filteredProducts.length;

//         const start = (requestedPage - 1) * PAGE_SIZE;

//         fetchedProducts = filteredProducts.slice(
//           start,
//           start + PAGE_SIZE
//         );

//         if (requestId !== latestRequestId.current) return;

//         setHasMore(start + fetchedProducts.length < total);
//       } else {
//         // Normal Shop functionality remains unchanged.
//         const params = {
//           skip: (requestedPage - 1) * PAGE_SIZE,
//           limit: PAGE_SIZE,
//           sort: filters.sort,
//         };

//         if (filters.category && filters.category !== 'All') {
//           params.category = filters.category;
//         }

//         if (filters.minPrice !== '') {
//           params.min_price = filters.minPrice;
//         }

//         if (filters.maxPrice !== '') {
//           params.max_price = filters.maxPrice;
//         }

//         if (filters.condition) {
//           params.condition = filters.condition;
//         }

//         if (debouncedSearch) {
//           params.search = debouncedSearch;
//         }

//         const response = await productsService.getProducts(params);
//         const extracted = extractProducts(response);

//         fetchedProducts = extracted.products;
//         total = extracted.total;

//         if (requestId !== latestRequestId.current) return;

//         if (total !== null) {
//           const loadedCount =
//             (requestedPage - 1) * PAGE_SIZE +
//             fetchedProducts.length;

//           setHasMore(loadedCount < total);
//         } else {
//           setHasMore(fetchedProducts.length === PAGE_SIZE);
//         }
//       }

//       if (requestId !== latestRequestId.current) return;

//       setProducts((previous) => {
//         if (requestedPage === 1) {
//           return fetchedProducts;
//         }

//         const existingIds = new Set(
//           previous.map((product) => String(product.id))
//         );

//         return [
//           ...previous,
//           ...fetchedProducts.filter(
//             (product) => !existingIds.has(String(product.id))
//           ),
//         ];
//       });

//       setTotalCount(total);
//     } catch (error) {
//       if (requestId !== latestRequestId.current) return;

//       console.error('Failed to load products:', error);

//       toast.error(
//         error?.response?.data?.detail ||
//           'Failed to load products'
//       );
//     } finally {
//       if (requestId === latestRequestId.current) {
//         setLoading(false);
//         setLoadingMore(false);
//         setInitialLoading(false);
//       }
//     }
//   }, [page, filters, debouncedSearch, productType]);

//   // Reset pagination when search or filters change.
//   useEffect(() => {
//     const queryKey = JSON.stringify({
//       search: debouncedSearch,
//       filters,
//       productType,
//     });

//     if (lastQueryKey.current !== queryKey) {
//       lastQueryKey.current = queryKey;

//       if (page !== 1) {
//         setPage(1);
//         return;
//       }
//     }

//     loadProducts();
//   }, [
//     page,
//     filters,
//     debouncedSearch,
//     productType,
//     loadProducts,
//   ]);

//   const handleLike = async (productId) => {
//     if (!user) {
//       toast.error('Please log in to like products');
//       return;
//     }

//     const alreadyLiked = likedProducts.has(productId);

//     try {
//       if (alreadyLiked) {
//         await productsService.unlikeProduct(productId);

//         setLikedProducts((previous) => {
//           const updated = new Set(previous);
//           updated.delete(productId);
//           return updated;
//         });

//         setProducts((previous) =>
//           previous.map((product) =>
//             product.id === productId
//               ? {
//                   ...product,
//                   likes_count: Math.max(
//                     0,
//                     Number(product.likes_count || 0) - 1
//                   ),
//                 }
//               : product
//           )
//         );
//       } else {
//         await productsService.likeProduct(productId);

//         setLikedProducts((previous) =>
//           new Set([...previous, productId])
//         );

//         setProducts((previous) =>
//           previous.map((product) =>
//             product.id === productId
//               ? {
//                   ...product,
//                   likes_count:
//                     Number(product.likes_count || 0) + 1,
//                 }
//               : product
//           )
//         );
//       }
//     } catch (error) {
//       console.error('Failed to like or unlike product:', error);

//       toast.error(
//         error?.response?.data?.detail || 'Action failed'
//       );
//     }
//   };

//   const handleImageError = (productId) => {
//     setImageErrors((previous) => ({
//       ...previous,
//       [productId]: true,
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       condition: '',
//       sort: 'newest',
//     });

//     setSearchQuery('');
//     setDebouncedSearch('');
//     setProductType('all');
//   };

//   const updateFilter = (key, value) => {
//     setFilters((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const applyFilters = () => {
//     if (
//       filters.minPrice !== '' &&
//       Number(filters.minPrice) < 0
//     ) {
//       toast.error('Minimum price cannot be negative');
//       return;
//     }

//     if (
//       filters.maxPrice !== '' &&
//       Number(filters.maxPrice) < 0
//     ) {
//       toast.error('Maximum price cannot be negative');
//       return;
//     }

//     if (
//       filters.minPrice !== '' &&
//       filters.maxPrice !== '' &&
//       Number(filters.minPrice) > Number(filters.maxPrice)
//     ) {
//       toast.error('Minimum price cannot exceed maximum price');
//       return;
//     }

//     setShowFilters(false);
//   };

//   const handleScroll = useCallback(() => {
//     if (loading || loadingMore || !hasMore) return;

//     const scrollTop =
//       window.scrollY || document.documentElement.scrollTop;

//     const scrollHeight =
//       document.documentElement.scrollHeight;

//     const clientHeight = window.innerHeight;

//     if (scrollTop + clientHeight >= scrollHeight - 500) {
//       setPage((previous) => previous + 1);
//     }
//   }, [loading, loadingMore, hasMore]);

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);

//   if (initialLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center bg-black">
//         <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
//         <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
//             <div className="flex w-full items-center space-x-3 lg:w-auto">
//               <h1 className="whitespace-nowrap bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
//                 Shop
//               </h1>

//               <button
//                 type="button"
//                 aria-label="Grid view"
//                 aria-pressed={viewMode === 'grid'}
//                 onClick={() => setViewMode('grid')}
//                 className={`rounded-lg p-2 transition ${
//                   viewMode === 'grid'
//                     ? 'bg-brand-orange text-white'
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 <Grid className="h-5 w-5" />
//               </button>

//               <button
//                 type="button"
//                 aria-label="List view"
//                 aria-pressed={viewMode === 'list'}
//                 onClick={() => setViewMode('list')}
//                 className={`rounded-lg p-2 transition ${
//                   viewMode === 'list'
//                     ? 'bg-brand-orange text-white'
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 <List className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="w-full flex-1 lg:max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(event) =>
//                     setSearchQuery(event.target.value)
//                   }
//                   onKeyDown={(event) => {
//                     if (event.key === 'Enter') {
//                       setDebouncedSearch(searchQuery.trim());
//                     }
//                   }}
//                   placeholder="Search products..."
//                   aria-label="Search products"
//                   className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2 pl-10 pr-10 text-white placeholder-gray-500 focus:border-brand-orange focus:outline-none"
//                 />

//                 {searchQuery.trim() !== debouncedSearch && (
//                   <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
//                 )}
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => setShowFilters((previous) => !previous)}
//               aria-expanded={showFilters}
//               className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-900 px-4 py-2 transition hover:bg-gray-800 lg:w-auto"
//             >
//               <Filter className="h-5 w-5" />
//               <span>Filters</span>
//               <ChevronDown
//                 className={`h-4 w-4 transition-transform ${
//                   showFilters ? 'rotate-180' : ''
//                 }`}
//               />
//             </button>
//           </div>

//           {showFilters && (
//             <div className="mt-4 rounded-xl bg-gray-900 p-4">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Product Type
//                   </label>

//                   <select
//                     value={productType}
//                     onChange={(event) =>
//                       setProductType(event.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   >
//                     <option value="all">All Products</option>
//                     <option value="boosted">Boosted Products Only</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Category
//                   </label>

//                   <select
//                     value={filters.category}
//                     onChange={(event) =>
//                       updateFilter('category', event.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   >
//                     {categories.map((category) => (
//                       <option
//                         key={category}
//                         value={category === 'All' ? '' : category}
//                       >
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Condition
//                   </label>

//                   <select
//                     value={filters.condition}
//                     onChange={(event) =>
//                       updateFilter('condition', event.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   >
//                     {conditions.map((condition) => (
//                       <option
//                         key={condition.value}
//                         value={condition.value}
//                       >
//                         {condition.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Minimum Price (₦)
//                   </label>

//                   <input
//                     type="number"
//                     min="0"
//                     value={filters.minPrice}
//                     onChange={(event) =>
//                       updateFilter('minPrice', event.target.value)
//                     }
//                     placeholder="0"
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Maximum Price (₦)
//                   </label>

//                   <input
//                     type="number"
//                     min="0"
//                     value={filters.maxPrice}
//                     onChange={(event) =>
//                       updateFilter('maxPrice', event.target.value)
//                     }
//                     placeholder="Any"
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm text-gray-400">
//                     Sort By
//                   </label>

//                   <select
//                     value={filters.sort}
//                     onChange={(event) =>
//                       updateFilter('sort', event.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
//                   >
//                     {sortOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-4 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={resetFilters}
//                   className="px-4 py-2 text-gray-400 transition hover:text-white"
//                 >
//                   Reset All
//                 </button>

//                 <button
//                   type="button"
//                   onClick={applyFilters}
//                   className="rounded-lg bg-brand-orange px-6 py-2 text-white transition hover:bg-orange-600"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         <AdsCarousel />
//       </div>

//       <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {productType === 'boosted' && (
//           <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
//             <Zap className="h-6 w-6 shrink-0 text-brand-orange" />
//             <div>
//               <h2 className="font-semibold text-white">
//                 Boosted Products
//               </h2>
//               <p className="text-sm text-gray-300">
//                 Browse currently available boosted listings.
//               </p>
//             </div>
//           </div>
//         )}

//         {loading && products.length > 0 && (
//           <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/40 pt-16">
//             <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
//           </div>
//         )}

//         {loading && products.length === 0 ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
//           </div>
//         ) : products.length === 0 ? (
//           <div className="py-20 text-center">
//             <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-600" />

//             <h3 className="mb-2 text-xl font-semibold">
//               {productType === 'boosted'
//                 ? 'No boosted products found'
//                 : 'No products found'}
//             </h3>

//             <p className="text-gray-400">
//               {productType === 'boosted'
//                 ? 'No boosted products match your current filters.'
//                 : 'Try another search term or adjust your filters.'}
//             </p>

//             <button
//               type="button"
//               onClick={resetFilters}
//               className="mt-4 rounded-lg bg-brand-orange px-5 py-2 text-white hover:bg-orange-600"
//             >
//               Clear Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             <p className="mb-4 text-sm text-gray-400">
//               {totalCount !== null
//                 ? `Showing ${products.length} of ${totalCount} products`
//                 : hasMore
//                   ? `Showing ${products.length}+ products`
//                   : `Showing ${products.length} products`}
//             </p>

//             <div
//               className={
//                 viewMode === 'grid'
//                   ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
//                   : 'space-y-4'
//               }
//             >
//               {products.map((product) => {
//                 const productId = product.id ?? product.product_id;

//                 const imagePath = Array.isArray(product.images)
//                   ? product.images[0]
//                   : product.image_url || product.image || null;

//                 const displayImage = imageErrors[productId]
//                   ? null
//                   : getImageUrl(imagePath);

//                 const sellerName = product.seller_name || 'Seller';
//                 const sellerId = product.seller_id;

//                 return (
//                   <article key={productId} className="group min-w-0">
//                     {viewMode === 'grid' ? (
//                       <div className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-gray-900">
//                         <Link
//                           to={`/product/${productId}`}
//                           className="block h-full w-full"
//                         >
//                           {displayImage ? (
//                             <img
//                               src={displayImage}
//                               alt={product.title || 'Product'}
//                               className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//                               loading="lazy"
//                               onError={() => handleImageError(productId)}
//                             />
//                           ) : (
//                             <div className="flex h-full flex-col items-center justify-center text-gray-500">
//                               <ShoppingBag className="mb-2 h-10 w-10" />
//                               <span className="text-xs">
//                                 No image available
//                               </span>
//                             </div>
//                           )}
//                         </Link>

//                         <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
//                           <div className="absolute bottom-0 left-0 right-0 p-3">
//                             <Link
//                               to={`/product/${productId}`}
//                               className="pointer-events-auto"
//                             >
//                               <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white">
//                                 {product.title}
//                               </h3>

//                               <p className="text-sm font-bold text-brand-orange">
//                                 {formatPrice(product.price)}
//                               </p>
//                             </Link>

//                             <div className="pointer-events-auto mt-2 flex items-center space-x-3">
//                               <button
//                                 type="button"
//                                 onClick={() => handleLike(productId)}
//                                 aria-label="Like product"
//                                 className="flex items-center space-x-1 text-white transition hover:text-red-500"
//                               >
//                                 <Heart
//                                   className={`h-4 w-4 ${
//                                     likedProducts.has(productId)
//                                       ? 'fill-red-500 text-red-500'
//                                       : ''
//                                   }`}
//                                 />
//                                 <span className="text-xs">
//                                   {product.likes_count || 0}
//                                 </span>
//                               </button>

//                               <Link
//                                 to={`/product/${productId}#comments`}
//                                 className="flex items-center space-x-1 text-white transition hover:text-brand-orange"
//                               >
//                                 <MessageCircle className="h-4 w-4" />
//                                 <span className="text-xs">
//                                   {product.comments_count || 0}
//                                 </span>
//                               </Link>
//                             </div>
//                           </div>
//                         </div>

//                         {productType === 'boosted' && (
//                           <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-brand-orange px-2 py-1 text-xs font-semibold text-white">
//                             <Zap className="h-3 w-3" />
//                             Boosted
//                           </span>
//                         )}

//                         {sellerId && (
//                           <Link
//                             to={`/profile/${sellerId}`}
//                             className="absolute right-2 top-2 flex max-w-[85%] items-center space-x-1 truncate rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm"
//                           >
//                             <User className="h-3 w-3 shrink-0 text-white" />
//                             <span className="truncate text-xs text-white">
//                               {sellerName}
//                             </span>
//                           </Link>
//                         )}

//                         {product.condition &&
//                           product.condition !== 'new' && (
//                             <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1">
//                               <span className="text-xs capitalize text-white">
//                                 {product.condition.replace('_', ' ')}
//                               </span>
//                             </div>
//                           )}
//                       </div>
//                     ) : (
//                       <div className="flex gap-4 overflow-hidden rounded-xl bg-gray-900 p-4 transition hover:bg-gray-800">
//                         <Link
//                           to={`/product/${productId}`}
//                           className="h-24 w-24 shrink-0 sm:h-32 sm:w-32"
//                         >
//                           {displayImage ? (
//                             <img
//                               src={displayImage}
//                               alt={product.title || 'Product'}
//                               className="h-full w-full rounded-lg object-cover"
//                               loading="lazy"
//                               onError={() => handleImageError(productId)}
//                             />
//                           ) : (
//                             <div className="flex h-full items-center justify-center rounded-lg bg-gray-800 text-gray-500">
//                               <ShoppingBag className="h-8 w-8" />
//                             </div>
//                           )}
//                         </Link>

//                         <div className="min-w-0 flex-1">
//                           <Link to={`/product/${productId}`}>
//                             <h3 className="font-semibold text-white">
//                               {product.title}
//                             </h3>

//                             <p className="mt-1 font-bold text-brand-orange">
//                               {formatPrice(product.price)}
//                             </p>
//                           </Link>

//                           {productType === 'boosted' && (
//                             <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-1 text-xs text-brand-orange">
//                               <Zap className="h-3 w-3" />
//                               Boosted
//                             </span>
//                           )}

//                           <p className="mt-1 line-clamp-2 text-sm text-gray-400">
//                             {product.description || ''}
//                           </p>

//                           <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-400">
//                             <button
//                               type="button"
//                               onClick={() => handleLike(productId)}
//                               className="flex items-center gap-1 hover:text-red-500"
//                             >
//                               <Heart
//                                 className={`h-3 w-3 ${
//                                   likedProducts.has(productId)
//                                     ? 'fill-red-500 text-red-500'
//                                     : ''
//                                 }`}
//                               />
//                               <span className="text-xs">
//                                 {product.likes_count || 0}
//                               </span>
//                             </button>

//                             <Link
//                               to={`/product/${productId}#comments`}
//                               className="flex items-center gap-1 hover:text-brand-orange"
//                             >
//                               <MessageCircle className="h-3 w-3" />
//                               <span className="text-xs">
//                                 {product.comments_count || 0}
//                               </span>
//                             </Link>

//                             <span className="flex items-center gap-1">
//                               <Eye className="h-3 w-3" />
//                               <span className="text-xs">
//                                 {product.views || 0}
//                               </span>
//                             </span>
//                           </div>

//                           <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//                             <User className="h-3 w-3" />
//                             <span>By {sellerName}</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           </>
//         )}

//         {loadingMore && (
//           <div className="flex justify-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
//           </div>
//         )}

//         {!hasMore && products.length > 0 && !loading && (
//           <div className="py-8 text-center text-sm text-gray-500">
//             You've reached the end
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ShopPage;

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import {
  Heart,
  MessageCircle,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  Loader2,
  ShoppingBag,
  Eye,
  User,
  Zap,
} from 'lucide-react';

import { productsService } from '../../services/products';
import { useAuthStore } from '../../store/authStore';
import AdsCarousel from '../../components/common/AdsCarousel';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080'
).replace(/\/+$/, '');

const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;

  if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
    return path;
  }

  if (path.startsWith('//')) {
    return `${window.location.protocol}${path}`;
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

const extractProducts = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return {
      products: payload,
      total: payload.length,
    };
  }

  const candidates = [
    payload?.products,
    payload?.items,
    payload?.results,
    payload?.data,
  ];

  const products = candidates.find(Array.isArray) || [];

  const rawTotal =
    payload?.total ??
    payload?.total_count ??
    payload?.count ??
    payload?.meta?.total ??
    payload?.pagination?.total ??
    null;

  const total =
    rawTotal !== null &&
    rawTotal !== undefined &&
    rawTotal !== '' &&
    Number.isFinite(Number(rawTotal))
      ? Number(rawTotal)
      : null;

  return { products, total };
};

const getProductId = (product) =>
  product?.id ?? product?.product_id;

const getProductPrice = (product) =>
  Number(product?.price ?? 0);

const getProductSearchText = (product) =>
  [
    product?.title,
    product?.description,
    product?.category,
    product?.seller_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const initialProductType =
    searchParams.get('promoted') === 'true' ||
    searchParams.get('boosted') === 'true'
      ? 'boosted'
      : 'all';

  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] =
    useState(initialSearch);

  const [productType, setProductType] =
    useState(initialProductType);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sort: 'newest',
  });

  const [likedProducts, setLikedProducts] = useState(new Set());
  const [imageErrors, setImageErrors] = useState({});
  const [totalCount, setTotalCount] = useState(null);

  const latestRequestId = useRef(0);
  const lastQueryKey = useRef(null);

  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Sports',
    'Toys',
    'Books',
    'Jewelry',
    'Art',
    'Other',
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'Brand New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return 'Price unavailable';
    }

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ─────────────────────────────────────────────────────────────
  // LOAD PRODUCTS
  // ─────────────────────────────────────────────────────────────

  const loadProducts = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    const requestedPage = page;

    if (requestedPage === 1) {
      setLoading(true);
      setLoadingMore(false);
    } else {
      setLoadingMore(true);
    }

    try {
      let fetchedProducts = [];
      let total = null;

      if (productType === 'boosted') {
        // Load boosted products from the dedicated premium endpoint.
        const response =
          await productsService.getBoostedProducts();

        const extracted = extractProducts(response);

        let filteredProducts = extracted.products;

        // Remove duplicates.
        const uniqueProducts = [];
        const seenIds = new Set();

        for (const product of filteredProducts) {
          const id = getProductId(product);

          if (id !== undefined && id !== null) {
            const key = String(id);

            if (seenIds.has(key)) continue;

            seenIds.add(key);
          }

          uniqueProducts.push(product);
        }

        filteredProducts = uniqueProducts;

        // Category filter.
        if (filters.category) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              String(product.category || '').toLowerCase() ===
              filters.category.toLowerCase()
          );
        }

        // Search filter.
        if (debouncedSearch) {
          filteredProducts = filteredProducts.filter((product) =>
            getProductSearchText(product).includes(
              debouncedSearch.toLowerCase()
            )
          );
        }

        // Minimum price.
        if (filters.minPrice !== '') {
          filteredProducts = filteredProducts.filter(
            (product) =>
              getProductPrice(product) >=
              Number(filters.minPrice)
          );
        }

        // Maximum price.
        if (filters.maxPrice !== '') {
          filteredProducts = filteredProducts.filter(
            (product) =>
              getProductPrice(product) <=
              Number(filters.maxPrice)
          );
        }

        // Condition.
        if (filters.condition) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              String(product.condition || '').toLowerCase() ===
              filters.condition.toLowerCase()
          );
        }

        // Sort boosted listings.
        if (filters.sort === 'price_asc') {
          filteredProducts.sort(
            (a, b) =>
              getProductPrice(a) - getProductPrice(b)
          );
        } else if (filters.sort === 'price_desc') {
          filteredProducts.sort(
            (a, b) =>
              getProductPrice(b) - getProductPrice(a)
          );
        } else if (filters.sort === 'popular') {
          filteredProducts.sort((a, b) => {
            const popularityA =
              Number(a.views || 0) +
              Number(a.likes_count || 0) * 10;

            const popularityB =
              Number(b.views || 0) +
              Number(b.likes_count || 0) * 10;

            return popularityB - popularityA;
          });
        } else {
          filteredProducts.sort((a, b) => {
            const dateA = new Date(
              a.boosted_at || a.created_at || 0
            ).getTime();

            const dateB = new Date(
              b.boosted_at || b.created_at || 0
            ).getTime();

            return dateB - dateA;
          });
        }

        total = filteredProducts.length;

        // Boosted endpoint returns the available boosted list;
        // paginate that list locally.
        const start = (requestedPage - 1) * PAGE_SIZE;

        fetchedProducts = filteredProducts.slice(
          start,
          start + PAGE_SIZE
        );

        if (requestId !== latestRequestId.current) return;

        setHasMore(start + fetchedProducts.length < total);
      } else {
        /*
         * NORMAL SHOP:
         * Do not send limit: 20.
         *
         * productsService.getProducts now omits the limit unless
         * explicitly provided. The backend must support returning
         * all matching approved products when limit is omitted.
         */
        const params = {
          sort: filters.sort,
        };

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.minPrice !== '') {
          params.min_price = filters.minPrice;
        }

        if (filters.maxPrice !== '') {
          params.max_price = filters.maxPrice;
        }

        if (filters.condition) {
          params.condition = filters.condition;
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const response =
          await productsService.getProducts(params);

        const extracted = extractProducts(response);

        fetchedProducts = extracted.products;

        total =
          extracted.total !== null
            ? extracted.total
            : fetchedProducts.length;

        if (requestId !== latestRequestId.current) return;

        // Normal Shop loaded the complete matching response.
        setHasMore(false);
      }

      if (requestId !== latestRequestId.current) return;

      // Deduplicate and replace or append products.
      setProducts((previous) => {
        const base =
          requestedPage === 1 ? [] : previous;

        const existingIds = new Set(
          base
            .map(getProductId)
            .filter((id) => id !== undefined && id !== null)
            .map(String)
        );

        const uniqueNewProducts = fetchedProducts.filter(
          (product) => {
            const id = getProductId(product);

            if (id === undefined || id === null) {
              return true;
            }

            const key = String(id);

            if (existingIds.has(key)) return false;

            existingIds.add(key);
            return true;
          }
        );

        return [...base, ...uniqueNewProducts];
      });

      setTotalCount(total);
    } catch (error) {
      if (requestId !== latestRequestId.current) return;

      console.error('Failed to load products:', error);

      toast.error(
        error?.response?.data?.detail ||
          'Failed to load products'
      );
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoading(false);
      }
    }
  }, [page, filters, debouncedSearch, productType]);

  // Reset pagination and reload when filters change.
  useEffect(() => {
    const queryKey = JSON.stringify({
      search: debouncedSearch,
      filters,
      productType,
    });

    if (lastQueryKey.current !== queryKey) {
      lastQueryKey.current = queryKey;

      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    loadProducts();
  }, [
    page,
    filters,
    debouncedSearch,
    productType,
    loadProducts,
  ]);

  // ─────────────────────────────────────────────────────────────
  // LIKE PRODUCTS
  // ─────────────────────────────────────────────────────────────

  const handleLike = async (productId) => {
    if (!user) {
      toast.error('Please log in to like products');
      return;
    }

    const alreadyLiked = likedProducts.has(productId);

    try {
      if (alreadyLiked) {
        await productsService.unlikeProduct(productId);

        setLikedProducts((previous) => {
          const updated = new Set(previous);
          updated.delete(productId);
          return updated;
        });

        setProducts((previous) =>
          previous.map((product) =>
            getProductId(product) === productId
              ? {
                  ...product,
                  likes_count: Math.max(
                    0,
                    Number(product.likes_count || 0) - 1
                  ),
                }
              : product
          )
        );
      } else {
        await productsService.likeProduct(productId);

        setLikedProducts((previous) =>
          new Set([...previous, productId])
        );

        setProducts((previous) =>
          previous.map((product) =>
            getProductId(product) === productId
              ? {
                  ...product,
                  likes_count:
                    Number(product.likes_count || 0) + 1,
                }
              : product
          )
        );
      }
    } catch (error) {
      console.error('Failed to like or unlike product:', error);

      toast.error(
        error?.response?.data?.detail || 'Action failed'
      );
    }
  };

  const handleImageError = (productId) => {
    setImageErrors((previous) => ({
      ...previous,
      [productId]: true,
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────────────────────

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sort: 'newest',
    });

    setSearchQuery('');
    setDebouncedSearch('');
    setProductType('all');
  };

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    if (
      filters.minPrice !== '' &&
      Number(filters.minPrice) < 0
    ) {
      toast.error('Minimum price cannot be negative');
      return;
    }

    if (
      filters.maxPrice !== '' &&
      Number(filters.maxPrice) < 0
    ) {
      toast.error('Maximum price cannot be negative');
      return;
    }

    if (
      filters.minPrice !== '' &&
      filters.maxPrice !== '' &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      toast.error('Minimum price cannot exceed maximum price');
      return;
    }

    setShowFilters(false);
  };

  // Infinite scroll is used only when more boosted listings exist.
  const handleScroll = useCallback(() => {
    if (
      productType !== 'boosted' ||
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    const scrollTop =
      window.scrollY || document.documentElement.scrollTop;

    const scrollHeight =
      document.documentElement.scrollHeight;

    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 500) {
      setPage((previous) => previous + 1);
    }
  }, [productType, loading, loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // ─────────────────────────────────────────────────────────────
  // INITIAL LOADING
  // ─────────────────────────────────────────────────────────────

  if (initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SHOP PAGE
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="flex w-full items-center space-x-3 lg:w-auto">
              <h1 className="whitespace-nowrap bg-gradient-to-r from-brand-orange to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
                Shop
              </h1>

              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition ${
                  viewMode === 'grid'
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition ${
                  viewMode === 'list'
                    ? 'bg-brand-orange text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <div className="w-full flex-1 lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setDebouncedSearch(searchQuery.trim());
                    }
                  }}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2 pl-10 pr-10 text-white placeholder-gray-500 focus:border-brand-orange focus:outline-none"
                />

                {searchQuery.trim() !== debouncedSearch && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters((previous) => !previous)
              }
              aria-expanded={showFilters}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-900 px-4 py-2 transition hover:bg-gray-800 lg:w-auto"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 rounded-xl bg-gray-900 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Product Type
                  </label>

                  <select
                    value={productType}
                    onChange={(event) =>
                      setProductType(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    <option value="all">All Products</option>
                    <option value="boosted">
                      Boosted Products Only
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Category
                  </label>

                  <select
                    value={filters.category}
                    onChange={(event) =>
                      updateFilter('category', event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category === 'All' ? '' : category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Condition
                  </label>

                  <select
                    value={filters.condition}
                    onChange={(event) =>
                      updateFilter('condition', event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    {conditions.map((condition) => (
                      <option
                        key={condition.value}
                        value={condition.value}
                      >
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Minimum Price (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(event) =>
                      updateFilter('minPrice', event.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Maximum Price (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      updateFilter('maxPrice', event.target.value)
                    }
                    placeholder="Any"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Sort By
                  </label>

                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      updateFilter('sort', event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    {sortOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-400 transition hover:text-white"
                >
                  Reset All
                </button>

                <button
                  type="button"
                  onClick={applyFilters}
                  className="rounded-lg bg-brand-orange px-6 py-2 text-white transition hover:bg-orange-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdsCarousel />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {productType === 'boosted' && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
            <Zap className="h-6 w-6 shrink-0 text-brand-orange" />

            <div>
              <h2 className="font-semibold text-white">
                Boosted Products
              </h2>

              <p className="text-sm text-gray-300">
                Browse currently available boosted listings.
              </p>
            </div>
          </div>
        )}

        {loading && products.length > 0 && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/40 pt-16">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-600" />

            <h3 className="mb-2 text-xl font-semibold">
              {productType === 'boosted'
                ? 'No boosted products found'
                : 'No products found'}
            </h3>

            <p className="text-gray-400">
              {productType === 'boosted'
                ? 'No boosted products match your current filters.'
                : 'Try another search term or adjust your filters.'}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg bg-brand-orange px-5 py-2 text-white hover:bg-orange-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-400">
              Showing {products.length} of{' '}
              {totalCount ?? products.length} products
            </p>

            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'space-y-4'
              }
            >
              {products.map((product) => {
                const productId = getProductId(product);

                const imagePath = Array.isArray(product.images)
                  ? product.images[0]
                  : product.image_url || product.image || null;

                const displayImage = imageErrors[productId]
                  ? null
                  : getImageUrl(imagePath);

                const sellerName =
                  product.seller_name || 'Seller';

                const sellerId = product.seller_id;

                return (
                  <article
                    key={productId}
                    className="group min-w-0"
                  >
                    {viewMode === 'grid' ? (
                      <div className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-gray-900">
                        <Link
                          to={`/product/${productId}`}
                          className="block h-full w-full"
                        >
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={product.title || 'Product'}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                              onError={() =>
                                handleImageError(productId)
                              }
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center text-gray-500">
                              <ShoppingBag className="mb-2 h-10 w-10" />
                              <span className="text-xs">
                                No image available
                              </span>
                            </div>
                          )}
                        </Link>

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <Link
                              to={`/product/${productId}`}
                              className="pointer-events-auto"
                            >
                              <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white">
                                {product.title}
                              </h3>

                              <p className="text-sm font-bold text-brand-orange">
                                {formatPrice(product.price)}
                              </p>
                            </Link>

                            <div className="pointer-events-auto mt-2 flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleLike(productId)
                                }
                                aria-label="Like product"
                                className="flex items-center space-x-1 text-white transition hover:text-red-500"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    likedProducts.has(productId)
                                      ? 'fill-red-500 text-red-500'
                                      : ''
                                  }`}
                                />

                                <span className="text-xs">
                                  {product.likes_count || 0}
                                </span>
                              </button>

                              <Link
                                to={`/product/${productId}#comments`}
                                className="flex items-center space-x-1 text-white transition hover:text-brand-orange"
                              >
                                <MessageCircle className="h-4 w-4" />

                                <span className="text-xs">
                                  {product.comments_count || 0}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {productType === 'boosted' && (
                          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-brand-orange px-2 py-1 text-xs font-semibold text-white">
                            <Zap className="h-3 w-3" />
                            Boosted
                          </span>
                        )}

                        {sellerId && (
                          <Link
                            to={`/profile/${sellerId}`}
                            className="absolute right-2 top-2 flex max-w-[85%] items-center space-x-1 truncate rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm"
                          >
                            <User className="h-3 w-3 shrink-0 text-white" />

                            <span className="truncate text-xs text-white">
                              {sellerName}
                            </span>
                          </Link>
                        )}

                        {product.condition &&
                          product.condition !== 'new' && (
                            <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1">
                              <span className="text-xs capitalize text-white">
                                {product.condition.replace('_', ' ')}
                              </span>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="flex gap-4 overflow-hidden rounded-xl bg-gray-900 p-4 transition hover:bg-gray-800">
                        <Link
                          to={`/product/${productId}`}
                          className="h-24 w-24 shrink-0 sm:h-32 sm:w-32"
                        >
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={product.title || 'Product'}
                              className="h-full w-full rounded-lg object-cover"
                              loading="lazy"
                              onError={() =>
                                handleImageError(productId)
                              }
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-lg bg-gray-800 text-gray-500">
                              <ShoppingBag className="h-8 w-8" />
                            </div>
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${productId}`}>
                            <h3 className="font-semibold text-white">
                              {product.title}
                            </h3>

                            <p className="mt-1 font-bold text-brand-orange">
                              {formatPrice(product.price)}
                            </p>
                          </Link>

                          {productType === 'boosted' && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-1 text-xs text-brand-orange">
                              <Zap className="h-3 w-3" />
                              Boosted
                            </span>
                          )}

                          <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                            {product.description || ''}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-400">
                            <button
                              type="button"
                              onClick={() =>
                                handleLike(productId)
                              }
                              className="flex items-center gap-1 hover:text-red-500"
                            >
                              <Heart
                                className={`h-3 w-3 ${
                                  likedProducts.has(productId)
                                    ? 'fill-red-500 text-red-500'
                                    : ''
                                }`}
                              />

                              <span className="text-xs">
                                {product.likes_count || 0}
                              </span>
                            </button>

                            <Link
                              to={`/product/${productId}#comments`}
                              className="flex items-center gap-1 hover:text-brand-orange"
                            >
                              <MessageCircle className="h-3 w-3" />

                              <span className="text-xs">
                                {product.comments_count || 0}
                              </span>
                            </Link>

                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />

                              <span className="text-xs">
                                {product.views || 0}
                              </span>
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span>By {sellerName}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
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

        {!hasMore && products.length > 0 && !loading && (
          <div className="py-8 text-center text-sm text-gray-500">
            You've reached the end
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;
