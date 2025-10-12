import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import CartItem from '../../../components/shared/CartItem/CartItem';
import { ChevronLeft } from "lucide-react";

const gradientClass = "bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]";

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/confirm-order');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className={`${gradientClass} min-h-screen flex items-center justify-center`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-[#E3D5C5] rounded-lg border border-[#83715E] shadow-md mx-auto max-w-xl">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${gradientClass} min-h-screen`}>
      <div className="container mx-auto max-w-7xl py-8">
        <div className="mb-8 px-4">
          {/* Back Navigation Icon */}
          <div
            onClick={() => navigate("/products")}
            className="absolute top-30 left-4 cursor-pointer opacity-80 hover:opacity-100 transition-all duration-200"
          >
            <ChevronLeft
              size={32}
              className="text-[#D4B998] hover:text-[#e1caa5] transition transform hover:scale-110"
              title="Back to Products"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#E3D5C5]">Shopping Cart</h1>
          <p className="text-[#D4B998]">
            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#E3D5C5] rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#E3D5C5] rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>LKR {getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>LKR 350.00</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>LKR {(getTotalPrice() + 350).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[#D4B998] text-[#463C30] py-3 rounded-full font-bold hover:bg-[#e1caa5] transition"
              >
                Proceed to Confirm
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full mt-3 border-2 border-[#D4B998] text-[#463C30] bg-transparent py-3 rounded-full font-semibold hover:bg-[#e1caa5] hover:text-[#3b332b] transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
