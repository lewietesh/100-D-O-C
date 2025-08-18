
// src/api/axiosInstance.ts - Enhanced Version with Better Error Handling
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
}

class ApiClient {

  async putFormData<T>(url: string, formData: FormData, config: AxiosRequestConfig = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {}),
      },
    });
    return response.data;
  }
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as any;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || localStorage.getItem('auth_token');
    }
    return null;
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem('refresh_token') || localStorage.getItem('refresh')
      : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh/`, {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('auth_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('refresh', refresh);
      }
    }

    return access;
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private handleAuthFailure() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/auth') &&
        !window.location.pathname.includes('/login')) {
        window.location.href = '/auth?expired=true';
      }
    }
  }

  private formatError(error: AxiosError<ApiErrorResponse>) {
    const formattedError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response?.data) {
      const { detail, message, errors, non_field_errors } = error.response.data;

      if (detail) {
        formattedError.message = detail;
      } else if (message) {
        formattedError.message = message;
      } else if (non_field_errors?.length) {
        formattedError.message = non_field_errors[0];
      } else if (errors) {
        // Handle field-specific errors
        const firstError = Object.values(errors)[0];
        if (firstError?.length) {
          formattedError.message = firstError[0];
        }
      }
    } else if (error.message) {
      formattedError.message = error.message;
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        formattedError.message = 'Request timeout. Please try again.';
      } else if (error.message === 'Network Error') {
        formattedError.message = 'Network error. Please check your connection.';
      }
    }

    return formattedError;
  }

  // Public methods
  async get<T>(url: string, config = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  async postFormData<T>(url: string, formData: FormData, config: AxiosRequestConfig = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {}),
      },
    });
    return response.data;
  }

  async patchFormData<T>(url: string, formData: FormData, config: AxiosRequestConfig = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {}),
      },
    });
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health/');
  }
}

export const apiClient = new ApiClient();
export default apiClient;