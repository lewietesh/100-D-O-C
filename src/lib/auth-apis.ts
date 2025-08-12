
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AuthAPI {
          private baseURL: string;

          constructor(baseURL: string = API_BASE_URL) {
                    this.baseURL = baseURL;
          }

          private async makeRequest<T>(
                    endpoint: string,
                    options: RequestInit = {}
          ): Promise<T> {
                    const url = `${this.baseURL}${endpoint}`;

                    const config: RequestInit = {
                              headers: {
                                        'Content-Type': 'application/json',
                                        ...options.headers,
                              },
                              ...options,
                    };

                    // Add auth token if available
                    if (typeof window !== 'undefined') {
                              const token = localStorage.getItem('auth_token');
                              if (token && !config.headers) {
                                        config.headers = {};
                              }
                              if (token) {
                                        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
                              }
                    }

                    try {
                              logger.info(`Making ${config.method || 'GET'} request to ${url}`);

                              const response = await fetch(url, config);
                              const data = await response.json();

                              if (!response.ok) {
                                        logger.error(`API Error ${response.status}:`, data);
                                        throw {
                                                  message: data.detail || data.message || 'Request failed',
                                                  status: response.status,
                                                  errors: data.errors || data,
                                        } as ApiError;
                              }

                              logger.info(`API Success ${response.status}:`, data);
                              return data;
                    } catch (error) {
                              if (error instanceof Error) {
                                        logger.error('Network Error:', error.message);
                                        throw {
                                                  message: 'Network error occurred',
                                                  status: 0,
                                        } as ApiError;
                              }
                              throw error;
                    }
          }

          async register(data: AuthRequest): Promise<AuthResponse> {
                    return this.makeRequest<AuthResponse>('/api/v1/auth/register/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async login(data: AuthRequest): Promise<AuthResponse> {
                    return this.makeRequest<AuthResponse>('/api/v1/auth/login/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async verifyEmail(data: VerificationRequest): Promise<VerificationResponse> {
                    return this.makeRequest<VerificationResponse>('/api/v1/auth/verify-email/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async resetPassword(data: PasswordResetRequest): Promise<PasswordResetResponse> {
                    return this.makeRequest<PasswordResetResponse>('/api/v1/auth/password/reset/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
                    return this.makeRequest<AuthResponse>('/api/v1/accounts/auth/social/google/', {
                              method: 'POST',
                              body: JSON.stringify(data),
                    });
          }

          async getCurrentUser(): Promise<User> {
                    return this.makeRequest<User>('/api/v1/auth/user/');
          }

          async logout(): Promise<void> {
                    return this.makeRequest<void>('/api/v1/auth/logout/', {
                              method: 'POST',
                    });
          }
}

export const authAPI = new AuthAPI();

