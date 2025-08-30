'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import * as LucideIcons from 'lucide-react'
import codeAnimation from '@/assets/lottie/code.json'

// Dynamically import Lottie to avoid SSR crash
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface HeroData {
  heading: string
  subheading: string
  cta_text: string
  cta_link: string
}

interface AboutStat {
  stat_name: string
  stat_value: string
  stat_description: string
  icon_name: string
}

interface HeroProps {
  title?: string
  subtitle?: string
  page?: string
}

// API Base URL for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

// Helper function to get Lucide icon component
const getLucideIcon = (iconName: string) => {
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  
  return (LucideIcons as any)[pascalCase] || LucideIcons.Star
}

export default function Hero({
  title = "Professional Full-Stack Developer",
  subtitle = "I build modern web applications that solve real business problems and help companies grow through technology.",
  page
}: HeroProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [aboutStats, setAboutStats] = useState<AboutStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShowAnimation(true)

    const fetchData = async () => {
      try {
        const heroPage = (typeof page === 'string' && page) ? page : 'home';
        const heroResponse = await fetch(`${API_BASE_URL}/api/v1/core/hero/${heroPage}/`)
        const statsResponse = await fetch(`${API_BASE_URL}/api/v1/core/about-stats/active/`)

        let heroDataResult = null;
        let statsDataResult: AboutStat[] = [];

        if (heroResponse.ok) {
          heroDataResult = await heroResponse.json()
        } else {
          heroDataResult = {
            heading: title,
            subheading: subtitle,
            cta_text: 'View My Work',
            cta_link: '/projects'
          }
        }

        if (statsResponse.ok) {
          statsDataResult = await statsResponse.json()
        } else {
          statsDataResult = [
            {
              stat_name: "5+ Years Experience",
              stat_value: "100+",
              stat_description: "Full-stack development with modern technologies",
              icon_name: "code"
            },
            {
              stat_name: "End-to-End Solutions",
              stat_value: "React • Django",
              stat_description: "From concept to deployment and beyond",
              icon_name: "rocket"
            },
            {
              stat_name: "Client-Focused",
              stat_value: "Available",
              stat_description: "Clear communication and reliable delivery",
              icon_name: "users"
            }
          ]
        }

        setHeroData(heroDataResult)
        setAboutStats(statsDataResult)

      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load content')
        
        setHeroData({
          heading: title,
          subheading: subtitle,
          cta_text: 'View My Work',
          cta_link: '/projects'
        })
        
        setAboutStats([
          {
            stat_name: "5+ Years Experience",
            stat_value: "100+",
            stat_description: "Full-stack development with modern technologies",
            icon_name: "code"
          },
          {
            stat_name: "End-to-End Solutions", 
            stat_value: "React • Django",
            stat_description: "From concept to deployment and beyond",
            icon_name: "rocket"
          },
          {
            stat_name: "Client-Focused",
            stat_value: "Available",
            stat_description: "Clear communication and reliable delivery",
            icon_name: "users"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [title, subtitle])

  if (isLoading) {
    return (
      <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:bg-neutral-900">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </section>
    )
  }

  const displayData = heroData || {
    heading: title,
    subheading: subtitle,
    cta_text: 'View My Work',
    cta_link: '/projects'
  }

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center bg-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-[2rem]">
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10"></div>
        
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 dark:bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Minimal grid overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Lottie Animation - Simplified */}
      {showAnimation && (
        <div className="absolute bottom-8 right-8 w-32 sm:w-48 lg:w-64 opacity-20 dark:opacity-30 pointer-events-none">
          <Lottie animationData={codeAnimation} loop autoplay />
        </div>
      )}

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Professional greeting */}


          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl font-bold tracking-tight text-primary dark:text-white leading-[1.1] animate-fade-in-up max-w-5xl mx-auto" style={{ animationDelay: '0.2s' }}>
                                    {displayData.heading}

          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-primary dark:text-neutral-300 leading-relaxed animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.4s' }}>
            {displayData.subheading}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <a
              href={displayData.cta_link}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-accent text-white hover:bg-primary-600 shadow-medium hover:shadow-large transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {displayData.cta_text}
              <ChevronRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-primary-600 dark:border-neutral-700 text-primary dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              Let's Talk
            </a>
          </div>

          {/* Professional credentials strip */}
          <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success rounded-full shadow-lg"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Available for projects</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">📍 Nairobi, Kenya</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">⚡ 5+ Years Experience</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">🚀 Full-Stack Developer</span>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-4">Trusted by businesses to deliver quality solutions</p>
            <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
              {/* You can replace these with actual client logos */}
              <div className="px-4 py-2 bg-success dark:bg-neutral-800/50 rounded-lg text-xs text-inverse dark:text-neutral-400 font-medium">
                50+ projects
              </div>
              <div className="px-4 py-2 bg-success dark:bg-neutral-800/50 rounded-lg text-xs text-inverse dark:text-neutral-400 font-medium">
                8+ live apps
              </div>
              <div className="px-4 py-2 bg-success dark:bg-neutral-800/50 rounded-lg text-xs text-inverse dark:text-neutral-400 font-medium">
                97% Lighthouse Score
              </div>
              <div className="px-4 py-2 bg-success dark:bg-neutral-800/50 rounded-lg text-xs text-inverse dark:text-neutral-400 font-medium">
                5+ industries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error state display */}
      {error && (
        <div className="absolute top-4 right-4 bg-error/90 text-white px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </section>
  )
}