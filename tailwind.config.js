/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1.25': '0.3125rem',  // Tương đương 5px
        '1/2': '50%', // Thêm giá trị 50% vào thang đo spacing
      }
    }
  },
  plugins: [],
}
