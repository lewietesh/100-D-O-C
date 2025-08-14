// src/components/dashboard/DashboardLayout.tsx
import React from 'react';

interface DashboardLayoutProps {
          sidebar: React.ReactNode;
          children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, children }) => {
          return (
                    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
                              {/* Sidebar */}
                              {sidebar}
                              {/* Main content */}
                              <div className="flex-1 flex flex-col min-w-0">
                                        {children}
                              </div>
                    </div>
          );
};

export default DashboardLayout;
