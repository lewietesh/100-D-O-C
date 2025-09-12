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
      case 'hourly': return <ClockIcon className="w-5 h-5" />;
      case 'fixed': return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'custom': return <WrenchScrewdriverIcon className="w-5 h-5" />;
      default: return <CurrencyDollarIcon className="w-5 h-5" />;
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
      description: 'We start by understanding your requirements, goals, and constraints to create a detailed project plan.',
      step_order: 1
    },
    {
      id: '2',
      service: service.id,
      title: 'Design & Architecture',
      description: 'Design the solution architecture and user experience, ensuring scalability and performance.',
      step_order: 2
    },
    {
      id: '3',
      service: service.id,
      title: 'Development & Testing',
      description: 'Build your solution using modern technologies with continuous testing and quality assurance.',
      step_order: 3
    },
    {
      id: '4',
      service: service.id,
      title: 'Deployment & Support',
      description: 'Deploy to production and provide ongoing support to ensure smooth operation.',
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="space-y-6">
          {/* Category Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
              <CodeBracketIcon className="w-4 h-4" />
              {service.category}
            </span>
            {service.subcategory && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full">
                {service.subcategory}
              </span>
            )}
            {service.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                <StarIcon className="w-4 h-4" />
                Featured Service
              </span>
            )}
          </div>

          {/* Service Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {service.name}
          </h1>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                {getPricingModelIcon(service.pricing_model)}
                <span className="font-semibold text-sm">{getPricingModelLabel(service.pricing_model)}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(service.starting_at, service.currency)}
                {service.pricing_model === 'hourly' && <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/hour</span>}
              </p>
              {service.pricing_model === 'fixed' && service.min_price > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Min: {formatPrice(service.min_price.toString(), service.currency)}
                </p>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <ClockIcon className="w-5 h-5" />
                <span className="font-semibold text-sm">Timeline</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {service.timeline || 'Flexible'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Depends on scope
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <DocumentTextIcon className="w-5 h-5" />
                <span className="font-semibold text-sm">Tiers</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {service.pricing_tiers_count || 'Custom'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Options available
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-center gap-2 mb-6">
          <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Overview</h2>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {service.description}
          </p>
        </div>

        {/* Technologies & Tools */}
        {tools.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span
                  key={tool.id}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800"
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-center gap-2 mb-8">
          <RocketLaunchIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Process</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stepsToShow
            .sort((a, b) => a.step_order - b.step_order)
            .map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-center gap-2 mb-8">
          <CurrencyDollarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing & Packages</h2>
        </div>

        {service.pricing_model === 'custom' ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Custom Pricing</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Starting at {formatPrice(service.starting_at, service.currency)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Every project is unique. I provide personalized quotes based on your specific requirements, 
                complexity, and timeline to ensure you get the best value for your investment.
              </p>
              <a
                href={`/contact?service=${service.slug}&type=custom`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <span>Request Custom Quote</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ) : service.pricing_model === 'hourly' ? (
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-emerald-200 dark:border-emerald-800">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hourly Rate</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {formatPrice(service.starting_at, service.currency)}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">per hour</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Perfect for ongoing projects, maintenance, or when you need flexible development support. 
                No long-term commitments - pay only for the time you need.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Minimum Engagement</h4>
                  <p className="text-gray-600 dark:text-gray-400">2 hours per session</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Billing</h4>
                  <p className="text-gray-600 dark:text-gray-400">Weekly invoicing</p>
                </div>
              </div>
              <a
                href={`/contact?service=${service.slug}&type=hourly`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <span>Discuss Your Project</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ) : (
          <div>
            {/* Fixed Pricing */}
            {pricingTiers.length > 1 && (
              <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-8">
                {pricingTiers
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((tier) => (
                    <button
                      key={tier.id}
                      className={`px-6 py-3 font-semibold text-sm transition-all duration-200 ${
                        selectedTierId === tier.id
                          ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      } rounded-t-lg`}
                      onClick={() => setSelectedTierId(tier.id)}
                    >
                      {tier.name} {tier.recommended && '⭐'}
                    </button>
                  ))}
              </div>
            )}

            {selectedTier ? (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedTier.name}
                        {selectedTier.recommended && (
                          <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                            <StarIcon className="w-4 h-4" />
                            Recommended
                          </span>
                        )}
                      </h3>
                      {selectedTier.estimated_delivery && (
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          Estimated Delivery: {selectedTier.estimated_delivery}
                        </p>
                      )}
                    </div>
                    <div className="text-right mt-4 lg:mt-0">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(selectedTier.price, selectedTier.currency)}
                      </div>
                      {selectedTier.unit && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{selectedTier.unit}</div>
                      )}
                    </div>
                  </div>

                  {selectedTier.features && selectedTier.features.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTier.features.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-3">
                            {feature.included ? (
                              <CheckCircleIcon className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircleIcon className="h-6 w-6 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className={`font-medium ${feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {feature.title}
                              </span>
                              {feature.description && (
                                <p className={`text-sm mt-1 ${feature.included ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
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

                <div className="px-8 py-6 bg-white/70 dark:bg-gray-800/70 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`/request-service?service=${service.slug}&tier=${selectedTier.id}`}
                    className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Request This Package
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </div>
              </div>
            ) : pricingTiers.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Standard Pricing</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {formatPrice(service.starting_at, service.currency)}
                </div>
                <a
                  href={`/contact?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What You'll Receive</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliverables
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item.description}</span>
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
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <LightBulbIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfect For</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase) => (
              <div
                key={useCase.id}
                className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  {useCase.use_case}
                </h3>
                {useCase.description && (
                  <p className="text-sm text-purple-600 dark:text-purple-400">
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-center gap-2 mb-6">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        
        {faqs.length > 0 ? (
          <FAQAccordion faqs={faqs} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions about this service? I'm here to help!
            </p>
            <a
              href={`/contact?service=${service.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Ask a Question
            </a>
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">Loading service details...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;