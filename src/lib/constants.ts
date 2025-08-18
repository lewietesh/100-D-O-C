// lib/constants.ts
export const AUTH_ROUTES = {
  LOGIN: '/auth',
  REGISTER: '/auth?mode=register',
  VERIFY_EMAIL: '/auth/verify',
  RESET_PASSWORD: '/auth?mode=reset',
  DASHBOARD: '/dashboard',
} as const;

export const API_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register/',
  LOGIN: '/api/v1/auth/login/',
  LOGOUT: '/api/v1/auth/logout/',
  VERIFY_EMAIL: '/api/v1/auth/verify-email/',
  RESET_PASSWORD: '/api/v1/auth/password/reset/',
  GOOGLE_AUTH: '/api/v1/auth/social/google/',
  USER_PROFILE: '/api/v1/accounts/users/me/',
} as const;

export const SESSION_CONFIG = {
  TIMEOUT: 15 * 60 * 1000, // 15 minutes
  CHECK_INTERVAL: 60 * 1000, // 1 minute
  WARNING_TIME: 2 * 60 * 1000, // 2 minutes before timeout
} as const;
