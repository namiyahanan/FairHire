/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0C1E3C',
          800: '#0A2540',
          700: '#13355C',
          600: '#1E4670',
          100: '#EBF2FA',
          50: '#F4F7FC',
        },
        teal: {
          600: '#008487',
          500: '#00A3A6',
          400: '#00B4D8',
          100: '#E0F7F8',
          50: '#F0FAF8',
        },
        surface: {
          bg: '#F8FAFC',
          card: 'rgba(255, 255, 255, 0.95)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 37, 64, 0.05), 0 2px 6px -1px rgba(10, 37, 64, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(10, 37, 64, 0.1), 0 4px 12px -2px rgba(10, 37, 64, 0.05)',
      }
    },
  },
  plugins: [],
}
