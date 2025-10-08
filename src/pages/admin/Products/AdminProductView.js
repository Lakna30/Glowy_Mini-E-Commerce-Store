import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { ArrowLeft, Edit, Package, DollarSign, Tag, Calendar, FileText, AlertCircle } from 'lucide-react';

const AdminProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          navigate('/admin/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not specified';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockStatus = (stock) => {
    if (!stock || stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (stock < 10) {
      return { text: `Low Stock (${stock} left)`, color: 'text-orange-600 bg-orange-100' };
    } else {
      return { text: `In Stock (${stock})`, color: 'text-green-600 bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="admin-product-view">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DDBB92] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-product-view">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you're looking for doesn't exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              to="/admin/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#DDBB92] hover:bg-[#B8A082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92]"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <div className="admin-product-view">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/products"
              className="flex items-center text-[#DDBB92] hover:text-[#B8A082] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
              <p className="text-gray-600 mt-1">View and manage product information</p>
            </div>
          </div>
          <Link
            to={`/admin/edit-product/${product.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#DDBB92] hover:bg-[#B8A082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
            </div>
            <div className="p-6">
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={typeof image === 'string' ? image : image?.url || '/placeholder-product.jpg'}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                  <p className="mt-1 text-sm text-gray-500">No product images available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Product Name */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-gray-600">by {product.brand}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Stock Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Stock Status
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>

              {/* Price Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <span className="text-lg font-semibold text-gray-900">LKR {product.price}</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Original Price:</span>
                      <span className="text-sm text-gray-500 line-through">LKR {product.originalPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Category
                </h4>
                <p className="text-gray-700">
                  {product.category || 'Uncategorized'}
                </p>
              </div>

              {/* Size Information */}
              {product.size && (product.size.type || product.size.ml) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Size Information</h4>
                  <div className="space-y-1">
                    {product.size.type && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Type:</span> {product.size.type}
                      </p>
                    )}
                    {product.size.ml && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Volume:</span> {product.size.ml}ml
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Date Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Important Dates
                </h4>
                <div className="space-y-2">
                  {product.manufacturerDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manufactured:</span>
                      <span className="text-sm text-gray-700">{formatDate(product.manufacturerDate)}</span>
                    </div>
                  )}
                  {product.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expires:</span>
                      <span className="text-sm text-gray-700">{formatDate(product.expiryDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-700">{formatDate(product.createdAt)}</span>
                  </div>
                  {product.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm text-gray-700">{formatDate(product.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Product Status</h4>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to={`/admin/edit-product/${product.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#DDBB92] hover:bg-[#B8A082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Link>
              <Link
                to="/admin/products"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductView;
