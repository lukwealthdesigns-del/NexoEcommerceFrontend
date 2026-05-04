// src/services/cloudinary.js
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nexoecommerce';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const cloudinaryService = {
  /**
   * Upload image directly to Cloudinary (unsigned upload)
   * Use this for faster uploads without going through backend
   */
  async uploadImageDirect(file, folder = 'nexoecommerce/products') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Optional transformations
    formData.append('transformation', JSON.stringify([
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]));
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      return {
        success: true,
        url: response.data.secure_url,
        public_id: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
        format: response.data.format,
        bytes: response.data.bytes
      };
    } catch (error) {
      console.error('Cloudinary direct upload error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Upload failed'
      };
    }
  },
  
  /**
   * Upload video directly to Cloudinary
   */
  async uploadVideoDirect(file, folder = 'nexoecommerce/videos') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', 'video');
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData
      );
      
      // Generate video thumbnail URL
      const thumbnailUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_2/${response.data.public_id}.jpg`;
      
      return {
        success: true,
        url: response.data.secure_url,
        public_id: response.data.public_id,
        duration: response.data.duration,
        thumbnail_url: thumbnailUrl,
        format: response.data.format,
        bytes: response.data.bytes
      };
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Upload failed'
      };
    }
  },
  
  /**
   * Upload avatar with face detection
   */
  async uploadAvatarDirect(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'nexoecommerce/avatars');
    formData.append('public_id', userId);
    formData.append('transformation', JSON.stringify([
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ]));
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      return {
        success: true,
        url: response.data.secure_url,
        public_id: response.data.public_id
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Upload failed'
      };
    }
  },
  
  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary')) return url;
    
    const { width = 500, height = 500, crop = 'fill', quality = 'auto' } = options;
    
    // Insert transformations into URL
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = `w_${width},h_${height},c_${crop},q_${quality}/`;
      return `${parts[0]}/upload/${transformations}${parts[1]}`;
    }
    
    return url;
  },
  
  /**
   * Get product thumbnail (small image for listings)
   */
  getProductThumbnail(url) {
    return this.getOptimizedUrl(url, { width: 200, height: 200, crop: 'fill' });
  },
  
  /**
   * Get product detail image (larger for product page)
   */
  getProductDetailImage(url) {
    return this.getOptimizedUrl(url, { width: 800, height: 800, crop: 'limit' });
  },
  
  /**
   * Get avatar with specific size
   */
  getAvatarUrl(url, size = 100) {
    if (!url || !url.includes('cloudinary')) return url;
    
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = `w_${size},h_${size},c_fill,g_face,r_max/`;
      return `${parts[0]}/upload/${transformations}${parts[1]}`;
    }
    
    return url;
  }
};

export default cloudinaryService;