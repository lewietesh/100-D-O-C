// src/components/services/PageLayout.tsx
'use client';

import ServicesListCard, { ApiService } from './ServicesListCard';
import ServiceDetail from './ServiceDetail';

interface PageLayoutProps {
  allServices: ApiService[];
  selectedService: ApiService | null;
  onServiceSelect: (service: ApiService) => void;
}

export default function PageLayout({
  allServices,
  selectedService,
  onServiceSelect
}: PageLayoutProps) {
  if (!selectedService) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <p className="text-gray-500">Select a service to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Services List - Left Sidebar */}
      <div className="lg:col-span-1">
        <ServicesListCard
          services={allServices}
          selectedServiceId={selectedService.id}
          onServiceSelect={onServiceSelect}
        />
      </div>
      
      {/* Service Details - Main Content */}
      <div className="lg:col-span-2">
        <ServiceDetail service={selectedService} />
      </div>
    </div>
  );
}