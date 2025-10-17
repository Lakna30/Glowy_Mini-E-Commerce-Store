import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { ChevronLeft } from "lucide-react";

const ConfirmOrder = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle Buy Now flow - single product purchase
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    sameAsShipping: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if this is a Buy Now flow
  useEffect(() => {
    if (location.state?.product) {
      setBuyNowProduct(location.state.product);
      setBuyNowQuantity(location.state.quantity || 1);
    }
  }, [location.state]);

  // Get items for order (either cart items or single product)
  const getOrderItems = () => {
    if (buyNowProduct) {
      return [{
        ...buyNowProduct,
        quantity: buyNowQuantity,
        selectedSize: buyNowProduct.selectedSize || null,
        selectedColor: buyNowProduct.selectedColor || null
      }];
    }
    return cartItems;
  };

  // Get total price
  const getOrderTotal = () => {
    if (buyNowProduct) {
      return buyNowProduct.price * buyNowQuantity;
    }
    return getTotalPrice();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = getOrderItems();
      const orderTotal = getOrderTotal();
      
      // Create order document
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: orderItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billingAddress: formData.sameAsShipping ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        subtotal: orderTotal,
        shipping: 350,
        total: orderTotal + 350,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart only if not Buy Now flow
      if (!buyNowProduct) {
        clearCart();
      }
      
      showSuccess('Order placed successfully!');
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${docRef.id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Failed to place order. Please try again.');
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !buyNowProduct) {
    return (
      <div className="confirm-order">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#484139]">
      <div className="confirm-order w-full">
        <div className="container mx-auto max-w-7xl py-8">
          {/* Back Navigation Icon */}
          <div
            onClick={() => navigate("/cart")}
            className="absolute top-30 left-8 cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200"
          >
            <ChevronLeft
              size={32}
              className="text-[#D4B998] hover:text-[#e1caa5] transition transform hover:scale-110"
              title="Back to Products"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
            {/* Shipping Information */}
            <div className="space-y-6">
              <div className="bg-[#E3D5C5] rounded-lg shadow-md p-6">
                <h2 className="text-xl text-[#463C30] font-bold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      className="w-full px-3 py-2 bg-[#E3D5C5] border border-[#83715E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#83715E]"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-[#E3D5C5] rounded-lg shadow-md p-6">
                <h2 className="text-xl text-[#463C30] font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  {getOrderItems().map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                          {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          {item.selectedColor && ` • Color: ${item.selectedColor}`}
                        </p>
                      </div>
                      <span className="font-semibold">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>LKR {getOrderTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>LKR 350.00</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>LKR {(getOrderTotal() + 350).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-[#D4B998] text-[#463C30] py-3 rounded-full font-bold hover:bg-[#e1caa5] transition"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
