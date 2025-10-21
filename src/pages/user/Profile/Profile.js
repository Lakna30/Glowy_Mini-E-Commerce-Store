import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Phone, MapPin, User, Edit2, Save, X } from 'lucide-react';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

// Define brand colors for easy reference
const BRAND_COLORS = {
  darkBrown: '#484139',
  lightAccent: '#DDBB92',
  charcoalCard: '#35312C',
  lightText: '#E3D5C5',
};

const gradientClass = "bg-gradient-to-b from-[#484139] via-[#544C44] via-[#5D554C] via-[#655E54] to-[#6B5B4F]";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [inputKey, setInputKey] = useState(0);

  // Format address from shipping info
  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return '';
    return [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.postalCode
    ].filter(Boolean).join(', ');
  };

  // Fetch user data on component mount - memoized to prevent unnecessary re-runs
  const fetchUserData = useCallback(async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError('');

        // 1. Get user document
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // 2. Fetch most recent order
        let latestOrder = null;
        try {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          
          if (!ordersSnapshot.empty) {
            latestOrder = {
              id: ordersSnapshot.docs[0].id,
              ...ordersSnapshot.docs[0].data()
            };
          }
        } catch (orderError) {
          console.error('Error fetching orders:', orderError);
        }

        // 3. Set user data with order data as fallback
        const newUserData = {
          fullName: userData.fullName || 
                   currentUser.displayName || 
                   latestOrder?.shippingInfo?.name || 
                   '',
          email: currentUser.email || '',
          phone: userData.phone || 
                latestOrder?.shippingInfo?.phone || 
                '',
          address: userData.address || 
                  (latestOrder?.shippingInfo ? 
                    formatAddress(latestOrder.shippingInfo) : 
                    '')
        };

        setUserData(newUserData);

        // 4. Update user document if we got new data from orders
        if (latestOrder?.shippingInfo) {
          const updateData = {};
          let needsUpdate = false;

          if (!userData.phone && latestOrder.shippingInfo.phone) {
            updateData.phone = latestOrder.shippingInfo.phone;
            needsUpdate = true;
          }

          if (!userData.address && latestOrder.shippingInfo.address) {
            updateData.address = formatAddress(latestOrder.shippingInfo);
            needsUpdate = true;
          }

          if (needsUpdate) {
            await updateDoc(doc(db, 'users', currentUser.uid), {
              ...updateData,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        }

      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Force input re-render when editing starts
  const handleEditStart = useCallback(() => {
    setIsEditing(true);
    setInputKey(prev => prev + 1);
  }, []);

  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');

      const updateData = {
        fullName: userData.fullName.trim(),
        phone: userData.phone.trim(),
        address: userData.address.trim(),
        updatedAt: new Date().toISOString()
      };

      // Check if user document exists, create if it doesn't
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          fullName: updateData.fullName,
          phone: updateData.phone,
          address: updateData.address,
          createdAt: new Date().toISOString(),
          updatedAt: updateData.updatedAt
        });
      } else {
        // Update existing document
        await updateDoc(userDocRef, updateData, { merge: true });
      }
      
      // Update auth display name if changed
      if (currentUser.displayName !== updateData.fullName) {
        await updateProfile(currentUser, {
          displayName: updateData.fullName
        });
      }
      
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (currentUser) {
      setUserData(prev => ({
        ...prev,
        fullName: currentUser.displayName || prev.fullName,
        email: currentUser.email || prev.email
      }));
    }
    setIsEditing(false);
    setError('');
  };


  if (loading && !userData.email) {
    return (
      <div className={`${gradientClass} min-h-screen flex items-center justify-center`}>
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`${gradientClass} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Profile updated successfully!</span>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#35312C] rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-[#484139] border-b border-[#5D554C]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="mt-1 text-[#DDBB92]">
                  {isEditing ? 'Update your profile information' : 'View and manage your profile'}
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditStart}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#2B2A29] bg-[#DDBB92] hover:bg-[#C9A87A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#2B2A29] bg-[#DDBB92] hover:bg-[#C9A87A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDBB92] transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 rounded-full bg-[#35312C]">
                  <User className="w-5 h-5 text-[#DDBB92]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      key={`fullName-${inputKey}`}
                      type="text"
                name="fullName"
                      value={userData.fullName || ''}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full p-2 rounded-lg border border-[#484139] bg-[#35312C] text-white focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                    />
                  ) : (
                    <p className={`text-[#E3D5C5] ${!userData.fullName ? 'text-gray-500 italic' : ''}`}>
                      {userData.fullName || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 rounded-full bg-[#35312C]">
                  <Mail className="w-5 h-5 text-[#DDBB92]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <p className={`text-[#E3D5C5] ${!userData.email ? 'text-gray-500 italic' : ''}`}>
                    {userData.email || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Phone Field */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 rounded-full bg-[#35312C]">
                  <Phone className="w-5 h-5 text-[#DDBB92]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      key={`phone-${inputKey}`}
                      type="tel"
                name="phone"
                      value={userData.phone || ''}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full p-2 rounded-lg border border-[#484139] bg-[#35312C] text-white focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                    />
                  ) : (
                    <p className={`text-[#E3D5C5] ${!userData.phone ? 'text-gray-500 italic' : ''}`}>
                      {userData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 rounded-full bg-[#35312C]">
                  <MapPin className="w-5 h-5 text-[#DDBB92]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Shipping Address
                  </label>
                  {isEditing ? (
                    <input
                      key={`address-${inputKey}`}
                      type="text"
                name="address"
                      value={userData.address || ''}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full p-2 rounded-lg border border-[#484139] bg-[#35312C] text-white focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                    />
                  ) : (
                    <p className={`text-[#E3D5C5] ${!userData.address ? 'text-gray-500 italic' : ''}`}>
                      {userData.address || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;