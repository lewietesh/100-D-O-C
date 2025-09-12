// src/app/dashboard/page.tsx - Enhanced Version with Error Boundaries
'use client';

import React, { useState, Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { User, CreditCard, ShoppingBag, Shield, HelpCircle, LogOut, Menu, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Lazy load components for better performance
const ProfileView = React.lazy(() => import('@/components/dashboard/ProfileView').then(module => ({ default: module.ProfileView })));
const OrdersList = React.lazy(() => import('@/components/dashboard/OrderList').then(module => ({ default: module.OrdersList })));
const PaymentsDashboard = React.lazy(() => import('@/components/dashboard/PaymentsDashboard').then(module => ({ default: module.PaymentsDashboard })));
const SecurityTab = React.lazy(() => import('@/components/dashboard/SecurityTab').then(module => ({ default: module.SecurityTab })));
const SupportTab = React.lazy(() => import('@/components/dashboard/SupportTab').then(module => ({ default: module.SupportTab })));

type TabId = 'profile' | 'orders' | 'payments' | 'security' | 'support';

interface TabConfig {
          id: TabId;
          label: string;
          icon: React.ComponentType<{ className?: string }>;
          component: React.ComponentType;
          badge?: number;
}

// Error Boundary Component
class TabErrorBoundary extends React.Component<
          { children: React.ReactNode; tabName: string; onRetry: () => void },
          { hasError: boolean; error: Error | null }
> {
          constructor(props: any) {
                    super(props);
                    this.state = { hasError: false, error: null };
          }

          static getDerivedStateFromError(error: Error) {
                    return { hasError: true, error };
          }

          componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
                    console.error(`Error in ${this.props.tabName} tab:`, error, errorInfo);
          }

          render() {
                    if (this.state.hasError) {
                              return (
                                        <div className="flex flex-col items-center justify-center py-12">
                                                  <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            Something went wrong in {this.props.tabName}
                                                  </h3>
                                                  <p className="text-gray-600 mb-6 text-center max-w-md">
                                                            We're sorry, but there was an error loading this section. Please try refreshing.
                                                  </p>
                                                  <button
                                                            onClick={() => {
                                                                      this.setState({ hasError: false, error: null });
                                                                      this.props.onRetry();
                                                            }}
                                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                  >
                                                            <RefreshCw className="w-4 h-4 mr-2" />
                                                            Try Again
                                                  </button>
                                        </div>
                              );
                    }

                    return this.props.children;
          }
}

// Loading fallback component
const TabLoadingFallback: React.FC<{ tabName: string }> = ({ tabName }) => (
          <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                              <p className="text-gray-600">Loading {tabName}...</p>
                    </div>
          </div>
);

export default function DashboardPage() {
          const [activeTab, setActiveTab] = useState<TabId>('profile');
          const [sidebarOpen, setSidebarOpen] = useState(false);
          const [tabKey, setTabKey] = useState(0); // For forcing re-render on error retry
          const { user, logout, isLoading, isAuthenticated } = useAuth();

          const tabs: TabConfig[] = [
                    {
                              id: 'profile',
                              label: 'Profile',
                              icon: User,
                              component: ProfileView,
                    },
                    {
                              id: 'orders',
                              label: 'Orders',
                              icon: ShoppingBag,
                              component: OrdersList,
                    },
                    {
                              id: 'payments',
                              label: 'Payments',
                              icon: CreditCard,
                              component: PaymentsDashboard,
                    },
                    {
                              id: 'security',
                              label: 'Security',
                              icon: Shield,
                              component: SecurityTab,
                    },
                    {
                              id: 'support',
                              label: 'Support',
                              icon: HelpCircle,
                              component: SupportTab,
                    },
          ];

          const handleLogout = async () => {
                    try {
                              await logout();
                    } catch (error) {
                              console.error('Logout failed:', error);
                              // Force logout on client side if server logout fails
                              if (typeof window !== 'undefined') {
                                        localStorage.clear();
                                        window.location.href = '/auth';
                              }
                    }
          };

          const handleTabChange = (tabId: TabId) => {
                    setActiveTab(tabId);
                    setSidebarOpen(false);
                    setTabKey(prev => prev + 1); // Reset error boundary
          };

          const retryTab = () => {
                    setTabKey(prev => prev + 1);
          };

          // Loading state
          if (isLoading) {
                    return (
                              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                        <div className="text-center">
                                                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                                  <p className="text-gray-600 text-lg">Loading your dashboard...</p>
                                        </div>
                              </div>
                    );
          }

          // Not authenticated
          if (!isAuthenticated || !user) {
                    return (
                              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                        <div className="text-center">
                                                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                                                  <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
                                                  <button
                                                            onClick={() => window.location.href = '/auth'}
                                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                  >
                                                            Go to Login
                                                  </button>
                                        </div>
                              </div>
                    );
          }

          const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileView;

          // Sidebar node
          const sidebar = (
                    <>
                              {sidebarOpen && (
                                        <div
                                                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                                                  onClick={() => setSidebarOpen(false)}
                                        />
                              )}
                              <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                                        {/* ...sidebar code (user info, nav, logout)... */}
                                        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                                                  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                                                  <button
                                                            onClick={() => setSidebarOpen(false)}
                                                            className="lg:hidden text-gray-500 hover:text-gray-700"
                                                  >
                                                            <X className="w-6 h-6" />
                                                  </button>
                                        </div>
                                        {/* User info */}
                                        <div className="p-6 border-b border-gray-200">
                                                  <div className="flex items-center">
                                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                                                                      {user.profile_img ? (
                                                                                <img
                                                                                          src={user.profile_img}
                                                                                          alt="Profile"
                                                                                          className="w-full h-full object-cover"
                                                                                          onError={(e) => {
                                                                                                    e.currentTarget.style.display = 'none';
                                                                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                                                          }}
                                                                                />
                                                                      ) : null}
                                                                      <User className={`w-6 h-6 text-white ${user.profile_img ? 'hidden' : ''}`} />
                                                            </div>
                                                            <div className="ml-3 min-w-0 flex-1">
                                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                                                {user.first_name && user.last_name
                                                                                          ? `${user.first_name} ${user.last_name}`
                                                                                          : user.username || 'User'}
                                                                      </p>
                                                                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                                      {user.is_verified && (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                                                          ✓ Verified
                                                                                </span>
                                                                      )}
                                                            </div>
                                                  </div>
                                        </div>
                                        {/* Navigation */}
                                        <nav className="flex-1 px-6 py-4">
                                                  <ul className="space-y-2">
                                                            {tabs.map((tab) => {
                                                                      const Icon = tab.icon;
                                                                      return (
                                                                                <li key={tab.id}>
                                                                                          <button
                                                                                                    onClick={() => handleTabChange(tab.id)}
                                                                                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                                                                                              ? 'bg-blue-100 text-blue-700'
                                                                                                              : 'text-gray-700 hover:bg-gray-100'
                                                                                                              }`}
                                                                                          >
                                                                                                    <div className="flex items-center">
                                                                                                              <Icon className="w-5 h-5 mr-3" />
                                                                                                              {tab.label}
                                                                                                    </div>
                                                                                                    {tab.badge && tab.badge > 0 && (
                                                                                                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                                                                                                        {tab.badge}
                                                                                                              </span>
                                                                                                    )}
                                                                                          </button>
                                                                                </li>
                                                                      );
                                                            })}
                                                  </ul>
                                        </nav>
                                        {/* Logout button */}
                                        <div className="p-6 border-t border-gray-200">
                                                  <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                  >
                                                            <LogOut className="w-5 h-5 mr-3" />
                                                            Logout
                                                  </button>
                                        </div>
                              </div>
                    </>
          );

          // Main content node
          const mainContent = (
                    <>
                              {/* Top bar */}
                              <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                                        <div className="flex items-center justify-between h-16 px-6">
                                                  <div className="flex items-center">
                                                            <button
                                                                      onClick={() => setSidebarOpen(true)}
                                                                      className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                                                            >
                                                                      <Menu className="w-6 h-6" />
                                                            </button>
                                                            <h2 className="text-lg font-semibold text-gray-900 capitalize">
                                                                      {activeTab}
                                                            </h2>
                                                  </div>
                                                  {/* User menu for larger screens */}
                                                  <div className="hidden lg:flex items-center space-x-4">
                                                            <span className="text-sm text-gray-700">
                                                                      Welcome back, {user.first_name || user.username}!
                                                            </span>
                                                  </div>
                                        </div>
                              </div>
                              {/* Page content */}
                              <main className="flex-1 p-6">
                                        <div className="max-w-7xl mx-auto">
                                                  <TabErrorBoundary key={tabKey} tabName={activeTab} onRetry={retryTab}>
                                                            <Suspense fallback={<TabLoadingFallback tabName={activeTab} />}>
                                                                      <ActiveComponent />
                                                            </Suspense>
                                                  </TabErrorBoundary>
                                        </div>
                              </main>
                    </>
          );

          return (
                    <DashboardLayout sidebar={sidebar}>
                              {mainContent}
                    </DashboardLayout>
          );
}