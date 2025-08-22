//components/home/TechStackShowcase.tsx
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { CodeBracketIcon } from '@heroicons/react/24/solid'

// API Technology interface that matches your API response
interface ApiTechnology {
  id: number;
  name: string;
  icon_url: string;
  category: string;
}

interface TechnologyResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiTechnology[];
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Fallback icons for technologies when icon_url is empty
const getTechnologyIcon = (techName: string): string => {
  const iconMap: Record<string, string> = {
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Next JS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
    'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg'
  };
  
  return iconMap[techName] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
};

// Category colors for visual distinction
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Frontend': 'from-blue-400 to-cyan-500',
    'Backend': 'from-green-400 to-emerald-500',
    'database': 'from-purple-400 to-violet-500',
    'deployment': 'from-orange-400 to-red-500',
    'Language': 'from-yellow-400 to-amber-500'
  };
  
  return colorMap[category] || 'from-gray-400 to-gray-500';
};

export default function TechStackShowcase() {
  const [technologies, setTechnologies] = useState<ApiTechnology[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 3  // sm: 3 items
      if (window.innerWidth < 768) return 4  // md: 4 items
      if (window.innerWidth < 1024) return 5 // lg: 5 items
      return 7 // xl: 7 items (show all if we have 7 or fewer)
    }
    return 3
  }

  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView())
    }

    setItemsPerView(getItemsPerView())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/technologies/`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status}`)
        }
        
        const data: TechnologyResponse = await response.json()
        setTechnologies(data.results)
        
      } catch (err) {
        console.error('Error fetching technologies:', err)
        setError('Unable to load technologies')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  const nextSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, technologies.length - itemsPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, technologies.length - itemsPerView)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const canGoNext = currentIndex < Math.max(0, technologies.length - itemsPerView)
  const canGoPrev = currentIndex > 0
  const showNavigation = technologies.length > itemsPerView

  if (isLoading) {
    return (
      <section className="w-full py-20 px-4 bg-light-primary">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className="flex justify-center space-x-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-20 px-4 bg-light-primary">
        <div className="max-w-6xl mx-auto text-center">
          <CodeBracketIcon className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-inverse mb-2">Unable to load technology stack</h3>
          <p className="text-text-secondary">{error}</p>
        </div>
      </section>
    )
  }

  if (technologies.length === 0) {
    return (
      <section className="w-full py-20 px-4 bg-light-primary">
        <div className="max-w-6xl mx-auto text-center">
          <CodeBracketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-inverse mb-2">No technologies found</h3>
          <p className="text-text-secondary">Technology stack information will be available soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-20 px-4 bg-light-primary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-cta rounded-full flex items-center justify-center">
              <CodeBracketIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-inverse mb-6">
            Technology Stack
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Cutting-edge technologies I use to build robust, scalable, and modern solutions
          </p>
        </div>

        {/* Navigation Controls */}
        {showNavigation && (
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className={`p-3 rounded-full border transition-all duration-200 ${
                canGoPrev
                  ? 'border-primary-200 bg-white text-primary-500 hover:bg-primary-50 shadow-md hover:shadow-lg'
                  : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.ceil(technologies.length / itemsPerView) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    Math.floor(currentIndex / itemsPerView) === i
                      ? 'bg-primary-500 w-6'
                      : 'bg-gray-300 hover:bg-primary-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className={`p-3 rounded-full border transition-all duration-200 ${
                canGoNext
                  ? 'border-primary-200 bg-white text-primary-500 hover:bg-primary-50 shadow-md hover:shadow-lg'
                  : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Technologies Display */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {technologies.map((technology, index) => {
                const iconUrl = technology.icon_url?.trim() 
                  ? technology.icon_url 
                  : getTechnologyIcon(technology.name);
                
                const categoryGradient = getCategoryColor(technology.category);
                
                return (
                  <div
                    key={technology.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="flex flex-col items-center group">
                      {/* Technology Icon Container */}
                      <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryGradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                        <div className="relative w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                          <img
                            src={iconUrl}
                            alt={technology.name}
                            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                            style={{ 
                              filter: technology.name === 'Next JS' ? 'invert(1)' : 'none'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
                            }}
                          />
                        </div>
                      </div>

                      {/* Technology Name */}
                      <h3 className="text-lg font-semibold text-text-inverse text-center mb-2 group-hover:text-primary-500 transition-colors duration-200">
                        {technology.name}
                      </h3>

                      {/* Category Badge */}
                      <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${categoryGradient} text-white font-medium capitalize`}>
                        {technology.category}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-primary-50 rounded-full border border-primary-200">
            <span className="text-primary-600 font-medium">
              {technologies.length} technologies across {[...new Set(technologies.map(t => t.category))].length} categories
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}