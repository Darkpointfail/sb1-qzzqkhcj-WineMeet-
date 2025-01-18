/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#faf5f6',
          100: '#f4eaec',
          200: '#e8d5da',
          300: '#d4b3bc',
          400: '#ba8c99',
          500: '#a06d7c',
          600: '#8b5465',
          700: '#744353',
          800: '#633a47',
          900: '#56333f',
          950: '#2d1b21',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};