import React from 'react';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="home min-h-screen">
      {/* Main Hero Section */}
      <div className="bg-[#484139] min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Center Image */}
            <div className="col-span-4 flex justify-center relative z-0">
              <div className="relative">
                  <img
                    src="Hero.png"
                    alt="Woman applying skincare"
                    className="w-full h-full object-cover"
                  />
              </div>
            </div>
            
            {/* Left Section - Text Content */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 -mt-10 z-10 px-6 lg:px-12">
              <div className="text-[#E3D5C5] space-y-8 max-w-md">
              
              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight">
                Glow Beyond
                <br />
                Limits
              </h1>
              
              {/* Description */}
              <p className="text-lg lg:text-xl text-[#E3D5C5] leading-relaxed max-w-lg">
                Transform your skincare routine with our innovative solutions, crafted to bring out your natural beauty and deliver a luminous, healthy glow.
              </p>
              
              {/* CTA Button */}
              <button className="bg-[#DDBB92] text-[#2B2A29] px-8 py-4 rounded-full font-serif font-semibold text-lg hover:opacity-90 transition-colors duration-300 flex items-center space-x-2">
                <span>Explore more</span>
                <ArrowRight className="w-5 h-5 translate-y-1" />
              </button>
            </div>
          </div>  

            {/* Product Categories */}
            <div className="absolute top-[40%] right-[15%] transform -translate-y-1/2 space-y-4 z-20">
              {/* Hair Care */}
              <div className="bg-[#484139] rounded-lg p-0 w-60 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                    <img src="HairCareIcon.png"
                           alt="Hair Care" 
                           className="w-full h-full object-contain" />
                  </div>
                  <span className="font-serif font-semibold text-[#E3D5C5] text-lg">Hair Care</span>
                </div>
              </div>

              {/* Body Care */}
              <div className="bg-[#484139] rounded-lg p-0 w-60 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                    <img src="BodyCareIcon.png"
                           alt="Body Care" 
                           className="w-full h-full object-contain" />
                  </div>
                  <span className="font-serif font-semibold text-[#E3D5C5] text-lg">Body Care</span>
                </div>
              </div>

              {/* Facial Care */}
              <div className="bg-[#484139] rounded-lg p-0 w-60 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                    <img src="SunProtectionIcon.png"
                           alt="Sun Protection" 
                           className="w-full h-full object-contain" />
                  </div>
                  <span className="font-serif font-semibold text-[#E3D5C5] text-lg">Sun Protection</span>
                </div>
              </div>

              {/* Sun Protection */}
                <div className="bg-[#484139] rounded-lg p-0 w-60 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                      <img src="FacialCareIcon.png"
                           alt="Facial Care" 
                           className="w-full h-full object-contain" />
                    </div>
                    <span className="font-serif font-semibold text-[#E3D5C5] text-lg">Facial Care</span>
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