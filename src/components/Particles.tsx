// Lebendige Hintergrund-Partikel: Glühwürmchen, Blasen oder Sternenstaub
import { useMemo, type CSSProperties } from 'react';

interface Props {
  kind: 'fireflies' | 'bubbles' | 'stars';
  count?: number;
}

export function Particles({ kind, count = 22 }: Props) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 47 + 13) % 100,
        top: (i * 31 + 7) % 100,
        size: kind === 'bubbles' ? 6 + ((i * 7) % 16) : kind === 'stars' ? 2 + (i % 3) : 4 + (i % 4),
        dur: 6 + ((i * 13) % 9),
        delay: -((i * 1.7) % 10),
        fx: ((i % 5) - 2) * 18,
        fy: (((i * 3) % 5) - 2) * 18,
      })),
    [count, kind],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Sanfte Lichtkegel für Tiefe */}
      <div className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-2/3 w-2/3 rounded-full bg-yellow-200/10 blur-3xl" />
      {items.map((p) => {
        const style = {
          left: `${p.left}%`,
          top: kind === 'bubbles' ? '100%' : `${p.top}%`,
          width: p.size,
          height: p.size,
          '--dur': `${p.dur}s`,
          '--delay': `${p.delay}s`,
          '--fx': `${p.fx}px`,
          '--fy': `${p.fy}px`,
          animationDelay: `${p.delay}s`,
        } as CSSProperties;
        if (kind === 'fireflies')
          return (
            <span
              key={p.id}
              className="absolute animate-firefly rounded-full bg-yellow-200"
              style={{ ...style, boxShadow: '0 0 10px 4px rgba(253,224,71,.75), 0 0 22px 8px rgba(190,242,100,.35)' }}
            />
          );
        if (kind === 'bubbles')
          return (
            <span
              key={p.id}
              className="absolute animate-rise rounded-full border-2 border-white/70 bg-white/20"
              style={{ ...style, boxShadow: 'inset -2px -2px 4px rgba(255,255,255,.6)' }}
            />
          );
        return (
          <span
            key={p.id}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{ ...style, boxShadow: '0 0 6px 2px rgba(255,255,255,.7)' }}
          />
        );
      })}
    </div>
  );
}
