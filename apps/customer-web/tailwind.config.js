/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cineva: {
          bg: '#050505',
          'bg-secondary': '#0B0B0B',
          surface: '#111111',
          elevated: '#181818',
          card: '#141414',
          orange: '#FF6500',
          'orange-hover': '#FF7A1A',
          amber: '#B94700',
          'amber-hover': '#CE5200',
          'text-primary': '#FFFFFF',
          'text-secondary': '#A0A0A0',
          'text-muted': '#707070',
          border: '#222222',
          'border-subtle': 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 24px -4px rgba(255, 101, 0, 0.35)',
        'glow-orange-sm': '0 0 12px -2px rgba(255, 101, 0, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'elevated-xl': '0 24px 60px -12px rgba(0, 0, 0, 0.95)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      transitionTimingFunction: {
        'cinema-in-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
