// lib/session-manager.ts
import { logger } from './logger';
import type { User } from '../types/auth';

interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
  lastActivity: number;
}

interface SessionConfig {
  tokenKey: string;
  userKey: string;
  sessionDataKey: string;
  sessionTimeout: number; // in milliseconds
  activityCheckInterval: number; // in milliseconds
  setTemporaryRegistrationSession?: (access: string, refresh: string, email: string) => void;
  getTemporaryRegistrationSession?: () => { access: string; refresh: string; email: string } | null;
  clearTemporaryRegistrationSession?: () => void;
}

interface SessionInfo {
  isValid: boolean;
  timeUntilExpiry: number;
  timeUntilTimeout: number;
  lastActivity: string;
  expiresAt: string | null;
}

class SessionManager {
  private config: SessionConfig;
  private activityTimer: NodeJS.Timeout | null = null;
  private onSessionExpired: (() => void) | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      setTemporaryRegistrationSession(access: string, refresh: string, email: string) {
        localStorage.setItem('reg_access_token', access);
        localStorage.setItem('reg_refresh_token', refresh);
        localStorage.setItem('reg_email', email);
        localStorage.setItem('reg_expires', String(Date.now() + 1000 * 60 * 5)); // 5 min expiry
      },
      getTemporaryRegistrationSession() {
        const access = localStorage.getItem('reg_access_token');
        const refresh = localStorage.getItem('reg_refresh_token');
        const email = localStorage.getItem('reg_email');
        const expires = Number(localStorage.getItem('reg_expires'));
        if (!access || !refresh || !email || Date.now() > expires) {
          return null;
        }
        return { access, refresh, email };
      },
      clearTemporaryRegistrationSession() {
        localStorage.removeItem('reg_access_token');
        localStorage.removeItem('reg_refresh_token');
        localStorage.removeItem('reg_email');
        localStorage.removeItem('reg_expires');
      },
      tokenKey: 'auth_token',
      userKey: 'auth_user',
      sessionDataKey: 'session_data',
      sessionTimeout: 15 * 60 * 1000, // 15 minutes
      activityCheckInterval: 60 * 1000, // 1 minute
    };
  }

  // Initialize session monitoring
  init(onSessionExpired?: () => void): void {
    if (typeof window === 'undefined') return;

    if (this.isInitialized) {
      logger.warn('Session manager already initialized');
      return;
    }

    this.onSessionExpired = onSessionExpired || (() => {
      logger.info('Session expired, redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    });

    this.setupActivityTracking();
    this.startSessionMonitoring();
    this.isInitialized = true;

    logger.info('Session manager initialized');
  }

  // Setup activity event listeners
  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const updateActivity = () => {
      this.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    logger.debug('Activity tracking setup complete');
  }

  // Start monitoring session expiration
  private startSessionMonitoring(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
    }

    this.activityTimer = setInterval(() => {
      this.checkSessionValidity();
    }, this.config.activityCheckInterval);

    logger.debug('Session monitoring started');
  }

  // Check if session is still valid
  private checkSessionValidity(): void {
    const sessionData = this.getSessionData();

    if (!sessionData) {
      return; // No session to check
    }

    const now = Date.now();
    const timeSinceLastActivity = now - sessionData.lastActivity;

    // Check if session has expired due to inactivity
    if (timeSinceLastActivity > this.config.sessionTimeout) {
      logger.warn('Session expired due to inactivity');
      this.handleSessionExpiration();
      return;
    }

    // Check if token has expired
    if (sessionData.expiresAt && now > sessionData.expiresAt) {
      logger.warn('Session expired due to token expiration');
      this.handleSessionExpiration();
      return;
    }
  }

  // Handle session expiration
  private handleSessionExpiration(): void {
    this.clearSession();

    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }

  // Store session data (persists full user including currency/language)
  setSession(token: string, user: User, expiresIn?: number): void {
    if (typeof window === 'undefined') {
      logger.warn('Cannot set session: window is undefined');
      return;
    }

    const now = Date.now();
    const sessionData: SessionData = {
      token,
      user,
      expiresAt: expiresIn ? now + (expiresIn * 1000) : 0, // Convert seconds to milliseconds
      lastActivity: now,
    };

    try {
      // Store token in localStorage for persistence across tabs
      localStorage.setItem(this.config.tokenKey, token);

      // Store user data in sessionStorage for security
      sessionStorage.setItem(this.config.userKey, JSON.stringify(user));

      // Store session metadata in sessionStorage
      sessionStorage.setItem(this.config.sessionDataKey, JSON.stringify(sessionData));

      logger.info('Session stored successfully');
    } catch (error) {
      logger.error('Failed to store session:', error);
      throw new Error('Failed to store session data');
    }
  }

  // Get current token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(this.config.tokenKey);
    } catch (error) {
      logger.error('Failed to get token:', error);
      return null;
    }
  }

  // Get current user
  getUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = sessionStorage.getItem(this.config.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      logger.error('Failed to get user data:', error);
      return null;
    }
  }

  // Get session data
  private getSessionData(): SessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionData = sessionStorage.getItem(this.config.sessionDataKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      logger.error('Failed to get session data:', error);
      return null;
    }
  }

  // Update last activity timestamp
  updateLastActivity(): void {
    if (typeof window === 'undefined') return;

    const sessionData = this.getSessionData();
    if (!sessionData) return;

    sessionData.lastActivity = Date.now();

    try {
      sessionStorage.setItem(this.config.sessionDataKey, JSON.stringify(sessionData));
    } catch (error) {
      logger.error('Failed to update last activity:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const sessionData = this.getSessionData();

    if (!token || !user || !sessionData) {
      return false;
    }

    const now = Date.now();

    // Check token expiration
    if (sessionData.expiresAt && now > sessionData.expiresAt) {
      this.clearSession();
      return false;
    }

    // Check activity timeout
    const timeSinceLastActivity = now - sessionData.lastActivity;
    if (timeSinceLastActivity > this.config.sessionTimeout) {
      this.clearSession();
      return false;
    }

    return true;
  }

  // Clear all session data
  clearSession(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear localStorage
      localStorage.removeItem(this.config.tokenKey);

      // Clear sessionStorage
      sessionStorage.removeItem(this.config.userKey);
      sessionStorage.removeItem(this.config.sessionDataKey);

      // Clear any cached data
      this.clearCache();

      logger.info('Session cleared successfully');
    } catch (error) {
      logger.error('Failed to clear session:', error);
    }
  }

  // Legacy method for backward compatibility
  clearToken(): void {
    this.clearSession();
  }

  // Clear application cache
  private clearCache(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear any application-specific cache keys
      const cacheKeys = [
        'user_preferences',
        'app_cache',
        'temp_data',
      ];

      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      logger.debug('Application cache cleared');
    } catch (error) {
      logger.error('Failed to clear cache:', error);
    }
  }

  // Get session info for debugging
  getSessionInfo(): SessionInfo | null {
    if (typeof window === 'undefined') return null;

    const sessionData = this.getSessionData();
    if (!sessionData) return null;

    const now = Date.now();
    const timeUntilExpiry = sessionData.expiresAt ? sessionData.expiresAt - now : 0;
    const timeSinceActivity = now - sessionData.lastActivity;
    const timeUntilTimeout = this.config.sessionTimeout - timeSinceActivity;

    return {
      isValid: this.isAuthenticated(),
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
      timeUntilTimeout: Math.max(0, timeUntilTimeout),
      lastActivity: new Date(sessionData.lastActivity).toISOString(),
      expiresAt: sessionData.expiresAt ? new Date(sessionData.expiresAt).toISOString() : null,
    };
  }

  // Extend session (refresh activity)
  refreshSession(): void {
    this.updateLastActivity();
    logger.debug('Session refreshed');
  }

  // Get session timeout configuration
  getSessionTimeout(): number {
    return this.config.sessionTimeout;
  }

  // Clean up when component unmounts
  destroy(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    this.isInitialized = false;
    logger.info('Session manager destroyed');
  }
}


// Export singleton instance
export const sessionManager = new SessionManager();