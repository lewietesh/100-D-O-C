'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// Technology interfaces
interface Technology {
  id: string
  name: string
  category: string
  logo?: string
  color?: string
  description?: string
}

interface TechnologyShowcase {
  technology: Technology
  projectsCount: number
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience: number
  certifications?: string[]
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Mock data with real technology logos - LIMITED TO 6
const mockTechnologies: TechnologyShowcase[] = [
  {
    technology: {
      id: '1',
      name: 'React',
      category: 'Frontend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      color: '#61DAFB'
    },
    projectsCount: 15,
    proficiencyLevel: 'expert',
    yearsOfExperience: 4
  },
  {
    technology: {
      id: '2',
      name: 'Next.js',
      category: 'Frontend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      color: '#000000'
    },
    projectsCount: 12,
    proficiencyLevel: 'expert',
    yearsOfExperience: 3
  },
  {
    technology: {
      id: '3',
      name: 'Django',
      category: 'Backend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
      color: '#092E20'
    },
    projectsCount: 18,
    proficiencyLevel: 'expert',
    yearsOfExperience: 5
  },
  {
    technology: {
      id: '4',
      name: 'Python',
      category: 'Backend',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      color: '#3776AB'
    },
    projectsCount: 20,
    proficiencyLevel: 'expert',
    yearsOfExperience: 5
  },
  {
    technology: {
      id: '5',
      name: 'PostgreSQL',
      category: 'Database',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      color: '#336791'
    },
    projectsCount: 14,
    proficiencyLevel: 'advanced',
    yearsOfExperience: 4
  },
  {
    technology: {
      id: '6',
      name: 'TypeScript',
      category: 'Language',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      color: '#3178C6'
    },
    projectsCount: 16,
    proficiencyLevel: 'expert',
    yearsOfExperience: 3
  }
]

// Proficiency level colors
const getProficiencyColor = (level: string) => {
  switch (level) {
    case 'expert': return 'from-green-400 to-green-600'
    case 'advanced': return 'from-blue-400 to-blue-600'
    case 'intermediate': return 'from-yellow-400 to-yellow-600'
    case 'beginner': return 'from-gray-400 to-gray-600'
    default: return 'from-gray-400 to-gray-600'
  }
}

const getProficiencyDots = (level: string) => {
  switch (level) {
    case 'expert': return 4
    case 'advanced': return 3
    case 'intermediate': return 2
    case 'beginner': return 1
    default: return 1
  }
}

export default function TechStackShowcase() {
  const [technologies, setTechnologies] = useState<TechnologyShowcase[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2 // sm: 2 items
      if (window.innerWidth < 768) return 3 // md: 3 items
      if (window.innerWidth < 1024) return 4 // lg: 4 items
      return 5 // xl: 5 items
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
    const fetchTechnologies = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/api/v1/technologies/showcase/`)
        // const data = await response.json()
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600))
        setTechnologies(mockTechnologies)
      } catch (err) {
        console.error('Error fetching technologies:', err)
        setError('Failed to load technologies')
        setTechnologies(mockTechnologies) // Fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechnologies()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || technologies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, technologies.length - itemsPerView)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 3000) // Auto scroll every 3 seconds

    return () => clearInterval(interval)
  }, [isAutoScrolling, technologies.length, itemsPerView])

  const nextSlide = () => {
    setIsAutoScrolling(false) // Stop auto scroll when user interacts
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, technologies.length - itemsPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setIsAutoScrolling(false) // Stop auto scroll when user interacts
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, technologies.length - itemsPerView)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const canGoNext = currentIndex < Math.max(0, technologies.length - itemsPerView)
  const canGoPrev = currentIndex > 0

  if (isLoading) {
    return (
      <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="flex justify-center space-x-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-inverse dark:text-text-primary mb-4">
            Technology Stack
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Cutting-edge technologies I use to build robust, scalable, and modern solutions
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full border border-border-dark bg-white dark:bg-dark-tertiary text-text-inverse dark:text-text-primary hover:bg-gray-50 dark:hover:bg-dark-accent shadow-md transition-all duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full border border-border-dark bg-white dark:bg-dark-tertiary text-text-inverse dark:text-text-primary hover:bg-gray-50 dark:hover:bg-dark-accent shadow-md transition-all duration-200"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Auto-scroll toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                isAutoScrolling 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 dark:bg-dark-tertiary text-text-secondary'
              }`}
            >
              {isAutoScrolling ? 'Auto' : 'Manual'}
            </button>
            <div className="text-sm text-text-secondary">
              {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, technologies.length)} of {technologies.length}
            </div>
          </div>
        </div>

        {/* Technologies Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {technologies.map((techShowcase, index) => {
              const { technology, projectsCount, proficiencyLevel, yearsOfExperience } = techShowcase
              const isHovered = hoveredTech === technology.id
              
              return (
                <div
                  key={technology.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div
                    className="flex flex-col items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredTech(technology.id)}
                    onMouseLeave={() => setHoveredTech(null)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Technology Icon Circle */}
                    <div className="relative mb-3">
                      {/* Proficiency Ring */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getProficiencyColor(proficiencyLevel)} p-1 transform transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-lg' : 'scale-100'
                      }`}>
                        <div className="w-full h-full bg-white dark:bg-dark-secondary rounded-full"></div>
                      </div>
                      
                      {/* Main Circle */}
                      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-dark-secondary rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-xl' : 'scale-100'
                      } group-hover:shadow-xl`}>
                        {/* Technology Logo */}
                        <img
                          src={technology.logo}
                          alt={technology.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                          style={{ 
                            filter: technology.name === 'Next.js' ? 'invert(1)' : 'none'
                          }}
                        />
                      </div>
                      
                      {/* Experience Years Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-cta text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {yearsOfExperience}y
                      </div>
                    </div>

                    {/* Technology Name */}
                    <h3 className="text-sm font-medium text-text-inverse dark:text-text-primary text-center mb-1 transition-colors group-hover:text-primary-500 whitespace-nowrap">
                      {technology.name}
                    </h3>

                    {/* Proficiency Dots */}
                    <div className="flex space-x-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i < getProficiencyDots(proficiencyLevel)
                              ? 'bg-primary-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Projects Count */}
                    <span className="text-xs text-text-secondary whitespace-nowrap">
                      {projectsCount} projects
                    </span>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute z-10 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-dark-primary text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap animate-fade-in">
                        <div className="font-medium">{technology.name}</div>
                        <div className="text-xs text-gray-300">
                          {proficiencyLevel} • {yearsOfExperience} years • {projectsCount} projects
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-primary"></div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
            <span>Expert</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <span>Advanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
            <span>Beginner</span>
          </div>
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