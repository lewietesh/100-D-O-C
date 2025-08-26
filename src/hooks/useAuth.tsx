// hooks/useAuth.ts - CORRECTED VERSION
'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
  useRef
} from 'react';
import { authAPI } from '../lib/auth-apis';
import { sessionManager } from '../lib/session-manager';
// @ts-ignore
import { logger } from '../lib/logger';
import type { User, ApiError } from '../types/auth';

// ========================================
// TYPES DEFINITION - Define these BEFORE using them
// ========================================

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthContextType extends AuthState {
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

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// ========================================
// INITIAL STATE
// ========================================

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  isInitialized: false,
};

// ========================================
// REDUCER FUNCTION
// ========================================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
        isLoading: false,
        isInitialized: true,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
        isLoading: !action.payload
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        isInitialized: true
      };

    default:
      return state;
  }
}

// ========================================
// CONTEXT IMPORT
// ========================================
import AuthContext from './AuthContext';

// ========================================
// PROVIDER COMPONENT
// ========================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // Periodic token refresh logic
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

    async function tryRefreshToken() {
      if (!sessionManager.isAuthenticated()) return;
      try {
        if (typeof window !== 'undefined') {
          const refresh = localStorage.getItem('refresh');
          if (refresh) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/accounts/auth/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh }),
            });
            const data = await response.json();
            const user = sessionManager.getUser();
            if (response.ok && data.access && data.refresh && user) {
              localStorage.setItem('auth_token', data.access);
              localStorage.setItem('refresh', data.refresh);
              sessionManager.setSession(data.access, user);
              logger.info('Token and refresh token updated successfully');
            }
          }
        }
      } catch (error) {
        logger.error('Token refresh failed:', error);
      }
    }

    refreshInterval = setInterval(tryRefreshToken, REFRESH_INTERVAL);
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(true);

  // Safe dispatch that checks if component is still mounted
  const safeDispatch = useCallback((action: AuthAction) => {
    if (mountedRef.current) {
      dispatch(action);
    }
  }, []);

  // Handle session expiration
  const handleSessionExpired = useCallback(() => {
    logger.info('Session expired, logging out user');
    safeDispatch({ type: 'LOGOUT' });

    // Redirect to auth page if not already there
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
      window.location.href = '/auth?expired=true';
    }
  }, [safeDispatch]);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    if (isInitializingRef.current) return;

    isInitializingRef.current = true;

    try {
      // Initialize session manager with expiration callback
      sessionManager.init(handleSessionExpired);

      // Check if user has valid session
      if (!sessionManager.isAuthenticated()) {
        logger.info('No valid session found');
        safeDispatch({ type: 'SET_INITIALIZED', payload: true });
        return;
      }

      const token = sessionManager.getToken();
      const cachedUser = sessionManager.getUser();

      if (!token) {
        logger.info('No token found');
        safeDispatch({ type: 'SET_INITIALIZED', payload: true });
        return;
      }

      // Use cached user data if available for immediate UI update
      if (cachedUser) {
        logger.info('Loading cached user data');
        safeDispatch({ type: 'SET_USER', payload: cachedUser });

        // Verify user data in background
        try {
          const freshUser = await authAPI.getCurrentUser();

          // Update if user data has changed
          if (JSON.stringify(freshUser) !== JSON.stringify(cachedUser)) {
            logger.info('Updating user data from server');
            sessionManager.setSession(token, freshUser);
            safeDispatch({ type: 'SET_USER', payload: freshUser });
          }
        } catch (error) {
          logger.warn('Failed to refresh user data in background:', error);
        }
      } else {
        // No cached user, fetch from server
        logger.info('Fetching user data from server');
        const user = await authAPI.getCurrentUser();
        sessionManager.setSession(token, user);
        safeDispatch({ type: 'SET_USER', payload: user });
      }

      logger.info('Authentication initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize authentication:', error);
      sessionManager.clearSession();
      safeDispatch({ type: 'SET_INITIALIZED', payload: true });
    } finally {
      isInitializingRef.current = false;
    }
  }, [handleSessionExpired, safeDispatch]);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();

    return () => {
      mountedRef.current = false;
      sessionManager.destroy();
    };
  }, [initializeAuth]);

  // Authentication functions
  const login = useCallback(async (email: string, password: string) => {
    safeDispatch({ type: 'SET_LOADING', payload: true });
    safeDispatch({ type: 'CLEAR_ERROR' });

    let response;
    try {
      response = await authAPI.login({ email, password });
    } catch (error: any) {
      // If API throws, treat as error response
      safeDispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed: Invalid credentials' });
      safeDispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    // If backend returns success: false or missing tokens, treat as error
    if (!response.success || !response.access || !response.refresh) {
      safeDispatch({ type: 'SET_ERROR', payload: response.message || 'Login failed: Invalid credentials' });
      safeDispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    let user = response.user;
    if (!user) {
      user = await authAPI.getCurrentUser();
    }

    sessionManager.setSession(response.access, user);
    safeDispatch({ type: 'SET_USER', payload: user });
    safeDispatch({ type: 'SET_LOADING', payload: false });

    // Redirect to dashboard if not coming from an authenticated route
    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  }, [safeDispatch]);

  const register = useCallback(async (data: { email: string; password: string; password_confirm: string }) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.register(data);
      if (response && response.access && response.refresh) {
        localStorage.setItem('auth_token', response.access);
        localStorage.setItem('refresh', response.refresh);
        if (response.user) {
          sessionManager.setSession(response.access, response.user);
        }
        logger.info('User registered successfully and tokens saved');
      } else {
        logger.error('Registration did not return tokens:', response);
        throw new Error('Registration failed: No tokens returned');
      }
      safeDispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Registration failed';
      logger.error('Registration failed:', errorMessage);
      safeDispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [safeDispatch]);

  const logout = useCallback(async () => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });

      // Log token before logout
      const token = localStorage.getItem('auth_token');
      logger.info('Logout: access token in localStorage:', token);
      if (!token) {
        logger.error('Logout: No access token found in localStorage.');
      }

      try {
        const response = await authAPI.logout();
        logger.info('Server logout successful:', response);
      } catch (error: any) {
        logger.error('Server logout failed:', error);
        if (error?.status) {
          logger.error('Logout error status:', error.status);
        }
        if (error?.message) {
          logger.error('Logout error message:', error.message);
        }
        if (error?.errors) {
          logger.error('Logout error details:', error.errors);
        }
      }

      sessionManager.clearSession();
      safeDispatch({ type: 'LOGOUT' });
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error (outer catch):', error);
      sessionManager.clearSession();
      safeDispatch({ type: 'LOGOUT' });
    }
  }, [safeDispatch]);

  const verifyEmail = useCallback(async ({ email, code }: { email: string; code: string }) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      // Use temporary registration token for verification
      // @ts-ignore
      const regSession = sessionManager.getTemporaryRegistrationSession();
      if (!regSession) {
        throw new Error('Verification session expired. Please register again.');
      }
      // Temporarily set regSession.access in localStorage for getAuthHeaders
      const prevToken = localStorage.getItem('auth_token');
      localStorage.setItem('auth_token', regSession.access);
      let response;
      try {
        response = await authAPI.verifyEmail({ email, code });
      } finally {
        // Restore previous token (if any)
        if (prevToken) {
          localStorage.setItem('auth_token', prevToken);
        } else {
          localStorage.removeItem('auth_token');
        }
      }

      // On success, start full session
      if (response && response.access && response.refresh && response.user) {
        // @ts-ignore
        sessionManager.setSession(response.access, response.user);
        // @ts-ignore
        sessionManager.clearTemporaryRegistrationSession();
        safeDispatch({ type: 'SET_USER', payload: response.user });
        safeDispatch({ type: 'SET_LOADING', payload: false });
        logger.info('Email verified and session started');
      } else if (response && (response as any).resend_prompt) {
        safeDispatch({ type: 'SET_ERROR', payload: 'Invalid or expired code. Please resend verification email.' });
        logger.warn('Verification code invalid or expired');
      } else {
        safeDispatch({ type: 'SET_ERROR', payload: response.message || 'Email verification failed' });
        logger.error('Email verification failed:', response);
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Email verification failed';

      logger.error('Email verification failed:', errorMessage);
      safeDispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [safeDispatch]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      await authAPI.resetPassword({ email });
      safeDispatch({ type: 'SET_LOADING', payload: false });

      logger.info('Password reset email sent successfully');
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Password reset failed';

      logger.error('Password reset failed:', errorMessage);
      safeDispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [safeDispatch]);

  // Google sign-in: expects id_token (JWT) from Google Identity Services
  const googleAuth = useCallback(async (idToken: string) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.googleAuth({ id_token: idToken });

      if (!response.access) {
        throw new Error('No authentication token received from Google');
      }

      let user = response.user;
      if (!user) {
        user = await authAPI.getCurrentUser();
      }

      sessionManager.setSession(response.access, user);
      safeDispatch({ type: 'SET_USER', payload: user });

      logger.info('Google authentication successful');
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Google authentication failed';

      logger.error('Google authentication failed:', errorMessage);
      safeDispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [safeDispatch]);

  const clearError = useCallback(() => {
    safeDispatch({ type: 'CLEAR_ERROR' });
  }, [safeDispatch]);

  const refreshSession = useCallback(() => {
    sessionManager.refreshSession();
    logger.debug('Session activity refreshed');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) {
      logger.warn('Cannot refresh user: not authenticated');
      return;
    }

    try {
      const user = await authAPI.getCurrentUser();
      const token = sessionManager.getToken();

      if (token) {
        sessionManager.setSession(token, user);
        safeDispatch({ type: 'SET_USER', payload: user });
        logger.info('User data refreshed successfully');
      }
    } catch (error) {
      logger.error('Failed to refresh user data:', error);
    }
  }, [state.isAuthenticated, safeDispatch]);

  // ✅ CORRECT: Create context value using AuthContextType
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    verifyEmail,
    resetPassword,
    googleAuth,
    clearError,
    refreshSession,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ========================================
// HOOK TO USE THE CONTEXT
// ========================================

// ✅ CORRECT: Use the context VALUE, return the TYPE
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext); // Using the VALUE
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Returns AuthContextType
}

// Additional helper hooks
export function useSessionInfo() {
  return sessionManager.getSessionInfo();
}

export function useAuthStatus() {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    isReady: isInitialized && !isLoading,
    hasUser: !!user,
  };
}