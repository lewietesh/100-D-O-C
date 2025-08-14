// src/components/dashboard/OrderSkeleton.tsx - Complete Implementation
import React from 'react';

export const OrderSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="animate-pulse">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="ml-3">
                <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-8 bg-gray-200 rounded" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2" />
        </div>

        {/* Info Section */}
        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const OrderSkeletonCompact: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="animate-pulse flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-4 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// Grid version for dashboard overview
export const OrderSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// List version with multiple items
export const OrderSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <OrderSkeleton key={i} />
      ))}
    </div>
  );
};

// Table row version for table layouts
export const OrderSkeletonRow: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="w-8 h-8 bg-gray-200 rounded" />
      </td>
    </tr>
  );
};

// Statistics cards skeleton
export const OrderStatsSkeletons: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-12 bg-gray-200 rounded" />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Search and filters skeleton
export const OrderFiltersSkeletons: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// Complete orders page skeleton
export const OrdersPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-20 bg-gray-200 rounded" />
            <div className="h-10 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <OrderStatsSkeletons />

      {/* Filters */}
      <OrderFiltersSkeletons />

      {/* Results Info */}
      <div className="animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>

      {/* Orders List */}
      <OrderSkeletonList count={5} />
    </div>
  );
};