import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { uploadToCloudinary, getOptimizedImageUrl } from '../../../config/cloudinary';
import { updateProfile } from 'firebase/auth';
import { PencilIcon } from "lucide-react";

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
    photoURL: currentUser?.photoURL || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, {
        folder: 'admin-profiles'
      });
      
      // Apply transformations to the uploaded image URL
      const optimizedUrl = getOptimizedImageUrl(result.publicId, {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto'
      });
      
      setProfileData(prev => ({
        ...prev,
        photoURL: optimizedUrl
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="admin-profile min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your admin account settings.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-center">Profile Information</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#DDBB92] flex items-center justify-center">
                    {profileData.photoURL ? (
                      <img 
                        src={profileData.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-[#2B2A29]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-[#DDBB92] text-[#2B2A29] p-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-[#2B2A29] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <PencilIcon className="w-4 h-4" />
                      )}
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {profileData.displayName || 'Admin User'}
                  </h3>
                  <p className="text-gray-500">{profileData.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
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

              <div className="mt-8 flex justify-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={uploading}
                      className="bg-[#DDBB92] text-[#2B2A29] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={uploading}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#DDBB92] text-[#2B2A29] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;