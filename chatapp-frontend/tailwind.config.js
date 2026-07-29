/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E1420",
          900: "#141C2C",
          800: "#1C2740",
          700: "#283354",
          600: "#374468",
        },
        mist: {
          50: "#F5F7FB",
          100: "#EBEFF6",
          200: "#D9E0EC",
          300: "#B9C4DA",
        },
        signal: {
          DEFAULT: "#3E63DD",
          light: "#6E8CF0",
          dark: "#2C49AD",
        },
        ember: {
          DEFAULT: "#F0A63A",
          light: "#F6C067",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(6,10,20,0.35)",
      },
    },
  },
  plugins: [],
};
