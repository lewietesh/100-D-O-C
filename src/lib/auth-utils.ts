// lib/auth-utils.ts
import { sessionManager } from './session-manager';
import { logger } from './logger';
import { SESSION_CONFIG } from './constants';

export class AuthUtils {
          // Check if current route requires authentication
          static requiresAuth(pathname: string): boolean {
                    const publicRoutes = ['/auth', '/auth/verify', '/'];
                    return !publicRoutes.some(route => pathname.startsWith(route));
          }

          // Get redirect URL after login
          static getRedirectUrl(searchParams?: URLSearchParams): string {
                    const redirect = searchParams?.get('redirect');
                    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
                              return redirect;
                    }
                    return '/dashboard';
          }

          // Format authentication errors for display
          static formatAuthError(error: any): string {
                    if (typeof error === 'string') return error;

                    if (error?.errors) {
                              // Handle Django form errors
                              const firstKey = Object.keys(error.errors)[0];
                              const firstError = error.errors[firstKey];
                              return Array.isArray(firstError) ? firstError[0] : firstError;
                    }

                    return error?.message || 'An authentication error occurred';
          }

          // Validate environment variables
          static validateConfig(): boolean {
                    const required = [
                              'NEXT_PUBLIC_API_BASE_URL',
                              'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
                    ];

                    const missing = required.filter(key => !process.env[key]);

                    if (missing.length > 0) {
                              logger.error('Missing required environment variables:', missing);
                              return false;
                    }

                    return true;
          }

          // Get user display name
          static getUserDisplayName(user: any): string {
                    if (user?.first_name && user?.last_name) {
                              return `${user.first_name} ${user.last_name}`;
                    }
                    if (user?.first_name) {
                              return user.first_name;
                    }
                    if (user?.email) {
                              return user.email.split('@')[0];
                    }
                    return 'User';
          }

          // Check if session will expire soon
          static isSessionExpiringSoon(): boolean {
                    const sessionInfo = sessionManager.getSessionInfo();
                    if (!sessionInfo) return false;

                    return sessionInfo.timeUntilTimeout < SESSION_CONFIG.WARNING_TIME;
          }
}
