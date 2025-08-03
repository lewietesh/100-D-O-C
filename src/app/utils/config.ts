// src/app/utils/config.ts

/**
 * Get the API base URL based on the current environment
 * @returns The API base URL
 */
export const getApiBaseUrl = (): string => {
          if (typeof window === 'undefined') {
                    // Server-side rendering
                    return process.env.NODE_ENV === 'production'
                              ? 'https://your-production-api.com'
                              : 'http://localhost:8000';
          }

          // Client-side
          return process.env.NODE_ENV === 'production'
                    ? 'https://your-production-api.com'
                    : 'http://localhost:8000';
};

/**
 * API configuration constants
 */
export const API_CONFIG = {
          baseUrl: getApiBaseUrl(),
          timeout: 10000,
          endpoints: {
                    projects: '/api/v1/projects/',
                    business: '/api/v1/business/',
                    newsletter: '/api/v1/business/newsletter/',
                    comments: '/api/v1/projects/comments/',
          },
} as const;
