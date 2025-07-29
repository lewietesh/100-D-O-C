// src/components/services/ServicesListCard.tsx
'use client';

import { Star, ArrowRight } from 'lucide-react';

// API Service interface that matches your API response
interface ApiService {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  pricing_model: string;
  starting_at: string;
  currency: string;
  timeline: string;
  featured: boolean;
  min_price: number;
  pricing_tiers_count: number;
}

interface ServicesListCardProps {
  services: ApiService[];
  selectedServiceId: string;
  onServiceSelect: (service: ApiService) => void;
}

export default function ServicesListCard({
  services,
  selectedServiceId,
  onServiceSelect
}: ServicesListCardProps) {
  // Filter for featured services first, then group by category
  const featuredServices = services.filter(service => service.featured);
  const regularServices = services.filter(service => !service.featured);
  
  // Group services by category
  const groupServicesByCategory = (serviceList: ApiService[]) => {
    return serviceList.reduce((acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, ApiService[]>);
  };

  const featuredByCategory = groupServicesByCategory(featuredServices);
  const regularByCategory = groupServicesByCategory(regularServices);

  // Format price display
  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    if (numPrice === 0) return 'Free';
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  const ServiceItem = ({ service }: { service: ApiService }) => (
    <li
      key={service.id}
      className={`group relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 ${
        selectedServiceId === service.id
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md transform scale-[1.02]'
          : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md hover:bg-gray-50'
      }`}
      onClick={() => onServiceSelect(service)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h5 className={`font-medium text-sm truncate ${
              selectedServiceId === service.id ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {service.name}
            </h5>
            
            {service.subcategory && (
              <p className="text-xs text-gray-500 mt-1">{service.subcategory}</p>
            )}
            
            <div className="flex items-center mt-2 space-x-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                selectedServiceId === service.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {formatPrice(service.starting_at, service.currency)}
              </span>
              
              {service.featured && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <div className={`ml-3 transition-transform duration-300 ${
            selectedServiceId === service.id ? 'transform rotate-90' : 'group-hover:transform group-hover:translate-x-1'
          }`}>
            <ArrowRight className={`w-5 h-5 ${
              selectedServiceId === service.id ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </div>
      
      {/* Active indicator */}
      {selectedServiceId === service.id && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
      )}
    </li>
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Star className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Our Services</h3>
      </div>
      
      <div className="space-y-6">
        {/* Featured Services Section */}
        {Object.keys(featuredByCategory).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <h4 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Featured Services</h4>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent ml-3"></div>
            </div>
            
            {Object.entries(featuredByCategory).map(([category, categoryServices]) => (
              <div key={`featured-${category}`} className="space-y-3">
                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide pl-2">{category}</h5>
                <ul className="space-y-2">
                  {categoryServices.map((service) => (
                    <ServiceItem key={service.id} service={service} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Regular Services Section */}
        {Object.keys(regularByCategory).length > 0 && (
          <div className="space-y-4">
            {Object.keys(featuredByCategory).length > 0 && (
              <div className="flex items-center">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">All Services</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-3"></div>
              </div>
            )}
            
            {Object.entries(regularByCategory).map(([category, categoryServices]) => (
              <div key={`regular-${category}`} className="space-y-3">
                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide pl-2">{category}</h5>
                <ul className="space-y-2">
                  {categoryServices.map((service) => (
                    <ServiceItem key={service.id} service={service} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* No services fallback */}
        {services.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No services available at the moment.</p>
          </div>
        )}
      </div>
      
      {/* Services count */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{services.length} service{services.length !== 1 ? 's' : ''} available</span>
          {featuredServices.length > 0 && (
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              {featuredServices.length} featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Also export the ApiService interface for use in other components
export type { ApiService };