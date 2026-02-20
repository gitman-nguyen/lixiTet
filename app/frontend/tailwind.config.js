/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tetRed: '#991b1b',
        tetGold: '#fbbf24',
      },
    },
  },
  plugins: [],
}
