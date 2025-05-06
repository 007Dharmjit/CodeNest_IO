/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        comfortaa: ["Comfortaa", "cursive"],
        cursive: ["cursive", "serif"],
      },
    },
  },
  plugins: [],
};
