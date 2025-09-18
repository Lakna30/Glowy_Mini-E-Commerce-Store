import React from 'react';

const Home = () => {
  return (
    <div className="home min-h-screen">
      {/* Main Hero Section */}
      <div className="bg-[#484139] min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Section - Text Content */}
            <div className="text-white space-y-8">
              {/* Sparkle Icons */}
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-beige-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg className="w-6 h-6 text-beige-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight">
                Glow Beyond Limits
              </h1>
              
              {/* Description */}
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                Transform your skincare routine with our innovative solutions, crafted to bring out your natural beauty and deliver a luminous, healthy glow.
              </p>
              
              {/* CTA Button */}
              <button className="bg-beige-500 text-brown-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-beige-400 transition-colors duration-300 flex items-center space-x-2">
                <span>Explore more</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Right Section - Image and Categories */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative">
                {/* Beige Arch Background */}
                <div className="absolute inset-0 bg-beige-500 rounded-full transform scale-110 opacity-90"></div>
                
                {/* Woman's Image */}
                <div className="relative z-10 p-8">
                  <img
                    src="/woman-portrait.jpg"
                    alt="Woman with glowing skin"
                    className="w-full h-auto rounded-full object-cover shadow-2xl"
                  />
                </div>
                
                {/* Sparkle near woman's head */}
                <div className="absolute top-8 left-8 z-20">
                  <svg className="w-8 h-8 text-beige-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              
              {/* Product Categories */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4">
                {/* Hair Care */}
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">Hair Care</span>
                  </div>
                </div>
                
                {/* Body Care */}
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">Body Care</span>
                  </div>
                </div>
                
                {/* Facial Care */}
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">Facial Care</span>
                  </div>
                </div>
                
                {/* Sun Protection */}
                <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">Sun Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;