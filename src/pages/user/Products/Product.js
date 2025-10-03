import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useCart } from '../../../contexts/CartContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() });
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity,
        selectedSize,
        selectedColor
      });
      // You might want to show a success message here
    }
  };

  if (loading) {
    return (
      <div className="product">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image mb-4">
              <img
                src={(Array.isArray(product.images)
                  ? (typeof product.images[selectedImage] === 'string'
                      ? product.images[selectedImage]
                      : product.images[selectedImage]?.url)
                  : '/placeholder-product.jpg') || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images flex gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={(typeof image === 'string' ? image : image?.url) || '/placeholder-product.jpg'}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="price mb-4">
              <span className="text-3xl font-bold text-primary-600">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.rating && (
              <div className="rating mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            )}

            <div className="description mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Product Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="color-selection mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? 'border-primary-500'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="quantity-cart mb-6">
              <div className="flex items-center gap-4">
                <div className="quantity-selector">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="add-to-cart">
                  <button
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.brand && (
                <div>
                  <span className="text-sm text-gray-500">Brand</span>
                  <div className="text-gray-800 font-medium">{product.brand}</div>
                </div>
              )}
              {product.category && (
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <div className="text-gray-800 font-medium">{product.category}</div>
                </div>
              )}
              {product.size?.type && (
                <div>
                  <span className="text-sm text-gray-500">Size Type</span>
                  <div className="text-gray-800 font-medium">{product.size.type}</div>
                </div>
              )}
              {product.size?.ml && (
                <div>
                  <span className="text-sm text-gray-500">Volume</span>
                  <div className="text-gray-800 font-medium">{product.size.ml} ml</div>
                </div>
              )}
              {product.manufacturerDate && (
                <div>
                  <span className="text-sm text-gray-500">Manufactured</span>
                  <div className="text-gray-800 font-medium">{product.manufacturerDate}</div>
                </div>
              )}
              {product.expiryDate && (
                <div>
                  <span className="text-sm text-gray-500">Expiry</span>
                  <div className="text-gray-800 font-medium">{product.expiryDate}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
