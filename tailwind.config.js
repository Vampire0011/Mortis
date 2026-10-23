/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: '#0038FF', deep: '#001A99', lime: '#CCFF00', ink: '#0B0F1A', mist: '#F3F5FF' },
      fontFamily: { display: ['"Arial Black"', 'Impact', 'sans-serif'] },
    },
  },
  plugins: [],
}
