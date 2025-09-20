import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Eye, EyeOff, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#3c3530]">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
        
        {/* Logo */}
        <div className="mb-10">
          <img src="Logo.png" alt="Glowy Logo" className="h-14 object-contain" />
        </div>

        {/* Welcome Section */}
        <div className="max-w-md">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#E3D5C5] mb-6 leading-tight">Welcome Back!</h2>
          <p className="text-white/80 text-sm mb-10">
            Access your account to track orders, view your wishlist, and enjoy exclusive offers. 
            Don't have an account yet? Sign up today for a seamless shopping experience!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 pr-4 h-12 w-full rounded-full border-0 text-gray-800 placeholder:text-gray-600"
                style={{ backgroundColor: "#f0e7dc" }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-4 pr-12 h-12 w-full rounded-full border-0 text-gray-800 placeholder:text-gray-600"
                style={{ backgroundColor: "#f0e7dc" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center rounded-full font-medium text-gray-900 hover:opacity-90 transition"
              style={{ backgroundColor: "#e0c4a3" }}
            >
              Login <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="text-center text-white/70 text-sm my-6">-OR-</div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-6">
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100">
              {/* Google */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center hover:bg-blue-600">
              {/* Facebook */}
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12..." />
              </svg>
            </button>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <span className="text-white/70 text-sm">Don’t have an account yet? </span>
            <Link to="/signup" className="text-white font-medium text-sm hover:underline">
              Sign up →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 lg:pr-20">
        <div className="bg-[#e0c4a3] rounded-3xl p-6 shadow-lg w-[540px]">
          <div className="relative flex flex-col items-center">

            {/* Image */}
            <img 
              src="LoginPic.png" 
              alt="Skincare" 
              className="object-contain w-full h-auto rounded-xl mb-8"
              style={{ height: '540px', width: 'auto' }}
            />

            {/* Quote Overlapping */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-6 bg-[#fce9f5] rounded-xl p-4 shadow-md w-[90%]">
              <p 
                style={{ fontFamily: "'Source Serif Pro', serif" }} 
                className="text-[#463C30] text-xl italic font-light leading-relaxed text-center"
              >
                “ Beautiful skin starts with self-care—nourish it, and let your inner glow shine through “
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
