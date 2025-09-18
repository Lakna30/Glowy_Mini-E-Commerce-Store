import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0] || '/placeholder-product.jpg',
      brand: product.brand,
      selectedSize,
      selectedColor,
      quantity
    };

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === cartItem.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const updateQuantity = (productId, newQuantity, selectedSize = '', selectedColor = '') => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId, selectedSize = '', selectedColor = '') => {
    setCartItems(prevItems => {
      return prevItems.filter(item => 
        !(item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (productId, selectedSize = '', selectedColor = '') => {
    const item = cartItems.find(
      item => item.id === productId && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (productId, selectedSize = '', selectedColor = '') => {
    return cartItems.some(
      item => item.id === productId && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
