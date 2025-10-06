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
    <div className="product bg-[#484139] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="bg-[#D4B998] px-6 py-3 mb-8 rounded-lg">
          <nav className="text-[#463c30] text-sm">
            <span>Home</span> <span className="mx-2">></span>
            <span>Products</span> <span className="mx-2">></span>
            <span className="font-semibold">{product.category || 'Product'}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details - Left Column (Beige) */}
          <div className="bg-[#D4B998] rounded-2xl p-8">
            <h1 className="text-4xl font-serif font-bold text-[#463c30] mb-6">{product.name}</h1>
            
            <div className="description mb-6">
              <h3 className="text-lg font-semibold text-[#463c30] mb-3">{product.name}:</h3>
              <div className="text-[#463c30] space-y-2">
                {product.description && (
                  <p className="text-sm">{product.description}</p>
                )}
                {product.brand && (
                  <p className="text-sm">• Brand: {product.brand}</p>
                )}
                {product.size?.ml && (
                  <p className="text-sm">• Volume: {product.size.ml}ml</p>
                )}
              </div>
            </div>

            {product.brand && (
              <div className="mb-4">
                <span className="text-sm text-[#463c30]">All Types Of Skin</span>
              </div>
            )}

            <div className="price mb-6">
              <span className="text-4xl font-bold text-[#463c30]">
                LKR {product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-[#927b5e] line-through ml-2">
                  LKR {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.rating && (
              <div className="rating mb-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="bg-[#463c30] text-[#D4B998] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#3c352d] transition-colors"
                onClick={handleAddToCart}
              >
                Buy Now
              </button>
              
              <button
                className="bg-[#D4B998] text-[#463c30] p-4 rounded-lg border-2 border-[#463c30] hover:bg-[#ddbb92] transition-colors"
                onClick={handleAddToCart}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </button>
              
              <button className="bg-[#D4B998] text-[#463c30] p-4 rounded-lg border-2 border-[#463c30] hover:bg-[#ddbb92] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Images - Right Column (Dark Brown) */}
          <div className="bg-[#3c352d] rounded-2xl p-8">
            <div className="main-image mb-6">
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
              <div className="thumbnail-images grid grid-cols-2 gap-4">
                {product.images.slice(0, 2).map((image, index) => (
                  <img
                    key={index}
                    src={(typeof image === 'string' ? image : image?.url) || '/placeholder-product.jpg'}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-full h-32 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === index ? 'border-[#D4B998]' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-[#3c352d] rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-[#D4B998] mb-4">Reviews</h2>
          <p className="text-[#D4B998] mb-6">No reviews</p>
          
          <h3 className="text-2xl font-bold text-[#D4B998] mb-4">Write a review</h3>
          
          <div className="mb-4">
            <div className="flex text-yellow-400 text-2xl">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="cursor-pointer hover:text-yellow-300">★</span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <textarea
              placeholder="Write a review"
              className="w-full h-32 p-4 bg-[#D4B998] text-[#463c30] rounded-lg border-2 border-[#927b5e] focus:border-[#463c30] focus:outline-none resize-none"
            />
          </div>
          
          <button className="bg-[#927b5e] text-[#D4B998] px-6 py-3 rounded-lg font-semibold hover:bg-[#8a6f5a] transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
