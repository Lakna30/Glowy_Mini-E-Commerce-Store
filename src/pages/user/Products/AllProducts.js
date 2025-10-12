import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useCart } from '../../../contexts/CartContext';

const gradientClass = "bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]";

const AllProducts = () => {
  // 🔹 State
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [notification, setNotification] = useState(null);
  
  // 🔹 Cart context
  const { addToCart } = useCart();

  // 🔹 Notification functions
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 🔹 Cart handling function
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addToCart(product);
      showNotification(`${product.name} added to cart successfully!`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart', 'error');
    }
  };

  // 🔹 Sort options for dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "a-z", label: "Name (A - Z)" },
    { value: "z-a", label: "Name (Z - A)" },
    { value: "price-low", label: "Price (Low → High)" },
    { value: "price-high", label: "Price (High → Low)" },
  ];

  // 🔹 Filter categories
  const filterCategories = [
    "Shampoo", "Conditioner", "Body Lotion",
    "Moisturizer", "Cleanser", "Serum", "Toner", "Spray Sunscreen", "Stick Sunscreen"
  ];

  // 🔹 Top Category Bar
  const topCategories = [
    { name: "Hair Care", key: "hair" },
    { name: "Body Care", key: "body" },
    { name: "Facial Care", key: "face" },
    { name: "Sun Protection", key: "sun" }
  ];

  // 🔹 Sidebar keyword mapping
  const sidebarKeywordMap = {
    "Shampoo": ["shampoo"],
    "Conditioner": ["conditioner"],
    "Body Lotion": ["body lotion"],
    "Moisturizer": ["moisturizer"],
    "Cleanser": ["cleanser"],
    "Serum": ["serum"],
    "Toner": ["toner"],
    "Spray Sunscreen": ["spray sunscreen"],
    "Stick Sunscreen": ["stick sunscreen"],
  };

  // 🔹 Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Filtering & Sorting Logic
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sidebar precise filter
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((product) => {
        const searchable = `${product.name || ''} ${product.description || ''}`.toLowerCase();
        return appliedFilters.some((filterLabel) => {
          const keywords = sidebarKeywordMap[filterLabel] || [];
          return keywords.some((kw) => searchable.includes(kw));
        });
      });
    }

    // Top Category Bar filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === activeCategory || product.topCategory === activeCategory
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'a-z': return a.name.localeCompare(b.name);
        case 'z-a': return b.name.localeCompare(a.name);
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, appliedFilters, sortBy, activeCategory]);

  // 🔹 Loading State
  if (loading) {
    return (
      <div className={`${gradientClass} all-products`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${gradientClass} all-products`}>
      <div className="container mx-auto px-4 py-8">

        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#D4B998] rounded-3xl px-12 py-16 text-center relative overflow-hidden">
              <h1 className="text-5xl font-serif font-bold text-[#463c30] mb-6">Elevate Your Routine</h1>
              <p className="text-lg text-[#463C30] max-w-4xl mx-auto">
                Explore our carefully curated collection of beauty and wellness products designed to nourish, protect, and enhance. 
                From skincare essentials to hair care and body care, find everything you need to elevate your routine and achieve your best look yet.
              </p>
            </div>
          </div>
        </section>

        {/* Top Category Bar */}
        <section className="px-6 mb-0 -mt-8">
          <div className="w-full px-8">
            <div className="hidden lg:flex flex-col items-center">
              <div className="flex justify-center flex-wrap gap-6">
                {topCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center space-x-3 bg-[#D4B998] rounded-2xl px-6 py-4 min-w-[19rem] shadow-md transition-transform duration-300 cursor-pointer
                      hover:scale-105 hover:shadow-2xl
                      ${activeCategory === cat.key ? "scale-105 shadow-2xl bg-[#3c352d] text-white" : "text-[#463C30]"}`}
                  >
                    <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center">
                      <img
                        src={
                          cat.name === "Hair Care"
                            ? "HairCareIcon.png"
                            : cat.name === "Body Care"
                            ? "BodyCareIcon.png"
                            : cat.name === "Facial Care"
                            ? "FacialCareIcon.png"
                            : "SunProtectionIcon.png"
                        }
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-3xl"
                      />
                    </div>
                    <span className="font-serif font-semibold text-lg">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* All Products button */}
              <div className="mt-6 w-full flex justify-end pr-12">
                <button
                  onClick={() => { setActiveCategory('All'); setAppliedFilters([]); setSearchTerm(''); }}
                  className="border-2 border-[#D4B998] text-[#E3D5C5] bg-transparent rounded-lg px-8 py-2 font-semibold hover:bg-[#e1caa5] hover:text-[#3b332b] transition"
                >
                  All Products
                </button>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="lg:hidden flex flex-col items-center gap-4">
              <div className="w-full flex justify-center gap-4 flex-wrap">
                {topCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center space-x-3 bg-[#D4B998] rounded-2xl px-6 py-4 min-w-[16rem] shadow-md transition-transform duration-300 cursor-pointer
                      hover:scale-105 hover:shadow-2xl
                      ${activeCategory === cat.key ? "scale-105 shadow-2xl bg-[#3c352d] text-white" : "text-[#463C30]"}`}
                  >
                    <div className="w-14 h-14 bg-purple-100 rounded-3xl flex items-center justify-center">
                      <img
                        src={
                          cat.name === "Hair Care"
                            ? "HairCareIcon.png"
                            : cat.name === "Body Care"
                            ? "BodyCareIcon.png"
                            : cat.name === "Facial Care"
                            ? "FacialCareIcon.png"
                            : "SunProtectionIcon.png"
                        }
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-3xl"
                      />
                    </div>
                    <span className="font-serif font-semibold text-lg">{cat.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setActiveCategory('All'); setAppliedFilters([]); setSearchTerm(''); }}
                className="whitespace-nowrap bg-[#3c352d] text-white rounded-full px-6 py-2 shadow-md hover:bg-[#2f2923]"
              >
                All Products
              </button>
            </div>
          </div>
        </section>

        {/* Filter + Products */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Sidebar Filter */}
              <div className="lg:col-span-1">
                <div className="bg-[#D4B998] rounded-2xl p-6 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#463C30]">Filter</h3>
                    <button
                      onClick={() => setAppliedFilters([])}
                      className="text-sm text-[#927b5e] hover:text-[#463c30]"
                    >
                      clear all
                    </button>
                  </div>

                  {/* Search Box */}
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-6 px-3 py-2 border border-[#927b5e] rounded-lg text-sm"
                  />

                  {/* Category Filter */}
                  <div className="mb-8">
                    <h4 className="text-[#463c30] font-medium mb-4">Category</h4>
                    <div className="space-y-3">
                      {filterCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={category}
                            checked={appliedFilters.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppliedFilters([...appliedFilters, category]);
                              } else {
                                setAppliedFilters(appliedFilters.filter((c) => c !== category));
                              }
                            }}
                            className="accent-[#8f72d9]"
                          />
                          <label htmlFor={category} className="text-[#463c30] text-sm cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort Dropdown */}
                  <div>
                    <h4 className="text-[#463c30] font-medium mb-4">Sort by</h4>
                    <Listbox value={sortBy} onChange={setSortBy}>
                      <div className="relative">
                        <Listbox.Button className="w-full px-3 py-2 border border-[#927b5e] rounded-lg text-sm bg-white">
                          {sortOptions.find((o) => o.value === sortBy)?.label || "Select"}
                        </Listbox.Button>

                        <Listbox.Options className="absolute w-full mt-1 rounded-lg bg-[#FFFFFF] text-[#000000] shadow-lg z-10">
                          {sortOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `cursor-pointer select-none px-3 py-2 ${
                                  active ? "bg-[#dec6a9]" : "bg-[#FFFFFF]"
                                }`
                              }
                            >
                              {option.label}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <p className="text-center text-white">No products found.</p>
              ) : (
                <div className="lg:col-span-3 mt-6 lg:mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-2xl shadow-sm group relative">
                        {/* Stock warning */}
                        {product.stockQuantity && product.stockQuantity > 0 && product.stockQuantity < 10 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                            Only {product.stockQuantity} items left
                          </div>
                        )}
                        
                        {/* Out of stock overlay */}
                        {(!product.stockQuantity || product.stockQuantity === 0) && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl z-10">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                        
                        {/* Product image - clickable to navigate */}
                        <Link to={`/product/${product.id}`} className="block">
                          <div className="aspect-square bg-gray-100 p-4 overflow-hidden rounded-2xl">
                            <img
                              src={(Array.isArray(product.images) && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)) || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            />
                          </div>
                        </Link>
                        
                        <div className="p-6">
                          <h3 className="text-[#463c30] font-medium text-lg mb-1">{product.name}</h3>
                          <p className="text-[#463c30] text-lg font-semibold mb-4">LKR {product.price}</p>
                          <button 
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={!product.stockQuantity || product.stockQuantity === 0}
                            className="w-full bg-[#d4b998] text-[#463c30] hover:bg-[#ddbb92] rounded-full font-medium py-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                          >
                            {!product.stockQuantity || product.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
