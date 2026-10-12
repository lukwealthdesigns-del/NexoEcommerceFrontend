// src/pages/user/UserUploadProduct.jsx
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { productsService } from '../../services/products';
// import { Upload, X, Video, Image, Loader2, Plus } from 'lucide-react';
// import toast from 'react-hot-toast';

// const UserUploadProduct = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [category, setCategory] = useState('');
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

//   const categories = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Other'];
//   const conditions = [
//     { value: 'new', label: 'Brand New' },
//     { value: 'like_new', label: 'Like New' },
//     { value: 'good', label: 'Good' },
//     { value: 'fair', label: 'Fair' }
//   ];

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > 5) {
//       toast.error('Maximum 5 images allowed');
//       return;
//     }
    
//     setImages([...images, ...files]);
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews([...imagePreviews, ...newPreviews]);
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (file.size > 100 * 1024 * 1024) {
//       toast.error('Video must be less than 100MB');
//       return;
//     }
    
//     setVideo(file);
//     setVideoPreview(URL.createObjectURL(file));
//   };

//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   const removeVideo = () => {
//     setVideo(null);
//     setVideoPreview(null);
//     if (videoInputRef.current) videoInputRef.current.value = '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!title.trim()) {
//       toast.error('Please enter a product title');
//       return;
//     }
    
//     if (!price || price <= 0) {
//       toast.error('Please enter a valid price');
//       return;
//     }
    
//     if (images.length === 0 && !video) {
//       toast.error('Please add at least one photo or a video');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('price', price);
//     formData.append('category', category);
//     formData.append('condition', condition);
//     formData.append('stock_qty', stockQty);
//     if (brand) formData.append('brand', brand);
    
//     images.forEach(image => {
//       formData.append('images', image);
//     });
    
//     if (video) {
//       formData.append('video', video);
//     }

//     const toastId = toast.loading('Uploading product...');

//     try {
//       const response = await productsService.createProduct(formData);
//       toast.success(response.message || 'Product uploaded! Pending admin approval', { id: toastId });
//       setTimeout(() => navigate('/dashboard/listings'), 2000);
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.response?.data?.detail || 'Upload failed', { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-gray-900 rounded-2xl p-6">
//         <h1 className="text-2xl font-bold text-white mb-2">Create New Product</h1>
//         <p className="text-gray-400 mb-6">Share your product with the community</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
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
//           <input
//             type="text"
//             placeholder="Product title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//             maxLength="100"
//           />

//           {/* Description */}
//           <textarea
//             placeholder="Describe your product..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows="3"
//             className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//           />

//           {/* Price and Category */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="number"
//               placeholder="Price (₦)"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//             />
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-brand-orange"
//             >
//               <option value="">Select category</option>
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
//           </div>

//           {/* Condition and Stock */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">Condition</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {conditions.map(cond => (
//                   <button
//                     key={cond.value}
//                     type="button"
//                     onClick={() => setCondition(cond.value)}
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
//             <input
//               type="number"
//               placeholder="Stock Quantity"
//               value={stockQty}
//               onChange={(e) => setStockQty(e.target.value)}
//               className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//             />
//           </div>

//           {/* Brand (Optional) */}
//           <input
//             type="text"
//             placeholder="Brand (Optional)"
//             value={brand}
//             onChange={(e) => setBrand(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
//           />

//           {/* Photo Upload */}
//           {uploadType === 'photo' && (
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">Photos (Max 5)</label>
//               <div className="grid grid-cols-3 gap-3">
//                 {imagePreviews.map((preview, index) => (
//                   <div key={index} className="relative aspect-square">
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
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
//                     <span className="text-xs text-gray-500 mt-1">Add Photo</span>
//                   </button>
//                 )}
//                 <input
//                   ref={imageInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-2">JPEG, PNG, WebP, GIF (Max 5MB each)</p>
//             </div>
//           )}

//           {/* Video Upload */}
//           {uploadType === 'video' && (
//             <div>
//               <label className="block text-sm text-gray-400 mb-2">Product Video</label>
//               {!videoPreview ? (
//                 <button
//                   type="button"
//                   onClick={() => videoInputRef.current?.click()}
//                   className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center hover:border-brand-orange transition"
//                 >
//                   <Video className="h-12 w-12 text-gray-500" />
//                   <span className="text-gray-500 mt-2">Upload Video</span>
//                   <p className="text-xs text-gray-600 mt-1">MP4, MOV, AVI, WEBM up to 100MB</p>
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
//             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
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
import { Upload, X, Video, Image, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const UserUploadProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const categoryInputRef = useRef(null);

  const categories = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home',
    'Sports',
    'Other'
  ];

  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

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
      ...newPreviews
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title.trim()) {
      toast.error('Please enter a product title');
      return;
    }

    const numericPrice = Number(price);

    if (
      !price ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      toast.error('Please enter a valid price');
      return;
    }

    // Require category selection before uploading anything.
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

    setLoading(true);

    const formData = new FormData();

    formData.append('title', title.trim());
    formData.append('description', description);
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

    const toastId = toast.loading('Uploading product...');

    try {
      const response =
        await productsService.createProduct(formData);

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
              Description
            </label>

            <textarea
              id="product-description"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
            />
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

          {/* Brand (Optional) */}
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