'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  CodeBracketIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CpuChipIcon,
  PencilSquareIcon
} from '@heroicons/react/24/solid'

// Service interface based on your types
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
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Mock data - will be replaced with API call
const mockServiceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern, responsive websites and web applications built with cutting-edge technologies',
    iconComponent: CodeBracketIcon,
    servicesCount: 8,
    featured: true,
    startingPrice: 500,
    gradient: 'from-blue-500 to-blue-700',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Beautiful, user-centered designs that convert visitors into customers',
    iconComponent: GlobeAltIcon,
    servicesCount: 5,
    featured: true,
    startingPrice: 300,
    gradient: 'from-purple-500 to-purple-700',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: '3',
    name: 'Content Writing',
    slug: 'content-writing',
    description: 'Compelling content that engages your audience and drives results',
    iconComponent: PencilSquareIcon,
    servicesCount: 6,
    featured: true,
    startingPrice: 50,
    gradient: 'from-green-500 to-green-700',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: '4',
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'AI-powered solutions for data analysis, predictions, and automation',
    iconComponent: CpuChipIcon,
    servicesCount: 4,
    featured: true,
    startingPrice: 800,
    gradient: 'from-orange-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: '5',
    name: 'Technical Writing',
    slug: 'technical-writing',
    description: 'Clear, comprehensive documentation and technical content',
    iconComponent: DocumentTextIcon,
    servicesCount: 3,
    featured: false,
    startingPrice: 100,
    gradient: 'from-indigo-500 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=60'
  }
]

export default function ServicesShowcase() {
  const [services, setServices] = useState<ServiceCategory[]>([])
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
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/api/v1/services/categories/`)
        // const data = await response.json()
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        setServices(mockServiceCategories)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
        setServices(mockServiceCategories) // Fallback to mock data
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= services.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, services.length - itemsPerView) : prev - 1
    )
  }

  const canGoNext = currentIndex + itemsPerView < services.length
  const canGoPrev = currentIndex > 0

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
            {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, services.length)} of {services.length}
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
              {services.map((service, index) => {
                const IconComponent = service.iconComponent
                return (
                  <div
                    key={service.id}
                    className={`flex-shrink-0 px-3`}
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="group cursor-pointer h-full">
                      <div className="relative bg-white dark:bg-dark-tertiary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                        {/* Image Background */}
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-80`}></div>
                          
                          {/* Icon */}
                          <div className="absolute top-4 left-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Featured Badge */}
                          {service.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-cta text-white text-xs font-medium px-2 py-1 rounded-full">
                                Popular
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-text-inverse dark:text-text-primary mb-2 group-hover:text-primary-500 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                            {service.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-text-secondary mb-1">
                                {service.servicesCount} service{service.servicesCount !== 1 ? 's' : ''}
                              </div>
                              {service.startingPrice && (
                                <div className="text-sm font-semibold text-text-inverse dark:text-text-primary">
                                  From ${service.startingPrice}
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
          <button className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            View All Services
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </button>
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

// Hook for services data fetching
export function useServicesData() {
  const [data, setData] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch(`${API_BASE_URL}/api/v1/services/categories/`)
        // const data = await response.json()
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setData(mockServiceCategories)
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