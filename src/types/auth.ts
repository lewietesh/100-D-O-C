// types/auth.ts
// Authentication and User Management Types

export type UserRole = 'developer' | 'admin' | 'client';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface BaseUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isStaff: boolean;
  dateJoined: string;
  dateUpdated: string;
  lastLogin?: string;
}

export interface User extends BaseUser {
  fullName: string;
}

export interface ClientProfile {
  user: string; // User ID
  companyName?: string;
  industry?: string;
  accountBalance: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface UserWithProfile extends User {
  clientProfile?: ClientProfile;
}

// Authentication-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  companyName?: string;
  industry?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  codename: string;
  contentType: string;
}

export interface UserPermissions {
  user: User;
  permissions: Permission[];
  groups: string[];
}

// Password reset types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Admin user management types
export interface UserCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
  phone?: string;
  isActive?: boolean;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  companyName?: string;
  industry?: string;
}

export interface ClientProfileUpdateRequest {
  companyName?: string;
  industry?: string;
  accountBalance?: number;
}

// Session and security types
export interface UserSession {
  sessionId: string;
  user: User;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: string;
  expiresAt: string;
}

export interface SecurityLog {
  id: string;
  user: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  successful: boolean;
  details?: Record<string, any>;
}