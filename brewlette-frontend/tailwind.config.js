/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        peach: "#FFD39A",
        purple: "#840150",
        cream: "#FFEBD1",
      },
      fontFamily: {
        luckiest: ["Luckiest Guy", "cursive"],
      },
    },
  },
  plugins: [],
};
