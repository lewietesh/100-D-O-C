// lib/auth-api.ts
import { logger } from './logger';
import type {
          AuthRequest,
          AuthResponse,
          VerificationRequest,
          VerificationResponse,
          PasswordResetRequest,
          PasswordResetResponse,
          GoogleAuthRequest,
          ApiError,
          User
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class AuthAPI {
          async resendVerification(email: string): Promise<{ message: string; development_note?: string }> {
                    return this.makeRequest<{ message: string; development_note?: string }>(
                              '/api/v1/accounts/auth/resend-verification/',
                              {
                                        method: 'POST',
                                        body: JSON.stringify({ email }),
                              }
                    );
          }
          private baseURL: string;

          constructor(baseURL: string = API_BASE_URL) {
                    this.baseURL = baseURL;
          }

          private async makeRequest<T>(
                    endpoint: string,
                    options: RequestInit = {}
          ): Promise<T> {
                    const url = `${this.baseURL}${endpoint}`;

                    // Build headers, but do NOT send Authorization for Google social login
                    let headers: Record<string, string> = {
                              'Content-Type': 'application/json',
                              ...(options.headers as Record<string, string> || {}),
                    };

                    // Only add Authorization header if NOT Google social login endpoint
                    if (
                              typeof window !== 'undefined' &&
                              !endpoint.includes('/api/v1/accounts/auth/social/google/')
                    ) {
                              const token = localStorage.getItem('auth_token');
                              if (token) {
                                        headers['Authorization'] = `Bearer ${token}`;
                              }
                    }

                    const config: RequestInit = {
                              ...options,
                              headers,
                    };

                    try {
                              logger.info(`Making ${config.method || 'GET'} request to ${url}`);

                              const response = await fetch(url, config);
                              const data = await response.json();

                              if (!response.ok) {
                                        // Only throw for server errors (500+)
                                        if (response.status >= 500) {
                                                  logger.error(`API Error ${response.status}:`, data);
                                                  throw new Error(data.detail || data.message || 'Server error');
                                        }
                                        // For registration duplicate email error, log a specific message
                                        if (endpoint.includes('/register') && data?.errors?.email && Array.isArray(data.errors.email) && data.errors.email[0].includes('already exists')) {
                                                  let email = '';
                                                  if (typeof options.body === 'string') {
                                                            try {
                                                                      email = JSON.parse(options.body).email || '';
                                                            } catch { }
                                                  }
                                                  logger.info(`Registration failed: User with email ${email} already exists.`);
                                        } else {
                                                  logger.info(`API Validation/Error ${response.status}:`, data);
                                        }
                                        return {
                                                  success: false,
                                                  message: data.detail || data.message || 'Request failed',
                                                  status: response.status,
                                                  errors: data.errors || data,
                                        } as any;
                              }

                              logger.info(`API Success ${response.status}:`, data);
                              return data;
                    } catch (error) {
                              logger.error('Network Error:', error instanceof Error ? error.message : error);
                              return {
                                        success: false,
                                        message: 'Network error occurred',
                                        status: 0,
                                        errors: error,
                              } as any;
                    }
          }

          async register(data: AuthRequest): Promise<AuthResponse> {
                    return this.makeRequest<AuthResponse>('/api/v1/accounts/auth/register/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async login(data: AuthRequest): Promise<AuthResponse> {
                    // dj-rest-auth expects only email and password
                    const payload = {
                              email: data.email,
                              password: data.password
                    };
                    const response = await this.makeRequest<AuthResponse>('/api/v1/accounts/auth/login/', {
                              method: 'POST',
                              body: JSON.stringify(payload),
                    });
                    // Always return response, never throw
                    return response;
          }

          async verifyEmail(data: VerificationRequest): Promise<VerificationResponse> {
                    // Use correct endpoint with underscore and always use getAuthHeaders
                    const { getAuthHeaders } = await import('./auth-headers');
                    return this.makeRequest<VerificationResponse>('/api/v1/accounts/auth/verify_email/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                              headers: getAuthHeaders(),
                    });
          }

          async resetPassword(data: PasswordResetRequest): Promise<PasswordResetResponse> {
                    return this.makeRequest<PasswordResetResponse>('/api/v1/auth/password/reset/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          // For sign-in, expects { id_token } from Google Identity Services
          async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
                    return this.makeRequest<AuthResponse>('/api/v1/accounts/auth/social/google/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async getCurrentUser(): Promise<User> {
                    return this.makeRequest<User>('/api/v1/accounts/users/me/');
          }

          async logout(): Promise<void> {
                    const { getAuthHeaders } = await import('./auth-headers');
                    return this.makeRequest<void>('/api/v1/accounts/auth/logout/', {
                              method: 'POST',
                              headers: getAuthHeaders(),
                    });
          }
}

export const authAPI = new AuthAPI();

