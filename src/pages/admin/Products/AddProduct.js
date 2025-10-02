import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { uploadToCloudinary } from '../../../config/cloudinary';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    size: { type: '', ml: '' },   // ✅ single size object
    manufacturerDate: '',
    expiryDate: '',
    stockQuantity: ''
  });

  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // handle text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handle size input
  const handleSizeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      size: { ...prev.size, [field]: value }
    }));
  };

  // image select (input)
  const handleImageChange = (e) => {
  const files = Array.from(e.target.files || []);
  const imageFiles = files.filter((f) => f.type.startsWith('image/'));
  const newImages = [...images, ...imageFiles].slice(0, 3); // keep max 3
  if (newImages.length > 3) {
    setError('You can upload a maximum of 3 images.');
  } else {
    setError('');
  }
  setImages(newImages);
  };

  // drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  const files = Array.from(e.dataTransfer?.files || []);
  if (files.length) {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const newImages = [...images, ...imageFiles].slice(0, 3); // keep max 3
    if (newImages.length > 3) {
      setError('You can upload a maximum of 3 images.');
    } else {
      setError('');
    }
    setImages(newImages);
  }
  };

  // upload images to Cloudinary
  const uploadImages = async () => {
    const uploadPromises = images.map(async (image, index) => {
      try {
        
        const uploadOptions = {
          folder: 'glowy/products', // Organize images in folders
          // Note: transformations should be configured in the upload preset, not here
        };
        
        
        const result = await uploadToCloudinary(image, uploadOptions);
        
        return {
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          format: result.format
        };
      } catch (error) {
        console.error(`❌ Failed to upload image ${index + 1} to Cloudinary:`, error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        throw new Error(`Failed to upload ${image.name} to Cloudinary: ${error.message}`);
      }
    });
    return Promise.all(uploadPromises);
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if required fields are filled
      if (!formData.name.trim()) {
        setLoading(false);
        setError('Product name is required.');
        return;
      }
      if (!formData.description.trim()) {
        setLoading(false);
        setError('Product description is required.');
        return;
      }
      if (!formData.category) {
        setLoading(false);
        setError('Product category is required.');
        return;
      }
      if (!formData.price) {
        setLoading(false);
        setError('Product price is required.');
        return;
      }

      // basic client-side validations
      const todayStr = new Date().toISOString().split('T')[0];
      if (formData.manufacturerDate && formData.manufacturerDate > todayStr) {
        setLoading(false);
        setError('Manufacturer date cannot be in the future.');
        return;
      }
      if (formData.expiryDate && formData.expiryDate < todayStr) {
        setLoading(false);
        setError('Expiry date cannot be in the past.');
        return;
      }
      const stock = formData.stockQuantity === '' ? 0 : parseInt(formData.stockQuantity, 10);
      if (Number.isNaN(stock) || stock < 0) {
        setLoading(false);
        setError('Stock quantity must be a non-negative number.');
        return;
      }
      const price = parseFloat(formData.price);
      if (Number.isNaN(price) || price <= 0) {
        setLoading(false);
        setError('Price must be a positive number.');
        return;
      }
      let originalPrice = null;
      if (formData.originalPrice) {
        originalPrice = parseFloat(formData.originalPrice);
        if (Number.isNaN(originalPrice) || originalPrice <= 0) {
          setLoading(false);
          setError('Original price must be a positive number.');
          return;
        }
      }
      let sizeMl = null;
      if (formData.size.ml) {
        sizeMl = parseInt(formData.size.ml, 10);
        if (Number.isNaN(sizeMl) || sizeMl <= 0) {
          setLoading(false);
          setError('Size (ml) must be a positive number.');
          return;
        }
      }
      if (images.length > 3) {
        setLoading(false);
        setError('You can upload a maximum of 3 images.');
        return;
      }


      let uploadedImageUrls = [];
      if (images.length > 0) {
        try {
          uploadedImageUrls = await uploadImages();
        } catch (uploadError) {
          setLoading(false);
          setError(`Image upload failed: ${uploadError.message}. Please check your Cloudinary configuration.`);
          return;
        }
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        size: {
          type: formData.size.type,
          ml: formData.size.ml ? parseInt(formData.size.ml, 10) : null   // ✅ ensure number
        },
        stockQuantity: stock,
        manufacturerDate: formData.manufacturerDate || null,
        expiryDate: formData.expiryDate || null,
        images: uploadedImageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };


      try {
        const docRef = await addDoc(collection(db, 'products'), productData);
        setSuccess(`Product added successfully with ID: ${docRef.id}`);

        // reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: '',
          brand: '',
          size: { type: '', ml: '' },
          manufacturerDate: '',
          expiryDate: '',
          stockQuantity: ''
        });
        setImages([]);
      } catch (firestoreError) {
        console.error('❌ Firestore save failed:', firestoreError);
        setError(`Failed to save product: ${firestoreError.message}`);
        return;
      }

    } catch (error) {
      console.error('❌ Unexpected error adding product:', error);
      setError(`Failed to add product: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product flex items-center justify-center min-h-screen bg-gray-30">
      <div className="container max-w-6xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
          <p className="text-gray-600">Add a new product to your store</p>
        </div>


        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/** compute today for date inputs */}
          {(() => null)()}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="originalPrice"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Size with ml */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex items-center space-x-3 mb-3">
                  <select
                    value={formData.size.type}
                    onChange={(e) => handleSizeChange('type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Size</option>
                    <option value="Travel/Trial">Travel/Trial</option>
                    <option value="Standard">Standard</option>
                    <option value="Larger">Larger</option>
                  </select>
                  <input
                    type="number"
                    placeholder="ml"
                    min="0"
                    value={formData.size.ml}
                    onChange={(e) => handleSizeChange('ml', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Manufacturer and Expiry Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer Date
                  </label>
                  <input
                    type="date"
                    name="manufacturerDate"
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.manufacturerDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                />
              </div>

              {/* Category and Brand moved here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="hair">Hair Care</option>
                    <option value="body">Body Care</option>
                    <option value="face">Facial Care</option>
                    <option value="sun">Sun Protection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            {/* Product Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Images</h2>

              {/* Upload area */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                />
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 7.5L12 3m0 0L7.5 7.5M12 3v13.5"
                    />
                  </svg>
                  <span className="text-primary-600 font-medium">Add Image</span>
                  <p className="text-xs text-gray-500 mt-1">Up to 3 images</p>
                </label>
              </div>

              {/* Preview Section */}
{images.length > 0 && (
  <div className="space-y-3">
    {/* Main Image */}
    <div className="relative w-full max-w-md mx-auto aspect-square border rounded-lg overflow-hidden">
      <img
        src={URL.createObjectURL(images[0])}
        alt="main-product"
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const updated = [...images];
          updated.splice(0, 1); // remove main
          setImages(updated);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>

    {/* Thumbnails (side by side) */}
    {images.length > 1 && (
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {images.slice(1).map((file, idx) => (
          <div
            key={idx}
            className="relative aspect-square border rounded-lg overflow-hidden"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                const updated = [...images];
                updated.splice(idx + 1, 1); // remove correct thumbnail
                setImages(updated);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Show + slot if less than 3 images */}
        {images.length < 3 && (
          <label
            htmlFor="imageInput"
            className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer aspect-square text-gray-400 hover:bg-gray-50"
          >
            +
          </label>
        )}
      </div>
    )}
  </div>
)}
            </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#DDBB92] text-[#2B2A29] font-semibold rounded-md hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
         </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
