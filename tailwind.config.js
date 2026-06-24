/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F', // Deep Navy
          light: '#112240',
        },
        accent: {
          DEFAULT: '#D4AF37', // Gold
          light: '#F3E5AB',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
