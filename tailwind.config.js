/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./newComponents/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#6d6d6d",
        normal: "#393939",
        dark: "#1F1F1F",
        tertiary: "#F2B203",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0C5110",
          secondary: "#E8BF29",
          accent: "#FCF8E9",
          neutral: "#313632",
          tile: "#e3e8e3",
          "base-100": "#FFFFFF",
          info: "#A3A6A4",
          success: "#3A9F59",
          warning: "#F39930",
          error: "#B00020",
          "base-200": "#edebeb",
        },
      },
    ],
  },
};
