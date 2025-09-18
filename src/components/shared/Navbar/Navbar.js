import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isAdmin = currentUser?.email === 'admin@glowy.com';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[#0D0806] text-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Left Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded transition-colors ${
                isActive('/') ? 'bg-[#DDBB92] text-brown-800' : 'hover:text-[#2B2A29]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="hover:text-beige-300 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/products" 
              className="hover:text-beige-300 transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-beige-300 transition-colors"
            >
              Contact us
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-3xl font-serif font-bold text-white flex items-center">
              <span className="relative">
                glowy
                {/* Decorative dots above 'o' and 'w' */}
                <span className="absolute -top-2 left-1 w-1 h-1 bg-beige-400 rounded-full"></span>
                <span className="absolute -top-2 right-1 w-1 h-1 bg-beige-400 rounded-full"></span>
              </span>
            </Link>
          </div>

          {/* Right Side Icons and Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Icon */}
            <button className="text-white hover:text-beige-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <div className="relative">
              <Link to="/cart" className="text-white hover:text-beige-300 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-beige-500 text-brown-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>

            {/* Login/Register Button */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center text-white hover:text-beige-300 transition-colors">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Order History
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-beige-500 text-brown-800 px-6 py-2 rounded-lg font-semibold hover:bg-beige-400 transition-colors flex items-center space-x-2"
              >
                <span>Login/Register</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-beige-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-brown-700">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded transition-colors ${
                  isActive('/') ? 'bg-beige-500 text-brown-800' : 'hover:text-beige-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="hover:text-beige-300 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/products" 
                className="hover:text-beige-300 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-beige-300 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact us
              </Link>
              
              <div className="border-t border-brown-700 pt-4 mt-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <Link to="/cart" className="flex items-center text-white hover:text-beige-300 transition-colors">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Cart ({getTotalItems()})
                  </Link>
                </div>
                
                {currentUser ? (
                  <div className="px-4 py-2 space-y-2">
                    <Link to="/my-orders" className="block text-white hover:text-beige-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link to="/order-history" className="block text-white hover:text-beige-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Order History
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block text-white hover:text-beige-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-left text-white hover:text-beige-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <Link 
                      to="/login" 
                      className="bg-beige-500 text-brown-800 px-4 py-2 rounded-lg font-semibold hover:bg-beige-400 transition-colors inline-flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Login/Register</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;