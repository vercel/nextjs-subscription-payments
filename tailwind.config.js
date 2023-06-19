const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#181A1E",
        success: "#41f1b6",
        warning: "#ffbb55",
        danger: "#ff7782",
        sidebar: "#181a1e",
        sidebar2: "#2B2D31",
        input: "#383A40",
        outsider: "#202528",
        logoColor: "#33BBCF",
    },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};
