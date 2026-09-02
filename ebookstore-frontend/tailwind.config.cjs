/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', hover: '#4338ca', light: '#eef2ff' },
        accent:  { DEFAULT: '#f59e0b', hover: '#d97706' }
      }
    }
  },
  plugins: []
}
