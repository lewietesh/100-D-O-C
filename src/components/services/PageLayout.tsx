'use client'

import ServicesListCard from './ServicesListCard'
import ContactCard from './ContactCard'
import BrochureCard from './BronchureCard'
import ServiceDetail from './ServiceDetail'
import FAQAccordion from './FAQAccordion'
import CTACard from './CTACard'
import GetInTouch from './GetinTouch'

interface PageLayoutProps {
  serviceId: string;
  service: {
    title: string;
    imageUrl: string;
    description: string;
  };
}

export default function PageLayout({ serviceId, service }: PageLayoutProps) {
  
    
    
        return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-12 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <aside className="space-y-6 lg:col-span-1">
        <ServicesListCard />
        <ContactCard />
        <GetInTouch serviceId={serviceId} />
        <BrochureCard />
      </aside>

      {/* Right Main Content */}
      <section className="lg:col-span-2 space-y-12">
        <ServiceDetail
          title={service.title}
          imageUrl={service.imageUrl}
          description={service.description}
        />
        <CTACard />
        <FAQAccordion />
      </section>
    </div>
  )
}
