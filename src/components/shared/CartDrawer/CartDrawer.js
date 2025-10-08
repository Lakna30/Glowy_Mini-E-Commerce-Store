import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (cartItems.length > 0) {
      onClose();
      navigate('/confirm-order');
    }
  };

  const formatLKR = (amount) => `LKR ${amount?.toFixed(0)}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } z-40`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#D9C7B5] text-[#2B2A29] shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <div className="text-2xl font-semibold">Shopping Cart</div>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="px-6 py-3 text-sm">
          Buy <span className="font-semibold">LKR 10000</span> more and get{' '}
          <span className="font-semibold">free</span> shipping
        </div>

        {/* Cart Items */}
        <div className="px-6 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100% - 220px)' }}>
          {cartItems.map((product) => (
            <div
              key={`${product.id}-${product.selectedSize}-${product.selectedColor}`}
              className="flex items-start gap-4 py-4 border-t border-black/10 first:border-t-0"
            >
              {/* Robust product image logic for cart drawer */}
<img
  src={
    (Array.isArray(product.images) && product.images.length > 0
      ? (typeof product.images[0] === 'string'
          ? product.images[0]
          : (product.images[0] && product.images[0].url) || null)
      : (typeof product.imageUrl === 'string' && product.imageUrl)
    ) || '/placeholder-product.jpg'
  }
  alt={product.name}
  className="w-20 h-20 rounded object-cover bg-[#E9D8C5]"
  onError={e => {
    e.target.onerror = null;
    e.target.src = '/placeholder-product.jpg';
  }}
/>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold truncate">{product.name}</div>
                  <div className="whitespace-nowrap">{formatLKR(product.price)}</div>
                </div>
                <div className="text-sm text-black/70">
                  {product.brand && <span>{product.brand}</span>}
                  {product.selectedSize && (
                    <span className="ml-2">Size: {product.selectedSize}</span>
                  )}
                  {product.selectedColor && (
                    <span className="ml-2">Color: {product.selectedColor}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="inline-flex items-center rounded-full bg-white text-[#2B2A29]">
                    <button
                      onClick={() =>
                        updateQuantity(
                          product.id,
                          Math.max(1, product.quantity - 1),
                          product.selectedSize,
                          product.selectedColor
                        )
                      }
                      className="px-3 py-1 text-base"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm font-semibold w-10 text-center">
                      {String(product.quantity).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          product.id,
                          product.quantity + 1,
                          product.selectedSize,
                          product.selectedColor
                        )
                      }
                      className="px-3 py-1 text-base"
                    >
                      ＋
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      removeFromCart(product.id, product.selectedSize, product.selectedColor)
                    }
                    className="text-red-700 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center text-black/70 py-12">Your cart is empty</div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-black/10 bg-[#D9C7B5]">
          <div className="flex items-center justify-between text-base font-semibold mb-4">
            <span>Grand Total</span>
            <span>{formatLKR(getTotalPrice())}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={getTotalItems() === 0}
            className="w-full rounded-full py-3 bg-[#C9AD90] text-[#2B2A29] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Order
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
