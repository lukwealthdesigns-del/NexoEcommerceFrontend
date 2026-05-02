

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronLeft, ChevronRight, Zap, Eye, TrendingUp, Clock } from 'lucide-react';
// import { premiumService } from '../../services/premium';
// import toast from 'react-hot-toast';

// const AdsCarousel = () => {
//   const [ads, setAds] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     loadAds();
//   }, []);

//   useEffect(() => {
//     if (ads.length === 0 || hovered) return;
    
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % ads.length);
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, [ads.length, hovered]);

//   const loadAds = async () => {
//     try {
//       setLoading(true);
//       const data = await premiumService.getBoostedProducts();
//       console.log('Boosted products API response:', data);
      
//       // Handle different response structures
//       let products = [];
//       if (data && Array.isArray(data)) {
//         products = data;
//       } else if (data && data.products && Array.isArray(data.products)) {
//         products = data.products;
//       } else if (data && data.data && Array.isArray(data.data)) {
//         products = data.data;
//       }
      
//       console.log('Products to display in carousel:', products);
//       setAds(products);
      
//       if (products.length === 0) {
//         console.log('No boosted products found');
//       }
//     } catch (error) {
//       console.error('Failed to load boosted products:', error);
//       toast.error('Failed to load promoted products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdClick = async (productId) => {
//     try {
//       await premiumService.trackAdClick(productId);
//     } catch (error) {
//       console.error('Failed to track ad click:', error);
//     }
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % ads.length);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     if (imagePath.startsWith('/uploads')) {
//       return `http://localhost:8080${imagePath}`;
//     }
//     return `http://localhost:8080/uploads/products/${imagePath}`;
//   };

//   // Show nothing while loading (no skeleton)
//   if (loading) {
//     return null;
//   }

//   // Don't show carousel if no ads
//   if (ads.length === 0) {
//     return null;
//   }

//   const currentAd = ads[currentIndex];

//   return (
//     <div 
//       className="relative bg-gradient-to-r from-brand-orange/10 via-orange-500/10 to-red-500/10 rounded-2xl overflow-hidden shadow-xl mb-8"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Sponsored Badge */}
//       <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
//         <Zap className="h-3 w-3 text-yellow-400" />
//         <span className="text-white text-xs font-medium">Sponsored</span>
//       </div>

//       {/* View Stats Badge */}
//       {currentAd.views > 0 && (
//         <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
//           <Eye className="h-3 w-3 text-blue-400" />
//           <span className="text-white text-xs">{currentAd.views?.toLocaleString()} views</span>
//         </div>
//       )}

//       {/* Ad Content */}
//       <Link
//         to={`/product/${currentAd.id}`}
//         onClick={() => handleAdClick(currentAd.id)}
//         className="block group"
//       >
//         <div className="flex flex-col md:flex-row items-stretch">
//           {/* Image Section */}
//           <div className="relative md:w-2/5 lg:w-1/3 overflow-hidden">
//             <img
//               src={getImageUrl(currentAd.images?.[0]) || 'https://via.placeholder.com/500x300?text=Sponsored'}
//               alt={currentAd.title}
//               className="w-full h-56 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/500x300?text=Sponsored+Product';
//               }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent md:bg-gradient-to-l" />
//           </div>

//           {/* Content Section */}
//           <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
//             <div className="mb-2">
//               <span className="text-xs text-brand-orange font-semibold uppercase tracking-wider">
//                 🔥 Premium Product
//               </span>
//             </div>
            
//             <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
//               {currentAd.title}
//             </h3>
            
//             <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
//               {currentAd.description || 'Check out this premium product at an unbeatable price!'}
//             </p>
            
//             <div className="flex items-center gap-4 mb-4">
//               <span className="text-2xl md:text-3xl font-bold text-brand-orange">
//                 {formatPrice(currentAd.price)}
//               </span>
//               {currentAd.old_price && (
//                 <span className="text-sm text-gray-400 line-through">
//                   {formatPrice(currentAd.old_price)}
//                 </span>
//               )}
//             </div>

//             {/* CTA Button */}
//             <div className="flex items-center gap-3">
//               <button className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
//                 <span>Shop Now</span>
//                 <TrendingUp className="h-4 w-4" />
//               </button>
              
//               {currentAd.premium_boost_until && (
//                 <div className="flex items-center gap-1 text-xs text-gray-500">
//                   <Clock className="h-3 w-3" />
//                   <span>Limited time</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>

//       {/* Navigation Arrows */}
//       {ads.length > 1 && (
//         <>
//           <button
//             onClick={handlePrev}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-20"
//             aria-label="Previous ad"
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-20"
//             aria-label="Next ad"
//           >
//             <ChevronRight className="h-5 w-5" />
//           </button>
//         </>
//       )}

//       {/* Dots Indicator */}
//       {ads.length > 1 && (
//         <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
//           {ads.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentIndex(idx)}
//               className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                 idx === currentIndex
//                   ? 'bg-brand-orange w-6'
//                   : 'bg-white/50 hover:bg-white/80'
//               }`}
//               aria-label={`Go to ad ${idx + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdsCarousel;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, Eye, TrendingUp, Clock } from 'lucide-react';
import { premiumService } from '../../services/premium';
import toast from 'react-hot-toast';

const AdsCarousel = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0 || hovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [ads.length, hovered]);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await premiumService.getBoostedProducts();
      console.log('Boosted products API response:', data);
      
      // Handle different response structures
      let products = [];
      if (data && Array.isArray(data)) {
        products = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        products = data.products;
      } else if (data && data.data && Array.isArray(data.data)) {
        products = data.data;
      }
      
      console.log('Products to display in carousel:', products);
      setAds(products);
      
      if (products.length === 0) {
        console.log('No boosted products found');
      }
    } catch (error) {
      console.error('Failed to load boosted products:', error);
      toast.error('Failed to load promoted products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (productId) => {
    try {
      await premiumService.trackAdClick(productId);
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // FIXED: Parse JSON string images properly
  const getImageUrl = (images) => {
    if (!images) return null;
    
    // Parse if it's a JSON string
    let imageArray = images;
    if (typeof images === 'string') {
      try {
        imageArray = JSON.parse(images);
      } catch (e) {
        return null;
      }
    }
    
    // Get the first image
    let imagePath = Array.isArray(imageArray) ? imageArray[0] : imageArray;
    if (!imagePath) return null;
    
    // Construct full URL
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:8080${imagePath}`;
    }
    return `http://localhost:8080/uploads/products/${imagePath}`;
  };

  // Show nothing while loading (no skeleton)
  if (loading) {
    return null;
  }

  // Don't show carousel if no ads
  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  return (
    <div 
      className="relative bg-gradient-to-r from-brand-orange/10 via-orange-500/10 to-red-500/10 rounded-2xl overflow-hidden shadow-xl mb-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sponsored Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
        <Zap className="h-3 w-3 text-yellow-400" />
        <span className="text-white text-xs font-medium">Sponsored</span>
      </div>

      {/* View Stats Badge */}
      {currentAd.views > 0 && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Eye className="h-3 w-3 text-blue-400" />
          <span className="text-white text-xs">{currentAd.views?.toLocaleString()} views</span>
        </div>
      )}

      {/* Ad Content */}
      <Link
        to={`/product/${currentAd.id}`}
        onClick={() => handleAdClick(currentAd.id)}
        className="block group"
      >
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Image Section */}
          <div className="relative md:w-2/5 lg:w-1/3 overflow-hidden">
            <img
              src={getImageUrl(currentAd.images) || 'https://via.placeholder.com/500x300?text=Sponsored'}
              alt={currentAd.title}
              className="w-full h-56 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x300?text=Sponsored+Product';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent md:bg-gradient-to-l" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs text-brand-orange font-semibold uppercase tracking-wider">
                🔥 Premium Product
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {currentAd.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {currentAd.description || 'Check out this premium product at an unbeatable price!'}
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl md:text-3xl font-bold text-brand-orange">
                {formatPrice(currentAd.price)}
              </span>
              {currentAd.old_price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(currentAd.old_price)}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <button className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <span>Shop Now</span>
                <TrendingUp className="h-4 w-4" />
              </button>
              
              {currentAd.premium_boost_until && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Limited time</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-20"
            aria-label="Previous ad"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-20"
            aria-label="Next ad"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {ads.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-brand-orange w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to ad ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsCarousel;