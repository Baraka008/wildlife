/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        savannah: '#f8d36a',
        grass: '#22c55e',
        earth: '#7b5e3f',
        water: '#38bdf8',
        sky: '#dbeafe',
        forest: '#0d4d38',
        sunset: '#fb923c',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(17, 24, 39, 0.12)',
      },
    },
  },
  plugins: [],
};
