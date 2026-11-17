// Konfetti-Explosion aus der Bildschirmmitte – reines CSS
import { useMemo, type CSSProperties } from 'react';

const COLORS = ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#facc15', '#06b6d4', '#ec4899'];
const SHAPES = ['⭐', '✨', '💖', '🎉'];

export function Confetti({ count = 120 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 160 + Math.random() * 420;
        return {
          id: i,
          color: COLORS[i % COLORS.length],
          w: 7 + Math.random() * 9,
          h: 9 + Math.random() * 12,
          delay: Math.random() * 0.25,
          dur: 1.4 + Math.random() * 1.4,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist + 180,
          rot: (Math.random() - 0.5) * 1440,
          emoji: i % 9 === 0 ? SHAPES[i % SHAPES.length] : null,
          round: Math.random() > 0.6,
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-[45%] flex animate-confetti-burst items-center justify-center text-xl"
          style={
            {
              width: p.emoji ? 'auto' : p.w,
              height: p.emoji ? 'auto' : p.round ? p.w : p.h,
              background: p.emoji ? 'none' : p.color,
              borderRadius: p.round ? '9999px' : '3px',
              '--delay': `${p.delay}s`,
              '--dur': `${p.dur}s`,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--rot': `${p.rot}deg`,
              opacity: 0,
            } as CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
