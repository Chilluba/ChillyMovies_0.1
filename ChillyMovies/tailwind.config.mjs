/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121416',
        primary: '#2c3135',
        secondary: '#40484f',
        accent: '#dce8f3',
        text: {
          primary: '#ffffff',
          secondary: '#a2abb3'
        }
      }
    },
  },
  plugins: [],
}
