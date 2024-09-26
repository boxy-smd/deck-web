import tailwindcssTypography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        deck: {
          darkest: '#1F002E',
          dark: '#3F344C',
          placeholder: '#70677B',
          'secondary-text': '#3C3544',
          border: '#D0CBE1',
          'bg-button': '#E5E2E8',
          'clear-hover': '#F0ECF3',
          bg: '#F8FAFC',
          'bg-hover': '#DBDADC',
          'clear-tone': '#F1F3F9',
          'purple-icon': '#8B00D0',
          'red-icon': '#D41919',
          'blue-icon': '#0581C4',
          'orange-icon': '#E99700',
          'green-icon': '#5BAD5E',
          'purple-text': '#7D00B3',
          'red-text': '#980C0C',
          'blue-text': '#00426E',
          'orange-text': '#8A3500',
          'green-text': '#007F05',
          'purple-bg': '#EEE1F3',
          'red-bg': '#FFE5E8',
          'blue-bg': '#D9F2FF',
          'orange-bg': '#F5E9DB',
          'green-bg': '#E3F1E9',
          red: '#D41919',
          'red-dark': '#980C0C',
          'red-light': '#FFE5E8',
          blue: '#0581C4',
          'blue-dark': '#00426E',
          'blue-light': '#D9F2FF',
          orange: '#E99700',
          'orange-dark': '#8A3500',
          'orange-light': '#F5E9DB',
          green: '#5BAD5E',
          'green-dark': '#007F05',
          'green-light': '#E3F1E9',
          purple: '#8B00D0',
          'purple-dark': '#7D00B3',
          'purple-light': '#EEE1F3',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config

export default config
