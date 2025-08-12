// components/auth/AuthGuard.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
          children: ReactNode;
          requireAuth?: boolean;
          redirectTo?: string;
          fallback?: ReactNode;
}

export function AuthGuard({
          children,
          requireAuth = true,
          redirectTo = '/auth',
          fallback
}: AuthGuardProps) {
          const { isAuthenticated, isLoading } = useAuth();
          const router = useRouter();

          useEffect(() => {
                    if (!isLoading) {
                              if (requireAuth && !isAuthenticated) {
                                        router.push(redirectTo);
                              } else if (!requireAuth && isAuthenticated) {
                                        router.push('/dashboard');
                              }
                    }
          }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

          if (isLoading) {
                    return (
                              fallback || (
                                        <div className="min-h-screen flex items-center justify-center bg-gray-50">
                                                  <div className="text-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                            <p className="text-gray-600">Loading...</p>
                                                  </div>
                                        </div>
                              )
                    );
          }

          if (requireAuth && !isAuthenticated) {
                    return null; // Will redirect
          }

          if (!requireAuth && isAuthenticated) {
                    return null; // Will redirect
          }

          return <>{children}</>;
}