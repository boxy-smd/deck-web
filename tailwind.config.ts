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
          placeholder: '#70677B',
          'secondary-text': '#3C3544',
          border: '#D0CBE1',
          button: '#E5E2E8',
          background: '#F8FAFC',
          'background-hover': '#DBDADC',
          'clear-tone': '#F1F3F9',
          'clear-hover': '#F0ECF3',
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
