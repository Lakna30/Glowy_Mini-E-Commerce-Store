import React from 'react';
import { Sparkles, Heart, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page min-h-screen bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]">
      {/* Hero Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              About <span className="text-[#edd9c0]">Glowy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#E3D5C5] max-w-3xl mx-auto leading-relaxed">
              Your trusted destination for discovering and purchasing the best skincare products from the world's most famous brands.
            </p>
          </div>
        </div>
      </div>

      {/* Our Ethos Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1a1918] mb-8">
                Our <span className="text-[#d6c6b2]">Ethos</span>
              </h2>
              <p className="text-lg text-[#f2e9df] leading-relaxed">
                We believe achieving truly radiant skin is a journey of self-care and confidence. Our mission is to make that journey effortless and joyful by curating a diverse selection of high-quality products that deliver authenticity, freshness, natural hydration, and a sense of profound indulgence.
              </p>
              <div className="flex items-center space-x-3 pt-4">
                <Heart className="w-6 h-6 text-[#c7bfb5]" />
                <span className="text-[#c7bfb5] font-semibold">Crafted with love and care</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="Skincare routine.jpg" 
                alt="Skincare routine" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Glowy Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1a1918] mb-6">
              Why Choose <span className="text-[#d6c6b2]">Glowy?</span>
            </h2>
            <p className="text-lg text-[#f2e9df] max-w-4xl mx-auto leading-relaxed">
              We combine meticulous research and contemporary beauty trends with practical experience to ensure every item in our collection is a step toward your best skin yet. We don't just sell products; we provide a personalized gateway to elevating your personal beauty through the best of global skincare innovation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] text-center border border-white/50">
              <div className="bg-[#484139]/30 backdrop-blur-lg rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#484139]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#484139] mb-4">Authenticity</h3>
              <p className="text-gray-700 leading-relaxed">
                Every product is sourced directly from authorized distributors, ensuring 100% authentic skincare solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] text-center border border-white/50">
              <div className="bg-[#484139]/30 backdrop-blur-lg rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#484139]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#484139] mb-4">Freshness</h3>
              <p className="text-gray-700 leading-relaxed">
                Our products are stored in optimal conditions and have the latest manufacturing dates for maximum efficacy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] text-center border border-white/50">
              <div className="bg-[#484139]/30 backdrop-blur-lg rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#484139]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#484139] mb-4">Natural Hydration</h3>
              <p className="text-gray-700 leading-relaxed">
                Curated selection focuses on natural ingredients that provide deep, lasting hydration for all skin types.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] text-center border border-white/50">
              <div className="bg-[#484139]/30 backdrop-blur-lg rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#484139]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#484139] mb-4">Indulgence</h3>
              <p className="text-gray-700 leading-relaxed">
                Transform your daily routine into a luxurious self-care ritual with our premium product selection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
            Ready to discover your next glow-up?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their skincare routine with Glowy's curated collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* ✅ Buttons now navigate to /all-products */}
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-[#8B7355] px-8 py-4 rounded-full font-serif font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Shop Now</span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-serif font-semibold text-lg hover:bg-white hover:text-[#8B7355] transition-colors duration-300"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>

      {/* Brand Values Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-0 mb-6 border border-white/20">
                <img 
                  src="Global brands.webp" 
                  alt="Global brands" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Global Brands</h3>
              <p className="text-[#f2e9df] leading-relaxed">
                Partnering with world-renowned skincare brands to bring you the finest products from around the globe.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-0 mb-6 border border-white/20 h-64">
                <img 
                  src="Expert curation.webp" 
                  alt="Expert curation" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Expert Curation</h3>
              <p className="text-[#f2e9df] leading-relaxed">
                Our skincare experts carefully select each product based on efficacy, quality, and customer satisfaction.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-0 mb-6 border border-white/20 h-64">
                <img 
                  src="Customer care.jpeg" 
                  alt="Customer care" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Customer Care</h3>
              <p className="text-[#f2e9df] leading-relaxed">
                Dedicated support team ready to help you find the perfect products for your unique skincare needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
