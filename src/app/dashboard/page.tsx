// app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/app/context/ToastContext';
import { useEffect } from 'react';

function DashboardContent() {
          const { user, logout } = useAuth();
          const { showToast } = useToast();

          useEffect(() => {
                    showToast('Welcome! You are successfully authenticated.', 'success');
          }, [showToast]);

          const handleLogout = async () => {
                    try {
                              await logout();
                    } catch (error) {
                              console.error('Logout failed:', error);
                    }
          };

          return (
                    <div className="min-h-screen bg-gray-50">
                              <nav className="bg-white shadow-sm border-b border-gray-200">
                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                  <div className="flex justify-between items-center h-16">
                                                            <div className="flex items-center">
                                                                      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                      <span className="text-sm text-gray-700 hidden sm:block">
                                                                                {user?.email}
                                                                      </span>
                                                                      <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={handleLogout}
                                                                      >
                                                                                Sign Out
                                                                      </Button>
                                                            </div>
                                                  </div>
                                        </div>
                              </nav>

                              <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                                        <div className="mb-6 sm:mb-8">
                                                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                                            Welcome back, {user?.first_name || user?.email?.split('@')[0]}!
                                                  </h2>
                                                  <p className="text-gray-600">
                                                            You are successfully authenticated and can access protected content.
                                                  </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
                                                            <p className="text-gray-600 text-sm mb-4">Manage your account settings</p>
                                                            <div className="space-y-2 text-sm">
                                                                      <p><span className="font-medium">Email:</span> {user?.email}</p>
                                                                      <p><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
                                                                      <p><span className="font-medium">Verified:</span>
                                                                                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${user?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                                          {user?.is_verified ? 'Verified' : 'Pending'}
                                                                                </span>
                                                                      </p>
                                                            </div>
                                                  </div>

                                                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
                                                            <p className="text-gray-600 text-sm mb-4">Manage your security settings</p>
                                                            <Button variant="outline" size="sm" className="w-full">
                                                                      Change Password
                                                            </Button>
                                                  </div>

                                                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity</h3>
                                                            <p className="text-gray-600 text-sm mb-4">View your recent activity</p>
                                                            <p className="text-xs text-gray-500">Last login: Just now</p>
                                                  </div>
                                        </div>
                              </main>
                    </div>
          );
}

export default function DashboardPage() {
          return (
                    <ProtectedRoute>
                              <DashboardContent />
                    </ProtectedRoute>
          );
}
