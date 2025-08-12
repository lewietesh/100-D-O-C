// lib/auth-headers.ts

export function getAuthHeaders(): Record<string, string> {
          if (typeof window === 'undefined') return {};
          // Use access token for all users (including Google Auth)
          const accessToken = localStorage.getItem('auth_token');
          return accessToken
                    ? {
                              'Authorization': `Bearer ${accessToken}`,
                              'Content-Type': 'application/json',
                    }
                    : {
                              'Content-Type': 'application/json',
                    };
}
