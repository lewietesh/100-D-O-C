'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import codeAnimation from '@/assets/lottie/code.json'

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
}

interface HeroProps {
  title?: string
  subtitle?: string
  links?: Link[]
  page?: string
}

// API Base URL for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

export default function Hero({
  title = "Build a Better Future, With Tech",
  subtitle = "Dedicated to helping professionals build success stories whether through software development or content writing.",
  links = [
    { name: 'View My Projects', href: '/projects' },
    { name: 'Request a Service', href: '/contact' },
  ],
  page
}: HeroProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShowAnimation(true)

    const fetchHeroData = async () => {
      try {
        // Use the page prop if provided, otherwise default to 'home'
        const heroPage = (typeof page === 'string' && page) ? page : 'home';
        const response = await fetch(`${API_BASE_URL}/api/v1/core/hero/${heroPage}/`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: HeroData = await response.json()
        setHeroData(data)
      } catch (error) {
        console.error('Error fetching hero data:', error)
        setError('Failed to load hero data')
        // Fallback to props if API fails
        setHeroData({
          heading: title,
          subheading: subtitle,
          cta_text: links[0]?.name || 'Get Started',
          cta_link: links[0]?.href || '/contact'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroData()
  }, [title, subtitle, links])

  if (isLoading) {
    return (
      <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-dark-primary">
        <div className="animate-pulse-subtle">
          <div className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  const displayData = heroData || {
    heading: title,
    subheading: subtitle,
    cta_text: 'Get Started',
    cta_link: '/contact'
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

// Hook for hero data fetching (ready for API integration)
export function useHeroData() {
  const [data, setData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/core/hero/home/`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: HeroData = await response.json()
        setData(data)
      } catch (err) {
        setError('Failed to load hero data')
        console.error('Hero data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}