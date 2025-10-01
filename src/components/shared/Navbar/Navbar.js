import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { isAdminEmail } from '../../../constants/admin';
import { Search, ShoppingCart } from 'lucide-react';

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

  const isAdmin = currentUser?.email && isAdminEmail(currentUser.email);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-[#484139] p-4">
      <nav className="bg-[#0D0806] text-white relative mx-4 mt-4 rounded-lg">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">

          {/* Left Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAdmin ? (
              // Admin Navigation
              <>
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/admin') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/add-product" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/admin/add-product') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  to="/admin/orders" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/admin/orders') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Orders
                </Link>
                <Link 
                  to="/admin/reviews" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/admin/reviews') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Reviews
                </Link>
              </>
            ) : (
              // Regular User Navigation
              <>
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/about') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/products" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/products') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  to="/contact" 
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive('/contact') 
                      ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                      : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                  }`}
                >
                  Contact us
                </Link>
              </>
            )}
          </div>

          {/* Center Logo */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <img 
              src="Logo.png" 
              alt="Glowy Logo" 
              className="h-20 md:h-28 object-contain"
            />
          </div>

          {/* Right Side Icons and Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search and Cart Icons - Only show for regular users */}
            {!isAdmin && (
              <>
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center bg-[#DDBB92] text-[#2B2A29] p-3 rounded-lg hover:opacity-90 transition-colors duration-300"
                >
                  <Search className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <Link
                    to="/cart"
                    className="relative inline-flex items-center justify-center bg-[#DDBB92] text-[#2B2A29] p-3 rounded-lg hover:opacity-90 transition-colors duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-beige-500 text-brown-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}

            {/* Login/Register Button */}
            {currentUser ? ( 
              <div className="relative group">
                <button className="flex items-center text-white hover:text-beige-300 transition-colors">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{currentUser.displayName || currentUser.email.split('@')[0]}</span> 
                </button>
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
                className="bg-[#DDBB92] text-[#2B2A29] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center space-x-2"
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
              {isAdmin ? (
                // Admin Mobile Navigation
                <>
                  <Link 
                    to="/admin" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/admin') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/add-product" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/admin/add-product') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/admin/orders') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/admin/reviews" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/admin/reviews') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reviews
                  </Link>
                </>
              ) : (
                // Regular User Mobile Navigation
                <>
                  <Link 
                    to="/" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/about') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/products" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/products') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`px-4 py-2 rounded transition-colors ${
                      isActive('/contact') 
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium' 
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact us
                  </Link>
                </>
              )}

              {/* Cart section - Only show for regular users */}
              {!isAdmin && (
                <div className="border-t border-brown-700 pt-4 mt-4">
                  <div className="flex items-center justify-between px-4 py-2">
                    <Link to="/cart" className="flex items-center text-white hover:text-beige-300 transition-colors">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Cart ({getTotalItems()})
                    </Link>
                  </div>
                </div>
              )}

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
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center space-x-2 bg-[#DDBB92] text-[#2B2A29] px-6 py-3 rounded-full font-semibold hover:bg-[#e6c79b] transition-colors"
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
        )}
      </nav>
    </div>
  );
};

export default Navbar;
