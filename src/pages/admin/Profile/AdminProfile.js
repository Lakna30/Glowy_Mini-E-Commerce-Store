import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would update the user profile in Firebase
    setIsEditing(false);
  };

  return (
    <div className="admin-profile">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your admin account settings.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-[#DDBB92] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#2B2A29]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {currentUser?.displayName || 'Admin User'}
                </h3>
                <p className="text-gray-500">{currentUser?.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Admin
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.displayName || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profileData.email}</p>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio || 'No bio available'}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#DDBB92] text-[#2B2A29] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#DDBB92] text-[#2B2A29] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
