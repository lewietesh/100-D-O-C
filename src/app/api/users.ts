// src/api/user.ts
import { apiClient } from './axiosInstance';
import { UserProfile } from '@/types/user';

export const userApi = {
  getProfile: () => apiClient.get<UserProfile>('/api/v1/accounts/users/me/'),

  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>('/api/v1/accounts/users/me/update/', data),

  uploadProfileImage: (formData: FormData) =>
    apiClient.putFormData<UserProfile>('/api/v1/accounts/users/me/profile-image/', formData),

  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post('/api/v1/accounts/change-password/', data),
};