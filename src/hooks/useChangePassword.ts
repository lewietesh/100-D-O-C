// src/hooks/useChangePassword.ts - Complete Implementation
import { useState } from 'react';
import { userApi } from '@/app/api/users';

interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

interface UseChangePasswordReturn {
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useChangePassword = (): UseChangePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate input
      if (!data.current_password || !data.new_password) {
        throw new Error('Both current and new passwords are required');
      }

      if (data.new_password.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      await userApi.changePassword(data);
      setSuccess(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to change password';
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.detail || err.response.data?.current_password?.[0] || 'Invalid current password';
      } else if (err.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
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
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  return { 
    changePassword, 
    loading, 
    error, 
    success, 
    clearError, 
    clearSuccess 
  };
};