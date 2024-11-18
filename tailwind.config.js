/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#2563EB',
        background: '#FFFFFF',
        foreground: '#0F172A',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F8FAFC',
          foreground: '#64748B',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#F8FAFC',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
