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
  // Convert icon name to PascalCase (e.g., 'code-bracket' -> 'CodeBracket')
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  
  // Return the icon component or fallback to Star
  return (LucideIcons as any)[pascalCase] || LucideIcons.Star
}

export default function Hero({
  title = "Hi, I'm Lewis",
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
        // Fetch hero data
        const heroPage = (typeof page === 'string' && page) ? page : 'home';
        const heroResponse = await fetch(`${API_BASE_URL}/api/v1/core/hero/${heroPage}/`)
        
        // Fetch about stats data
        const statsResponse = await fetch(`${API_BASE_URL}/api/v1/core/about-stats/active/`)

        let heroDataResult = null;
        let statsDataResult: AboutStat[] = [];

        if (heroResponse.ok) {
          heroDataResult = await heroResponse.json()
        } else {
          // Fallback hero data
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
          // Fallback stats data
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
        
        // Set fallback data
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
    cta_text: 'View My Work',
    cta_link: '/projects'
  }

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center isolate overflow-hidden bg-dark-primary">
      {/* Background - Same as before */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-orange-900/20 animate-pulse-subtle"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-800/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-orange-800/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-700/15 to-transparent rounded-full blur-2xl animate-float-gentle"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating particles - Same as before */}
      <div className="absolute inset-0 -z-25">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-400/60 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cta/50 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-primary-300/50 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-success/40 rounded-full animate-ping" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/6 right-1/2 w-2 h-2 bg-primary-500/40 rounded-full animate-ping" style={{ animationDelay: '8s' }}></div>
      </div>

      {/* Lottie Animation */}
      {showAnimation && (
        <div className="absolute bottom-4 right-4 w-48 sm:w-64 lg:w-80 opacity-40 lg:opacity-60 pointer-events-none z-0">
          <Lottie animationData={codeAnimation} loop autoplay />
        </div>
      )}

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Personal Introduction */}
          <div className="max-w-2xl">
            {/* Personal greeting */}
            <div className="animate-fade-in">
              <p className="text-cta font-medium text-lg mb-4">👋 Hello there!</p>
            </div>

            {/* Hero Title - More personal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight animate-fade-in">
              <span className="block text-white drop-shadow-lg">
                {displayData.heading}
              </span>
            </h1>

            {/* Personal subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-gray-100 max-w-2xl leading-relaxed animate-slide-up drop-shadow-md" style={{ animationDelay: '0.3s' }}>
              {displayData.subheading}
            </p>

            {/* Tech stack preview */}
            <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-gray-300 mb-3">I work with:</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Django', 'Node.js', 'TypeScript', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-white/10 text-gray-200 rounded-full text-sm font-medium border border-white/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <a
                href={displayData.cta_link}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-cta hover:bg-cta-hover text-white transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-cta-glow"
              >
                {displayData.cta_text}
                <ChevronRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-200"
              >
                Let's Talk
              </a>
            </div>

            {/* Personal touch - availability and location */}
            <div className="mt-12 flex flex-wrap items-center gap-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse-subtle shadow-lg"></div>
                <span className="text-sm text-gray-100 font-medium">Available for projects</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-100">📍 Nairobi, Kenya</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-100">⏰ Typically responds in 2-4 hours</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic What I Bring (From AboutStats API) */}
          <div className="lg:pl-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                What I Bring to Your Project
              </h3>
              <p className="text-gray-300 text-center text-sm mb-8">
                6+ years of turning ideas into reality
              </p>

              <div className="space-y-6">
                {aboutStats.map((stat, index) => {
                  const IconComponent = getLucideIcon(stat.icon_name);
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 animate-slide-up"
                      style={{ animationDelay: `${1.2 + index * 0.2}s` }}
                    >
                      {/* Dynamic Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cta to-cta-hover rounded-full flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Dynamic Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">{stat.stat_name}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-2">{stat.stat_description}</p>
                        <span className="text-xs text-cta font-medium">{stat.stat_value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA - More personal */}
              <div className="mt-8 text-center">
                <p className="text-gray-300 text-sm mb-4">Ready to bring your idea to life?</p>
                <a
                  href="/contact"
                  className="inline-flex items-center text-cta hover:text-cta-hover font-medium transition-colors"
                >
                  Let's discuss your project
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