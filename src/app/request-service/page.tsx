// app/request-service/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useData } from '@/app/context/DataContext';
import { Service, PricingTier } from '@/app/models/services.model';
import Hero from '@/components/Hero';

export default function RequestServicePage() {
  const router = useRouter();
  const { services, createOrder } = useData();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const tierId = searchParams.get('tier');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
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

  // Find service and tier based on URL params
  useEffect(() => {
    if (services.length > 0 && serviceSlug) {
      const service = services.find(s => s.slug === serviceSlug);
      if (service) {
        setSelectedService(service);
        
        if (tierId && service.pricing.tiers) {
          const tier = service.pricing.tiers.find(t => t.id === tierId);
          if (tier) {
            setSelectedTier(tier);
          }
        }
      }
    }
  }, [serviceSlug, tierId, services]);

  // Handle service selection change
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find(s => s.id === e.target.value);
    setSelectedService(service || null);
    setSelectedTier(null);
  };

  // Handle tier selection change
  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedService?.pricing.tiers) {
      const tier = selectedService.pricing.tiers.find(t => t.id === e.target.value);
      setSelectedTier(tier || null);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      return;
    }
    
    setStatus('submitting');
    
    try {
      // Create a new order object that matches the ServiceOrder interface
      const orderData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone || undefined,
        description: form.description,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        timeline: form.timeline || undefined,
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date().toISOString(),
        requirements: form.requirements ? [
          {
            title: selectedTier ? `${selectedTier.name} Package` : "Custom Requirements",
            description: form.requirements,
            completed: false
          }
        ] : undefined
      };
      
      // Use the createOrder method from the data context
      createOrder(orderData);
      
      setStatus('success');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting request:', error);
      setStatus('error');
    }
  };

  // Early return if services are still loading
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Hero 
        title="Request Service" 
        subtitle="Complete the form below to request our professional services" 
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Request!</h2>
              <p className="text-gray-600 mb-6">
                We've received your service request and will contact you shortly to discuss the details.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/services" 
                  className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Browse Services
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
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Request Form</h2>
              
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                  There was an error submitting your request. Please try again or contact us directly.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">1. Select Service</h3>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full p-3 border border-gray-300 rounded bg-white"
                      value={selectedService?.id || ''}
                      onChange={handleServiceChange}
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedService && selectedService.pricing.tiers && (
                    <div>
                      <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Tier
                      </label>
                      <select
                        id="tier"
                        name="tier"
                        className="w-full p-3 border border-gray-300 rounded bg-white"
                        value={selectedTier?.id || ''}
                        onChange={handleTierChange}
                        required
                      >
                        <option value="">Select a tier</option>
                        {selectedService.pricing.tiers.map(tier => (
                          <option key={tier.id} value={tier.id}>
                            {tier.name} - {tier.price} {tier.currency} {tier.unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Client Information */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">2. Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                {/* Project Details */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">3. Project Details</h3>
                  
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  {/* File Upload UI (non-functional for this example) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        multiple
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Select Files
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Drag and drop files here or click to browse. Max 5 files, 5MB each.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Terms and Submit */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start mb-6">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      I agree to the <a href="/terms" className="text-blue-600 hover:underline">terms and conditions</a> and understand that my information will be processed in accordance with the <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a>.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Service Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}