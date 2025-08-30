'use client'

import { useState, useEffect } from 'react'
import { ArrowRightIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import * as LucideIcons from 'lucide-react'

// API interfaces based on your models
interface AboutData {
  title: string
  description: string
  media_url: string
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch about section data
        const aboutResponse = await fetch(`${API_BASE_URL}/api/v1/core/about-sections/latest/`)

        let aboutResult = null

        if (aboutResponse.ok) {
          aboutResult = await aboutResponse.json()
        }

        // Set data or fallbacks
        setAboutData(aboutResult || {
          title: "About Me",
          description: "A tech-savvy professional with over five years of experience developing unique, and standard web software solutions that are usable, interactive, reliable and scalable. In addition, I have 8+ years of experience as a content writer, with a focus on essays, research papers, dissertations, technical writing and course projects.",
          media_url: "https://cdn.pixabay.com/photo/2015/07/31/14/59/creative-869200_1280.jpg"
        })

      } catch (err) {
        console.error('Error fetching about data:', err)
        setError('Failed to load about information')

        // Set fallback data
        setAboutData({
          title: "About Me",
          description: "A tech-savvy professional with over five years of experience developing unique, and standard web software solutions that are usable, interactive, reliable and scalable.",
          media_url: "https://cdn.pixabay.com/photo/2015/07/31/14/59/creative-869200_1280.jpg"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  const isVideoContent = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.endsWith('.mp4')
  }

  const getExcerpt = (description: string, maxLength: number = 300) => {
    // Get first paragraph or truncate if too long
    const firstParagraph = description.split('\n\n')[0] || description
    if (firstParagraph.length <= maxLength) return firstParagraph
    return firstParagraph.substring(0, maxLength).trim() + '...'
  }

  if (isLoading) {
    return (
      <section className="w-full bg-neutral-100 dark:bg-neutral-900 py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-neutral-300 dark:bg-neutral-700 rounded-lg h-80"></div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-300 dark:bg-neutral-700 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!aboutData) {
    return (
      <section className="w-full bg-neutral-100 dark:bg-neutral-900 py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <LucideIcons.AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Unable to load about information</h3>
          <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="about"
      className="w-full overflow-x-hidden bg-main dark:bg-neutral-900 transition-colors duration-300 py-20 px-6 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="w-8 h-px bg-accent mr-3"></span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              Get to know me </h2>
            <span className="w-8 h-px  bg-accent ml-3"></span>
          </div>
        </div>

        {/* Main About Content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Media Content */}
          <div className="w-full lg:w-1/2 animate-fade-in-up">
            <div className="relative group">
              {isVideoContent(aboutData.media_url) ? (
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-large">
                    {isVideoPlaying ? (
                      <iframe
                        src={aboutData.media_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src="https://cdn.pixabay.com/photo/2015/07/31/14/59/creative-869200_1280.jpg"
                          alt={aboutData.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                          >
                            <PlayCircleIcon className="w-12 h-12 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={aboutData.media_url}
                    alt={aboutData.title}
                    className="rounded-2xl shadow-large object-cover w-full aspect-[4/3] transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary  mb-6 leading-tight">
                {aboutData.title}
              </h2>

              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                <p className="text-primary text-lg leading-relaxed">
                  {getExcerpt(aboutData.description)}
                </p>
              </div>
            </div>



            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/about"
                className="group inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-primary-600 text-white text-lg font-semibold rounded-xl shadow-medium hover:shadow-large transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Learn More About Me
                <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-300 dark:border-primary text-primary dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-lg font-semibold rounded-xl transition-all duration-200"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-error/10 text-error rounded-lg text-sm border border-error/20">
              <LucideIcons.AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}