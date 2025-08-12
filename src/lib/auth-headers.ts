// lib/auth-headers.ts

export function getAuthHeaders(): Record<string, string> {
          if (typeof window === 'undefined') return {};
          const token = localStorage.getItem('auth_token');
          return token
                    ? {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json',
                    }
                    : {
                              'Content-Type': 'application/json',
                    };
}
