// src/types/user.ts - Complete Type Definitions
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  is_verified: boolean;
  profile_img?: string | null;
  phone?: string | null;
  currency?: string | null;
  language_preference?: string | null;
  account_balance?: number | string;
  date_joined: string;
  last_login?: string | null;
  is_active: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AuthUser {
  profile: UserProfile;
  access_token: string;
  refresh_token: string;
}

export interface UpdateProfileData {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  currency?: string | null;
  language_preference?: string | null;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

// API Response interfaces
export interface LoginResponse {
  success: boolean;
  access: string;
  refresh: string;
  user?: UserProfile;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  access?: string;
  refresh?: string;
  user?: UserProfile;
  message?: string;
  requires_verification?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Form validation interfaces
export interface ProfileFormErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_img?: string;
}

export interface PasswordFormErrors {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

// User preferences and settings
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
}

export interface UserSession {
  id: string;
  device: string;
  location: string;
  ip_address: string;
  last_activity: string;
  is_current: boolean;
  device_type: 'desktop' | 'mobile' | 'tablet';
  user_agent: string;
  created_at: string;
}

// Utility types
export type UserRole = 'user' | 'admin' | 'moderator';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

// Complete user context interface
export interface UserContextData extends UserProfile {
  preferences?: UserPreferences;
  role: UserRole;
  status: AccountStatus;
  permissions: string[];
}