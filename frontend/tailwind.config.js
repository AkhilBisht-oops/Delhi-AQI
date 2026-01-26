/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#009966',
          moderate: '#ffde33',
          'unhealthy-sensitive': '#ff9933',
          unhealthy: '#cc0033',
          'very-unhealthy': '#660099',
          hazardous: '#7e0023'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}