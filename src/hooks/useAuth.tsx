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
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (key: string) => Promise<void>;
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
// CONTEXT CREATION - This creates a VALUE, not a TYPE
// ========================================

// ✅ CORRECT: AuthContext is a VALUE (React context instance)
const AuthContext = createContext<AuthContextType | undefined>(undefined);



// ✅ CORRECT: Use AuthContextType as the type
// function someFunction(): AuthContextType { }

// ========================================
// PROVIDER COMPONENT
// ========================================

export function AuthProvider({ children }: { children: ReactNode }) {
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
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.login({ email, password });

      if (!response.access) {
        throw new Error('No authentication token received');
      }

      let user = response.user;
      if (!user) {
        user = await authAPI.getCurrentUser();
      }

      sessionManager.setSession(response.access, user);
      safeDispatch({ type: 'SET_USER', payload: user });

      logger.info('User logged in successfully');
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Login failed';

      logger.error('Login failed:', errorMessage);
      safeDispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [safeDispatch]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      await authAPI.register({ email, password });
      safeDispatch({ type: 'SET_LOADING', payload: false });

      logger.info('User registered successfully');
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

      sessionManager.clearSession();

      try {
        await authAPI.logout();
        logger.info('Server logout successful');
      } catch (error) {
        logger.warn('Server logout failed, continuing with local logout:', error);
      }

      safeDispatch({ type: 'LOGOUT' });
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
      sessionManager.clearSession();
      safeDispatch({ type: 'LOGOUT' });
    }
  }, [safeDispatch]);

  const verifyEmail = useCallback(async (key: string) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      await authAPI.verifyEmail({ key });
      safeDispatch({ type: 'SET_LOADING', payload: false });

      logger.info('Email verified successfully');
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

  const googleAuth = useCallback(async (accessToken: string) => {
    try {
      safeDispatch({ type: 'SET_LOADING', payload: true });
      safeDispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.googleAuth({ access_token: accessToken });

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