// types/auth.types.ts
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  date_joined?: string;
  last_login?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  password_confirm?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
  message?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface VerificationResponse {
  message: string;
  user: User;
  access: string;
  refresh: string;
  errors?: Record<string, string[]>;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  detail: string;
}

// For Google sign-in, use id_token (JWT). For signup, keep access_token if needed.
export interface GoogleAuthRequest {
  id_token?: string;
  access_token?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export type AuthMode = 'login' | 'register' | 'reset-password';

// Session related types
export interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
  lastActivity: number;
}

export interface SessionInfo {
  isValid: boolean;
  timeUntilExpiry: number;
  timeUntilTimeout: number;
  lastActivity: string;
  expiresAt: string | null;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; password_confirm: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (data: { email: string; code: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleAuth: (accessToken: string) => Promise<void>;
  clearError: () => void;
  refreshSession: () => void;
  refreshUser: () => Promise<void>;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationErrors;
  isSubmitting: boolean;
  touched: Record<keyof T, boolean>;
}

// Password strength types
export interface PasswordStrength {
  isValid: boolean;
  score: number;
  feedback: string[];
  checks: {
    length: boolean;
    hasLetters: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
  };
}

// Component prop types
export interface GoogleAuthButtonProps {
  onSuccess: (accessToken: string) => void;
  onError: (error: string) => void;
  text?: 'signin' | 'signup' | 'continue';
  disabled?: boolean;
  className?: string;
}

export interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

export interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showStrengthIndicator?: boolean;
  required?: boolean;
}

export interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

// API response types for specific endpoints
export interface LoginResponse extends AuthResponse {
  user: User;
}

export interface RegisterResponse {
  detail: string;
  user?: Partial<User>;
}

export interface GoogleAuthResponse extends AuthResponse {
  user: User;
  is_new_user?: boolean;
}

export interface UserProfileResponse extends User {
  permissions?: string[];
  groups?: string[];
}