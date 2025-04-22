import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], // if using Inter from next/font
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
   
      colors: {
        brand: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#4338CA',
          faint: '#EEF2FF',
          secondary:'#E76F51',

        },
        accent: {
          DEFAULT: '#22D3EE',
          dark: '#06B6D4',
          light: '#CFFAFE',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        background: {
          light: '#F9FAFB',
          dark: '#0F172A',
        },
        text: {
          light: '#111827',
          dark: '#F3F4F6',
          secondary: '#6B7280',
        },
        border: {
          light: '#E5E7EB',
          dark: '#334155',
        },
        cta: {
          DEFAULT: '#10B981',
          dark: '#34D399',
          hover: '#059669',
        },
      },
      
    
    },
  },
  plugins: [],
}
export default config;
