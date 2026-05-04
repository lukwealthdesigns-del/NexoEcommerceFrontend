// src/hooks/useCloudinaryUpload.js
import { useState, useCallback } from 'react';
import { cloudinaryService } from '../services/cloudinary';
import toast from 'react-hot-toast';

export const useCloudinaryUpload = (options = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState(null);
  
  const {
    folder = 'nexoecommerce/products',
    resourceType = 'image',
    onSuccess,
    onError,
    onProgress
  } = options;
  
  const uploadSingle = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      let result;
      if (resourceType === 'video') {
        result = await cloudinaryService.uploadVideoDirect(file, folder);
      } else if (folder.includes('avatar')) {
        result = await cloudinaryService.uploadAvatarDirect(file, file.userId || Date.now().toString());
      } else {
        result = await cloudinaryService.uploadImageDirect(file, folder);
      }
      
      clearInterval(interval);
      setProgress(100);
      
      if (result.success) {
        setUploadedUrls(prev => [...prev, result.url]);
        if (onSuccess) onSuccess(result);
        toast.success('Upload successful!');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
      toast.error(err.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, resourceType, onSuccess, onError]);
  
  const uploadMultiple = useCallback(async (files) => {
    const results = [];
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress((i / files.length) * 100);
      
      try {
        let result;
        if (resourceType === 'video') {
          result = await cloudinaryService.uploadVideoDirect(file, folder);
        } else {
          result = await cloudinaryService.uploadImageDirect(file, folder);
        }
        
        if (result.success) {
          results.push(result);
          setUploadedUrls(prev => [...prev, result.url]);
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }
    
    setUploading(false);
    setProgress(100);
    
    if (onSuccess && results.length > 0) {
      onSuccess(results);
    }
    
    return results;
  }, [folder, resourceType, onSuccess]);
  
  const clearUploads = useCallback(() => {
    setUploadedUrls([]);
    setError(null);
  }, []);
  
  return {
    uploadSingle,
    uploadMultiple,
    uploading,
    progress,
    uploadedUrls,
    error,
    clearUploads
  };
};

export default useCloudinaryUpload;