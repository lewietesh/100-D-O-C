// app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import PageLayout from '@/components/services/PageLayout';
import { useData } from '@/app/context/DataContext';
import { useSearchParams } from 'next/navigation';

const heroData = {
  title: 'Professional Services',
  subtitle: 'Expert solutions tailored to your academic and digital needs',
};

export default function ServicesPage() {
  const { services } = useData();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [selectedService, setSelectedService] = useState(services[0]);

  useEffect(() => {
    if (services.length > 0) {
      // Set default service if none selected yet
      if (!selectedService) {
        setSelectedService(services[0]);
      }
      
      // Handle URL parameter for service selection
      if (slug) {
        const service = services.find(s => s.slug === slug);
        if (service) {
          setSelectedService(service);
        }
      }
    }
  }, [slug, services, selectedService]);

  // Only render once we have services loaded
  if (services.length === 0 || !selectedService) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Hero title={heroData.title} subtitle={heroData.subtitle} />
      
      <main className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <PageLayout 
            allServices={services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
        </div>
      </main>
    </>
  );
}