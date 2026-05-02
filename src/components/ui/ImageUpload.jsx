// import { useState, useRef } from 'react';
// import { Upload, X, Video, Image as ImageIcon } from 'lucide-react';
// import Cropper from 'react-easy-crop';
// import toast from 'react-hot-toast';

// const ImageUpload = ({ onUpload, multiple = false, accept = 'image/*', maxFiles = 5 }) => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [cropOpen, setCropOpen] = useState(false);
//   const [currentFile, setCurrentFile] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
    
//     if (!multiple && selectedFiles.length > 1) {
//       toast.error('Only one file can be uploaded');
//       return;
//     }
    
//     if (files.length + selectedFiles.length > maxFiles) {
//       toast.error(`Maximum ${maxFiles} files allowed`);
//       return;
//     }
    
//     // Check file types and sizes
//     const validFiles = selectedFiles.filter(file => {
//       const isValidType = accept.split(',').some(type => {
//         if (type.includes('image')) return file.type.startsWith('image/');
//         if (type.includes('video')) return file.type.startsWith('video/');
//         return file.type === type;
//       });
      
//       const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
//       if (!isValidType) toast.error(`${file.name}: Invalid file type`);
//       if (!isValidSize) toast.error(`${file.name}: File too large (max 10MB)`);
      
//       return isValidType && isValidSize;
//     });
    
//     setFiles([...files, ...validFiles]);
//   };
  
//   const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
//     if (!currentFile) return;
    
//     setUploading(true);
//     try {
//       const croppedImage = await getCroppedImage(currentFile, croppedAreaPixels);
//       onUpload(croppedImage);
//       setCropOpen(false);
//       setCurrentFile(null);
//     } catch (error) {
//       toast.error('Failed to crop image');
//     } finally {
//       setUploading(false);
//     }
//   };
  
//   const getCroppedImage = (file, croppedAreaPixels) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const image = new Image();
//         image.onload = () => {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
          
//           canvas.width = croppedAreaPixels.width;
//           canvas.height = croppedAreaPixels.height;
          
//           ctx.drawImage(
//             image,
//             croppedAreaPixels.x,
//             croppedAreaPixels.y,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height,
//             0,
//             0,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height
//           );
          
//           canvas.toBlob((blob) => {
//             resolve(new File([blob], file.name, { type: file.type }));
//           }, file.type);
//         };
//         image.src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     });
//   };
  
//   const removeFile = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };
  
//   return (
//     <div className="space-y-4">
//       {/* Upload Button */}
//       <div
//         onClick={() => fileInputRef.current?.click()}
//         className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-orange transition"
//       >
//         <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
//         <p className="text-gray-600 dark:text-gray-400">
//           Click to upload {accept.includes('video') ? 'videos or images' : 'images'}
//         </p>
//         <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//           Max {maxFiles} files, up to 10MB each
//         </p>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={accept}
//           multiple={multiple}
//           onChange={handleFileSelect}
//           className="hidden"
//         />
//       </div>
      
//       {/* Preview Grid */}
//       {files.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {files.map((file, index) => (
//             <div key={index} className="relative group">
//               {file.type.startsWith('image/') ? (
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={`Preview ${index}`}
//                   className="w-full h-32 object-cover rounded-lg"
//                 />
//               ) : (
//                 <video
//                   src={URL.createObjectURL(file)}
//                   className="w-full h-32 object-cover rounded-lg"
//                 />
//               )}
              
//               <button
//                 onClick={() => removeFile(index)}
//                 className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
//               >
//                 <X className="h-4 w-4" />
//               </button>
              
//               {file.type.startsWith('image/') && (
//                 <button
//                   onClick={() => {
//                     setCurrentFile(file);
//                     setCropOpen(true);
//                   }}
//                   className="absolute bottom-2 left-2 p-1 bg-brand-orange text-white rounded-md opacity-0 group-hover:opacity-100 transition text-xs"
//                 >
//                   Crop
//                 </button>
//               )}
              
//               <div className="absolute bottom-2 right-2">
//                 {file.type.startsWith('image/') ? (
//                   <ImageIcon className="h-4 w-4 text-white" />
//                 ) : (
//                   <Video className="h-4 w-4 text-white" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
      
//       {/* Crop Modal */}
//       {cropOpen && currentFile && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-lg w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-gray-900 dark:text-white">Crop Image</h3>
//               <button onClick={() => setCropOpen(false)}>
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             <div className="relative h-64">
//               <Cropper
//                 image={URL.createObjectURL(currentFile)}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//               />
//             </div>
            
//             <div className="flex space-x-3 mt-4">
//               <button
//                 onClick={() => setCropOpen(false)}
//                 className="flex-1 btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleCropComplete()}
//                 disabled={uploading}
//                 className="flex-1 btn-primary"
//               >
//                 {uploading ? 'Cropping...' : 'Apply Crop'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;

import { useState, useRef } from 'react';
import { Upload, X, Video, Image as ImageIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUpload, multiple = false, accept = 'image/*', maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
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
      // Update local state
      setFiles([...files, ...validFiles]);
      
      // 🔥 CRITICAL FIX: Call onUpload to send files to parent component
      onUpload(validFiles);
    }
  };
  
  const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
    if (!currentFile) return;
    
    setUploading(true);
    try {
      const croppedImage = await getCroppedImage(currentFile, croppedAreaPixels);
      
      // Remove the original file and add the cropped one
      const newFiles = files.filter(f => f !== currentFile);
      setFiles([...newFiles, croppedImage]);
      
      // Send cropped image to parent
      onUpload([croppedImage]);
      
      setCropOpen(false);
      setCurrentFile(null);
      toast.success('Image cropped successfully');
    } catch (error) {
      toast.error('Failed to crop image');
    } finally {
      setUploading(false);
    }
  };
  
  const getCroppedImage = (file, croppedAreaPixels) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
          
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          }, file.type);
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (index) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    // Notify parent that file was removed
    // Note: This is tricky because parent would need to know which file was removed
    // For simplicity, you might want to handle removal differently
  };
  
  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-orange transition"
      >
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          Click to upload {accept.includes('video') ? 'videos or images' : 'images'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Max {maxFiles} files, up to 10MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
              
              {file.type.startsWith('image/') && (
                <button
                  onClick={() => {
                    setCurrentFile(file);
                    setCropOpen(true);
                  }}
                  className="absolute bottom-2 left-2 p-1 bg-brand-orange text-white rounded-md opacity-0 group-hover:opacity-100 transition text-xs"
                >
                  Crop
                </button>
              )}
              
              <div className="absolute bottom-2 right-2">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-white" />
                ) : (
                  <Video className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Crop Modal */}
      {cropOpen && currentFile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Crop Image</h3>
              <button onClick={() => setCropOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative h-64">
              <Cropper
                image={URL.createObjectURL(currentFile)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setCropOpen(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCropComplete()}
                disabled={uploading}
                className="flex-1 btn-primary"
              >
                {uploading ? 'Cropping...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;