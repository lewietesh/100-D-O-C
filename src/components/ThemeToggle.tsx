'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon as MoonIconSolid, SunIcon as SunIconSolid } from '@heroicons/react/24/solid'

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const current = theme === 'system' ? systemTheme : theme
  const isDark = current === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className={`
        rounded-full p-2 transition duration-200
        ${isDark
          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
          : 'bg-gray-800 text-white hover:bg-gray-700'}
      `}
    >
      {isDark ? (
        <SunIconSolid className="h-5 w-5" />
      ) : (
        <MoonIconSolid className="h-5 w-5" />
      )}
    </button>
  )
}
