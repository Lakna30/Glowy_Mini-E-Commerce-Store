import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import {
  Sparkles,
  X
} from "lucide-react";

const AllProducts = () => {
  // 🔹 State
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // 🔹 Filter categories
  const filterCategories = [
    "Cleansers", "Exfoliators", "Toners",
    "Retinols", "Facial Oil", "Sunscreen", "Eye Care"
  ];

  // 🔹 Dummy Data (fallback if Firestore empty)
  const dummyProducts = [
    { id: 1, name: "Cleanser", price: 2300, image: "/luxury-skincare-cleanser-bottle.jpg", category: "Cleansers" },
    { id: 2, name: "Cleanser", price: 2050, image: "/blue-skincare-tube-cleanser.jpg", category: "Cleansers" },
    { id: 3, name: "Cleanser", price: 2650, image: "/green-skincare-cleanser-in-hands.jpg", category: "Cleansers" },
    { id: 4, name: "Moisturizer", price: 3200, image: "/white-jar-moisturizer-cream.jpg", category: "Facial Oil" },
    { id: 5, name: "Serum Set", price: 4500, image: "/yellow-serum-bottles-skincare-set.jpg", category: "Toners" },
    { id: 6, name: "Sunscreen", price: 2800, image: "/blue-sunscreen-tube-beach.jpg", category: "Sunscreen" }
  ];

  // 🔹 Fetch products from Firestore OR use dummy
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        let productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // If no products in Firestore, use dummy
        if (productsData.length === 0) {
          productsData = dummyProducts;
        }

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        // fallback to dummy
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

    // Category filter
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(product => appliedFilters.includes(product.category));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, appliedFilters, sortBy]);

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
    <div className="all-products">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>

        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#e3d5c5] rounded-3xl px-12 py-16 text-center relative overflow-hidden">
              <Sparkles className="absolute top-8 left-16 h-6 w-6 text-[#927b5e] opacity-60" />
              <Sparkles className="absolute bottom-12 right-20 h-4 w-4 text-[#927b5e] opacity-40" />
              <h1 className="text-5xl font-bold text-[#463c30] mb-6">Elevate Your Routine</h1>
              <p className="text-lg text-[#927b5e] max-w-4xl mx-auto">
                Explore our carefully curated collection of beauty and wellness products...
              </p>
            </div>
          </div>
        </section>

        {/* Filter + Products */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Filter */}
              <div className="lg:col-span-1">
                <div className="bg-[#d4b998] rounded-2xl p-6 h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#463c30]">Filter</h3>
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
                        <p className="text-[#927b5e] text-lg font-semibold mb-4">LKR {product.price}</p>
                        <button className="w-full bg-[#d4b998] text-[#463c30] hover:bg-[#ddbb92] rounded-full font-medium py-2">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllProducts;
