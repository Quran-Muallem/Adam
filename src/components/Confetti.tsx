// Konfetti-Regen – reines CSS, keine Bibliothek
import { useMemo, type CSSProperties } from 'react';

const COLORS = ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#facc15', '#06b6d4'];

export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 160,
        round: Math.random() > 0.6,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.round ? p.w : p.h,
              background: p.color,
              borderRadius: p.round ? '9999px' : '2px',
              '--delay': `${p.delay}s`,
              '--dur': `${p.dur}s`,
              '--drift': `${p.drift}px`,
              opacity: 0,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
