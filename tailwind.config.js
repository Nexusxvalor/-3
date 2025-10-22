/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // New fonts
        body: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
        // Keep "comic" class mapped in CSS to Poppins (not Comic Neue)
      },
      colors: {
        rosey: {
          50: '#fff1f7',
          100: '#ffe4ef',
          200: '#ffc9de',
          300: '#ff9fc4',
          400: '#ff76ac',
          500: '#ff4a92',
        },
      },
    },
  },
  plugins: [],
};