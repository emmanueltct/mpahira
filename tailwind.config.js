module.exports = {
  theme: {
    extend: {
      animation: {
        slide: 'slide 16s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0%)' },
          '25%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(-200%)' },
          '75%': { transform: 'translateX(-300%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
