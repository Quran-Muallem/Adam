/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', '"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'confetti-fall': {
          '0%': { transform: 'translate3d(0,-10vh,0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate3d(var(--drift),110vh,0) rotate(720deg)', opacity: '0.9' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        hop: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-45%) scale(1.2)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'confetti-fall': 'confetti-fall var(--dur) linear var(--delay) forwards',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        shake: 'shake 0.45s ease-in-out',
        pop: 'pop 0.45s ease-out both',
        float: 'float 2.4s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        hop: 'hop var(--hop-dur, 0.5s) ease-in-out',
      },
    },
  },
  plugins: [],
};
