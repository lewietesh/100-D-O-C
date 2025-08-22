'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  CodeBracketIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import PageLayout from '@/components/services/PageLayout';

// API Service interface that matches your API response exactly
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

interface ServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiService[];
}

// Get API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function ServicesPage() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/services/services/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
        }
        
        const data: ServiceResponse = await response.json();
        setServices(data.results);
        
        // Set default service if none selected yet
        if (data.results.length > 0 && !selectedService) {
          // Prioritize featured services for default selection
          const featuredService = data.results.find(service => service.featured);
          setSelectedService(featuredService || data.results[0]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle URL parameter for service selection
  useEffect(() => {
    if (services.length > 0 && slug) {
      const service = services.find(s => s.slug === slug);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [slug, services]);

  // Get service statistics
  const serviceStats = {
    total: services.length,
    featured: services.filter(s => s.featured).length,
    categories: [...new Set(services.map(s => s.category))].length,
    webDev: services.filter(s => s.category.toLowerCase().includes('web')).length
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 blur-3xl"></div>
        </div>
        
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
              <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Services</h2>
            <p className="text-gray-600 dark:text-gray-400">Fetching our professional services...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-red-200 dark:border-red-800"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Service Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // No services found
  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cog6ToothIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Services Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We're preparing amazing services for you. Check back soon!</p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
            >
              <span>Contact Us</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <CodeBracketIcon className="w-4 h-4" />
            Professional Services
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Transform Your Ideas Into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Digital Reality</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            From custom web applications to comprehensive digital solutions, I provide expert services 
            tailored to your unique business needs and technical requirements.
          </motion.p>

          {/* Service Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {serviceStats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {serviceStats.featured}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {serviceStats.categories}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </motion.div>
        </div>

        {/* Services Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PageLayout 
            allServices={services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and create a solution that perfectly fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <span>Get Started Today</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200"
              >
                <span>View My Work</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}