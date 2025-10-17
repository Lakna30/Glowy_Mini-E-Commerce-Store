import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { useConfirmation } from "../../../contexts/ConfirmationContext";
import { isAdminEmail } from "../../../constants/admin";
import { Search, ShoppingCart } from "lucide-react";
import CartDrawer from "../CartDrawer/CartDrawer";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { showSuccess, showError } = useNotification();
  const { showConfirmation } = useConfirmation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showEmptyTooltip, setShowEmptyTooltip] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    const confirmed = await showConfirmation({
      title: 'Logout',
      message: 'Are you sure you want to logout? You will need to sign in again to access your account.',
      confirmText: 'Yes, Logout',
      cancelText: 'Stay Logged In',
      type: 'logout'
    });

    if (!confirmed) return;

    try {
      await logout();
      showSuccess('Logged out successfully!');
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      showError('Failed to logout. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // Later you can implement real search logic here
  };

  const isAdmin = currentUser?.email && isAdminEmail(currentUser.email);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#484139] p-4">
      <nav className="bg-[#0D0806] text-white relative mx-4 mt-4 rounded-lg overflow-visible">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">
          {/* Left Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/admin")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/add-product"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/admin/add-product")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/admin/orders")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/reviews"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/admin/reviews")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Reviews
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/about")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/products"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/products")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-semibold ${
                    isActive("/contact")
                      ? "bg-[#DDBB92] text-[#2B2A29] font-medium"
                      : "text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]"
                  }`}
                >
                  Contact Us
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
            {/* Search & Cart (Regular Users Only) */}
            {!isAdmin && (
              <>
                {/* 🔍 Search Toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="inline-flex items-center justify-center bg-[#DDBB92] text-[#2B2A29] p-3 rounded-lg hover:opacity-90 transition-colors duration-300"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {isSearchOpen && (
                    <form
                      onSubmit={handleSearch}
                      className="absolute right-0 mt-3 bg-white text-black px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 w-64 z-50"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                      />
                      <button
                        type="submit"
                        className="bg-[#DDBB92] text-[#2B2A29] px-3 py-1 rounded-md font-semibold hover:bg-[#e6c79b] transition"
                      >
                        Go
                      </button>
                    </form>
                  )}
                </div>

                {/* 🛒 Cart */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (getTotalItems() > 0) {
                        setIsCartOpen(true);
                      }
                    }}
                    onMouseEnter={() =>
                      setShowEmptyTooltip(getTotalItems() === 0)
                    }
                    onMouseLeave={() => setShowEmptyTooltip(false)}
                    className="relative inline-flex items-center justify-center bg-[#DDBB92] text-[#2B2A29] p-3 rounded-lg hover:opacity-90 transition-colors duration-300"
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {currentUser && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                  {showEmptyTooltip && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-yellow-100 text-[#2B2A29] text-sm px-4 py-2 rounded-xl shadow-lg whitespace-nowrap border border-yellow-300 animate-fade-in z-50">
                      Cart is empty
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Login / User Menu */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center text-white hover:text-beige-300 transition-colors">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    {currentUser.displayName ||
                      currentUser.email.split("@")[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/my-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-beige-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (unchanged) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-brown-700">
            <div className="flex flex-col space-y-4">
              {/* ... your existing mobile menu code here (unchanged) ... */}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
