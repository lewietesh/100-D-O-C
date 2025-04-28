'use client'

import {
  GlobeAltIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid' // changed to solid for visibility

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
]

export default function Services() {
  return (
    <section className=" w-full overflow-x-hidden bg-secondary  transition-colors duration-300 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-[var(--cta-button)] tracking-wide uppercase">
            Services
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Solutions built to elevate your business
          </p>
          <p className="mt-6 text-lg text-[var(--color-secondary)] dark:text-gray-400">
            I offer end-to-end development services that cover every layer of your system — from frontend to backend, to ML models and infrastructure. Let’s build together.
          </p>
        </div>

        {/* Service Cards */}
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="rounded-xl bg-white-custom  shadow-md transition hover:shadow-lg p-6"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cta text-dark">
                  <service.icon className="h-7 w-7" aria-hidden="true" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-dark dark:text-white-800 mb-2">
                {service.name}
              </h3>
              <p className="text-dark dark:text-white-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
