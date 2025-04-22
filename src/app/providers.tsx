'use client'

import { ThemeProvider } from 'next-themes'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"     // ✅ applies 'dark' class to <html>
      defaultTheme="system" // ✅ follow system preference first
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}
