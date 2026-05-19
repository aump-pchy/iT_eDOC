export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mitr', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          950: '#16080e',
          800: '#6d0d30',
          700: '#a0163f',
          600: '#c94070',
          100: '#f0c8d8',
          50:  '#faf0f3',
        },
      },
    },
  },
  plugins: [],
}