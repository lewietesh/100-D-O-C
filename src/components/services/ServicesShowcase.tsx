'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { StarIcon, ClockIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import * as LucideIcons from 'lucide-react'

// API Service interface that matches your API response
interface ApiService {
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

interface ServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiService[];
}

// Service category for display purposes
interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  servicesCount: number
  featured: boolean
  startingPrice: number
  services: ApiService[]
  topService: ApiService
  pricingModels: string[]
  hasTimeline: boolean
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Helper function to get Lucide icon component
const getLucideIcon = (category: string) => {
  const iconMapping: Record<string, string> = {
    'web development': 'Globe',
    'tech': 'Code',
    'frontend': 'Monitor', 
    'backend': 'Server',
    'mobile': 'Smartphone',
    'design': 'Palette',
    'content': 'FileText',
    'marketing': 'TrendingUp',
    'consultation': 'MessageCircle',
    'maintenance': 'Settings',
    'seo': 'Search',
    'e-commerce': 'ShoppingCart',
    'api': 'Zap',
    'database': 'Database',
    'security': 'Shield',
    'analytics': 'BarChart',
    'automation': 'Bot'
  }
  
  const key = category.toLowerCase().replace(/\s+/g, ' ')
  const iconName = iconMapping[key] || 'Code'
  
  return (LucideIcons as any)[iconName] || LucideIcons.Code
}

// Helper function to generate gradient based on category
const generateGradient = (category: string): string => {
  const gradients = [
    'from-primary-500 to-primary-600',
    'from-accent-500 to-accent-600',
    'from-success-500 to-success-600',
    'from-primary-600 to-accent-500',
    'from-accent-600 to-primary-500',
    'from-success-600 to-primary-500',
    'from-primary-500 to-success-600',
    'from-accent-500 to-success-600'
  ]
  
  const hash = category.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return gradients[Math.abs(hash) % gradients.length]
}

export default function ServicesShowcase() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 768) return 2
      if (window.innerWidth < 1024) return 3
      return 4
    }
    return 1
  }

  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView())
    }

    setItemsPerView(getItemsPerView())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/v1/services/services/`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`)
        }
        
        const data: ServiceResponse = await response.json()
        
        if (!data.results || data.results.length === 0) {
          setServiceCategories([])
          return
        }
        
        // Group services by category
        const servicesByCategory = data.results.reduce((acc, service) => {
          const category = service.category || 'Other Services'
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(service)
          return acc
        }, {} as Record<string, ApiService[]>)

        // Convert to ServiceCategory format
        const categories: ServiceCategory[] = Object.entries(servicesByCategory).map(([categoryName, services]) => {
          const sortedServices = services.sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return parseFloat(b.starting_at) - parseFloat(a.starting_at)
          })

          const featuredCount = services.filter(s => s.featured).length
          const minPrice = Math.min(...services.map(s => parseFloat(s.starting_at)))
          const pricingModels = [...new Set(services.map(s => s.pricing_model))]
          const hasTimeline = services.some(s => s.timeline && s.timeline.trim() !== '')
          
          const description = `${services.length} professional ${categoryName.toLowerCase()} service${services.length > 1 ? 's' : ''} available`
          
          return {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            description,
            servicesCount: services.length,
            featured: featuredCount > 0,
            startingPrice: minPrice,
            services: sortedServices,
            topService: sortedServices[0],
            pricingModels,
            hasTimeline
          }
        })

        const sortedCategories = categories.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.servicesCount - a.servicesCount
        })

        setServiceCategories(sortedCategories)
        
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Unable to load services. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= serviceCategories.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, serviceCategories.length - itemsPerView) : prev - 1
    )
  }

  const canGoNext = currentIndex + itemsPerView < serviceCategories.length
  const canGoPrev = currentIndex > 0

  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price)
    return `${currency} ${numPrice.toLocaleString()}`
  }

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-300 border-t-primary mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading services...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center max-w-md mx-auto px-4">
          <ExclamationTriangleIcon className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  // Empty state
  if (serviceCategories.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <LucideIcons.Package className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">No Services Available</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            We're currently updating our service offerings. Please check back soon or contact us directly for custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
            >
              Contact Us
            </a>
            <a
              href="/projects"
              className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
            >
              View Past Work
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-16 px-4 bg-main dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <LucideIcons.Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Professional Services That Drive Results
          </h2>
          <p className="text-xl text-primary dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions designed to solve your business challenges and accelerate sustainable growth
          </p>
        </div>

        {/* Navigation Controls */}
        {serviceCategories.length > itemsPerView && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  canGoPrev
                    ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-medium'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`p-3 rounded-full border transition-all duration-200 ${
                  canGoNext
                    ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-medium'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, serviceCategories.length)} of {serviceCategories.length}
            </div>
          </div>
        )}

        {/* Services Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {serviceCategories.map((category) => {
                const IconComponent = getLucideIcon(category.name)
                const gradient = generateGradient(category.name)
                
                return (
                  <div
                    key={category.id}
                    className={`flex-shrink-0 px-3`}
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="group cursor-pointer h-full">
                      <div className="relative bg-primary dark:bg-main rounded-2xl shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full min-h-[400px] flex flex-col border border-neutral-200 dark:border-neutral-700">
                        
                        {/* Header with gradient */}
                        <div className={`relative h-32 bg-gradient-to-br ${gradient} p-6 flex items-center justify-between`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{category.name}</h3>
                              <p className="text-white/80 text-sm">{category.servicesCount} service{category.servicesCount !== 1 ? 's' : ''}</p>
                            </div>
                          </div>

                          {category.featured && (
                            <div className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                              <StarIcon className="w-3 h-3 mr-1" />
                              Popular
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 flex-1">
                            {category.description}
                          </p>

                          {/* Top Service Preview */}
                          {category.topService && (
                            <div className="bg-main dark:bg-neutral-700 rounded-lg p-4 mb-4 border border-neutral-200 dark:border-neutral-600">
                              <h4 className="font-medium text-primary dark:text-white text-sm mb-2">
                                Featured: {category.topService.name}
                              </h4>
                              <p className="text-xs text-primary dark:text-neutral-300 mb-3 line-clamp-2">
                                {truncateDescription(category.topService.description, 80)}
                              </p>
                        
                            </div>
                          )}
                          
                          {/* Pricing Info */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                Starting from {formatPrice(category.startingPrice.toString(), category.services[0]?.currency || 'KSH')}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {category.pricingModels.join(', ')} pricing
                              </div>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* View All Services CTA */}
        <div className="text-center">
          <a 
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-large hover:shadow-xl transform hover:scale-105"
          >
            Explore All Services
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </a>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            Or <a href="/contact" className="text-primary hover:text-primary-600 font-medium">contact me</a> for a custom solution
          </p>
        </div>
      </div>
    </section>
  )
}