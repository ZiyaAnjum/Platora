/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#24301F',
        paper: '#FAF6EE',
        linen: '#F1EAD9',
        forest: '#3C5233',
        'forest-dark': '#2A3A24',
        brass: '#B98B2A',
        brick: '#9C4B3F',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Public Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        docket: '0 1px 2px rgba(36, 48, 31, 0.06), 0 8px 24px rgba(36, 48, 31, 0.10)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.25s ease-out',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
