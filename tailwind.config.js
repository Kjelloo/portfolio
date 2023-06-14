/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing: {
        'underline-gap': '0.25rem'  // Adjust as needed
      },
      inset: {
        '1/2': '50%',
      },
      keyframes: {
        'slide-in-bck-center': {
          '0%': {transform: 'translateZ(-800px)', opacity: 0},
          '100%': {transform: 'translateZ(0)', opacity: 1}
        },
      },
      animation: {
        'slide-in-bck-center': 'slide-in-bck-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
      },
    }
  },
  plugins: [],
  variants: {
    extend: {
      textDecoration: ['hover'],
    },
    backgroundColor: ['active'],
  },
}
