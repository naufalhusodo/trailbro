/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brake: '#ef4444',
        throttle: '#22c55e',
        steering: '#3b82f6',
      },
    },
  },
  plugins: [],
}

