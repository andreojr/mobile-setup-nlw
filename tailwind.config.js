/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#000',
      },
      fontFamily: {
        regular: 'Poppins_400Regular',
        semibold: 'Poppins_600SemiBold',
        extrabold: 'Poppins_800ExtraBold',
      },
    },
  },
  plugins: [],
}

