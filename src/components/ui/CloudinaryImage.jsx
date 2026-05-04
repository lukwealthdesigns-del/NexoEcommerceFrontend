// src/components/ui/CloudinaryImage.jsx
import React, { useState } from 'react';
import { cloudinaryService } from '../../services/cloudinary';

const CloudinaryImage = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  crop = 'fill',
  quality = 'auto',
  fallbackSrc = 'https://via.placeholder.com/300x300?text=No+Image',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!src) return fallbackSrc;
    if (src.includes('cloudinary')) {
      return cloudinaryService.getOptimizedUrl(src, { width, height, crop, quality });
    }
    return src;
  });
  
  const [error, setError] = useState(false);
  
  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
  };
  
  // For Cloudinary images, add additional attributes
  const cloudinaryProps = src?.includes('cloudinary') ? {
    loading: 'lazy',
    decoding: 'async'
  } : {};
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      {...cloudinaryProps}
      {...props}
    />
  );
};

export const CloudinaryAvatar = ({ src, alt = 'Avatar', size = 100, className = '', ...props }) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!src) return null;
    return cloudinaryService.getAvatarUrl(src, size);
  });
  
  if (!imgSrc) {
    return (
      <div 
        className={`bg-gradient-to-r from-brand-orange to-orange-500 flex items-center justify-center ${className}`}
        style={{ width: size, height: size, borderRadius: '50%' }}
        {...props}
      >
        <span className="text-white text-xl font-bold">
          {alt?.[0]?.toUpperCase() || 'U'}
        </span>
      </div>
    );
  }
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement?.classList.add('show-fallback');
      }}
      {...props}
    />
  );
};

export const CloudinaryProductImage = ({ src, alt, size = 'medium', className = '', ...props }) => {
  const dimensions = {
    thumbnail: { width: 100, height: 100 },
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 800, height: 800 }
  };
  
  const { width, height } = dimensions[size] || dimensions.medium;
  
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      crop={size === 'large' ? 'limit' : 'fill'}
      className={className}
      {...props}
    />
  );
};

export default CloudinaryImage;