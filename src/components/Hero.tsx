'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import codeAnimation from '@/assets/lottie/code.json'
import { getApiBaseUrl } from '@/app/utils/config'

// Types
interface Link {
  name: string
  href: string
}

// Dynamically import Lottie to avoid SSR crash
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface HeroData {
  heading: string
  subheading: string
  cta_text: string
  cta_link: string
  route_name: string
}

interface HeroProps {
  routeName?: string // Allow manual route override
  fallbackTitle?: string
  fallbackSubtitle?: string
  fallbackLinks?: Link[]
}

// API Configuration
const API_BASE_URL = getApiBaseUrl();

export default function Hero({
  routeName,
  fallbackTitle = "Build a Better Future, With Tech",
  fallbackSubtitle = "Dedicated to helping professionals build success stories whether through software development or content writing.",
  fallbackLinks = [
    { name: 'View My Projects', href: '/projects' },
    { name: 'Request a Service', href: '/contact' },
  ],
}: HeroProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const pathname = usePathname()

  // Memoize the route name to prevent unnecessary re-renders
  const currentRouteName = useMemo(() => {
    return routeName || getRouteNameFromPath(pathname)
  }, [routeName, pathname])

  // Use the custom hook to fetch hero data
  const { data: heroData, loading, error } = useHeroData(currentRouteName)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  // Memoize display data to prevent unnecessary re-renders
  const displayData = useMemo(() => {
    return heroData ? {
      heading: heroData.heading,
      subheading: heroData.subheading,
      cta_text: heroData.cta_text || fallbackLinks[0]?.name || 'Get Started',
      cta_link: heroData.cta_link || fallbackLinks[0]?.href || '/contact'
    } : {
      heading: fallbackTitle,
      subheading: fallbackSubtitle,
      cta_text: fallbackLinks[0]?.name || 'Get Started',
      cta_link: fallbackLinks[0]?.href || '/contact'
    }
  }, [heroData, fallbackTitle, fallbackSubtitle, fallbackLinks])

  // Loading state - show skeleton with fallback content
  if (loading) {
    return (
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center isolate overflow-hidden bg-dark-primary">
        <div className="absolute inset-0 -z-30">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-700 rounded mb-6"></div>
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-8 w-3/4"></div>
                <div className="h-12 bg-gray-700 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Three-step process for potential clients
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "We analyze your needs and define the perfect solution"
    },
    {
      number: "02",
      title: "Develop",
      description: "Custom development with regular progress updates"
    },
    {
      number: "03",
      title: "Deploy",
      description: "Launch your solution with ongoing support and maintenance"
    }
  ]

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center isolate overflow-hidden bg-dark-primary">
      {/* 🌆 Animated Gradient Background - Better Contrast */}
      <div className="absolute inset-0 -z-30">
        {/* Primary gradient background - darker for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

        {/* Animated gradient overlays - subtle blue and orange accents */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-orange-900/20 animate-pulse-subtle"></div>

        {/* Moving gradient orbs - darker versions */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-800/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-orange-800/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-700/15 to-transparent rounded-full blur-2xl animate-float-gentle"></div>

        {/* Additional dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* ✨ Enhanced floating particles effect */}
      <div className="absolute inset-0 -z-25">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-400/60 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cta/50 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-primary-300/50 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-success/40 rounded-full animate-ping" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/6 right-1/2 w-2 h-2 bg-primary-500/40 rounded-full animate-ping" style={{ animationDelay: '8s' }}></div>
      </div>

      {/* ✨ Lottie Animation - Mobile optimized */}
      {showAnimation && (
        <div className="absolute bottom-4 right-4 w-48 sm:w-64 lg:w-80 opacity-40 lg:opacity-60 pointer-events-none z-0">
          <Lottie animationData={codeAnimation} loop autoplay />
        </div>
      )}

      {/* 📣 Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="max-w-2xl">
            {/* Hero Title with better contrast */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight animate-fade-in">
              <span className="block text-white drop-shadow-lg">
                {displayData.heading}
              </span>
              <span className="block text-cta mt-2 drop-shadow-lg">
                I'm Lewis
              </span>
            </h1>

            {/* Hero Subtitle with enhanced readability */}
            <p className="mt-6 text-lg sm:text-xl text-gray-100 max-w-2xl leading-relaxed animate-slide-up drop-shadow-md" style={{ animationDelay: '0.3s' }}>
              {displayData.subheading}
            </p>

            {/* CTA Button with dynamic data */}
            <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <a
                href={displayData.cta_link}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-cta hover:bg-cta-hover text-white transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-cta-glow"
              >
                {displayData.cta_text}
                <ChevronRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust indicators with better contrast */}
            <div className="mt-12 flex flex-wrap items-center gap-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-white shadow-lg"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-100 font-medium">Trusted by 10+ clients</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse-subtle shadow-lg"></div>
                <span className="text-sm text-gray-100 font-medium">Available for new projects</span>
              </div>
            </div>
          </div>

          {/* Right Column - Three Step Process */}
          <div className="lg:pl-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Your Journey to Success
              </h3>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex items-start space-x-4 animate-slide-up"
                    style={{ animationDelay: `${1.2 + index * 0.2}s` }}
                  >
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-cta hover:bg-cta-hover rounded-full flex items-center justify-center shadow-lg transition-colors">
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    </div>

                    {/* Check Icon */}
                    <CheckCircleIcon className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <p className="text-gray-300 text-sm mb-4">Ready to start your project?</p>
                <a
                  href={displayData.cta_link}
                  className="inline-flex items-center text-cta hover:text-cta-hover font-medium transition-colors"
                >
                  Let's discuss your needs
                  <ChevronRightIcon className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
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

// Utility function to get route name from pathname
function getRouteNameFromPath(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/contact')) return 'contact'
  if (pathname.startsWith('/services')) return 'services'
  if (pathname.startsWith('/blog')) return 'blog'

  // Default to 'home' for unknown routes
  return 'home'
}

// Hook for hero data fetching with route-specific data
export function useHeroData(routeName: string = 'home') {
  const [data, setData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch route-specific hero data
        const response = await fetch(`${API_BASE_URL}/api/v1/core/hero-sections/by-route/${routeName}/`)

        if (!response.ok) {
          // If route-specific hero doesn't exist, try to get default home hero
          if (response.status === 404 && routeName !== 'home') {
            const fallbackResponse = await fetch(`${API_BASE_URL}/api/v1/core/hero-sections/by-route/home/`)
            if (fallbackResponse.ok) {
              const fallbackData: HeroData = await fallbackResponse.json()
              setData(fallbackData)
              return
            }
          }

          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: HeroData = await response.json()
        setData(data)
      } catch (err) {
        setError(`Failed to load hero data for ${routeName}`)
        console.error('Hero data fetch error:', err)
        // Don't set data to null on error, keep existing data if any
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [routeName]) // Only depend on routeName

  return { data, loading, error }
}