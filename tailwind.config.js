/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- DÒNG NÀY RẤT QUAN TRỌNG
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Thêm font chữ đẹp hơn
      },
    },
  },
  plugins: [],
}