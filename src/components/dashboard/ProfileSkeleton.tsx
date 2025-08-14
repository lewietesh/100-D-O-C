// src/components/dashboard/ProfileSkeleton.tsx - Version 3
import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card Skeleton */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section Skeleton */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Image Skeleton */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-300 animate-pulse" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full animate-pulse" />
              </div>

              {/* User Info Skeleton */}
              <div className="space-y-3">
                <div className="h-8 w-48 bg-white/30 rounded animate-pulse" />
                <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-20 bg-white/20 rounded-md animate-pulse" />
              <div className="h-10 w-28 bg-white/30 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-3" />
                <div className="h-4 w-20 bg-gray-300 rounded mx-auto mb-2" />
                <div className="h-5 w-16 bg-gray-300 rounded mx-auto" />
              </div>
            ))}
          </div>

          {/* Profile Information Section */}
          <div>
            <div className="h-6 w-36 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-md p-3">
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative compact skeleton for loading states
export const ProfileSkeletonCompact: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Card-based skeleton for different loading scenarios
export const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};