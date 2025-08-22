'use client';

import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ArrowRightIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

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

  // Get pricing model icon
  const getPricingIcon = (model: string) => {
    switch (model) {
      case 'hourly': return <ClockIcon className="w-3 h-3" />;
      case 'fixed': return <CurrencyDollarIcon className="w-3 h-3" />;
      case 'custom': return <SparklesIcon className="w-3 h-3" />;
      default: return <CurrencyDollarIcon className="w-3 h-3" />;
    }
  };

  const ServiceItem = ({ service, index }: { service: ApiService; index: number }) => (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      key={service.id}
      className={`group relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-lg ${
        selectedServiceId === service.id
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-300 dark:border-blue-600 shadow-md transform scale-[1.02] ring-2 ring-blue-200 dark:ring-blue-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
      onClick={() => onServiceSelect(service)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Service Name */}
            <h5 className={`font-semibold text-base truncate mb-2 ${
              selectedServiceId === service.id 
                ? 'text-blue-700 dark:text-blue-300' 
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
            } transition-colors`}>
              {service.name}
            </h5>
            
            {/* Category and Subcategory */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                selectedServiceId === service.id 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <CodeBracketIcon className="w-3 h-3" />
                {service.category}
              </span>
              {service.subcategory && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                  {service.subcategory}
                </span>
              )}
            </div>

            {/* Description Preview */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {service.description.length > 80 
                ? `${service.description.substring(0, 80)}...` 
                : service.description}
            </p>
            
            {/* Pricing and Features */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${
                  selectedServiceId === service.id 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {getPricingIcon(service.pricing_model)}
                  {formatPrice(service.starting_at, service.currency)}
                  {service.pricing_model === 'hourly' && <span className="text-xs opacity-75">/hr</span>}
                </span>
                
                {service.featured && (
                  <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-bold shadow-sm">
                    <StarIcon className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Pricing Tiers Indicator */}
              {service.pricing_tiers_count > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {service.pricing_tiers_count} option{service.pricing_tiers_count !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Timeline */}
            {service.timeline && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <ClockIcon className="w-3 h-3" />
                <span>{service.timeline}</span>
              </div>
            )}
          </div>
          
          {/* Arrow Indicator */}
          <div className={`ml-4 transition-all duration-300 ${
            selectedServiceId === service.id 
              ? 'transform rotate-90 text-blue-500 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:transform group-hover:translate-x-1'
          }`}>
            <ArrowRightIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      {/* Active indicator */}
      {selectedServiceId === service.id && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r"></div>
      )}

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        selectedServiceId === service.id ? 'opacity-100' : ''
      }`}></div>
    </motion.li>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 sticky top-6"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <CodeBracketIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Services</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose what fits your needs</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Featured Services Section */}
        {Object.keys(featuredByCategory).length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
                  Featured Services
                </h4>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent ml-3"></div>
            </div>
            
            {Object.entries(featuredByCategory).map(([category, categoryServices]) => (
              <div key={`featured-${category}`} className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {category}
                  </h5>
                </div>
                <ul className="space-y-3">
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
          <div className="space-y-6">
            {Object.keys(featuredByCategory).length > 0 && (
              <div className="flex items-center">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  All Services
                </h4>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent ml-3"></div>
              </div>
            )}
            
            {Object.entries(regularByCategory).map(([category, categoryServices]) => (
              <div key={`regular-${category}`} className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {category}
                  </h5>
                </div>
                <ul className="space-y-3">
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
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CodeBracketIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Services Available</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Services are being prepared. Check back soon!
            </p>
          </div>
        )}
      </div>
      
      {/* Services Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {services.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Services
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {featuredServices.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Featured
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {[...new Set(services.map(s => s.category))].length} categories • 
            {services.filter(s => s.pricing_model === 'fixed').length} fixed price • 
            {services.filter(s => s.pricing_model === 'hourly').length} hourly rate
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <a
            href="/contact"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group text-sm"
          >
            <span>Need Custom Solution?</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Also export the ApiService interface for use in other components
export type { ApiService };