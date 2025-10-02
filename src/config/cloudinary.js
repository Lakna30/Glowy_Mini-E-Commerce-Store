// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dqntqa5la',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'glowy-products',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY, // Optional: for signed uploads
};

// Cloudinary upload function
export const uploadToCloudinary = async (file, options = {}) => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === 'your-cloud-name') {
    throw new Error('Cloudinary cloud name not configured. Please update CLOUDINARY_CONFIG.cloudName in src/config/cloudinary.js');
  }
  
  if (!CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error('Cloudinary upload preset not configured. Please create an upload preset in your Cloudinary dashboard and update the configuration.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
  
  // Add additional options
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.transformation) {
    formData.append('transformation', options.transformation);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.error && parsedError.error.message) {
          errorMessage = parsedError.error.message;
        }
      } catch (e) {
        // If we can't parse the error, use the raw text
        if (errorData) {
          errorMessage += ` - ${errorData}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    // Enhanced error logging
    console.error('Cloudinary upload error:', {
      message: error.message,
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    throw error;
  }
};

// Helper function to generate optimized image URLs
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
};
