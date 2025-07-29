// app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/services/PageLayout';
import { useSearchParams } from 'next/navigation';

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

const heroData = {
  title: 'Professional Services',
  subtitle: 'Expert solutions tailored to your academic and digital needs',
};

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
        
        const response = await fetch('http://127.0.0.1:8000/api/v1/services/services/');
        
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No services found
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Services Available</h2>
          <p className="text-gray-600">Check back later for available services.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{heroData.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{heroData.subtitle}</p>
        </div>

        {/* Services Layout */}
        <PageLayout 
          allServices={services}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
        />
      </div>
    </main>
  );
}