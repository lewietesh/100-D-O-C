// src/utils/getApiBaseUrl.ts
export function getApiBaseUrl() {
          if (typeof window !== 'undefined') {
                    // On client side, use window.location for production detection
                    if (process.env.NODE_ENV === 'development') {
                              return 'http://localhost:8000';
                    } else {
                              return 'https://mydomain.com';
                    }
          } else {
                    // On server side (SSR)
                    if (process.env.NODE_ENV === 'development') {
                              return 'http://localhost:8000';
                    } else {
                              return 'https://mydomain.com';
                    }
          }
}
