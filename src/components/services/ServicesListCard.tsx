// src/components/services/ServicesListCard.tsx
'use client';

import { useData } from '@/app/context/DataContext';
import { Service } from '@/app/models/services.model';

interface ServicesListCardProps {
  selectedServiceId: string;
  onServiceSelect: (service: Service) => void;
}

export default function ServicesListCard({ 
  selectedServiceId, 
  onServiceSelect 
}: ServicesListCardProps) {
  const { services } = useData();  // Use the data context hook
  
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="bg-white shadow rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
      
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">{category}</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {categoryServices.map((service) => (
              <li
                key={service.id}
                className={`flex justify-between items-center border px-3 py-2 rounded cursor-pointer transition ${
                  selectedServiceId === service.id 
                    ? 'bg-blue-50 border-blue-200 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <span className="truncate">{service.name}</span>
                <span className={`${
                  selectedServiceId === service.id ? 'text-blue-500' : 'text-yellow-500'
                }`}>→</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}