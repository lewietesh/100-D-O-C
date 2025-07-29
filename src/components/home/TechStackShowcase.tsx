//components/home/TechStackShowcase.tsx
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

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

// Enhanced technology interface for display
interface TechnologyShowcase {
  technology: ApiTechnology;
  projectsCount: number;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  color: string;
  fallbackLogo: string;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Technology enhancement data - maps technology names to additional info
const getTechnologyEnhancements = (techName: string): Omit<TechnologyShowcase, 'technology'> => {
  const enhancements: Record<string, Omit<TechnologyShowcase, 'technology'>> = {
    'React': {
      projectsCount: 15,
      proficiencyLevel: 'expert',
      yearsOfExperience: 4,
      color: '#61DAFB',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    'Next JS': {
      projectsCount: 12,
      proficiencyLevel: 'expert',
      yearsOfExperience: 3,
      color: '#000000',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
    },
    'Django': {
      projectsCount: 18,
      proficiencyLevel: 'expert',
      yearsOfExperience: 5,
      color: '#092E20',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg'
    },
    'TypeScript': {
      projectsCount: 16,
      proficiencyLevel: 'expert',
      yearsOfExperience: 3,
      color: '#3178C6',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
    },
    'SQL': {
      projectsCount: 14,
      proficiencyLevel: 'advanced',
      yearsOfExperience: 4,
      color: '#336791',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
    },
    'Mongodb': {
      projectsCount: 10,
      proficiencyLevel: 'advanced',
      yearsOfExperience: 3,
      color: '#47A248',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'
    },
    'Docker': {
      projectsCount: 8,
      proficiencyLevel: 'intermediate',
      yearsOfExperience: 2,
      color: '#2496ED',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
    },
    'Python': {
      projectsCount: 20,
      proficiencyLevel: 'expert',
      yearsOfExperience: 5,
      color: '#3776AB',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    },
    'JavaScript': {
      projectsCount: 18,
      proficiencyLevel: 'expert',
      yearsOfExperience: 4,
      color: '#F7DF1E',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    'Node.js': {
      projectsCount: 12,
      proficiencyLevel: 'advanced',
      yearsOfExperience: 3,
      color: '#339933',
      fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    }
  };

  // Default enhancement for unknown technologies
  const defaultEnhancement: Omit<TechnologyShowcase, 'technology'> = {
    projectsCount: 5,
    proficiencyLevel: 'intermediate',
    yearsOfExperience: 2,
    color: '#6B7280',
    fallbackLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'
  };

  return enhancements[techName] || defaultEnhancement;
};

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

// Get category priority for sorting
const getCategoryPriority = (category: string): number => {
  const priorities: Record<string, number> = {
    'Frontend': 1,
    'Backend': 2,
    'database': 3,
    'deployment': 4,
    'Language': 5
  };
  return priorities[category] || 6;
};

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
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/technologies/`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status}`)
        }
        
        const data: TechnologyResponse = await response.json()
        
        // Sort technologies by category priority and then by name
        const sortedTechnologies = data.results.sort((a, b) => {
          const categoryDiff = getCategoryPriority(a.category) - getCategoryPriority(b.category);
          if (categoryDiff !== 0) return categoryDiff;
          return a.name.localeCompare(b.name);
        });

        // Enhance technologies with additional data
        const enhancedTechnologies: TechnologyShowcase[] = sortedTechnologies.map(tech => {
          const enhancement = getTechnologyEnhancements(tech.name);
          return {
            technology: tech,
            ...enhancement
          };
        });

        setTechnologies(enhancedTechnologies)
        
      } catch (err) {
        console.error('Error fetching technologies:', err)
        setError('Failed to load technologies')
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

  if (technologies.length === 0) {
    return (
      <section className="w-full py-16 px-4 bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-500">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p>No technologies found.</p>
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
              const { technology, projectsCount, proficiencyLevel, yearsOfExperience, color, fallbackLogo } = techShowcase
              const isHovered = hoveredTech === technology.id.toString()
              
              // Use API icon_url if available, otherwise use fallback
              const logoUrl = technology.icon_url && technology.icon_url.trim() !== '' 
                ? technology.icon_url 
                : fallbackLogo;
              
              return (
                <div
                  key={technology.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div
                    className="flex flex-col items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredTech(technology.id.toString())}
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
                          src={logoUrl}
                          alt={technology.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                          style={{ 
                            filter: technology.name === 'Next JS' ? 'invert(1)' : 'none'
                          }}
                          onError={(e) => {
                            // Fallback to a generic icon if the image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
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

                    {/* Category Badge */}
                    <div className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full mb-1 capitalize">
                      {technology.category}
                    </div>

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
                      {/* {projectsCount} projects */}
                    </span>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute z-10 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-dark-primary text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap animate-fade-in">
                        <div className="font-medium">{technology.name}</div>
                        {/* <div className="text-xs text-gray-300 capitalize">
                          {technology.category} • {proficiencyLevel} • {yearsOfExperience} years • {projectsCount} projects
                        </div> */}
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
        {/* <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
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
        </div> */}

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