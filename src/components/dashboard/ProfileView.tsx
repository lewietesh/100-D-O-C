import React, { useState, useEffect } from 'react';
import { User, Upload, Save, Camera, X, Edit3, Mail, Phone, Calendar, Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserprofile';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ProfileEditForm } from './ProfileEditForm';
import { ProfileImageUploader } from './ProfileImageUploader';

export const ProfileView: React.FC = () => {
  const { profile, loading, error, updateProfile, uploadProfileImage, refetch } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleProfileUpdate = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      });
    }
    return success;
  };

  const handleImageUpload = async (file: File) => {
    const success = await uploadProfileImage(file);
    if (success) {
      setShowImageUploader(false);
      setNotification({
        type: 'success',
        message: 'Profile image updated successfully!'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to upload image. Please try again.'
      });
    }
    return success;
  };

  const handleRefresh = async () => {
    await refetch();
    setNotification({
      type: 'success',
      message: 'Profile refreshed successfully!'
    });
  };

  if (loading && !profile) return <ProfileSkeleton />;
  
  if (error && !profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`rounded-lg p-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            )}
            <p className={`font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-auto ${
                notification.type === 'success' ? 'text-green-600' : 'text-red-600'
              } hover:opacity-75`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover/Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {profile.profile_img ? (
                      <img
                        src={profile.profile_img}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-500" />
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowImageUploader(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition-colors shadow-lg border-2 border-white"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile.username
                  }
                </h1>
                <p className="text-blue-100 text-lg">@{profile.username}</p>
                
                <div className="flex items-center mt-3 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.is_verified 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {profile.is_verified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                  
                  <span className="text-blue-100 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(profile.date_joined).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isEditing 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {isEditing ? (
            <ProfileEditForm 
              profile={profile}
              onSave={handleProfileUpdate}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Email Status</p>
                  <p className="font-semibold text-gray-900">
                    {profile.is_verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Account Security</p>
                  <p className="font-semibold text-gray-900">Active</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-semibold text-gray-900">
                    {profile.last_login 
                      ? new Date(profile.last_login).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{profile.first_name || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{profile.last_name || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border flex items-center justify-between">
                      <p className="text-gray-900">{profile.email}</p>
                      {profile.is_verified ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{profile.phone || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">{profile.username}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-gray-900">
                        {new Date(profile.date_joined).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              {!profile.is_verified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Email Verification Required</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Please check your email and click the verification link to fully activate your account.
                      </p>
                      <button className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
                        Resend verification email
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ProfileImageUploader
          currentImage={profile.profile_img}
          onUpload={handleImageUpload}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </div>
  );
};