/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          50: '#1a1a1a',
          100: '#2d2d2d',
          200: '#3d3d3d',
          300: '#4d4d4d',
          400: '#5d5d5d',
          500: '#6d6d6d',
          600: '#7d7d7d',
          700: '#8d8d8d',
          800: '#9d9d9d',
          900: '#adadad',
        }
      }
    },
  },
  plugins: [],
}
