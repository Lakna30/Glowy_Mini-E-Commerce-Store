import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { Eye, EyeOff, Mail, ArrowRight, User } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // Validation rules
  const validateField = (name, value) => {
    let message = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) message = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) message = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = 'Invalid email format';
        break;
      case 'password':
        if (!value) message = 'Password is required';
        else if (value.length < 8)
          message = 'Password must be at least 8 characters';
        else if (!/[a-z]/.test(value))
          message = 'Must contain a lowercase letter';
        else if (!/[A-Z]/.test(value))
          message = 'Must contain an uppercase letter';
        else if (!/\d/.test(value))
          message = 'Must contain a number';
        else if (!/[!@#$%^&*]/.test(value))
          message = 'Must contain a special character';
        break;
      case 'confirmPassword':
        if (!value) message = 'Please confirm your password';
        else if (value !== formData.password)
          message = 'Passwords do not match';
        break;
      default:
        break;
    }
    return message;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const message = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const message = validateField(key, formData[key]);
      if (message) newErrors[key] = message;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // prevent submission
    }

    try {
      setError('');
      setLoading(true);

      const [firstName, ...rest] = (formData.fullName || '').split(' ');
      const lastName = rest.join(' ');

      const user = await signup(formData.email, formData.password, {
        firstName,
        lastName,
      });
      if (!user) throw new Error('Signup did not return a user');

      showSuccess('Account created successfully. Please log in.');
      navigate('/login');
    } catch (error) {
      setError('Failed to create an account');
      showError(`Failed to create an account. ${error?.message || 'Please try again.'}`);
      console.error('Signup error:', error);
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      showSuccess('Signed in with Google successfully!');
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in failed');
      showError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#3c3530]">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
        {/* Logo */}
        <div className="mb-10 mt-12">
          <img src="Logo.png" alt="Glowy Logo" className="h-14 object-contain" />
        </div>

        {/* Welcome Section */}
        <div className="max-w-md">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#E3D5C5] mb-6 leading-tight">
            Start your journey
          </h2>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" style={{ color: '#e3d5c5' }}>
                Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`pl-12 pr-4 h-12 w-full rounded-full border-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.fullName ? 'border-red-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: '#f0e7dc' }}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm pl-4">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" style={{ color: '#e3d5c5' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`pl-12 pr-4 h-12 w-full rounded-full border-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.email ? 'border-red-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: '#f0e7dc' }}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm pl-4">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" style={{ color: '#e3d5c5' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`pl-4 pr-12 h-12 w-full rounded-full border-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.password ? 'border-red-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: '#f0e7dc' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm pl-4">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" style={{ color: '#e3d5c5' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`pl-4 pr-12 h-12 w-full rounded-full border-2 text-gray-800 placeholder:text-gray-600 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: '#f0e7dc' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm pl-4">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Signup Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-full font-medium text-gray-900 hover:opacity-90 transition"
                style={{ backgroundColor: '#e0c4a3' }}
              >
                {loading ? 'Creating Account...' : 'Signup'} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="text-center text-white/70 text-sm my-6">-OR-</div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-4">
            {/* Google */}
            <button onClick={handleGoogle} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            {/* Facebook */}
            <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" style={{ backgroundColor: "#1877f2" }} >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          <div className="text-center">
            <span className="text-white/70 text-sm">Already have an account? </span>
            <Link to="/login" className="text-white font-medium text-sm hover:underline">
              Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 lg:pr-20">
        <div className="bg-[#e0c4a3] rounded-3xl p-6 shadow-lg w-[600px]">
          <div className="relative flex flex-col items-center">
            <img
              src="SignUpPic.png"
              alt="Skincare"
              className="object-contain w-full h-auto rounded-xl mb-8"
              style={{ height: '600px', width: 'auto' }}
            />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-6 bg-[#fce9f5] rounded-xl p-4 shadow-md w-[100%]">
              <p
                style={{ fontFamily: "'Source Serif Pro', serif" }}
                className="text-[#463C30] text-xl italic font-light leading-relaxed text-center"
              >
                " Radiant skin reflects the care you invest in yourself. Nourish it, and let your natural beauty shine "
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
