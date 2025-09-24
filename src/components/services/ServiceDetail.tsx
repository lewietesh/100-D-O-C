'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import FAQAccordion from './FAQAccordion';

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

// Get API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
        const baseUrl = `${API_BASE_URL}/api/v1/services`;
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

  const getPricingModelIcon = (model: string) => {
    switch (model) {
      case 'hourly': return <ClockIcon className="w-4 h-4" />;
      case 'fixed': return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'custom': return <WrenchScrewdriverIcon className="w-4 h-4" />;
      default: return <CurrencyDollarIcon className="w-4 h-4" />;
    }
  };

  const getPricingModelLabel = (model: string) => {
    switch (model) {
      case 'hourly': return 'Hourly Rate';
      case 'fixed': return 'Fixed Price';
      case 'custom': return 'Custom Quote';
      default: return 'Pricing';
    }
  };

  // Default process steps if none are provided
  const defaultProcessSteps = [
    {
      id: '1',
      service: service.id,
      title: 'Discovery & Planning',
      description: 'Understanding your requirements, goals, and constraints to create a detailed project plan.',
      step_order: 1
    },
    {
      id: '2',
      service: service.id,
      title: 'Design & Architecture',
      description: 'Creating the solution architecture and user experience, ensuring scalability and performance.',
      step_order: 2
    },
    {
      id: '3',
      service: service.id,
      title: 'Development & Testing',
      description: 'Building your solution using modern technologies with continuous testing and quality assurance.',
      step_order: 3
    },
    {
      id: '4',
      service: service.id,
      title: 'Deployment & Support',
      description: 'Deploying to production and providing ongoing support to ensure smooth operation.',
      step_order: 4
    }
  ];

  const stepsToShow = processSteps.length > 0 ? processSteps : defaultProcessSteps;

  return (
    <div className="space-y-8">
      {/* Service Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        <div className="p-8">
          {/* Category Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-full">
              <CodeBracketIcon className="w-4 h-4" />
              {service.category}
            </span>
            {service.subcategory && (
              <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm rounded-full">
                {service.subcategory}
              </span>
            )}
            {service.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-full">
                <StarIcon className="w-4 h-4" />
                Featured
              </span>
            )}
          </div>

          {/* Service Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {service.name}
          </h1>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 mb-2">
                {getPricingModelIcon(service.pricing_model)}
                <span className="font-medium text-sm">{getPricingModelLabel(service.pricing_model)}</span>
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {formatPrice(service.starting_at, service.currency)}
                {service.pricing_model === 'hourly' && <span className="text-sm font-normal text-neutral-500">/hour</span>}
              </p>
              {service.pricing_model === 'fixed' && service.min_price > 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  Min: {formatPrice(service.min_price.toString(), service.currency)}
                </p>
              )}
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 mb-2">
                <ClockIcon className="w-4 h-4" />
                <span className="font-medium text-sm">Timeline</span>
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {service.timeline || 'Flexible'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Depends on scope
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 mb-2">
                <DocumentTextIcon className="w-4 h-4" />
                <span className="font-medium text-sm">Options</span>
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {service.pricing_tiers_count || 'Custom'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Available packages
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Service Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <DocumentTextIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Service Overview</h2>
        </div>
        
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Technologies & Tools */}
        {tools.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool.id}
                  className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-full border border-neutral-200 dark:border-neutral-700"
                >
                  {tool.tool_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Process Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <RocketLaunchIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Our Process</h2>
        </div>
        
        <div className="space-y-6">
          {stepsToShow
            .sort((a, b) => a.step_order - b.step_order)
            .map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <CurrencyDollarIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Pricing & Packages</h2>
        </div>

        {service.pricing_model === 'custom' ? (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Custom Pricing</h3>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Starting at {formatPrice(service.starting_at, service.currency)}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                Every project is unique. I provide personalized quotes based on your specific requirements, 
                complexity, and timeline to ensure you get the best value for your investment.
              </p>
              <a
                href={`/contact?service=${service.slug}&type=custom`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                <span>Request Custom Quote</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : service.pricing_model === 'hourly' ? (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Hourly Rate</h3>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {formatPrice(service.starting_at, service.currency)}
              </div>
              <div className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">per hour</div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                Perfect for ongoing projects, maintenance, or when you need flexible development support. 
                No long-term commitments - pay only for the time you need.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Minimum Engagement</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">2 hours per session</p>
                </div>
                <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 border border-neutral-200 dark:border-neutral-600">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Billing</h4>
                  <p className="text-neutral-600 dark:text-neutral-400">Weekly invoicing</p>
                </div>
              </div>
              <a
                href={`/contact?service=${service.slug}&type=hourly`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                <span>Discuss Your Project</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div>
            {/* Fixed Pricing Tiers */}
            {pricingTiers.length > 1 && (
              <div className="flex flex-wrap border-b border-neutral-200 dark:border-neutral-700 mb-8">
                {pricingTiers
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((tier) => (
                    <button
                      key={tier.id}
                      className={`px-6 py-3 font-medium text-sm transition-colors ${
                        selectedTierId === tier.id
                          ? 'border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                      onClick={() => setSelectedTierId(tier.id)}
                    >
                      {tier.name} {tier.recommended && '★'}
                    </button>
                  ))}
              </div>
            )}

            {selectedTier ? (
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        {selectedTier.name}
                        {selectedTier.recommended && (
                          <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-full">
                            <StarIcon className="w-3 h-3" />
                            Recommended
                          </span>
                        )}
                      </h3>
                      {selectedTier.estimated_delivery && (
                        <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          Estimated Delivery: {selectedTier.estimated_delivery}
                        </p>
                      )}
                    </div>
                    <div className="text-right mt-4 lg:mt-0">
                      <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                        {formatPrice(selectedTier.price, selectedTier.currency)}
                      </div>
                      {selectedTier.unit && (
                        <div className="text-sm text-neutral-500">{selectedTier.unit}</div>
                      )}
                    </div>
                  </div>

                  {selectedTier.features && selectedTier.features.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">What's Included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTier.features.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-3">
                            {feature.included ? (
                              <CheckCircleIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-300 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className={`font-medium text-sm ${feature.included ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                                {feature.title}
                              </span>
                              {feature.description && (
                                <p className={`text-xs mt-1 ${feature.included ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-400'}`}>
                                  {feature.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-8 py-6 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                  <a
                    href={`/contact?service=${service.slug}&tier=${selectedTier.id}`}
                    className="block w-full py-4 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Request This Package
                      <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              </div>
            ) : pricingTiers.length === 0 ? (
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 border border-neutral-200 dark:border-neutral-700 text-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Standard Pricing</h3>
                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                  {formatPrice(service.starting_at, service.currency)}
                </div>
                <a
                  href={`/contact?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Deliverables Section */}
      {deliverables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <DocumentTextIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">What You'll Receive</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deliverables
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <CheckCircleIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-300 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">{item.description}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Use Cases Section */}
      {useCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <LightBulbIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Perfect For</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase) => (
              <div
                key={useCase.id}
                className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 text-sm">
                  {useCase.use_case}
                </h3>
                {useCase.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {useCase.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FAQs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        
        {faqs.length > 0 ? (
          <FAQAccordion faqs={faqs} />
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Have questions about this service? I'm here to help!
            </p>
            <a
              href={`/contact?service=${service.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Ask a Question
            </a>
          </div>
        )}
      </motion.div>



      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin"></div>
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">Loading service details...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;