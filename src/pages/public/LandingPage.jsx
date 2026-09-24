

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Search, MapPin, Star, TrendingUp, ChevronRight, 
//   ShoppingBag, ArrowRight, Zap, Shield, Truck, Heart
// } from 'lucide-react';
// import ProductCard from '../../components/ui/ProductCard';
// import AdsCarousel from '../../components/common/AdsCarousel';
// import { productsService } from '../../services/products';
// import { useAuthStore } from '../../store/authStore';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuthStore(); // adjust field names if your store differs
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [trendingProducts, setTrendingProducts] = useState([]);
//   const [topSellers, setTopSellers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [loading, setLoading] = useState(true);

//   // ========== HERO BACKGROUND SLIDESHOW (E-COMMERCE THEMED) ==========
//   const heroBackgroundImages = [
//     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop',
//   ];

//   const [heroImageIndex, setHeroImageIndex] = useState(0);

//   useEffect(() => {
//     const heroInterval = setInterval(() => {
//       setHeroImageIndex(prev => (prev + 1) % heroBackgroundImages.length);
//     }, 6000);
//     return () => clearInterval(heroInterval);
//   }, []);

//   // ========== CATEGORIES WITH 4 UNIQUE, RELEVANT IMAGES EACH ==========
//   const categoriesData = [
//     {
//       name: 'Electronics',
//       images: [
//         'https://picsum.photos/id/0/150/150',
//         'https://picsum.photos/id/2/150/150',
//         'https://picsum.photos/id/3/150/150',
//         'https://picsum.photos/id/6/150/150'
//       ],
//       alt: 'Electronics'
//     },
//     {
//       name: 'Fashion',
//       images: [
//         'https://picsum.photos/id/20/150/150',
//         'https://picsum.photos/id/1/150/150',
//         'https://picsum.photos/id/4/150/150',
//         'https://picsum.photos/id/7/150/150'
//       ],
//       alt: 'Fashion'
//     },
//     {
//       name: 'Home & Garden',
//       images: [
//         'https://picsum.photos/id/128/150/150',
//         'https://picsum.photos/id/5/150/150',
//         'https://picsum.photos/id/9/150/150',
//         'https://picsum.photos/id/10/150/150'
//       ],
//       alt: 'Home & Garden'
//     },
//     {
//       name: 'Beauty',
//       images: [
//         'https://picsum.photos/id/29/150/150',
//         'https://picsum.photos/id/8/150/150',
//         'https://picsum.photos/id/12/150/150',
//         'https://picsum.photos/id/11/150/150'
//       ],
//       alt: 'Beauty'
//     },
//     {
//       name: 'Sports',
//       images: [
//         'https://picsum.photos/id/96/150/150',
//         'https://picsum.photos/id/13/150/150',
//         'https://picsum.photos/id/14/150/150',
//         'https://picsum.photos/id/15/150/150'
//       ],
//       alt: 'Sports'
//     },
//     {
//       name: 'Food',
//       images: [
//         'https://picsum.photos/id/108/150/150',
//         'https://picsum.photos/id/30/150/150',
//         'https://picsum.photos/id/16/150/150',
//         'https://picsum.photos/id/17/150/150'
//       ],
//       alt: 'Food'
//     },
//     {
//       name: 'Books',
//       images: [
//         'https://picsum.photos/id/24/150/150',
//         'https://picsum.photos/id/18/150/150',
//         'https://picsum.photos/id/19/150/150',
//         'https://picsum.photos/id/20/150/150'
//       ],
//       alt: 'Books'
//     },
//     {
//       name: 'Auto',
//       images: [
//         'https://picsum.photos/id/111/150/150',
//         'https://picsum.photos/id/21/150/150',
//         'https://picsum.photos/id/22/150/150',
//         'https://picsum.photos/id/23/150/150'
//       ],
//       alt: 'Auto'
//     }
//   ];

//   const [categoryImageIndices, setCategoryImageIndices] = useState(() =>
//     categoriesData.map(() => 0)
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCategoryImageIndices(prev =>
//         prev.map((idx, i) => (idx + 1) % categoriesData[i].images.length)
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const features = [
//     { icon: <Truck className="h-6 w-6" />, title: 'Fast Delivery', desc: 'Same‑day delivery in major cities' },
//     { icon: <Shield className="h-6 w-6" />, title: 'Secure Payments', desc: '100% encrypted transactions' },
//     { icon: <Zap className="h-6 w-6" />, title: 'Easy Returns', desc: '30‑day money‑back guarantee' },
//     { icon: <Heart className="h-6 w-6" />, title: 'Premium Support', desc: '24/7 customer care' },
//   ];

//   // const mockProducts = [
//   //   { id: 1, title: "iPhone 14 Pro Max", price: 1200000, category: "Electronics", images: ["https://picsum.photos/id/0/300/300"], rating: 4.8, views: 1520, seller_name: "Apple Store NG", likes_count: 45 },
//   //   { id: 2, title: "Nike Air Max 270", price: 85000, category: "Fashion", images: ["https://picsum.photos/id/1/300/300"], rating: 4.9, views: 3200, seller_name: "Nike Official", likes_count: 89 },
//   //   { id: 3, title: "Samsung Galaxy S23 Ultra", price: 950000, category: "Electronics", images: ["https://picsum.photos/id/2/300/300"], rating: 4.7, views: 980, seller_name: "Samsung NG", likes_count: 34 },
//   //   { id: 4, title: "Sony WH-1000XM5", price: 350000, category: "Electronics", images: ["https://picsum.photos/id/3/300/300"], rating: 4.9, views: 2100, seller_name: "Sony Store", likes_count: 67 },
//   //   { id: 5, title: "Gucci Handbag", price: 450000, category: "Fashion", images: ["https://picsum.photos/id/4/300/300"], rating: 4.8, views: 560, seller_name: "Luxury Hub", likes_count: 23 },
//   //   { id: 6, title: "Dyson V15 Vacuum", price: 650000, category: "Home & Garden", images: ["https://picsum.photos/id/5/300/300"], rating: 4.8, views: 430, seller_name: "Dyson NG", likes_count: 12 },
//   //   { id: 7, title: "MacBook Pro M3", price: 2500000, category: "Electronics", images: ["https://picsum.photos/id/6/300/300"], rating: 4.9, views: 890, seller_name: "Apple Store NG", likes_count: 56 },
//   //   { id: 8, title: "Adidas Ultraboost", price: 75000, category: "Fashion", images: ["https://picsum.photos/id/7/300/300"], rating: 4.7, views: 1670, seller_name: "Adidas NG", likes_count: 78 },
//   // ];

//   // const mockSellers = [
//   //   { name: "Apple Store NG", rating: 4.9, products: 234, image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&h=150&fit=crop', alt: 'Apple MacBook' },
//   //   { name: "Nike Official", rating: 4.9, products: 456, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', alt: 'Nike shoes' },
//   //   { name: "Samsung NG", rating: 4.8, products: 189, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop', alt: 'Samsung phone' },
//   //   { name: "Sony Store", rating: 4.7, products: 123, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=150&h=150&fit=crop', alt: 'Sony headphones' },
//   //   { name: "Luxury Hub", rating: 4.8, products: 89, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop', alt: 'Luxury bag' },
//   //   { name: "Dyson NG", rating: 4.6, products: 45, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=150&h=150&fit=crop', alt: 'Dyson vacuum' },
//   // ];

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const [featured, trending] = await Promise.all([
//         productsService.getFeaturedProducts(),
//         productsService.getTrendingProducts(),
//       ]);
//       setFeaturedProducts(featured.length ? featured : mockProducts);
//       setTrendingProducts(trending.length ? trending : [...mockProducts].reverse());
//       setTopSellers(mockSellers);
//     } catch (error) {
//       console.error('Failed to load products', error);
//       setFeaturedProducts(mockProducts);
//       setTrendingProducts([...mockProducts].reverse());
//       setTopSellers(mockSellers);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (searchQuery.trim()) params.append('search', searchQuery.trim());
//     if (selectedCategory) params.append('category', selectedCategory);
//     navigate(`/shop?${params.toString()}`);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };

//   // NEW: smart "Become a Seller" handler
//   const handleSellerClick = () => {
//     if (isAuthenticated || user) {
//       navigate('/dashboard/listings');
//     } else {
//       navigate('/signup');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-orange border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           {heroBackgroundImages.map((img, idx) => (
//             <img
//               key={img}
//               src={img}
//               alt="E-commerce shopping"
//               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
//                 idx === heroImageIndex ? 'opacity-100' : 'opacity-0'
//               }`}
//               loading={idx === 0 ? 'eager' : 'lazy'}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-black/40 to-black/60 dark:from-brand-orange/50 dark:via-black/60 dark:to-black/80"></div>
//         </div>

//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
//           {heroBackgroundImages.map((_, idx) => (
//             <span
//               key={idx}
//               className={`h-1.5 rounded-full transition-all duration-500 ${
//                 idx === heroImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
//               }`}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
//           <div className="text-center max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
//               Buy & Sell Everything{' '}
//               <span className="text-brand-orange">Anywhere</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-100 mb-10 drop-shadow">
//               Join millions of buyers and sellers on NexoLeolite – Africa's fastest growing marketplace
//             </p>
            
//             <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
//               <div className="flex-1 flex items-center px-4">
//                 <Search className="h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="What are you looking for?"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="flex-1 px-3 py-3 outline-none bg-transparent"
//                 />
//               </div>
//               <div className="flex items-center px-4">
//                 <MapPin className="h-5 w-5 text-gray-400" />
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="flex-1 px-3 py-3 outline-none bg-transparent"
//                 >
//                   <option value="">All Categories</option>
//                   {categoriesData.map(cat => (
//                     <option key={cat.name} value={cat.name}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <button 
//                 onClick={handleSearch}
//                 className="bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2"
//               >
//                 Search <ArrowRight className="h-4 w-4" />
//               </button>
//             </div>
            
//             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
//               <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium">
//                 <ShoppingBag className="h-5 w-5" />
//                 Shop Now
//               </Link>
//               <button
//                 onClick={handleSellerClick}
//                 className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-brand-orange transition font-medium"
//               >
//                 Become a Seller
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop"  
//             alt="Shopping bags and products" 
//             className="w-full h-full object-cover" 
//           /> 
//           <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70"></div> 
//         </div> 
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"> 
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> 
//             {features.map((feature, idx) => ( 
//               <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md backdrop-blur-sm"> 
//                 <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange"> 
//                   {feature.icon} 
//                 </div> 
//                 <div> 
//                   <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3> 
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p> 
//                 </div> 
//               </div> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Shop by Category */} 
//       <section className="py-16"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
//             Shop by <span className="text-brand-orange">Category</span> 
//           </h2> 
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"> 
//             {categoriesData.map((category, idx) => ( 
//               <Link 
//                 key={category.name} 
//                 to={`/shop?category=${category.name}`} 
//                 className="group text-center" 
//               > 
//                 <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition duration-300"> 
//                   <img  
//                     src={category.images[categoryImageIndices[idx]]} 
//                     alt={category.name} 
//                     className="w-full h-full object-cover transition-opacity duration-500" 
//                     loading="lazy" 
//                   /> 
//                 </div> 
//                 <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</p> 
//               </Link> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       <AdsCarousel /> 
 
//       {/* Featured Products */} 
//       <section className="py-16 bg-gray-50 dark:bg-gray-800/50"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <div className="flex justify-between items-center mb-8"> 
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2> 
//             <Link to="/shop" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
//               View All <ChevronRight className="h-4 w-4" /> 
//             </Link> 
//           </div> 
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
//             {featuredProducts.slice(0, 8).map((product) => ( 
//               <ProductCard key={product.id} product={product} /> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Trending Products */} 
//       <section className="py-16"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <div className="flex justify-between items-center mb-8"> 
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"> 
//               <TrendingUp className="h-6 w-6 text-brand-orange" /> 
//               Trending Now 
//             </h2> 
//             <Link to="/shop?sort=popular" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
//               View All <ChevronRight className="h-4 w-4" /> 
//             </Link> 
//           </div> 
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
//             {trendingProducts.slice(0, 8).map((product) => ( 
//               <ProductCard key={product.id} product={product} /> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Top Rated Sellers */} 
//       <section className="py-16 bg-gradient-to-r from-brand-light to-white dark:from-brand-dark/30 dark:to-gray-900"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
//             Top <span className="text-brand-orange">Rated Sellers</span> 
//           </h2> 
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"> 
//             {topSellers.map((seller, index) => ( 
//               <div key={index} className="text-center group"> 
//                 <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition"> 
//                   <img  
//                     src={seller.image}  
//                     alt={seller.alt} 
//                     className="w-full h-full object-cover" 
//                     loading="lazy" 
//                   /> 
//                 </div> 
//                 <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{seller.name}</h3> 
//                 <div className="flex items-center justify-center mt-1"> 
//                   <Star className="h-4 w-4 text-yellow-400 fill-current" /> 
//                   <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{seller.rating}</span> 
//                 </div> 
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{seller.products}+ products</p> 
//               </div> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* CTA Banner */} 
//       <section className="bg-gradient-to-br from-brand-orange/20 via-brand-light/30 to-white dark:from-brand-orange/30 dark:via-brand-dark/50 dark:to-gray-900 py-20"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Selling?</h2> 
//           <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto"> 
//             Join thousands of successful sellers on NexoLeolite and grow your business 
//           </p> 
//           <button
//             onClick={handleSellerClick}
//             className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//           > 
//             Become a Seller <ArrowRight className="h-4 w-4" /> 
//           </button> 
//         </div> 
//       </section> 
//     </div> 
//   ); 
// }; 
 
// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Search, MapPin, Star, TrendingUp, ChevronRight, 
//   ShoppingBag, ArrowRight, Zap, Shield, Truck, Heart
// } from 'lucide-react';
// import ProductCard from '../../components/ui/ProductCard';
// import AdsCarousel from '../../components/common/AdsCarousel';
// import { productsService } from '../../services/products';
// import { useAuthStore } from '../../store/authStore';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuthStore();
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [trendingProducts, setTrendingProducts] = useState([]);
//   const [topSellers, setTopSellers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [loading, setLoading] = useState(true);

//   // ========== HERO BACKGROUND SLIDESHOW (E-COMMERCE THEMED) ==========
//   const heroBackgroundImages = [
//     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&h=1080&fit=crop',
//     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop',
//   ];

//   const [heroImageIndex, setHeroImageIndex] = useState(0);

//   useEffect(() => {
//     const heroInterval = setInterval(() => {
//       setHeroImageIndex(prev => (prev + 1) % heroBackgroundImages.length);
//     }, 6000);
//     return () => clearInterval(heroInterval);
//   }, []);

//   // ========== CATEGORIES WITH 4 UNIQUE, RELEVANT IMAGES EACH ==========
//   const categoriesData = [
//     {
//       name: 'Electronics',
//       images: [
//         'https://picsum.photos/id/0/150/150',
//         'https://picsum.photos/id/2/150/150',
//         'https://picsum.photos/id/3/150/150',
//         'https://picsum.photos/id/6/150/150'
//       ],
//       alt: 'Electronics'
//     },
//     {
//       name: 'Fashion',
//       images: [
//         'https://picsum.photos/id/20/150/150',
//         'https://picsum.photos/id/1/150/150',
//         'https://picsum.photos/id/4/150/150',
//         'https://picsum.photos/id/7/150/150'
//       ],
//       alt: 'Fashion'
//     },
//     {
//       name: 'Home & Garden',
//       images: [
//         'https://picsum.photos/id/128/150/150',
//         'https://picsum.photos/id/5/150/150',
//         'https://picsum.photos/id/9/150/150',
//         'https://picsum.photos/id/10/150/150'
//       ],
//       alt: 'Home & Garden'
//     },
//     {
//       name: 'Beauty',
//       images: [
//         'https://picsum.photos/id/29/150/150',
//         'https://picsum.photos/id/8/150/150',
//         'https://picsum.photos/id/12/150/150',
//         'https://picsum.photos/id/11/150/150'
//       ],
//       alt: 'Beauty'
//     },
//     {
//       name: 'Sports',
//       images: [
//         'https://picsum.photos/id/96/150/150',
//         'https://picsum.photos/id/13/150/150',
//         'https://picsum.photos/id/14/150/150',
//         'https://picsum.photos/id/15/150/150'
//       ],
//       alt: 'Sports'
//     },
//     {
//       name: 'Food',
//       images: [
//         'https://picsum.photos/id/108/150/150',
//         'https://picsum.photos/id/30/150/150',
//         'https://picsum.photos/id/16/150/150',
//         'https://picsum.photos/id/17/150/150'
//       ],
//       alt: 'Food'
//     },
//     {
//       name: 'Books',
//       images: [
//         'https://picsum.photos/id/24/150/150',
//         'https://picsum.photos/id/18/150/150',
//         'https://picsum.photos/id/19/150/150',
//         'https://picsum.photos/id/20/150/150'
//       ],
//       alt: 'Books'
//     },
//     {
//       name: 'Auto',
//       images: [
//         'https://picsum.photos/id/111/150/150',
//         'https://picsum.photos/id/21/150/150',
//         'https://picsum.photos/id/22/150/150',
//         'https://picsum.photos/id/23/150/150'
//       ],
//       alt: 'Auto'
//     }
//   ];

//   const [categoryImageIndices, setCategoryImageIndices] = useState(() =>
//     categoriesData.map(() => 0)
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCategoryImageIndices(prev =>
//         prev.map((idx, i) => (idx + 1) % categoriesData[i].images.length)
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const features = [
//     { icon: <Truck className="h-6 w-6" />, title: 'Fast Delivery', desc: 'Same‑day delivery in major cities' },
//     { icon: <Shield className="h-6 w-6" />, title: 'Secure Payments', desc: '100% encrypted transactions' },
//     { icon: <Zap className="h-6 w-6" />, title: 'Easy Returns', desc: '30‑day money‑back guarantee' },
//     { icon: <Heart className="h-6 w-6" />, title: 'Premium Support', desc: '24/7 customer care' },
//   ];

//   const mockProducts = [
//     { id: 1, title: "iPhone 14 Pro Max", price: 1200000, category: "Electronics", images: ["https://picsum.photos/id/0/300/300"], rating: 4.8, views: 1520, seller_name: "Apple Store NG", likes_count: 45 },
//     { id: 2, title: "Nike Air Max 270", price: 85000, category: "Fashion", images: ["https://picsum.photos/id/1/300/300"], rating: 4.9, views: 3200, seller_name: "Nike Official", likes_count: 89 },
//     { id: 3, title: "Samsung Galaxy S23 Ultra", price: 950000, category: "Electronics", images: ["https://picsum.photos/id/2/300/300"], rating: 4.7, views: 980, seller_name: "Samsung NG", likes_count: 34 },
//     { id: 4, title: "Sony WH-1000XM5", price: 350000, category: "Electronics", images: ["https://picsum.photos/id/3/300/300"], rating: 4.9, views: 2100, seller_name: "Sony Store", likes_count: 67 },
//     { id: 5, title: "Gucci Handbag", price: 450000, category: "Fashion", images: ["https://picsum.photos/id/4/300/300"], rating: 4.8, views: 560, seller_name: "Luxury Hub", likes_count: 23 },
//     { id: 6, title: "Dyson V15 Vacuum", price: 650000, category: "Home & Garden", images: ["https://picsum.photos/id/5/300/300"], rating: 4.8, views: 430, seller_name: "Dyson NG", likes_count: 12 },
//     { id: 7, title: "MacBook Pro M3", price: 2500000, category: "Electronics", images: ["https://picsum.photos/id/6/300/300"], rating: 4.9, views: 890, seller_name: "Apple Store NG", likes_count: 56 },
//     { id: 8, title: "Adidas Ultraboost", price: 75000, category: "Fashion", images: ["https://picsum.photos/id/7/300/300"], rating: 4.7, views: 1670, seller_name: "Adidas NG", likes_count: 78 },
//   ];

//   const mockSellers = [
//     { name: "Apple Store NG", rating: 4.9, products: 234, image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&h=150&fit=crop', alt: 'Apple MacBook' },
//     { name: "Nike Official", rating: 4.9, products: 456, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', alt: 'Nike shoes' },
//     { name: "Samsung NG", rating: 4.8, products: 189, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop', alt: 'Samsung phone' },
//     { name: "Sony Store", rating: 4.7, products: 123, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=150&h=150&fit=crop', alt: 'Sony headphones' },
//     { name: "Luxury Hub", rating: 4.8, products: 89, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop', alt: 'Luxury bag' },
//     { name: "Dyson NG", rating: 4.6, products: 45, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=150&h=150&fit=crop', alt: 'Dyson vacuum' },
//   ];

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       // allSettled so one failing endpoint doesn't kill the other
//       const [featuredRes, trendingRes] = await Promise.allSettled([
//         productsService.getFeaturedProducts(),
//         productsService.getTrendingProducts(),
//       ]);

//       const featured =
//         featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value)
//           ? featuredRes.value
//           : [];

//       const trending =
//         trendingRes.status === 'fulfilled' && Array.isArray(trendingRes.value)
//           ? trendingRes.value
//           : [];

//       // Fallback to mock data if backend returned nothing or errored
//       setFeaturedProducts(featured.length ? featured : mockProducts);
//       setTrendingProducts(
//         trending.length ? trending : [...mockProducts].reverse()
//       );
//       setTopSellers(mockSellers);
//     } catch (error) {
//       console.error('Failed to load products', error);
//       // Fallback so the page never gets stuck
//       setFeaturedProducts(mockProducts);
//       setTrendingProducts([...mockProducts].reverse());
//       setTopSellers(mockSellers);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (searchQuery.trim()) params.append('search', searchQuery.trim());
//     if (selectedCategory) params.append('category', selectedCategory);
//     navigate(`/shop?${params.toString()}`);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };

//   // Smart "Become a Seller" handler
//   const handleSellerClick = () => {
//     if (isAuthenticated || user) {
//       navigate('/dashboard/listings');
//     } else {
//       navigate('/signup');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-orange border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           {heroBackgroundImages.map((img, idx) => (
//             <img
//               key={img}
//               src={img}
//               alt="E-commerce shopping"
//               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
//                 idx === heroImageIndex ? 'opacity-100' : 'opacity-0'
//               }`}
//               loading={idx === 0 ? 'eager' : 'lazy'}
//             />
//           ))}
//           <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-black/40 to-black/60 dark:from-brand-orange/50 dark:via-black/60 dark:to-black/80"></div>
//         </div>

//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
//           {heroBackgroundImages.map((_, idx) => (
//             <span
//               key={idx}
//               className={`h-1.5 rounded-full transition-all duration-500 ${
//                 idx === heroImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
//               }`}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
//           <div className="text-center max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
//               Buy & Sell Everything{' '}
//               <span className="text-brand-orange">Anywhere</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-100 mb-10 drop-shadow">
//               Join millions of buyers and sellers on NexoLeolite – Africa's fastest growing marketplace
//             </p>
            
//             <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
//               <div className="flex-1 flex items-center px-4">
//                 <Search className="h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="What are you looking for?"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="flex-1 px-3 py-3 outline-none bg-transparent"
//                 />
//               </div>
//               <div className="flex items-center px-4">
//                 <MapPin className="h-5 w-5 text-gray-400" />
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="flex-1 px-3 py-3 outline-none bg-transparent"
//                 >
//                   <option value="">All Categories</option>
//                   {categoriesData.map(cat => (
//                     <option key={cat.name} value={cat.name}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <button 
//                 onClick={handleSearch}
//                 className="bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2"
//               >
//                 Search <ArrowRight className="h-4 w-4" />
//               </button>
//             </div>
            
//             <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
//               <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium">
//                 <ShoppingBag className="h-5 w-5" />
//                 Shop Now
//               </Link>
//               <button
//                 onClick={handleSellerClick}
//                 className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-brand-orange transition font-medium"
//               >
//                 Become a Seller
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop"  
//             alt="Shopping bags and products" 
//             className="w-full h-full object-cover" 
//           /> 
//           <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70"></div> 
//         </div> 
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"> 
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> 
//             {features.map((feature, idx) => ( 
//               <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md backdrop-blur-sm"> 
//                 <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange"> 
//                   {feature.icon} 
//                 </div> 
//                 <div> 
//                   <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3> 
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p> 
//                 </div> 
//               </div> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Shop by Category */} 
//       <section className="py-16"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
//             Shop by <span className="text-brand-orange">Category</span> 
//           </h2> 
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"> 
//             {categoriesData.map((category, idx) => ( 
//               <Link 
//                 key={category.name} 
//                 to={`/shop?category=${category.name}`} 
//                 className="group text-center" 
//               > 
//                 <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition duration-300"> 
//                   <img  
//                     src={category.images[categoryImageIndices[idx]]} 
//                     alt={category.name} 
//                     className="w-full h-full object-cover transition-opacity duration-500" 
//                     loading="lazy" 
//                   /> 
//                 </div> 
//                 <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</p> 
//               </Link> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       <AdsCarousel /> 
 
//       {/* Featured Products */} 
//       <section className="py-16 bg-gray-50 dark:bg-gray-800/50"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <div className="flex justify-between items-center mb-8"> 
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2> 
//             <Link to="/shop" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
//               View All <ChevronRight className="h-4 w-4" /> 
//             </Link> 
//           </div> 
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
//             {featuredProducts.slice(0, 8).map((product) => ( 
//               <ProductCard key={product.id} product={product} /> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Trending Products */} 
//       <section className="py-16"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <div className="flex justify-between items-center mb-8"> 
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"> 
//               <TrendingUp className="h-6 w-6 text-brand-orange" /> 
//               Trending Now 
//             </h2> 
//             <Link to="/shop?sort=popular" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
//               View All <ChevronRight className="h-4 w-4" /> 
//             </Link> 
//           </div> 
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
//             {trendingProducts.slice(0, 8).map((product) => ( 
//               <ProductCard key={product.id} product={product} /> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* Top Rated Sellers */} 
//       <section className="py-16 bg-gradient-to-r from-brand-light to-white dark:from-brand-dark/30 dark:to-gray-900"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
//           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
//             Top <span className="text-brand-orange">Rated Sellers</span> 
//           </h2> 
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"> 
//             {topSellers.map((seller, index) => ( 
//               <div key={index} className="text-center group"> 
//                 <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition"> 
//                   <img  
//                     src={seller.image}  
//                     alt={seller.alt} 
//                     className="w-full h-full object-cover" 
//                     loading="lazy" 
//                   /> 
//                 </div> 
//                 <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{seller.name}</h3> 
//                 <div className="flex items-center justify-center mt-1"> 
//                   <Star className="h-4 w-4 text-yellow-400 fill-current" /> 
//                   <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{seller.rating}</span> 
//                 </div> 
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{seller.products}+ products</p> 
//               </div> 
//             ))} 
//           </div> 
//         </div> 
//       </section> 
 
//       {/* CTA Banner */} 
//       <section className="bg-gradient-to-br from-brand-orange/20 via-brand-light/30 to-white dark:from-brand-orange/30 dark:via-brand-dark/50 dark:to-gray-900 py-20"> 
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Selling?</h2> 
//           <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto"> 
//             Join thousands of successful sellers on NexoLeolite and grow your business 
//           </p> 
//           <button
//             onClick={handleSellerClick}
//             className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//           > 
//             Become a Seller <ArrowRight className="h-4 w-4" /> 
//           </button> 
//         </div> 
//       </section> 
//     </div> 
//   ); 
// }; 
 
// export default LandingPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, TrendingUp, ChevronRight, 
  ShoppingBag, ArrowRight, Zap, Shield, Truck, Heart
} from 'lucide-react';
import ProductCard from '../../components/ui/ProductCard';
import AdsCarousel from '../../components/common/AdsCarousel';
import { productsService } from '../../services/products';
import { useAuthStore } from '../../store/authStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // ========== HERO BACKGROUND SLIDESHOW (E-COMMERCE THEMED) ==========
  const heroBackgroundImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop',
  ];

  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % heroBackgroundImages.length);
    }, 6000);
    return () => clearInterval(heroInterval);
  }, []);

  // ========== CATEGORIES WITH REAL RELEVANT IMAGES ==========
  const categoriesData = [
    {
      name: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=150&h=150&fit=crop',
      ],
      alt: 'Electronics'
    },
    {
      name: 'Fashion',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&h=150&fit=crop',
      ],
      alt: 'Fashion'
    },
    {
      name: 'Home & Garden',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&h=150&fit=crop',
      ],
      alt: 'Home & Garden'
    },
    {
      name: 'Beauty',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150&h=150&fit=crop',
      ],
      alt: 'Beauty'
    },
    {
      name: 'Sports',
      images: [
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&h=150&fit=crop',
      ],
      alt: 'Sports'
    },
    {
      name: 'Food',
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop',
      ],
      alt: 'Food'
    },
    {
      name: 'Books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&h=150&fit=crop',
      ],
      alt: 'Books'
    },
    {
      name: 'Auto',
      images: [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150&h=150&fit=crop',
      ],
      alt: 'Auto'
    }
  ];

  const [categoryImageIndices, setCategoryImageIndices] = useState(() =>
    categoriesData.map(() => 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryImageIndices(prev =>
        prev.map((idx, i) => (idx + 1) % categoriesData[i].images.length)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Truck className="h-6 w-6" />, title: 'Fast Delivery', desc: 'Same-day delivery in major cities' },
    { icon: <Shield className="h-6 w-6" />, title: 'Secure Payments', desc: '100% encrypted transactions' },
    { icon: <Zap className="h-6 w-6" />, title: 'Easy Returns', desc: '30-day money-back guarantee' },
    { icon: <Heart className="h-6 w-6" />, title: 'Premium Support', desc: '24/7 customer care' },
  ];

  const mockProducts = [
    {
      id: 1,
      title: "iPhone 14 Pro Max",
      price: 1200000,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"],
      rating: 4.8, views: 1520, seller_name: "Apple Store NG", likes_count: 45
    },
    {
      id: 2,
      title: "Nike Air Max 270",
      price: 85000,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
      rating: 4.9, views: 3200, seller_name: "Nike Official", likes_count: 89
    },
    {
      id: 3,
      title: "Samsung Galaxy S23 Ultra",
      price: 950000,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop"],
      rating: 4.7, views: 980, seller_name: "Samsung NG", likes_count: 34
    },
    {
      id: 4,
      title: "Sony WH-1000XM5",
      price: 350000,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop"],
      rating: 4.9, views: 2100, seller_name: "Sony Store", likes_count: 67
    },
    {
      id: 5,
      title: "Gucci Handbag",
      price: 450000,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"],
      rating: 4.8, views: 560, seller_name: "Luxury Hub", likes_count: 23
    },
    {
      id: 6,
      title: "Dyson V15 Vacuum",
      price: 650000,
      category: "Home & Garden",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
      rating: 4.8, views: 430, seller_name: "Dyson NG", likes_count: 12
    },
    {
      id: 7,
      title: "MacBook Pro M3",
      price: 2500000,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"],
      rating: 4.9, views: 890, seller_name: "Apple Store NG", likes_count: 56
    },
    {
      id: 8,
      title: "Adidas Ultraboost",
      price: 75000,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop"],
      rating: 4.7, views: 1670, seller_name: "Adidas NG", likes_count: 78
    },
  ];

  const mockSellers = [
    { name: "Apple Store NG", rating: 4.9, products: 234, image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&h=150&fit=crop', alt: 'Apple MacBook' },
    { name: "Nike Official", rating: 4.9, products: 456, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', alt: 'Nike shoes' },
    { name: "Samsung NG", rating: 4.8, products: 189, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop', alt: 'Samsung phone' },
    { name: "Sony Store", rating: 4.7, products: 123, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=150&h=150&fit=crop', alt: 'Sony headphones' },
    { name: "Luxury Hub", rating: 4.8, products: 89, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&h=150&fit=crop', alt: 'Luxury bag' },
    { name: "Dyson NG", rating: 4.6, products: 45, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=150&h=150&fit=crop', alt: 'Dyson vacuum' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // allSettled so one failing endpoint doesn't kill the other
      const [featuredRes, trendingRes] = await Promise.allSettled([
        productsService.getFeaturedProducts(),
        productsService.getTrendingProducts(),
      ]);

      const featured =
        featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value)
          ? featuredRes.value
          : [];

      const trending =
        trendingRes.status === 'fulfilled' && Array.isArray(trendingRes.value)
          ? trendingRes.value
          : [];

      // Fallback to mock data if backend returned nothing or errored
      setFeaturedProducts(featured.length ? featured : mockProducts);
      setTrendingProducts(
        trending.length ? trending : [...mockProducts].reverse()
      );
      setTopSellers(mockSellers);
    } catch (error) {
      console.error('Failed to load products', error);
      // Fallback so the page never gets stuck
      setFeaturedProducts(mockProducts);
      setTrendingProducts([...mockProducts].reverse());
      setTopSellers(mockSellers);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    navigate(`/shop?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Smart "Become a Seller" handler
  const handleSellerClick = () => {
    if (isAuthenticated || user) {
      navigate('/dashboard/listings');
    } else {
      navigate('/signup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBackgroundImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="E-commerce shopping"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                idx === heroImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-black/40 to-black/60 dark:from-brand-orange/50 dark:via-black/60 dark:to-black/80"></div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroBackgroundImages.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === heroImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Buy & Sell Everything{' '}
              <span className="text-brand-orange">Anywhere</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 drop-shadow">
              Join millions of buyers and sellers on NexoLeolite – Africa's fastest growing marketplace
            </p>
            
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-3 outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center px-4">
                <MapPin className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-3 outline-none bg-transparent"
                >
                  <option value="">All Categories</option>
                  {categoriesData.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition font-medium">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <button
                onClick={handleSellerClick}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-brand-orange transition font-medium"
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop"  
            alt="Shopping bags and products" 
            className="w-full h-full object-cover" 
          /> 
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70"></div> 
        </div> 
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> 
            {features.map((feature, idx) => ( 
              <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md backdrop-blur-sm"> 
                <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange"> 
                  {feature.icon} 
                </div> 
                <div> 
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3> 
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p> 
                </div> 
              </div> 
            ))} 
          </div> 
        </div> 
      </section> 
 
      {/* Shop by Category */} 
      <section className="py-16"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
            Shop by <span className="text-brand-orange">Category</span> 
          </h2> 
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"> 
            {categoriesData.map((category, idx) => ( 
              <Link 
                key={category.name} 
                to={`/shop?category=${category.name}`} 
                className="group text-center" 
              > 
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition duration-300"> 
                  <img  
                    src={category.images[categoryImageIndices[idx]]} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-opacity duration-500" 
                    loading="lazy" 
                  /> 
                </div> 
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</p> 
              </Link> 
            ))} 
          </div> 
        </div> 
      </section> 
 
      <AdsCarousel /> 
 
      {/* Featured Products */} 
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <div className="flex justify-between items-center mb-8"> 
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2> 
            <Link to="/shop" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
              View All <ChevronRight className="h-4 w-4" /> 
            </Link> 
          </div> 
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
            {featuredProducts.slice(0, 8).map((product) => ( 
              <ProductCard key={product.id} product={product} /> 
            ))} 
          </div> 
        </div> 
      </section> 
 
      {/* Trending Products */} 
      <section className="py-16"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <div className="flex justify-between items-center mb-8"> 
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"> 
              <TrendingUp className="h-6 w-6 text-brand-orange" /> 
              Trending Now 
            </h2> 
            <Link to="/shop?sort=popular" className="text-brand-orange flex items-center gap-1 hover:gap-2 transition"> 
              View All <ChevronRight className="h-4 w-4" /> 
            </Link> 
          </div> 
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
            {trendingProducts.slice(0, 8).map((product) => ( 
              <ProductCard key={product.id} product={product} /> 
            ))} 
          </div> 
        </div> 
      </section> 
 
      {/* Top Rated Sellers */} 
      <section className="py-16 bg-gradient-to-r from-brand-light to-white dark:from-brand-dark/30 dark:to-gray-900"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"> 
            Top <span className="text-brand-orange">Rated Sellers</span> 
          </h2> 
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"> 
            {topSellers.map((seller, index) => ( 
              <div key={index} className="text-center group"> 
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition"> 
                  <img  
                    src={seller.image}  
                    alt={seller.alt} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  /> 
                </div> 
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{seller.name}</h3> 
                <div className="flex items-center justify-center mt-1"> 
                  <Star className="h-4 w-4 text-yellow-400 fill-current" /> 
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{seller.rating}</span> 
                </div> 
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{seller.products}+ products</p> 
              </div> 
            ))} 
          </div> 
        </div> 
      </section> 
 
      {/* CTA Banner */} 
      <section className="bg-gradient-to-br from-brand-orange/20 via-brand-light/30 to-white dark:from-brand-orange/30 dark:via-brand-dark/50 dark:to-gray-900 py-20"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Selling?</h2> 
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto"> 
            Join thousands of successful sellers on NexoLeolite and grow your business 
          </p> 
          <button
            onClick={handleSellerClick}
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          > 
            Become a Seller <ArrowRight className="h-4 w-4" /> 
          </button> 
        </div> 
      </section> 
    </div> 
  ); 
}; 
 
export default LandingPage;