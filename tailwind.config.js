/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', '"Baloo 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'confetti-burst': {
          '0%': { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg) scale(0.4)', opacity: '1' },
          '35%': { opacity: '1' },
          '100%': {
            transform: 'translate(-50%,-50%) translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1)',
            opacity: '0',
          },
        },
        wiggle: { '0%, 100%': { transform: 'rotate(-4deg)' }, '50%': { transform: 'rotate(4deg)' } },
        wobble: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '25%': { transform: 'rotate(-8deg) translateY(-6%)' },
          '75%': { transform: 'rotate(8deg) translateY(-6%)' },
        },
        boing: {
          '0%': { transform: 'scale(1,1)' },
          '20%': { transform: 'scale(1.35,0.65)' },
          '40%': { transform: 'scale(0.8,1.2)' },
          '60%': { transform: 'scale(1.12,0.9)' },
          '80%': { transform: 'scale(0.96,1.04)' },
          '100%': { transform: 'scale(1,1)' },
        },
        'happy-hop': {
          '0%, 100%': { transform: 'translateY(0) scale(1,1)' },
          '10%': { transform: 'translateY(0) scale(1.15,0.85)' },
          '45%': { transform: 'translateY(-38%) scale(0.92,1.1)' },
          '80%': { transform: 'translateY(0) scale(1.1,0.9)' },
        },
        hop: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-50%) scale(1.2)' },
        },
        breathe: { '0%, 100%': { transform: 'scale(1,1)' }, '50%': { transform: 'scale(1.03,0.97)' } },
        blink: { '0%, 92%, 100%': { transform: 'scaleY(1)' }, '95%': { transform: 'scaleY(0.1)' } },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8%)' } },
        twinkle: { '0%, 100%': { opacity: '0.25', transform: 'scale(0.8)' }, '50%': { opacity: '1', transform: 'scale(1.2)' } },
        firefly: {
          '0%': { transform: 'translate(0,0)', opacity: '0' },
          '15%': { opacity: '1' },
          '50%': { transform: 'translate(var(--fx), var(--fy))', opacity: '0.9' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translate(0,0)', opacity: '0' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '15%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-110vh) scale(1.1)', opacity: '0' },
        },
        'gold-pulse': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 4px #fde047, 0 0 30px 10px rgba(253,224,71,1)' },
          '100%': { transform: 'scale(1.035)', boxShadow: '0 0 0 4px #fde047, 0 0 14px 4px rgba(253,224,71,0.6)' },
        },
        'portal-spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'teleport-out': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(0.1) rotate(540deg)', opacity: '0' },
        },
        'teleport-in': {
          '0%': { transform: 'scale(0.1) rotate(-540deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'translateY(30px) scale(0.8)', opacity: '0' },
          '60%': { transform: 'translateY(-6px) scale(1.04)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'confetti-burst': 'confetti-burst var(--dur) cubic-bezier(.1,.8,.3,1) var(--delay) forwards',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        wobble: 'wobble var(--wob, 0.45s) ease-in-out',
        boing: 'boing 0.7s ease-out',
        'happy-hop': 'happy-hop 0.7s ease-in-out infinite',
        hop: 'hop var(--hop-dur, 0.5s) ease-in-out',
        breathe: 'breathe 2.6s ease-in-out infinite',
        blink: 'blink 4s ease-in-out infinite',
        shake: 'shake 0.45s ease-in-out',
        pop: 'pop 0.45s ease-out both',
        float: 'float 3s ease-in-out infinite',
        twinkle: 'twinkle 2.4s ease-in-out infinite',
        firefly: 'firefly var(--dur, 8s) ease-in-out var(--delay, 0s) infinite',
        rise: 'rise var(--dur, 10s) linear var(--delay, 0s) infinite',
        'gold-pulse': 'gold-pulse var(--pulse, 0.6s) ease-out',
        'portal-spin': 'portal-spin 3s linear infinite',
        'teleport-out': 'teleport-out var(--tp, 0.4s) ease-in forwards',
        'teleport-in': 'teleport-in var(--tp, 0.4s) ease-out',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(.34,1.56,.64,1) both',
      },
    },
  },
  plugins: [],
};
