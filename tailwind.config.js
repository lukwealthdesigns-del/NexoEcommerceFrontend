/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-orange': '#E8621A',
        dark: '#1A1A2E',
        light: '#FFF5EF',

      },
      fontFamily: {
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 1s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
      
    },
  },
  plugins: [],
  // darkMode: 'class',
}