'use client';

import {
  GlobeAltIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Organizational Websites',
    description:
      'Designing sleek, responsive, and high-performance websites for businesses and institutions to establish a strong digital presence.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Web Applications',
    description:
      'Full-stack development of dynamic and scalable web applications tailored to your business logic and workflow.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Machine Learning Models',
    description:
      'Building ML models for predictive analytics, recommendation systems, and automation of complex data workflows.',
    icon: Squares2X2Icon,
  },
  {
    name: 'Research & Dissertation Help',
    description:
      'Assistance with technical research, including system design, implementation, modeling, and documentation support.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Blog & Technical Writing',
    description:
      'Authoring blog posts, documentation, and guides that communicate complex technical concepts in simple terms.',
    icon: PencilIcon,
  },
  {
    name: 'System Integrations & APIs',
    description:
      'Custom API development and third-party integration with CRMs, ERPs, eTIMS systems and more.',
    icon: Cog6ToothIcon,
  },
];

export default function Services() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-brand dark:text-brand-dark tracking-wide uppercase">
            My Services
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-5xl">
            Solutions built to elevate your business
          </p>
          <p className="mt-6 text-lg text-text-secondary dark:text-gray-400">
            I offer end-to-end development services that cover every layer of your system — from frontend to backend, to ML models and infrastructure. Let’s build together.
          </p>
        </div>

        {/* Features List */}
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-5xl">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="relative pl-16">
                <dt className="text-lg font-semibold text-text-light dark:text-text-dark">
                  <div className="absolute top-0 left-0 flex size-12 items-center justify-center rounded-lg bg-brand dark:bg-brand-dark">
                    <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {service.name}
                </dt>
                <dd className="mt-2 text-base text-text-secondary dark:text-gray-400">
                  {service.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
