// src/components/forms/ProductUploadForm.jsx - UPDATED with Cloudinary
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ImageUpload from '../ui/ImageUpload';
import { productsService } from '../../services/products';
import { cloudinaryService } from '../../services/cloudinary';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  price: z.number().min(100, 'Price must be at least ₦100'),
  category: z.string().min(1, 'Please select a category'),
  brand: z.string().optional(),
  condition: z.enum(['new', 'used']),
  stock_qty: z.number().min(0, 'Stock quantity cannot be negative'),
});

const ProductUploadForm = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: 'new',
      stock_qty: 1,
    }
  });

  const handleImageUpload = async (urls) => {
    // urls can be array of Cloudinary URLs or array of files
    if (Array.isArray(urls)) {
      if (typeof urls[0] === 'string') {
        // Already Cloudinary URLs
        setImageUrls(prev => [...prev, ...urls]);
      } else {
        // Files - need to upload to Cloudinary first
        setUploadingImages(true);
        const uploadedUrls = [];
        for (const file of urls) {
          const result = await cloudinaryService.uploadImageDirect(file);
          if (result.success) {
            uploadedUrls.push(result.url);
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setImageUrls(prev => [...prev, ...uploadedUrls]);
        setUploadingImages(false);
      }
    }
  };

  const handleVideoUpload = async (files) => {
    if (files && files[0]) {
      const file = files[0];
      const result = await cloudinaryService.uploadVideoDirect(file);
      if (result.success) {
        setVideoUrl(result.url);
        setVideoData(result);
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Failed to upload video');
      }
    }
  };

  const removeImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (imageUrls.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('brand', data.brand || '');
      formData.append('condition', data.condition);
      formData.append('stock_qty', data.stock_qty.toString());
      
      // Append Cloudinary image URLs as JSON string
      formData.append('images_json', JSON.stringify(imageUrls));
      
      // Also send as array field for compatibility
      imageUrls.forEach(url => {
        formData.append('image_urls', url);
      });
      
      // Append video URL if exists
      if (videoUrl) {
        formData.append('video_url', videoUrl);
        if (videoData?.thumbnail_url) {
          formData.append('video_thumbnail', videoData.thumbnail_url);
        }
      }
      
      const response = await productsService.createProduct(formData);
      
      toast.success('Product listed successfully! Awaiting admin approval.');
      navigate('/listings');
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error(error.response?.data?.detail || 'Failed to list product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 
    'Food', 'Books', 'Auto', 'Toys', 'Baby', 'Pets', 'Office'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product Title *
        </label>
        <input
          {...register('title')}
          type="text"
          className="input-field"
          placeholder="e.g., iPhone 14 Pro Max - 256GB"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows="6"
          className="input-field resize-none"
          placeholder="Describe your product in detail..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (₦) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="e.g., 500000"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Quantity *
          </label>
          <input
            {...register('stock_qty', { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="e.g., 10"
          />
          {errors.stock_qty && <p className="text-red-500 text-xs mt-1">{errors.stock_qty.message}</p>}
        </div>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select {...register('category')} className="input-field">
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand
          </label>
          <input
            {...register('brand')}
            type="text"
            className="input-field"
            placeholder="e.g., Apple, Samsung, Nike"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Condition *
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input {...register('condition')} type="radio" value="new" />
            <span>Brand New</span>
          </label>
          <label className="flex items-center space-x-2">
            <input {...register('condition')} type="radio" value="used" />
            <span>Used</span>
          </label>
        </div>
      </div>

      {/* Images Upload with Cloudinary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product Images *
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          multiple={true}
          accept="image/*"
          maxFiles={5}
          useCloudinary={true}
        />
        
        {/* Image Preview Section */}
        {imageUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={cloudinaryService.getProductThumbnail(url)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {imageUrls.length === 0 && (
          <p className="text-red-500 text-xs mt-1">At least one image is required</p>
        )}
        {uploadingImages && (
          <p className="text-brand-orange text-xs mt-1">Uploading images to Cloudinary...</p>
        )}
        {imageUrls.length > 0 && (
          <p className="text-green-500 text-xs mt-1">✓ {imageUrls.length} image(s) uploaded to Cloudinary</p>
        )}
      </div>

      {/* Video Upload with Cloudinary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product Video (Optional)
        </label>
        <ImageUpload
          onUpload={handleVideoUpload}
          multiple={false}
          accept="video/*"
          maxFiles={1}
          useCloudinary={true}
        />
        {videoUrl && (
          <div className="mt-2">
            <video 
              src={videoUrl} 
              controls 
              className="w-full max-h-48 rounded-lg"
              poster={videoData?.thumbnail_url}
            />
            <p className="text-green-500 text-xs mt-1">✓ Video uploaded to Cloudinary</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || imageUrls.length === 0 || uploadingImages}
        className={`btn-primary w-full py-3 ${(isSubmitting || imageUrls.length === 0 || uploadingImages) ? 'disabled:opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Listing Product...' : uploadingImages ? 'Uploading Images...' : 'List Product'}
      </button>
    </form>
  );
};

export default ProductUploadForm;