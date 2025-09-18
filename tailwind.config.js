/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f0',
          100: '#e6e6d9',
          200: '#d4d4c2',
          300: '#c2c2ab',
          400: '#b0b094',
          500: '#9e9e7d',
          600: '#8c8c66',
          700: '#7a7a4f',
          800: '#686838',
          900: '#565621',
        },
        brown: {
          50: '#f7f3f0',
          100: '#ede1d8',
          200: '#dcc3b0',
          300: '#cba588',
          400: '#ba8760',
          500: '#a96938',
          600: '#8b5a2f',
          700: '#6d4b26',
          800: '#4f3c1d',
          900: '#312d14',
        },
        beige: {
          50: '#fefcf9',
          100: '#fdf7f0',
          200: '#fbe8d6',
          300: '#f9d9bc',
          400: '#f7caa2',
          500: '#f5bb88',
          600: '#d4a06e',
          700: '#b38554',
          800: '#926a3a',
          900: '#714f20',
        },
        purple: {
          50: '#f3f0ff',
          100: '#e6dfff',
          200: '#cdbfff',
          300: '#b49fff',
          400: '#9b7fff',
          500: '#825fff',
          600: '#6b4fcc',
          700: '#543f99',
          800: '#3d2f66',
          900: '#261f33',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
      }
    },
  },
  plugins: [],
}
