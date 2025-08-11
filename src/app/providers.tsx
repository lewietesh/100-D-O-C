//src/app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '@/app//context/ToastContext';
import { DataProvider } from './context/DataContext';
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
    <ThemeProvider
      attribute="class"     // ✅ applies 'dark' class to <html>
      defaultTheme="system" // ✅ follow system preference first
      enableSystem
    >
      <ToastProvider>

        {children}
      </ToastProvider>

    </ThemeProvider>
    </DataProvider>
  )
}
