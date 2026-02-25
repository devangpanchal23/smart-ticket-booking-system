/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#eaedf2',
          200: '#d5dee6', // Lighter slate
          300: '#b4c5d4',
          400: '#8faabf',
          500: '#6a89a7', // User color: Muted Blue
          600: '#54708a',
          700: '#425a6f',
          800: '#384959', // User color: Dark Slate
          900: '#2a3744',
          950: '#1a232c',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0f0fe',
          200: '#bdddfc', // User color: Pale Blue
          300: '#9ccef9',
          400: '#88bdf2', // User color: Sky Blue
          500: '#60a0d6',
          600: '#4a85b8',
          700: '#396f9e',
          800: '#6a89a7', // Linking brand dark to the muted blue
          900: '#1f4568',
        },
        accent: {
          500: '#6a89a7', // Using the Muted Blue as accent
          600: '#54708a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
