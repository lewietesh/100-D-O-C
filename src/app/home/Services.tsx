'use client'

import {
  GlobeAltIcon,
  CodeBracketIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid'

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
    <section className="w-full overflow-x-hidden bg-surface transition-colors duration-300 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6 animate-fade-in-up">
            <span className="w-8 h-px bg-accent mr-3"></span>
            <span className="text-accent font-semibold text-base sm:text-lg">What I Offer</span>
            <span className="w-8 h-px bg-accent ml-3"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Solutions built to elevate your business
          </h2>
          
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            I offer end-to-end development services that cover every layer of your system — from frontend to backend, to ML models and infrastructure. Let's build together.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <a
              key={service.name}
              href="/services"
              className="group relative service-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200 dark:border-neutral-700 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="icon-container flex items-center justify-center h-16 w-16 rounded-2xl text-white shadow-medium group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                  <service.icon className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="service-title text-xl font-bold  ">
                  {service.name}
                </h3>
                
                <p className="service-description text-primary">
                  {service.description}
                </p>
              </div>

              {/* Hover accent line */}
              <div className="accent-line absolute bottom-0 left-0 w-full h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Ready to transform your ideas into reality?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="cta-primary group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              Start Your Project
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
            
            <a
              href="/services"
              className="cta-secondary inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              View All Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}