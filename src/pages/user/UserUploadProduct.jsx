
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { productsService } from '../../services/products';
// import { Upload, X, Video, Image, Loader2, Plus } from 'lucide-react';
// import toast from 'react-hot-toast';

// const MIN_DESCRIPTION_WORDS = 20;

// // Count words in a string (ignores extra spaces and line breaks)
// const countWords = (text) =>
//   text.trim().split(/\s+/).filter(Boolean).length;

// const UserUploadProduct = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [descriptionError, setDescriptionError] = useState('');
//   const [price, setPrice] = useState('');
//   const [category, setCategory] = useState('');
//   const [categoryError, setCategoryError] = useState('');
//   const [condition, setCondition] = useState('new');
//   const [stockQty, setStockQty] = useState(1);
//   const [brand, setBrand] = useState('');
//   const [images, setImages] = useState([]);
//   const [video, setVideo] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [uploadType, setUploadType] = useState('photo');

//   const videoInputRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const categoryInputRef = useRef(null);
//   const descriptionInputRef = useRef(null);

//   // Must match the categories used on the landing page
//   const categories = [
//     'Electronics',
//     'Fashion',
//     'Home & Garden',
//     'Beauty',
//     'Sports',
//     'Food',
//     'Books',
//     'Auto',
//     'Other',
//   ];

//   const conditions = [
//     { value: 'new', label: 'Brand New' },
//     { value: 'like_new', label: 'Like New' },
//     { value: 'good', label: 'Good' },
//     { value: 'fair', label: 'Fair' },
//   ];

//   const wordCount = countWords(description);
//   const descriptionLongEnough = wordCount >= MIN_DESCRIPTION_WORDS;

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []);

//     if (images.length + files.length > 5) {
//       toast.error('Maximum 5 images allowed');
//       e.target.value = '';
//       return;
//     }

//     const validFiles = files.filter((file) =>
//       file.type.startsWith('image/')
//     );

//     if (validFiles.length !== files.length) {
//       toast.error('Please select valid image files');
//     }

//     setImages((previous) => [...previous, ...validFiles]);

//     const newPreviews = validFiles.map((file) =>
//       URL.createObjectURL(file)
//     );

//     setImagePreviews((previous) => [...previous, ...newPreviews]);

//     e.target.value = '';
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (file.size > 100 * 1024 * 1024) {
//       toast.error('Video must be less than 100MB');
//       e.target.value = '';
//       return;
//     }

//     if (!file.type.startsWith('video/')) {
//       toast.error('Please select a valid video file');
//       e.target.value = '';
//       return;
//     }

//     if (videoPreview) {
//       URL.revokeObjectURL(videoPreview);
//     }

//     setVideo(file);
//     setVideoPreview(URL.createObjectURL(file));
//   };

//   const removeImage = (index) => {
//     const previewToRemove = imagePreviews[index];

//     if (previewToRemove) {
//       URL.revokeObjectURL(previewToRemove);
//     }

//     setImages((previous) => previous.filter((_, i) => i !== index));
//     setImagePreviews((previous) =>
//       previous.filter((_, i) => i !== index)
//     );
//   };

//   const removeVideo = () => {
//     if (videoPreview) {
//       URL.revokeObjectURL(videoPreview);
//     }

//     setVideo(null);
//     setVideoPreview(null);

//     if (videoInputRef.current) {
//       videoInputRef.current.value = '';
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     const value = e.target.value;
//     setDescription(value);

//     // Clear the error as soon as the description is long enough
//     if (descriptionError && countWords(value) >= MIN_DESCRIPTION_WORDS) {
//       setDescriptionError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     if (!title.trim()) {
//       toast.error('Please enter a product title');
//       return;
//     }

//     // Description must be at least 20 words
//     if (!descriptionLongEnough) {
//       const message = `Description must be at least ${MIN_DESCRIPTION_WORDS} words. You have written ${wordCount}.`;

//       setDescriptionError(message);
//       toast.error(message);
//       descriptionInputRef.current?.focus();

//       return;
//     }

//     const numericPrice = Number(price);

//     if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
//       toast.error('Please enter a valid price');
//       return;
//     }

//     // Require category selection before uploading anything.
//     if (!category.trim()) {
//       const message = 'Please select a product category before posting.';

//       setCategoryError(message);
//       toast.error(message);
//       categoryInputRef.current?.focus();

//       return;
//     }

//     if (!Number.isInteger(Number(stockQty)) || Number(stockQty) < 1) {
//       toast.error('Please enter a stock quantity of at least 1');
//       return;
//     }

//     if (images.length === 0 && !video) {
//       toast.error('Please add at least one photo or a video');
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();

//     formData.append('title', title.trim());
//     formData.append('description', description.trim());
//     formData.append('price', String(numericPrice));
//     formData.append('category', category);
//     formData.append('condition', condition);
//     formData.append('stock_qty', String(Number(stockQty)));

//     if (brand.trim()) {
//       formData.append('brand', brand.trim());
//     }

//     images.forEach((image) => {
//       formData.append('images', image);
//     });

//     if (video) {
//       formData.append('video', video);
//     }

//     const toastId = toast.loading('Uploading product...');

//     try {
//       const response = await productsService.createProduct(formData);

//       toast.success(
//         response?.message || 'Product uploaded! Pending admin approval',
//         { id: toastId }
//       );

//       setTimeout(() => {
//         navigate('/dashboard/listings');
//       }, 2000);
//     } catch (error) {
//       console.error('Upload error:', error);

//       const detail = error?.response?.data?.detail;

//       const message = Array.isArray(detail)
//         ? detail
//             .map((item) => item.msg)
//             .filter(Boolean)
//             .join(', ')
//         : typeof detail === 'string'
//           ? detail
//           : 'Upload failed. Please check your information and try again.';

//       toast.error(message, { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-gray-900 rounded-2xl p-6">
//         <h1 className="text-2xl font-bold text-white mb-2">
//           Create New Product
//         </h1>

//         <p className="text-gray-400 mb-6">
//           Share your product with the community
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//           {/* Upload Type Selection */}
//           <div className="flex gap-3 p-1 bg-gray-800 rounded-xl">
//             <button
//               type="button"
//               onClick={() => setUploadType('photo')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
//                 uploadType === 'photo'
//                   ? 'bg-brand-orange text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <Image className="h-5 w-5" />
//               <span>Photos</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => setUploadType('video')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
//                 uploadType === 'video'
//                   ? 'bg-brand-orange text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <Video className="h-5 w-5" />
//               <span>Video</span>
//             </button>
//           </div>

//           {/* Title */}
//           <div>
//             <label
//               htmlFor="product-title"
//               className="block text-sm text-gray-400 mb-2"
//             >
//               Product title <span className="text-rose-400">*</span>
//             </label>

//             <input
//               id="product-title"
//               type="text"
//               placeholder="Product title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//               maxLength={100}
//               required
//             />
//           </div>

//           {/* Description (minimum 20 words) */}
//           <div>
//             <label
//               htmlFor="product-description"
//               className="block text-sm text-gray-400 mb-2"
//             >
//               Description <span className="text-rose-400">*</span>
//             </label>

//             <textarea
//               id="product-description"
//               ref={descriptionInputRef}
//               placeholder="Describe your product in at least 20 words..."
//               value={description}
//               onChange={handleDescriptionChange}
//               rows={4}
//               aria-invalid={Boolean(descriptionError)}
//               aria-describedby="product-description-help"
//               className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange ${
//                 descriptionError ? 'border-rose-500' : 'border-gray-700'
//               }`}
//             />

//             <div
//               id="product-description-help"
//               className="mt-2 flex items-start justify-between gap-3"
//             >
//               {descriptionError ? (
//                 <p role="alert" className="text-sm text-rose-400">
//                   {descriptionError}
//                 </p>
//               ) : (
//                 <p className="text-xs text-gray-500">
//                   Include details like size, color, features, and condition.
//                 </p>
//               )}

//               <span
//                 className={`text-xs shrink-0 ${
//                   descriptionLongEnough
//                     ? 'text-emerald-400'
//                     : 'text-gray-500'
//                 }`}
//               >
//                 {wordCount}/{MIN_DESCRIPTION_WORDS} words
//               </span>
//             </div>
//           </div>

//           {/* Price and Category */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label
//                 htmlFor="product-price"
//                 className="block text-sm text-gray-400 mb-2"
//               >
//                 Price (₦) <span className="text-rose-400">*</span>
//               </label>

//               <input
//                 id="product-price"
//                 type="number"
//                 min="0.01"
//                 step="any"
//                 placeholder="Price (₦)"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//                 required
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="product-category"
//                 className="block text-sm text-gray-400 mb-2"
//               >
//                 Category <span className="text-rose-400">*</span>
//               </label>

//               <select
//                 id="product-category"
//                 ref={categoryInputRef}
//                 value={category}
//                 onChange={(e) => {
//                   setCategory(e.target.value);

//                   if (e.target.value.trim()) {
//                     setCategoryError('');
//                   }
//                 }}
//                 aria-invalid={Boolean(categoryError)}
//                 aria-describedby={
//                   categoryError ? 'product-category-error' : undefined
//                 }
//                 className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:border-brand-orange ${
//                   categoryError ? 'border-rose-500' : 'border-gray-700'
//                 }`}
//                 required
//               >
//                 <option value="">Select category</option>

//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>

//               {categoryError && (
//                 <p
//                   id="product-category-error"
//                   role="alert"
//                   className="mt-2 text-sm text-rose-400"
//                 >
//                   {categoryError}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Condition and Stock */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">
//                 Condition
//               </label>

//               <div className="grid grid-cols-2 gap-2">
//                 {conditions.map((cond) => (
//                   <button
//                     key={cond.value}
//                     type="button"
//                     onClick={() => setCondition(cond.value)}
//                     aria-pressed={condition === cond.value}
//                     className={`py-2 rounded-lg text-sm transition ${
//                       condition === cond.value
//                         ? 'bg-brand-orange text-white'
//                         : 'bg-gray-800 text-gray-400 hover:text-white'
//                     }`}
//                   >
//                     {cond.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="product-stock"
//                 className="block text-sm text-gray-400 mb-2"
//               >
//                 Stock quantity <span className="text-rose-400">*</span>
//               </label>

//               <input
//                 id="product-stock"
//                 type="number"
//                 min="1"
//                 step="1"
//                 placeholder="Stock Quantity"
//                 value={stockQty}
//                 onChange={(e) => setStockQty(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//                 required
//               />
//             </div>
//           </div>

//           {/* Brand (Optional) */}
//           <div>
//             <label
//               htmlFor="product-brand"
//               className="block text-sm text-gray-400 mb-2"
//             >
//               Brand (Optional)
//             </label>

//             <input
//               id="product-brand"
//               type="text"
//               placeholder="Brand (Optional)"
//               value={brand}
//               onChange={(e) => setBrand(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//             />
//           </div>

//           {/* Photo Upload */}
//           {uploadType === 'photo' && (
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">
//                 Photos (Max 5)
//               </label>

//               <div className="grid grid-cols-3 gap-3">
//                 {imagePreviews.map((preview, index) => (
//                   <div key={preview} className="relative aspect-square">
//                     <img
//                       src={preview}
//                       alt={`Product preview ${index + 1}`}
//                       className="w-full h-full object-cover rounded-xl"
//                     />

//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       aria-label={`Remove image ${index + 1}`}
//                       className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
//                     >
//                       <X className="h-3 w-3 text-white" />
//                     </button>
//                   </div>
//                 ))}

//                 {imagePreviews.length < 5 && (
//                   <button
//                     type="button"
//                     onClick={() => imageInputRef.current?.click()}
//                     className="aspect-square border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center hover:border-brand-orange transition"
//                   >
//                     <Plus className="h-8 w-8 text-gray-500" />
//                     <span className="text-xs text-gray-500 mt-1">
//                       Add Photo
//                     </span>
//                   </button>
//                 )}

//                 <input
//                   ref={imageInputRef}
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp,image/gif"
//                   multiple
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>

//               <p className="text-xs text-gray-500 mt-2">
//                 JPEG, PNG, WebP, GIF (Max 5MB each)
//               </p>
//             </div>
//           )}

//           {/* Video Upload */}
//           {uploadType === 'video' && (
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">
//                 Product Video
//               </label>

//               {!videoPreview ? (
//                 <button
//                   type="button"
//                   onClick={() => videoInputRef.current?.click()}
//                   className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center hover:border-brand-orange transition"
//                 >
//                   <Video className="h-12 w-12 text-gray-500" />

//                   <span className="text-gray-500 mt-2">Upload Video</span>

//                   <p className="text-xs text-gray-600 mt-1">
//                     MP4, MOV, AVI, WEBM up to 100MB
//                   </p>
//                 </button>
//               ) : (
//                 <div className="relative">
//                   <video
//                     src={videoPreview}
//                     controls
//                     className="w-full rounded-xl"
//                   />

//                   <button
//                     type="button"
//                     onClick={removeVideo}
//                     aria-label="Remove video"
//                     className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
//                   >
//                     <X className="h-4 w-4 text-white" />
//                   </button>
//                 </div>
//               )}

//               <input
//                 ref={videoInputRef}
//                 type="file"
//                 accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
//                 onChange={handleVideoChange}
//                 className="hidden"
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <Loader2 className="h-5 w-5 animate-spin" />
//             ) : (
//               <Upload className="h-5 w-5" />
//             )}

//             {loading ? 'Uploading...' : 'Post Product'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserUploadProduct;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products';
import {
  Upload,
  X,
  Video,
  Image,
  Loader2,
  Plus,
  Tag,
  Calendar,
  Percent,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MIN_DESCRIPTION_WORDS = 20;

const countWords = (text) =>
  text.trim().split(/\s+/).filter(Boolean).length;

const UserUploadProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [condition, setCondition] = useState('new');
  const [stockQty, setStockQty] = useState(1);
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadType, setUploadType] = useState('photo');

  // Promotion fields
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  const [promotionName, setPromotionName] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [promotionStartAt, setPromotionStartAt] = useState('');
  const [promotionEndAt, setPromotionEndAt] = useState('');

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Beauty',
    'Sports',
    'Food',
    'Books',
    'Auto',
    'Other',
  ];

  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  const wordCount = countWords(description);
  const descriptionLongEnough = wordCount >= MIN_DESCRIPTION_WORDS;

  const numericPrice = Number(price);
  const numericDiscount = Number(discountPercent);

  const validDiscount =
    Number.isInteger(numericDiscount) &&
    numericDiscount >= 1 &&
    numericDiscount <= 99;

  const estimatedDiscountedPrice =
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    validDiscount
      ? Math.round(
          numericPrice * (100 - numericDiscount) / 100
        )
      : null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      e.target.value = '';
      return;
    }

    const validFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      toast.error('Please select valid image files');
    }

    setImages((previous) => [...previous, ...validFiles]);

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    e.target.value = '';
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be less than 100MB');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      e.target.value = '';
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const previewToRemove = imagePreviews[index];

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
    }

    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setImagePreviews((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideo(null);
    setVideoPreview(null);

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    if (
      descriptionError &&
      countWords(value) >= MIN_DESCRIPTION_WORDS
    ) {
      setDescriptionError('');
    }
  };

  const validatePromotion = () => {
    if (!promotionEnabled) return true;

    if (!validDiscount) {
      toast.error('Discount must be a whole number between 1 and 99');
      return false;
    }

    if (
      promotionStartAt &&
      promotionEndAt &&
      new Date(promotionStartAt).getTime() >=
        new Date(promotionEndAt).getTime()
    ) {
      toast.error('Promotion end date must be after its start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title.trim()) {
      toast.error('Please enter a product title');
      return;
    }

    if (!descriptionLongEnough) {
      const message =
        `Description must be at least ${MIN_DESCRIPTION_WORDS} words. ` +
        `You have written ${wordCount}.`;

      setDescriptionError(message);
      toast.error(message);
      descriptionInputRef.current?.focus();

      return;
    }

    if (
      !price ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!category.trim()) {
      const message =
        'Please select a product category before posting.';

      setCategoryError(message);
      toast.error(message);
      categoryInputRef.current?.focus();

      return;
    }

    if (
      !Number.isInteger(Number(stockQty)) ||
      Number(stockQty) < 1
    ) {
      toast.error('Please enter a stock quantity of at least 1');
      return;
    }

    if (images.length === 0 && !video) {
      toast.error('Please add at least one photo or a video');
      return;
    }

    if (!validatePromotion()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', String(numericPrice));
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('stock_qty', String(Number(stockQty)));

    if (brand.trim()) {
      formData.append('brand', brand.trim());
    }

    images.forEach((image) => {
      formData.append('images', image);
    });

    if (video) {
      formData.append('video', video);
    }

    // Send promotion information through the existing
    // product creation endpoint.
    formData.append(
      'promotion_is_active',
      promotionEnabled ? 'true' : 'false'
    );

    if (promotionName.trim()) {
      formData.append(
        'promotion_name',
        promotionName.trim()
      );
    }

    if (promotionEnabled) {
      formData.append(
        'discount_percent',
        String(numericDiscount)
      );

      if (promotionStartAt) {
        formData.append(
          'promotion_start_at',
          new Date(promotionStartAt).toISOString()
        );
      }

      if (promotionEndAt) {
        formData.append(
          'promotion_end_at',
          new Date(promotionEndAt).toISOString()
        );
      }
    }

    const toastId = toast.loading('Uploading product...');

    try {
      const response = await productsService.createProduct(formData);

      toast.success(
        response?.message ||
          'Product uploaded! Pending admin approval',
        { id: toastId }
      );

      setTimeout(() => {
        navigate('/dashboard/listings');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);

      const detail = error?.response?.data?.detail;

      const message = Array.isArray(detail)
        ? detail
            .map((item) => item.msg)
            .filter(Boolean)
            .join(', ')
        : typeof detail === 'string'
          ? detail
          : 'Upload failed. Please check your information and try again.';

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create New Product
        </h1>

        <p className="text-gray-400 mb-6">
          Share your product with the community
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          {/* Upload Type Selection */}
          <div className="flex gap-3 p-1 bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setUploadType('photo')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                uploadType === 'photo'
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Image className="h-5 w-5" />
              <span>Photos</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadType('video')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                uploadType === 'video'
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Video className="h-5 w-5" />
              <span>Video</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="product-title"
              className="block text-sm text-gray-400 mb-2"
            >
              Product title <span className="text-rose-400">*</span>
            </label>

            <input
              id="product-title"
              type="text"
              placeholder="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="product-description"
              className="block text-sm text-gray-400 mb-2"
            >
              Description <span className="text-rose-400">*</span>
            </label>

            <textarea
              id="product-description"
              ref={descriptionInputRef}
              placeholder="Describe your product in at least 20 words..."
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              aria-invalid={Boolean(descriptionError)}
              aria-describedby="product-description-help"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange ${
                descriptionError
                  ? 'border-rose-500'
                  : 'border-gray-700'
              }`}
            />

            <div
              id="product-description-help"
              className="mt-2 flex items-start justify-between gap-3"
            >
              {descriptionError ? (
                <p role="alert" className="text-sm text-rose-400">
                  {descriptionError}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Include details like size, color, features, and condition.
                </p>
              )}

              <span
                className={`text-xs shrink-0 ${
                  descriptionLongEnough
                    ? 'text-emerald-400'
                    : 'text-gray-500'
                }`}
              >
                {wordCount}/{MIN_DESCRIPTION_WORDS} words
              </span>
            </div>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-price"
                className="block text-sm text-gray-400 mb-2"
              >
                Price (₦) <span className="text-rose-400">*</span>
              </label>

              <input
                id="product-price"
                type="number"
                min="0.01"
                step="any"
                placeholder="Price (₦)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="block text-sm text-gray-400 mb-2"
              >
                Category <span className="text-rose-400">*</span>
              </label>

              <select
                id="product-category"
                ref={categoryInputRef}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);

                  if (e.target.value.trim()) {
                    setCategoryError('');
                  }
                }}
                aria-invalid={Boolean(categoryError)}
                aria-describedby={
                  categoryError
                    ? 'product-category-error'
                    : undefined
                }
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:border-brand-orange ${
                  categoryError
                    ? 'border-rose-500'
                    : 'border-gray-700'
                }`}
                required
              >
                <option value="">Select category</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {categoryError && (
                <p
                  id="product-category-error"
                  role="alert"
                  className="mt-2 text-sm text-rose-400"
                >
                  {categoryError}
                </p>
              )}
            </div>
          </div>

          {/* Condition and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Condition
              </label>

              <div className="grid grid-cols-2 gap-2">
                {conditions.map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setCondition(cond.value)}
                    aria-pressed={condition === cond.value}
                    className={`py-2 rounded-lg text-sm transition ${
                      condition === cond.value
                        ? 'bg-brand-orange text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="block text-sm text-gray-400 mb-2"
              >
                Stock quantity <span className="text-rose-400">*</span>
              </label>

              <input
                id="product-stock"
                type="number"
                min="1"
                step="1"
                placeholder="Stock Quantity"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                required
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="product-brand"
              className="block text-sm text-gray-400 mb-2"
            >
              Brand (Optional)
            </label>

            <input
              id="product-brand"
              type="text"
              placeholder="Brand (Optional)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

          {/* Promotion */}
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="p-2 rounded-xl bg-brand-orange/15">
                  <Tag className="h-5 w-5 text-brand-orange" />
                </div>

                <div>
                  <h2 className="text-white font-semibold">
                    Product Promotion
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Offer customers a discount on this product.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={promotionEnabled}
                  onChange={(e) =>
                    setPromotionEnabled(e.target.checked)
                  }
                  className="h-4 w-4 accent-orange-500"
                />
                Enable
              </label>
            </div>

            {promotionEnabled && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="promotion-name"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Promotion name (Optional)
                  </label>

                  <input
                    id="promotion-name"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Black Friday Sale"
                    value={promotionName}
                    onChange={(e) =>
                      setPromotionName(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label
                    htmlFor="promotion-discount"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Discount percentage (%)
                    <span className="text-rose-400"> *</span>
                  </label>

                  <div className="relative">
                    <input
                      id="promotion-discount"
                      type="number"
                      min="1"
                      max="99"
                      step="1"
                      placeholder="e.g. 20"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(e.target.value)
                      }
                      className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                      required
                    />

                    <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Enter a whole number between 1 and 99.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="promotion-start"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Start date (Optional)
                      </span>
                    </label>

                    <input
                      id="promotion-start"
                      type="datetime-local"
                      value={promotionStartAt}
                      onChange={(e) =>
                        setPromotionStartAt(e.target.value)
                      }
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="promotion-end"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        End date (Optional)
                      </span>
                    </label>

                    <input
                      id="promotion-end"
                      type="datetime-local"
                      value={promotionEndAt}
                      min={promotionStartAt || undefined}
                      onChange={(e) =>
                        setPromotionEndAt(e.target.value)
                      }
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                {estimatedDiscountedPrice !== null && (
                  <div className="p-3 rounded-xl bg-brand-orange/10 border border-brand-orange/30">
                    <p className="text-xs text-gray-400 mb-1">
                      Estimated promotional price
                    </p>

                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xl font-bold text-brand-orange">
                        ₦{estimatedDiscountedPrice.toLocaleString()}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ₦{numericPrice.toLocaleString()}
                      </span>

                      <span className="text-xs font-semibold text-emerald-400">
                        Save {numericDiscount}%
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Your original product price will remain unchanged.
                  The discount will apply automatically during its
                  scheduled promotion period.
                </p>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          {uploadType === 'photo' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Photos (Max 5)
              </label>

              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative aspect-square"
                  >
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}

                {imagePreviews.length < 5 && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center hover:border-brand-orange transition"
                  >
                    <Plus className="h-8 w-8 text-gray-500" />

                    <span className="text-xs text-gray-500 mt-1">
                      Add Photo
                    </span>
                  </button>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                JPEG, PNG, WebP, GIF (Max 5MB each)
              </p>
            </div>
          )}

          {/* Video Upload */}
          {uploadType === 'video' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Product Video
              </label>

              {!videoPreview ? (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center hover:border-brand-orange transition"
                >
                  <Video className="h-12 w-12 text-gray-500" />

                  <span className="text-gray-500 mt-2">
                    Upload Video
                  </span>

                  <p className="text-xs text-gray-600 mt-1">
                    MP4, MOV, AVI, WEBM up to 100MB
                  </p>
                </button>
              ) : (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={removeVideo}
                    aria-label="Remove video"
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}

            {loading ? 'Uploading...' : 'Post Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUploadProduct;
