// app/request-service/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchServices } from '@/services/api/services';
import { ServicesAPI } from '@/lib/api/services';
import { submitServiceRequest } from '@/services/api/serviceRequests';

import { Service, PricingTier, ApiService } from '@/app/models/services.model';
import Hero from '@/components/Hero';
import { useToast } from '@/app/context/ToastContext';

export default function RequestServicePage() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const tierId = searchParams.get('tier');

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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
    requirements: '',
    attachment: undefined as File | undefined,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch services from API (without tiers)
  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      setLoading(true);
      try {
        const res = await fetchServices();
        const allowedCategories = [
          'Dissertation',
          'Research Papers',
          'Course Projects',
          'IT and Programming',
          'Web Applications',
          'Data Science and Machine Learning',
          'Other',
        ] as const;
        const mapped = (res.results || []).map((apiService: ApiService) => {
          const category = allowedCategories.includes((apiService.category || 'Other') as any)
            ? (apiService.category as typeof allowedCategories[number])
            : 'Other';
          return {
            id: apiService.id,
            name: apiService.name,
            slug: apiService.slug,
            category,
            subcategory: apiService.subcategory || '',
            description: apiService.description || '',
            shortDescription: '',
            imgUrl: '',
            bannerUrl: '',
            iconUrl: '',
            pricing: {
              model: (
                apiService.pricing_model === 'fixed' ||
                apiService.pricing_model === 'tiered' ||
                apiService.pricing_model === 'custom' ||
                apiService.pricing_model === 'hourly' ||
                apiService.pricing_model === 'per-page'
              )
                ? apiService.pricing_model as 'fixed' | 'tiered' | 'custom' | 'hourly' | 'per-page'
                : 'custom',
              tiers: [],
              startingAt: apiService.starting_at ? Number(apiService.starting_at) : undefined,
              currency: apiService.currency || 'USD',
            },
            deliverables: [],
            timeline: apiService.timeline || '',
            process: [],
            tools: [],
            faqs: [],
            popularFor: [],
            featured: !!apiService.featured,
            active: true,
            createdAt: '',
            updatedAt: '',
          };
        });
        if (isMounted) {
          setServices(mapped);
        }
      } catch (err) {
        if (isMounted) setServices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadServices();
    return () => { isMounted = false; };
  }, []);

  // Find service and tier based on URL params
  useEffect(() => {
    if (services.length > 0 && serviceSlug) {
      const service = services.find((s: Service) => s.slug === serviceSlug);
      if (service) {
        setSelectedService(service);
        // Lazy-load tiers for this service
        (async () => {
          try {
            const tiers = await ServicesAPI.getPricingTiers(service.id);
            const mappedTiers: PricingTier[] = (tiers || []).map((tier: any) => ({
              id: tier.id,
              name: tier.name,
              price: Number(tier.price),
              currency: tier.currency,
              unit: tier.unit,
              features: [],
              estimatedDelivery: tier.estimated_delivery,
              recommended: tier.recommended,
            }));
            setSelectedService(prev => prev ? {
              ...prev,
              pricing: {
                ...prev.pricing,
                tiers: mappedTiers,
              },
            } : null);
            if (tierId) {
              const tier = mappedTiers.find((t: PricingTier) => t.id === tierId);
              if (tier) {
                setSelectedTier(tier);
              }
            }
          } catch (e) {
            setSelectedService(prev => prev ? {
              ...prev,
              pricing: {
                ...prev.pricing,
                tiers: [],
              },
            } : null);
          }
        })();
      }
    }
  }, [serviceSlug, tierId, services]);

  // Handle service selection change (lazy-load tiers)
  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find((s: Service) => s.id === e.target.value);
    setSelectedService(service || null);
    setSelectedTier(null);
    if (service) {
      try {
        const tiers = await ServicesAPI.getPricingTiers(service.id);
        const mappedTiers: PricingTier[] = (tiers || []).map((tier: any) => ({
          id: tier.id,
          name: tier.name,
          price: Number(tier.price),
          currency: tier.currency,
          unit: tier.unit,
          features: [],
          estimatedDelivery: tier.estimated_delivery,
          recommended: tier.recommended,
        }));
        setSelectedService(prev => prev ? {
          ...prev,
          pricing: {
            ...prev.pricing,
            tiers: mappedTiers,
          },
        } : null);
      } catch (e) {
        setSelectedService(prev => prev ? {
          ...prev,
          pricing: {
            ...prev.pricing,
            tiers: [],
          },
        } : null);
      }
      // Pre-fill timeline if available
      if (service.timeline) {
        setForm(prev => ({ ...prev, timeline: service.timeline || '' }));
      } else {
        setForm(prev => ({ ...prev, timeline: '' }));
      }
    }
  };

  // Handle tier selection change
  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedService?.pricing?.tiers) {
      const tier = selectedService.pricing.tiers.find((t: PricingTier) => t.id === e.target.value);
      setSelectedTier(tier || null);
      // Pre-fill timeline if tier has estimatedDelivery
      if (tier) {
        setForm(prev => ({ ...prev, timeline: tier.estimatedDelivery || '' }));
      }
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, attachment: fileInput.files?.[0] ?? undefined }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validation helpers
  const getMinBudget = () => {
    if (selectedTier) return selectedTier.price;
    if (selectedService?.pricing?.startingAt) return selectedService.pricing.startingAt;
    return 0;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedService) newErrors.service = 'Please select a service.';
    if (selectedService?.pricing?.tiers && !selectedTier) newErrors.tier = 'Please select a service tier.';
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Valid email is required.';
    if (!form.description.trim()) newErrors.description = 'Project description is required.';
    // Budget validation
    const minBudget = getMinBudget();
    if (form.budget && minBudget && Number(form.budget) < minBudget) {
      newErrors.budget = `Budget should not be less than ${minBudget}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (with validation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      console.log('Validation failed:', errors, form, selectedService, selectedTier);
      return;
    }
    setStatus('submitting');
    try {
      const payload = {
        service: selectedService?.id!,
        pricing_tier: selectedTier?.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        project_description: form.description,
        budget: form.budget,
        timeline: form.timeline,
        requirements: form.requirements,
        attachment: form.attachment,
      };
      console.log('Submitting to API:', payload);
      await submitServiceRequest(payload);
      setStatus('success');
      showToast('Your service request was submitted successfully! We will contact you soon.', 'success');
      window.scrollTo(0, 0);
    } catch (error: any) {
      setStatus('error');
      let msg = 'There was an error submitting your request. Please try again or contact support.';
      if (error && error.response && error.response.data) {
        msg = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      }
      showToast(msg, 'error');
      console.error('Submission error:', error);
    }
  };

  // Early return if services or their tiers are still loading
  if (loading || services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>

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
                      {services.map((service: Service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="text-red-600 text-xs mt-1">{errors.service}</p>}
                  </div>

                  {selectedService && selectedService.pricing.tiers && selectedService.pricing.tiers.length > 0 && (
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
                      {errors.tier && <p className="text-red-600 text-xs mt-1">{errors.tier}</p>}
                      {/* Show tier features/details if selected */}
                      {selectedTier && (
                        <div className="mt-2 p-3 border rounded bg-gray-50">
                          <div className="font-semibold text-gray-700 mb-1">Tier Features:</div>
                          {selectedTier.features && selectedTier.features.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm text-gray-700">
                              {selectedTier.features.map((f, i) => (
                                <li key={f.id || i}>{f.title}{f.included === false ? ' (not included)' : ''}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-xs text-gray-500">No features listed for this tier.</div>
                          )}
                          {selectedTier.estimatedDelivery && (
                            <div className="text-xs text-gray-500 mt-1">Estimated delivery: {selectedTier.estimatedDelivery}</div>
                          )}
                        </div>
                      )}
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
                      {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
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
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
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
                    {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
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
                        <option value="10000">Less than Ksh 10000</option>
                        <option value="20000">Ksh 10000 - 20,000</option>
                        <option value="30000">Ksh 20,000 - 30000</option>
                        <option value="50000">Ksh 40000 - Ksh 50,000</option>
                        <option value="75000">50,000 - 75,000</option>
                        <option value="10000">More than Ksh 75,000</option>
                        <option value="0">Not sure </option>
                      </select>
                      {/* Budget hint and error */}
                      {selectedTier && (
                        <p className="text-xs text-gray-500 mt-1">Tier price: {selectedTier.price} {selectedTier.currency} {selectedTier.unit}</p>
                      )}
                      {!selectedTier && selectedService?.pricing?.startingAt && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">Starting at: {selectedService?.pricing?.startingAt} {selectedService?.pricing?.currency}</p>
                          {selectedService?.timeline && (
                            <span className="block text-xs text-gray-400">Typical timeline: {selectedService.timeline}</span>
                          )}
                        </>
                      )}
                      {errors.budget && <p className="text-red-600 text-xs mt-1">{errors.budget}</p>}
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

                  {/* File Upload UI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachment (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        name="attachment"
                        onChange={handleChange}
                        className="block mx-auto mb-2"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Max 1 file, 15MB. Allowed: pdf, doc, docx, txt, jpg, jpeg, png, zip.
                        {form.attachment && <span className="block mt-1">Selected: {form.attachment.name}</span>}
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