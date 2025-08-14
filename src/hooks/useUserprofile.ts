// src/hooks/useUserProfile.ts - Enhanced Complete Implementation
import { useState, useEffect, useCallback } from 'react';
import { userApi } from '@/app/api/users';
import { UserProfile } from '../types/user';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<boolean>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getProfile();
      setProfile(data);
    } catch (err: any) {
      let errorMessage = 'Failed to load profile';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Profile not found.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input data
      if (data.first_name !== undefined && data.first_name && data.first_name.length > 50) {
        throw new Error('First name must be less than 50 characters');
      }
      if (data.last_name !== undefined && data.last_name && data.last_name.length > 50) {
        throw new Error('Last name must be less than 50 characters');
      }
      if (data.phone !== undefined && data.phone && !/^(\+?[1-9]\d{1,14})?$/.test(data.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const updated = await userApi.updateProfile(data);
      setProfile(updated);
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to update profile';
      
      if (err.response?.status === 400) {
        // Handle validation errors
        if (err.response.data?.first_name) {
          errorMessage = `First name: ${err.response.data.first_name[0]}`;
        } else if (err.response.data?.last_name) {
          errorMessage = `Last name: ${err.response.data.last_name[0]}`;
        } else if (err.response.data?.phone) {
          errorMessage = `Phone: ${err.response.data.phone[0]}`;
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProfileImage = useCallback(async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }
      
      const formData = new FormData();
      formData.append('profile_img', file);
      
      const updated = await userApi.uploadProfileImage(formData);
      setProfile(updated);
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to upload image';
      
      if (err.response?.status === 400) {
        if (err.response.data?.profile_img) {
          errorMessage = err.response.data.profile_img[0];
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.status === 413) {
        errorMessage = 'Image file is too large. Please choose a smaller file.';
      } else if (err.response?.status === 415) {
        errorMessage = 'Unsupported file type. Please choose a valid image file.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    refetch,
    clearError,
  };
};