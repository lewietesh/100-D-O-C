// src/components/services/ServiceDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// TypeScript interfaces
interface Service {
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
interface PricingTier {
  id: string;
  service: string;
  name: string;
  price: string;
  currency: string;
  unit?: string;
  estimated_delivery?: string;
  recommended: boolean;
  sort_order: number;
}
interface ServiceFeature {
  id: string;
  title: string;
  description?: string;
  included: boolean;
}
interface ProcessStep {
  id: string;
  service: string;
  title: string;
  description?: string;
  step_order: number;
}
interface ServiceTool {
  id: string;
  service: string;
  tool_name: string;
  tool_url?: string;
}
interface ServiceDeliverable {
  id: string;
  service: string;
  description: string;
  sort_order: number;
}
interface ServiceUseCase {
  id: string;
  service: string;
  use_case: string;
  description?: string;
}
interface PricingTierWithFeatures extends PricingTier {
  features: ServiceFeature[];
}
interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
}
interface ServiceDetailProps {
  service: Service;
}

import FAQAccordion from './FAQAccordion';

const ServiceDetail = ({ service }: ServiceDetailProps) => {
  const [pricingTiers, setPricingTiers] = useState<PricingTierWithFeatures[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [tools, setTools] = useState<ServiceTool[]>([]);
  const [deliverables, setDeliverables] = useState<ServiceDeliverable[]>([]);
  const [useCases, setUseCases] = useState<ServiceUseCase[]>([]);
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        const baseUrl = 'http://localhost:8000/api/v1/services';
        const [
          pricingResponse,
          stepsResponse,
          toolsResponse,
          deliverablesResponse,
          useCasesResponse,
          featuresResponse,
          faqsResponse
        ] = await Promise.all([
          fetch(`${baseUrl}/pricing-tiers/?service=${service.id}`),
          fetch(`${baseUrl}/process-steps/?service=${service.id}`),
          fetch(`${baseUrl}/tools/?service=${service.id}`),
          fetch(`${baseUrl}/deliverables/?service=${service.id}`),
          fetch(`${baseUrl}/usecases/?service=${service.id}`),
          fetch(`${baseUrl}/features/`),
          fetch(`${baseUrl}/faqs/?service=${service.id}`)
        ]);
        if (pricingResponse.ok) {
          const pricingData = await pricingResponse.json();
          const tiers = pricingData.results || [];
          const tiersWithFeatures = tiers.map((tier: PricingTier) => ({
            ...tier,
            features: []
          }));
          setPricingTiers(tiersWithFeatures);
          const recommendedTier = tiers.find((tier: PricingTier) => tier.recommended);
          setSelectedTierId(recommendedTier?.id || tiers[0]?.id || '');
        }
        if (stepsResponse.ok) {
          const stepsData = await stepsResponse.json();
          setProcessSteps(stepsData.results || []);
        }
        if (toolsResponse.ok) {
          const toolsData = await toolsResponse.json();
          setTools(toolsData.results || []);
        }
        if (deliverablesResponse.ok) {
          const deliverablesData = await deliverablesResponse.json();
          setDeliverables(deliverablesData.results || []);
        }
        if (useCasesResponse.ok) {
          const useCasesData = await useCasesResponse.json();
          setUseCases(useCasesData.results || []);
        }
        if (faqsResponse.ok) {
          const faqsData = await faqsResponse.json();
          setFaqs(faqsData.results || []);
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [service.id]);

  const selectedTier = pricingTiers.find(tier => tier.id === selectedTierId);
  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    if (numPrice === 0) return 'Free';
    return `${currency} ${numPrice.toLocaleString()}`;
  };

  return (
    <section className="space-y-8">
      {/* Service Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {service.category}
          </span>
          {service.subcategory && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {service.subcategory}
            </span>
          )}
          {service.featured && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Featured Service
            </span>
          )}
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">{service.name}</h2>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
        {/* Tools Used (if available) */}
        {tools.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Technologies & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tool.tool_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Process Steps (if available) */}
      {processSteps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Process</h3>
          <div className="space-y-3">
            {processSteps
              .sort((a, b) => a.step_order - b.step_order)
              .map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{step.title}</h4>
                    {step.description && (
                      <p className="text-gray-600">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Options</h3>
        {service.pricing_model === 'custom' ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800">Custom Pricing</h4>
            <p className="text-gray-600 mt-2">
              Starting at {formatPrice(service.starting_at, service.currency)}
            </p>
            <p className="text-gray-600 mt-2">
              Our pricing is tailored to your specific requirements. Contact us for a detailed quote.
            </p>
            <a
              href={`/request-service?service=${service.slug}&type=custom`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Request a Quote
            </a>
          </div>
        ) : service.pricing_model === 'hourly' ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800">Hourly Rate</h4>
            <p className="text-gray-600 mt-2">
              {formatPrice(service.starting_at, service.currency)} per hour
            </p>
            <p className="text-gray-600 mt-2">
              Final cost depends on project scope and complexity.
            </p>
            <a
              href={`/request-service?service=${service.slug}&type=hourly`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Discuss Your Project
            </a>
          </div>
        ) : (
          <>
            {pricingTiers.length > 1 && (
              <div className="flex flex-wrap border-b border-gray-200 mb-6">
                {pricingTiers
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((tier) => (
                    <button
                      key={tier.id}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${selectedTierId === tier.id
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                      onClick={() => setSelectedTierId(tier.id)}
                    >
                      {tier.name} {tier.recommended && '(Recommended)'}
                    </button>
                  ))}
              </div>
            )}
            {selectedTier && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {selectedTier.name}
                      </h4>
                      {selectedTier.estimated_delivery && (
                        <p className="text-gray-600 mt-1">
                          Estimated Delivery: {selectedTier.estimated_delivery}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(selectedTier.price, selectedTier.currency)}
                      </div>
                      {selectedTier.unit && (
                        <div className="text-sm text-gray-500">{selectedTier.unit}</div>
                      )}
                    </div>
                  </div>
                  {selectedTier.features && selectedTier.features.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h5 className="font-medium text-gray-800">What's Included:</h5>
                      <ul className="space-y-3">
                        {selectedTier.features.map((feature) => (
                          <li key={feature.id} className="flex items-start">
                            {feature.included ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                            )}
                            <div>
                              <span className={`font-medium ${feature.included ? 'text-gray-800' : 'text-gray-500'}`}>
                                {feature.title}
                              </span>
                              {feature.description && (
                                <p className={`text-sm ${feature.included ? 'text-gray-600' : 'text-gray-400'}`}>
                                  {feature.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <a
                    href={`/request-service?service=${service.slug}&tier=${selectedTier.id}`}
                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded transition"
                  >
                    Request This Service
                  </a>
                </div>
              </div>
            )}
            {pricingTiers.length === 0 && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-800">Pricing</h4>
                <p className="text-gray-600 mt-2">
                  Starting at {formatPrice(service.starting_at, service.currency)}
                </p>
                <a
                  href={`/request-service?service=${service.slug}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* FAQs Section (directly below CTA) */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Deliverables Section (if available) */}
      {deliverables.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Receive</h3>
          <ul className="space-y-2">
            {deliverables
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <li key={item.id} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item.description}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Popular Use Cases Section (if available) */}
      {useCases.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Use Cases</h3>
          <div className="flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <span
                key={useCase.id}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                {useCase.use_case}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading service details...</span>
        </div>
      )}
    </section>
  );
};

export default ServiceDetail;