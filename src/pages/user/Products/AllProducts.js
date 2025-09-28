import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { X } from "lucide-react";

const AllProducts = () => {
  // 🔹 State
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // 🔹 Filter categories
  const filterCategories = [
    "Cleansers", "Exfoliators", "Toners",
    "Retinols", "Facial Oil", "Sunscreen", "Eye Care"
  ];

  // 🔹 Top Category Bar
  const topCategories = [
    { name: "Hair Care", key: "Hair Care" },
    { name: "Body Care", key: "Body Care" },
    { name: "Facial Care", key: "Facial Care" },
    { name: "Sun Protection", key: "Sunscreen" }
  ];

  // 🔹 Dummy Data
  const dummyProducts = [
    { id: 1, name: "Cleanser", price: 2300, image: "/luxury-skincare-cleanser-bottle.jpg", category: "Cleansers", topCategory: "Facial Care" },
    { id: 2, name: "Cleanser", price: 2050, image: "/blue-skincare-tube-cleanser.jpg", category: "Cleansers", topCategory: "Facial Care" },
    { id: 3, name: "Cleanser", price: 2650, image: "/green-skincare-cleanser-in-hands.jpg", category: "Cleansers", topCategory: "Facial Care" },
    { id: 4, name: "Moisturizer", price: 3200, image: "/white-jar-moisturizer-cream.jpg", category: "Facial Oil", topCategory: "Facial Care" },
    { id: 5, name: "Serum Set", price: 4500, image: "/yellow-serum-bottles-skincare-set.jpg", category: "Toners", topCategory: "Facial Care" },
    { id: 6, name: "Sunscreen", price: 2800, image: "/blue-sunscreen-tube-beach.jpg", category: "Sunscreen", topCategory: "Sun Protection" }
  ];

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        let productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (!productsData || productsData.length === 0) {
          productsData = dummyProducts;
        }

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Filtering & Sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sidebar Category filter
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(product => appliedFilters.includes(product.category));
    }

    // Top Category Bar filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(product => product.topCategory === activeCategory);
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

  if (loading) {
    return (
      <div className="all-products">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-products bg-[#484139]">
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

        {/* Top Category Bar - Horizontal with Icons */}
        <section className="px-6 mb-12">
          <div className="w-full px-8 flex justify-center gap-6 flex-wrap">
          {topCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center space-x-3 bg-[#D4B998] rounded-2xl px-6 py-4 min-w-[19rem] shadow-md transition-transform duration-300 cursor-pointer
              hover:scale-105 hover:shadow-2xl
              ${activeCategory === cat.key ? "scale-105 shadow-2xl bg-[#3c352d] text-white" : "text-[#463C30]"}`
              }
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center">
                <img
                  src={
                  cat.key === "Hair Care"
                  ? "HairCareIcon.png"
                  : cat.key === "Body Care"
                  ? "BodyCareIcon.png"
                  : cat.key === "Facial Care"
                  ? "FacialCareIcon.png"
                  : "SunProtectionIcon.png"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>

              {/* Label */}
              <span className="font-serif font-semibold text-lg">
                {cat.name}
              </span>
            </button>
            ))}
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

                  {/* Applied Filters */}
                  {appliedFilters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[#463c30] font-medium mb-3">Applied filters</h4>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.map((filter) => (
                          <div key={filter} className="flex items-center bg-white rounded-full px-3 py-1 text-sm">
                            <span className="text-[#463c30]">{filter}</span>
                            <X
                              className="h-3 w-3 ml-2 text-[#927b5e] cursor-pointer"
                              onClick={() =>
                                setAppliedFilters(appliedFilters.filter((c) => c !== filter))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-[#927b5e] rounded-lg text-sm"
                    >
                      <option value="">Default</option>
                      <option value="a-z">Name (A - Z)</option>
                      <option value="z-a">Name (Z - A)</option>
                      <option value="price-low">Price (Low → High)</option>
                      <option value="price-high">Price (High → Low)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <p className="text-center text-white">No products found.</p>
              ) : (
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-2xl shadow-sm">
                        <div className="aspect-square bg-gray-100 p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-[#463c30] font-medium text-lg mb-1">{product.name}</h3>
                          <p className="text-[#463c30] text-lg font-semibold mb-4">LKR {product.price}</p>
                          <button className="w-full bg-[#d4b998] text-[#463c30] hover:bg-[#ddbb92] rounded-full font-medium py-2">
                            Add to cart
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
    </div>
  );
};

export default AllProducts;
