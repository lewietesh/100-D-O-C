'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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

  const ServiceItem = ({ service, index }: { service: ApiService; index: number }) => (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      key={service.id}
    >
      <button
        onClick={() => onServiceSelect(service)}
        className={`w-full text-left group relative overflow-hidden rounded-lg transition-all duration-200 ${
          selectedServiceId === service.id
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h5 className={`font-medium text-sm truncate transition-colors ${
              selectedServiceId === service.id 
                ? 'text-white dark:text-neutral-900' 
                : 'text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
            }`}>
              {service.name}
            </h5>
            
            {/* Optional: Show featured indicator */}
            {service.featured && (
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                selectedServiceId === service.id
                  ? 'bg-white/20 text-white dark:bg-neutral-800/30 dark:text-neutral-900'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}>
                Featured
              </span>
            )}
          </div>
          
          {/* Arrow Indicator */}
          <ChevronRight 
            className={`w-4 h-4 transition-all duration-200 ${
              selectedServiceId === service.id 
                ? 'text-white dark:text-neutral-900 transform rotate-90'
                : 'text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:translate-x-0.5'
            }`}
          />
        </div>
        
        {/* Active indicator line */}
        {selectedServiceId === service.id && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white dark:bg-neutral-900"></div>
        )}
      </button>
    </motion.li>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Services</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {services.length} available
        </p>
      </div>
      
      {/* Services List */}
      <div className="overflow-y-auto max-h-[60vh]">
        <div className="p-4 space-y-6">
          {/* Featured Services Section */}
          {Object.keys(featuredByCategory).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <div className="w-2 h-2 bg-neutral-900 dark:bg-white rounded-full"></div>
                <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Featured
                </h4>
              </div>
              
              {Object.entries(featuredByCategory).map(([category, categoryServices]) => (
                <div key={`featured-${category}`} className="space-y-2">
                  {category !== 'Featured' && (
                    <div className="px-2">
                      <h5 className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wide font-medium">
                        {category}
                      </h5>
                    </div>
                  )}
                  <ul className="space-y-1">
                    {categoryServices.map((service, index) => (
                      <ServiceItem key={service.id} service={service} index={index} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Regular Services Section */}
          {Object.keys(regularByCategory).length > 0 && (
            <div className="space-y-3">
              {Object.keys(featuredByCategory).length > 0 && (
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"></div>
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    All Services
                  </h4>
                </div>
              )}
              
              {Object.entries(regularByCategory).map(([category, categoryServices]) => (
                <div key={`regular-${category}`} className="space-y-2">
                  <div className="px-2">
                    <h5 className="text-xs text-neutral-500 dark:text-neutral-500 uppercase tracking-wide font-medium">
                      {category}
                    </h5>
                  </div>
                  <ul className="space-y-1">
                    {categoryServices.map((service, index) => (
                      <ServiceItem 
                        key={service.id} 
                        service={service} 
                        index={index + featuredServices.length} 
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* No services fallback */}
          {services.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-neutral-400 dark:text-neutral-600 text-sm">?</span>
              </div>
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">No Services</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Check back soon
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with summary */}
      <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <span>{services.length} total</span>
          <span>{featuredServices.length} featured</span>
        </div>
      </div>
    </motion.div>
  );
}

// Also export the ApiService interface for use in other components
export type { ApiService };