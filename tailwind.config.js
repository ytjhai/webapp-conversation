/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      colors: {
        gray: {
          50: '#f7f7f7',
          100: '#EFEFEF',
          200: '#E6E6E6',
          300: '#D1D1D1',
          400: '#ADADAD',
          500: '#8C8C8C',
          700: '#464646',
          800: '#333333',
          900: '#111111',
        },
        // translated using base brand color of #000000
        // Using https://m2.material.io/design/color/the-color-system.html
        primary: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#d9d9d9',
          300: '#c4c4c4',
          600: '#555555',
          700: '#464646',
        },
        blue: {
          500: '#E1EFFE',
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',

        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
        purple: {
          50: '#F6F5FF',
        },
        indigo: {
          25: '#F5F8FF',
          100: '#E0EAFF',
          600: '#444CE7',
        },
      },
      screens: {
        mobile: '100px',
        // => @media (min-width: 100px) { ... }
        tablet: '640px', // 391
        // => @media (min-width: 600px) { ... }
        pc: '769px',
        // => @media (min-width: 769px) { ... }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}
