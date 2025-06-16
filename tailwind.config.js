module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      colors: {
        pepper: {
          orange: '#fca311',
          gray: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
