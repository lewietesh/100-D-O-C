import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
     './pages/**/*.{js,ts,jsx,tsx}',  // ADD THIS
  './*.{js,ts,jsx,tsx}', 
  ],

  
  theme: {
extend: {
  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  
  colors: {
    // Primary brand colors from your scheme
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d6fe',
      300: '#a5b8fc',
      400: '#8b93f8',
      500: '#3b82f6', 
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
      DEFAULT: '#3b82f6',
    },
    
    // Dark theme backgrounds
    dark: {
      primary: '#0f172a', // Your primary dark #0f172a
      secondary: '#1e293b', // Your secondary dark #1e293b
      tertiary: '#334155',
      accent: '#475569',
      DEFAULT: '#0f172a',
    },
    
    // Light theme colors
    light: {
      primary: '#ffffff',
      secondary: '#f8fafc', // Light text #f8fafc
      tertiary: '#f1f5f9',
      accent: '#e2e8f0',
      DEFAULT: '#f8fafc',
    },
    
    // Text colors
    text: {
      primary: '#f8fafc', // Light text for dark backgrounds
      secondary: '#64748b', // Muted text #64748b
      muted: '#64748b',
      inverse: '#0f172a', // Dark text for light backgrounds
      accent: '#3b82f6',
      DEFAULT: '#f8fafc',
    },
    
    // Success/Status colors
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Success green #10b981
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      DEFAULT: '#10b981',
    },
    
    // CTA Orange - 
    cta: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Vibrant orange that works with blue
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      DEFAULT: '#f97316',
      hover: '#ea580c',
      light: '#fed7aa',
    },
    
    // Warning colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      DEFAULT: '#f59e0b',
    },
    
    // Error colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      DEFAULT: '#ef4444',
    },
    
    // Border colors
    border: {
      light: '#e2e8f0',
      dark: '#334155',
      muted: '#475569',
      DEFAULT: '#334155',
    },
    
    // Legacy brand colors (keeping for compatibility)
    brand: {
      DEFAULT: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      faint: '#dbeafe',
      secondary: '#f97316', 
    },
    
    // Legacy accent colors
    accent: {
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
      light: '#dbeafe',
    },
    
    // Legacy surface colors
    surface: {
      light: '#ffffff',
      dark: '#1e293b',
    },
    
    // Legacy background colors
    background: {
      light: '#f8fafc',
      dark: '#0f172a',
    },
  },
  
  // Extended spacing for consistent layouts
  spacing: {
    '18': '4.5rem',
    '88': '22rem',
    '128': '32rem',
  },
  
  // Custom animations for smooth interactions
  animation: {
    'fade-in': 'fadeIn 0.5s ease-in-out',
    'slide-up': 'slideUp 0.3s ease-out',
    'slide-down': 'slideDown 0.3s ease-out',
    'scale-in': 'scaleIn 0.2s ease-out',
    'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'float-slow': 'floatSlow 20s ease-in-out infinite',
    'float-reverse': 'floatReverse 25s ease-in-out infinite',
    'float-gentle': 'floatGentle 15s ease-in-out infinite',
  },
  
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    pulseSubtle: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.8' },
    },
    floatSlow: {
      '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
      '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
      '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
    },
    floatReverse: {
      '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
      '33%': { transform: 'translate(-25px, 35px) rotate(-120deg)' },
      '66%': { transform: 'translate(25px, -25px) rotate(-240deg)' },
    },
    floatGentle: {
      '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
      '50%': { transform: 'translate(15px, -15px) scale(1.1)' },
    },
  },
  
  // Gradient utilities - THIS WAS MISSING
  backgroundImage: {
    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  },
  
  // Typography improvements
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
    'base': ['1rem', { lineHeight: '1.5rem' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
    'xl': ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  
  // Box shadows for depth
  boxShadow: {
    'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
    'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
    'cta-glow': '0 0 20px rgba(249, 115, 22, 0.15)',
  },
  
  // Border radius for consistent rounded corners
  borderRadius: {
    'none': '0px',
    'sm': '0.125rem',
    'DEFAULT': '0.375rem',
    'md': '0.5rem',
    'lg': '0.75rem',
    'xl': '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
  },
  
  // Blur utilities for better gradients
  blur: {
    'xs': '2px',
    'sm': '4px',
    'DEFAULT': '8px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    '2xl': '40px',
    '3xl': '64px',
  },

    },
  },
  plugins: [
function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}

export default config