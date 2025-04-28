'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import codeAnimation from '@/assets/lottie/code.json'
import type { Link, Stat } from '@/types/global'

// Dynamically import Lottie to avoid SSR crash
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function Hero({
  title,
  subtitle,
  links = [],
  stats = [],
}: {
  title: string
  subtitle: string
  links?: Link[]
  stats?: Stat[]
}) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true) // Render Lottie only on the client
  }, [])

  return (
    <section className="relative w-full isolate overflow-hidden bg-background-light dark:bg-background-dark py-20 sm:py-28">
      {/* 🌆 Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1590658093848-f6f0df47b853?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Code background"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/70 dark:from-black/80 dark:to-black/80" />
      </div>

      {/* ✨ Lottie Animation */}
      {showAnimation && (
        <div className="absolute bottom-0 right-0 w-64 sm:w-80 opacity-80 pointer-events-none z-0">
          <Lottie animationData={codeAnimation} loop autoplay />
        </div>
      )}

      {/* 📣 Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white motion-safe:animate-fade-in-down">
          {title}
        </h1>

        <p
          className="mt-4 text-base sm:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto motion-safe:animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          {subtitle}
        </p>

        {links.length > 0 && (
          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '0.6s' }}
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="inline-flex items-center justify-center rounded-md bg-cta text-white hover:bg-accent px-5 py-2 text-sm font-semibold transition motion-safe:animate-fade-in-up"
                style={{ animationDelay: '0.9s' }}
              >
                {link.name} →
              </a>
            ))}
          </div>
        )}

        {stats.length > 0 && (
          <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 text-white text-sm sm:text-base">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse items-center gap-1">
                <dt className="text-gray-300">{stat.name}</dt>
                <dd className="text-2xl sm:text-3xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
