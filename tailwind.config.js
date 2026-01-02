export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dosto: {
          dark: '#1a1a1a',
          sepia: '#704214',
          paper: '#f5f5dc',
          accent: '#8b0000',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

