// src/components/services/ServiceDetail.tsx
'use client';

import { Service, PricingTier } from '@/app/models/services.model';
import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const [selectedTierId, setSelectedTierId] = useState(
    service.pricing.tiers?.find(tier => tier.recommended)?.id || 
    service.pricing.tiers?.[0]?.id
  );

  const selectedTier = service.pricing.tiers?.find(tier => tier.id === selectedTierId);

  return (
    <section className="space-y-8">
      {/* Service Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {service.category}
          </span>
          {service.featured && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Featured Service
            </span>
          )}
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">{service.name}</h2>
      </div>

      {/* Service Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={service.imgUrl}
          alt={service.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Description */}
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
        
        {/* Tools Used (if available) */}
        {service.tools && service.tools.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Technologies & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {service.tools.map((tool, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Process Steps (if available) */}
      {service.process && service.process.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Process</h3>
          <div className="space-y-3">
            {service.process.map((step) => (
              <div key={step.step} className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Options</h3>
        
        {service.pricing.model === 'custom' ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800">Custom Pricing</h4>
            <p className="text-gray-600 mt-2">
              Starting at {service.pricing.startingAt} {service.pricing.currency}
            </p>
            <p className="text-gray-600 mt-2">
              Our pricing is tailored to your specific requirements. Contact us for a detailed quote.
            </p>
            <Link
              href="#contact-form"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Request a Quote
            </Link>
          </div>
        ) : service.pricing.model === 'hourly' ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800">Hourly Rate</h4>
            <p className="text-gray-600 mt-2">
              {service.pricing.tiers && service.pricing.tiers[0]?.price} {service.pricing.tiers && service.pricing.tiers[0]?.currency} per hour
            </p>
            <p className="text-gray-600 mt-2">
              Final cost depends on project scope and complexity.
            </p>
            <Link
              href="#contact-form"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Discuss Your Project
            </Link>
          </div>
        ) : (
          // Tiered pricing display
          <>
            {/* Tier Selection Tabs */}
            {service.pricing.tiers && service.pricing.tiers.length > 1 && (
              <div className="flex flex-wrap border-b border-gray-200 mb-6">
                {service.pricing.tiers.map((tier) => (
                  <button
                    key={tier.id}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      selectedTierId === tier.id
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

            {/* Selected Tier Details */}
            {selectedTier && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {selectedTier.name}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {selectedTier.estimatedDelivery && `Estimated Delivery: ${selectedTier.estimatedDelivery}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedTier.price} {selectedTier.currency}
                      </div>
                      <div className="text-sm text-gray-500">{selectedTier.unit}</div>
                    </div>
                  </div>

                  {/* Features List */}
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
                </div>

                {/* CTA Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href={`/request-service?service=${service.slug}&tier=${selectedTier.id}`}
                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded transition"
                  >
                    Request This Service
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Deliverables Section (if available) */}
      {service.deliverables && service.deliverables.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Receive</h3>
          <ul className="space-y-2">
            {service.deliverables.map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular For Section (if available) */}
      {service.popularFor && service.popularFor.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Use Cases</h3>
          <div className="flex flex-wrap gap-2">
            {service.popularFor.map((useCase, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}