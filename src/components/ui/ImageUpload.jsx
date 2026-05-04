// src/components/ui/ImageUpload.jsx - UPDATED with Cloudinary support
import { useState, useRef } from 'react';
import { Upload, X, Video, Image as ImageIcon, Loader2, Cloud } from 'lucide-react';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';
import { cloudinaryService } from '../../services/cloudinary';

const ImageUpload = ({ onUpload, multiple = false, accept = 'image/*', maxFiles = 5, useCloudinary = true }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (!multiple && selectedFiles.length > 1) {
      toast.error('Only one file can be uploaded');
      return;
    }
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Check file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = accept.split(',').some(type => {
        if (type.includes('image')) return file.type.startsWith('image/');
        if (type.includes('video')) return file.type.startsWith('video/');
        return file.type === type;
      });
      
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) toast.error(`${file.name}: Invalid file type`);
      if (!isValidSize) toast.error(`${file.name}: File too large (max 10MB)`);
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      if (useCloudinary) {
        // Upload directly to Cloudinary
        setUploading(true);
        setUploadProgress(0);
        
        const uploadedUrls = [];
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          setUploadProgress(((i) / validFiles.length) * 100);
          
          let result;
          if (file.type.startsWith('image/')) {
            result = await cloudinaryService.uploadImageDirect(file);
          } else {
            result = await cloudinaryService.uploadVideoDirect(file);
          }
          
          if (result.success) {
            uploadedUrls.push(result.url);
            // Still keep the file object for preview
            setFiles(prev => [...prev, { file, cloudinaryUrl: result.url }]);
          } else {
            toast.error(`Failed to upload ${file.name}: ${result.error}`);
          }
        }
        
        setUploadProgress(100);
        setUploading(false);
        
        // Pass the Cloudinary URLs to parent
        if (uploadedUrls.length > 0) {
          onUpload(uploadedUrls);
        }
      } else {
        // Local storage mode (fallback)
        setFiles([...files, ...validFiles]);
        // Create object URLs for preview
        const previewUrls = validFiles.map(file => URL.createObjectURL(file));
        onUpload(validFiles, previewUrls);
      }
    }
  };
  
  const removeFile = (index) => {
    const removedFile = files[index];
    if (removedFile?.previewUrl) {
      URL.revokeObjectURL(removedFile.previewUrl);
    }
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
  
  return (
    <div className="space-y-4">
      {/* Cloudinary Badge */}
      {useCloudinary && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Cloud className="h-3 w-3" />
          <span>Uploading to Cloudinary CDN</span>
        </div>
      )}
      
      {/* Upload Button */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-orange transition ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 className="h-10 w-10 text-brand-orange mx-auto mb-2 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Uploading to Cloudinary...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-brand-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              Click to upload {accept.includes('video') ? 'videos or images' : 'images'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Max {maxFiles} files, up to 10MB each
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
      
      {/* Preview Grid */}
      {files.length > 0 && !uploading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((item, index) => {
            const file = item.file || item;
            const previewUrl = item.cloudinaryUrl || (file.type?.startsWith('image/') ? URL.createObjectURL(file) : null);
            
            return (
              <div key={index} className="relative group">
                {file.type?.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
                
                {item.cloudinaryUrl && (
                  <div className="absolute bottom-2 left-2 bg-black/50 rounded-full px-2 py-0.5">
                    <Cloud className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className="absolute bottom-2 right-2">
                  {file.type?.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-white" />
                  ) : (
                    <Video className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;