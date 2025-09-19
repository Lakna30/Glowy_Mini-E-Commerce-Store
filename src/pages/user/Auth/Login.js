import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Eye, EyeOff, Mail, ArrowRight } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in');
      console.error('Login error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-16" style={{ backgroundColor: "#484139" }}>
        {/* Logo */}
        <div className="mb-16">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#d4b998" }}></div>
            <h1 className="text-2xl font-light text-white tracking-wide">glowy</h1>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="max-w-md">
          <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">Welcome Back!</h2>

          <p className="text-white/80 text-base leading-relaxed mb-12">
            Access your account to track orders, view your wishlist, and enjoy exclusive offers. Don't have an account
            yet? Sign up today for a seamless shopping experience!
          </p>

          {/* Login Form */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-full border-0 text-gray-700 placeholder:text-gray-500"
                style={{ backgroundColor: "#e3d5c5" }}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12 h-14 rounded-full border-0 text-gray-700 placeholder:text-gray-500"
                style={{ backgroundColor: "#e3d5c5" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            className="w-full h-14 rounded-full text-lg font-medium text-gray-800 hover:opacity-90 transition-opacity mb-8"
            style={{ backgroundColor: "#d4b998" }}
          >
            Login
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="text-center text-white/60 text-sm mb-6">-OR-</div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-8">
            <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              style={{ backgroundColor: "#1877f2" }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-white/80 text-sm">Don't have an account yet? </span>
            <button className="text-white text-sm font-medium hover:underline">
              Sign up <ArrowRight className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="flex-1 relative">
        <div className="h-full rounded-l-3xl overflow-hidden" style={{ backgroundColor: "#d4b998" }}>
          <div className="relative h-full flex flex-col">
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-8">
              <img
                src="/asian-woman-in-white-clothing-applying-skincare-wi.jpg"
                alt="Woman applying skincare"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Quote Section */}
            <div className="p-8">
              <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#fae7f5" }}>
                <p className="text-gray-700 text-lg italic font-light leading-relaxed">
                  " Beautiful skin starts with self-care—nourish it, and let your inner glow shine through "
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
