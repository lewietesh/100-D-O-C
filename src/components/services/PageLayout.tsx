// src/components/services/PageLayout.tsx
'use client';

import { useRouter } from 'next/navigation';
import ServicesListCard from './ServicesListCard';
import ContactCard from './ContactCard';
import BrochureCard from './BronchureCard';
import ServiceDetail from './ServiceDetail';
import FAQAccordion from './FAQAccordion';
import CTACard from './CTACard';
import GetInTouch from './GetinTouch';
import { Service } from '@/app/models/services.model';

interface PageLayoutProps {
  selectedService: Service;
  onServiceSelect: (service: Service) => void;
    allServices?: Service[]; // Add this optional prop

}

export default function PageLayout({ 
  selectedService, 
  onServiceSelect 
}: PageLayoutProps) {
  const router = useRouter();

  const handleServiceChange = (service: Service) => {
    onServiceSelect(service);
    router.push(`/services?slug=${service.slug}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-3 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <aside className="space-y-6 lg:col-span-1 order-2 lg:order-1">
        <ServicesListCard 
          selectedServiceId={selectedService.id}
          onServiceSelect={handleServiceChange}
        />
        <ContactCard />
        <GetInTouch serviceId={selectedService.id} serviceName={selectedService.name} />
        <BrochureCard />
      </aside>

      {/* Right Main Content */}
      <section className="lg:col-span-2 space-y-12 order-1 lg:order-2">
        <ServiceDetail service={selectedService} />
        <FAQAccordion faqs={selectedService.faqs || []} />
        <CTACard />
      </section>
    </div>
  );
}