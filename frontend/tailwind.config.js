/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Telegram-inspired color palette
        telegram: {
          blue: '#2481cc',
          'blue-dark': '#1f7abf',
          'blue-light': '#5ba0d0',
          green: '#3ec969',
          red: '#e74c3c',
          grey: '#a8a8a8',
          'grey-light': '#f4f4f5',
          'grey-dark': '#17212b',
          white: '#ffffff',
          black: '#000000',
        },
        primary: {
          50: '#e8f4fd',
          100: '#d1e9fb',
          200: '#a3d3f7',
          300: '#75bdf3',
          400: '#47a7ef',
          500: '#2481cc', // Telegram blue
          600: '#1f6ba8',
          700: '#1a5584',
          800: '#153f60',
          900: '#0f293c',
          950: '#0a1318',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3ec969', // Telegram green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#e74c3c', // Telegram red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        bubble: {
          out: '#2481cc', // Outgoing message (teacher/self)
          in: '#f4f4f5', // Incoming message (student/other)
          'out-dark': '#2b5278',
          'in-dark': '#212121',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'telegram': '0 1px 2px 0 rgba(16, 35, 47, 0.15)',
        'telegram-hover': '0 2px 4px 0 rgba(16, 35, 47, 0.2)',
        'card': '0 0.5px 1px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'message': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'telegram': '12px',
        'bubble': '18px',
        'message': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
