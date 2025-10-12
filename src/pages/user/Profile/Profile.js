import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, Edit2, Save, X } from 'lucide-react';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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
  
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Format address from shipping info
  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return '';
    return [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.postalCode
    ].filter(Boolean).join(', ');
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
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
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), updateData, { merge: true });
      
      // Update auth display name if changed
      if (currentUser.displayName !== updateData.fullName) {
        await updateProfile(currentUser, {
          displayName: updateData.fullName
        });
      }
      
      setIsEditing(false);
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

  // Component to render a single profile field
  const ProfileField = ({ icon: Icon, label, value, name, type = 'text', readOnly = false }) => (
    <div className="flex items-start space-x-4 mb-6">
      <div className={`p-2 rounded-full bg-[${BRAND_COLORS.charcoalCard}]`}>
        <Icon className={`w-5 h-5 text-[${BRAND_COLORS.lightAccent}]`} />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        {isEditing && !readOnly ? (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={handleChange}
            disabled={loading}
            className={`w-full p-2 rounded-lg border border-[${BRAND_COLORS.darkBrown}] bg-[${BRAND_COLORS.charcoalCard}] text-white focus:outline-none focus:ring-2 focus:ring-[${BRAND_COLORS.lightAccent}]`}
          />
        ) : (
          <p className={`text-[${BRAND_COLORS.lightText}] ${!value ? 'text-gray-500 italic' : ''}`}>
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  );

  if (loading && !userData.email) {
    return (
      <div className={`${gradientClass} min-h-screen flex items-center justify-center`}>
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`${gradientClass} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
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
                  onClick={() => setIsEditing(true)}
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
              <ProfileField 
                icon={User} 
                label="Full Name" 
                value={userData.fullName} 
                name="fullName"
              />

              <ProfileField 
                icon={Mail} 
                label="Email Address" 
                value={userData.email} 
                name="email"
                type="email"
                readOnly
              />

              <ProfileField 
                icon={Phone} 
                label="Phone Number" 
                value={userData.phone} 
                name="phone"
                type="tel"
              />

              <ProfileField 
                icon={MapPin} 
                label="Shipping Address" 
                value={userData.address} 
                name="address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;