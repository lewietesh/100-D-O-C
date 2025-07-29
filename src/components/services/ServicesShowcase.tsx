//src/components/services/ServicesShowcase.tsx
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  CodeBracketIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CpuChipIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  StarIcon
} from '@heroicons/react/24/solid'

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
  iconComponent: React.ComponentType<{ className?: string }>
  servicesCount: number
  featured: boolean
  startingPrice?: number
  gradient: string
  image?: string
  services: ApiService[]
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Icon mapping for different service categories
const getCategoryIcon = (category: string): React.ComponentType<{ className?: string }> => {
  const iconMap: Record<string, any> = {
    'Web development': GlobeAltIcon,
    'Web Development': GlobeAltIcon,
    'Frontend Development': CodeBracketIcon,
    'Backend Development': Cog6ToothIcon,
    'Full Stack Development': CodeBracketIcon,
    'Machine Learning': CpuChipIcon,
    'AI Development': CpuChipIcon,
    'Data Science': CpuChipIcon,
    'Content Writing': PencilSquareIcon,
    'Technical Writing': DocumentTextIcon,
    'Blog Writing': PencilSquareIcon,
    'Documentation': DocumentTextIcon,
    'API Development': Cog6ToothIcon,
    'System Integration': Cog6ToothIcon,
    'Research': DocumentTextIcon,
    'Consultation': StarIcon,
    default: CodeBracketIcon
  };
  
  return iconMap[category] || iconMap.default;
};

// Gradient mapping for categories
const getCategoryGradient = (category: string): string => {
  const gradientMap: Record<string, string> = {
    'Web development': 'from-blue-500 to-blue-700',
    'Web Development': 'from-blue-500 to-blue-700',
    'Machine Learning': 'from-purple-500 to-purple-700',
    'Content Writing': 'from-green-500 to-green-700',
    'Technical Writing': 'from-indigo-500 to-indigo-700',
    'API Development': 'from-orange-500 to-red-600',
    'Research': 'from-pink-500 to-rose-700',
    default: 'from-gray-500 to-gray-700'
  };
  
  return gradientMap[category] || gradientMap.default;
};

// Category images mapping
const getCategoryImage = (category: string): string => {
  const imageMap: Record<string, string> = {
    'Web development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&auto=format&fit=crop&q=60',
    'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&auto=format&fit=crop&q=60',
    'Machine Learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&auto=format&fit=crop&q=60',
    'Content Writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&auto=format&fit=crop&q=60',
    'Technical Writing': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=60',
    'API Development': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&auto=format&fit=crop&q=60',
    'Research': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60',
    default: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&auto=format&fit=crop&q=60'
  };
  
  return imageMap[category] || imageMap.default;
};

export default function ServicesShowcase() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 2 // sm: 2 items
      if (window.innerWidth < 1024) return 3 // md: 3 items
      return 4 // lg: 4 items
    }
    return 2
  }

  const [itemsPerView, setItemsPerView] = useState(2)

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
        
        // Fetch all services from your API
        const response = await fetch(`${API_BASE_URL}/api/v1/services/services/`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`)
        }
        
        const data: ServiceResponse = await response.json()
        
        // Group services by category
        const servicesByCategory = data.results.reduce((acc, service) => {
          const category = service.category || 'Other'
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(service)
          return acc
        }, {} as Record<string, ApiService[]>)

        // Convert to ServiceCategory format
        const categories: ServiceCategory[] = Object.entries(servicesByCategory).map(([categoryName, services]) => {
          const featuredCount = services.filter(s => s.featured).length
          const minPrice = Math.min(...services.map(s => parseFloat(s.starting_at)))
          
          return {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            description: `Professional ${categoryName.toLowerCase()} services tailored to your needs`,
            iconComponent: getCategoryIcon(categoryName),
            servicesCount: services.length,
            featured: featuredCount > 0,
            startingPrice: minPrice > 0 ? minPrice : undefined,
            gradient: getCategoryGradient(categoryName),
            image: getCategoryImage(categoryName),
            services: services
          }
        })

        // Sort categories - featured first, then by service count
        const sortedCategories = categories.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.servicesCount - a.servicesCount
        })

        setServiceCategories(sortedCategories)
        
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
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

  const formatPrice = (price: number, currency: string = 'Ksh') => {
    return `${currency} ${price.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (serviceCategories.length === 0) {
    return (
      <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-500">
            <CodeBracketIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No services available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-cta rounded-full flex items-center justify-center">
              <CodeBracketIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-inverse dark:text-text-primary mb-4">
            Browse by Service Categories
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Discover our range of professional services designed to elevate your business and bring your ideas to life
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className={`p-3 rounded-full border transition-all duration-200 ${
                canGoPrev
                  ? 'border-border-dark bg-white dark:bg-dark-tertiary text-text-inverse dark:text-text-primary hover:bg-gray-50 dark:hover:bg-dark-accent shadow-md'
                  : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className={`p-3 rounded-full border transition-all duration-200 ${
                canGoNext
                  ? 'border-border-dark bg-white dark:bg-dark-tertiary text-text-inverse dark:text-text-primary hover:bg-gray-50 dark:hover:bg-dark-accent shadow-md'
                  : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-sm text-text-secondary">
            {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, serviceCategories.length)} of {serviceCategories.length}
          </div>
        </div>

        {/* Services Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {serviceCategories.map((category, index) => {
                const IconComponent = category.iconComponent
                return (
                  <div
                    key={category.id}
                    className={`flex-shrink-0 px-3`}
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="group cursor-pointer h-full">
                      <div className="relative bg-white dark:bg-dark-tertiary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                        {/* Image Background */}
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
                          
                          {/* Icon */}
                          <div className="absolute top-4 left-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Featured Badge */}
                          {category.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-cta text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                <StarIcon className="w-3 h-3 mr-1" />
                                Popular
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-text-inverse dark:text-text-primary mb-2 group-hover:text-primary-500 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-text-secondary mb-1">
                                {category.servicesCount} service{category.servicesCount !== 1 ? 's' : ''}
                              </div>
                              {category.startingPrice && (
                                <div className="text-sm font-semibold text-text-inverse dark:text-text-primary">
                                  From {formatPrice(category.startingPrice)}
                                </div>
                              )}
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
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
        <div className="text-center mt-12">
          <a 
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            View All Services
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </a>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-error/10 text-error rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Enhanced hook for services data fetching with categories
export function useServicesData() {
  const [data, setData] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/v1/services/services/`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`)
        }
        
        const serviceData: ServiceResponse = await response.json()
        
        // Group and process services into categories
        const servicesByCategory = serviceData.results.reduce((acc, service) => {
          const category = service.category || 'Other'
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(service)
          return acc
        }, {} as Record<string, ApiService[]>)

        const categories: ServiceCategory[] = Object.entries(servicesByCategory).map(([categoryName, services]) => {
          const featuredCount = services.filter(s => s.featured).length
          const minPrice = Math.min(...services.map(s => parseFloat(s.starting_at)))
          
          return {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            description: `Professional ${categoryName.toLowerCase()} services`,
            iconComponent: getCategoryIcon(categoryName),
            servicesCount: services.length,
            featured: featuredCount > 0,
            startingPrice: minPrice > 0 ? minPrice : undefined,
            gradient: getCategoryGradient(categoryName),
            image: getCategoryImage(categoryName),
            services: services
          }
        })

        setData(categories.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.servicesCount - a.servicesCount
        }))
        
      } catch (err) {
        setError('Failed to load services')
        console.error('Services data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}