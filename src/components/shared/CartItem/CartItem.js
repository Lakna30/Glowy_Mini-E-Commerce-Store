import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.id, item.selectedSize, item.selectedColor);
    } else {
      onUpdateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
    }
  };

  const formatPrice = (price) => {
    return price?.toFixed(2) || '0.00';
  };

  return (
    <div className="cart-item flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex-shrink-0">
        <img
          src={item.imageUrl || '/placeholder-product.jpg'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        
        {item.brand && (
          <p className="text-sm text-gray-600">{item.brand}</p>
        )}
        
        <div className="flex items-center space-x-2 mt-1">
          {item.selectedSize && (
            <span className="text-sm text-gray-600">Size: {item.selectedSize}</span>
          )}
          {item.selectedColor && (
            <span className="text-sm text-gray-600">Color: {item.selectedColor}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-semibold text-lg">
              ${formatPrice(item.price * item.quantity)}
            </p>
            <p className="text-sm text-gray-600">
              ${formatPrice(item.price)} each
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <button
          onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor)}
          className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
