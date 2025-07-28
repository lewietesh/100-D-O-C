// app/request-service/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/context/DataContext';
import { Service } from '@/app/models/services.model';
import Hero from '@/components/Hero';

interface RequestServicePageProps {
  params: {
    slug: string;
  }
}

export default function RequestServicePage({ params }: RequestServicePageProps) {
  const router = useRouter();
  const { services, createOrder } = useData();
  const { slug } = params;
  const [service, setService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
    budget: '',
    timeline: '',
    requirements: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Find the service based on the slug
  useEffect(() => {
    if (services.length > 0) {
      const foundService = services.find(s => s.slug === slug);
      if (foundService) {
        setService(foundService);
      }
    }
  }, [slug, services]);

  // If service not found, return 404
  if (!service) {
    return (
      <>
        <Hero title="Service Not Found" subtitle="The requested service could not be found" />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            The service you are looking for doesn't exist or has been removed.
          </p>
          <a 
            href="/services" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            View All Services
          </a>
        </div>
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // Create a new service order object using the updated model
      const newOrder = {
        serviceId: service.id,
        serviceName: service.name,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone || undefined,
        description: form.description,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        timeline: form.timeline || undefined,
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date().toISOString(),
        // Add any required fields from the ServiceOrder interface
        requirements: form.requirements ? [
          {
            title: "Custom requirement",
            description: form.requirements,
            completed: false
          }
        ] : undefined
      };
      
      // Use the createOrder method from the data context
      createOrder(newOrder);
      
      setStatus('success');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting request:', error);
      setStatus('error');
    }
  };

  return (
    <>
      <Hero 
        title={`Request ${service.name}`} 
        subtitle="Complete the form below to request this service" 
      />
      
      <main className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {status === 'success' ? (
            <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in our {service.name} service. We've received your request and will get back to you within 24-48 hours to discuss the next steps.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/services" 
                  className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Explore Other Services
                </a>
                <a 
                  href="/" 
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Return to Home
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              {/* Service Summary */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={service.imgUrl}
                        alt={service.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">{service.name}</h2>
                      <p className="mt-1 text-sm text-gray-500">{service.category}</p>
                    </div>
                  </div>
                  {service.pricing.model === 'tiered' && service.pricing.tiers ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-lg font-medium text-gray-900">
                        {service.pricing.tiers[0].price} {service.pricing.tiers[0].currency}
                      </p>
                    </div>
                  ) : service.pricing.model === 'custom' ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Custom pricing</p>
                      <p className="text-lg font-medium text-gray-900">
                        {service.pricing.startingAt} {service.pricing.currency} starting
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              
              {/* Request Form */}
              <div className="p-6">
                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    There was an error submitting your request. Please try again or contact us directly.
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Please describe your project, objectives, and any specific requirements."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                        Specific Requirements
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        rows={3}
                        value={form.requirements}
                        onChange={handleChange}
                        placeholder="Any specific technologies, features, or deliverables you need."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={form.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select budget range</option>
                          <option value="500">Less than $500</option>
                          <option value="1000">$500 - $1,000</option>
                          <option value="2500">$1,000 - $2,500</option>
                          <option value="5000">$2,500 - $5,000</option>
                          <option value="10000">$5,000 - $10,000</option>
                          <option value="15000">More than $10,000</option>
                          <option value="0">Not sure / Flexible</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Timeline
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={form.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select timeline</option>
                          <option value="ASAP">As soon as possible</option>
                          <option value="1 week">Within 1 week</option>
                          <option value="2 weeks">Within 2 weeks</option>
                          <option value="1 month">Within 1 month</option>
                          <option value="3 months">Within 3 months</option>
                          <option value="Flexible">Flexible / Not urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-start mb-6">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                        By submitting this form, I agree to the processing of my personal data in accordance with the privacy policy. I understand that I can withdraw my consent at any time.
                      </label>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                      </button>
                      
                      <a 
                        href="/services" 
                        className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}