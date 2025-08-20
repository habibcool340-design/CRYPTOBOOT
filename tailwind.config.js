/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0e8bff" } },
      boxShadow: { glass: "0 10px 30px rgba(0,0,0,0.35)" }
    },
  },
  plugins: [],
};
