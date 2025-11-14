/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
        gold: "#C6A667",
        brown: "#3E3228",
        mocha: "#8B796A",
        tan: "#A08C7D",
        cream: "#F7F3ED",
        black: "#111111",
        },
        background: "#FFFDF9", // trắng ngà sang trọng
        text: "#1A1A1A", // chữ đen nhạt tinh tế
        primary: "#8B4513", // nâu da bò - cảm giác thủ công, Việt Nam
        accent: "#E6B325", // vàng ánh kim điểm nhấn
        muted: "#D9CBA3", // vàng nhạt dịu
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
