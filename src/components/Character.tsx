// Spielfiguren als eigenes SVG (keine externen Grafiken nötig)
import type { Dir } from '../types';
import { DIR_ANGLE } from '../engine/world';

interface Props {
  kind: 'monster' | 'robot';
  dir: Dir;
  mood: 'happy' | 'sad' | 'normal';
}

export function Character({ kind, dir, mood }: Props) {
  return (
    <div className="relative h-full w-full">
      {kind === 'monster' ? <Monster dir={dir} mood={mood} /> : <Robot mood={mood} />}
      {kind === 'robot' && <DirectionArrow dir={dir} />}
    </div>
  );
}

/** Pfeil um die Figur herum, der die Blickrichtung zeigt (wichtig für Drehen & Springen) */
function DirectionArrow({ dir }: { dir: Dir }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${DIR_ANGLE[dir]}deg)` }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <polygon points="96,50 80,38 80,62" fill="#facc15" stroke="#78350f" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Monster({ dir, mood }: { dir: Dir; mood: Props['mood'] }) {
  const flip = dir === 'left' ? -1 : 1;
  const lookY = dir === 'up' ? -3 : dir === 'down' ? 3 : 0;
  const lookX = dir === 'left' || dir === 'right' ? 3 : 0;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md" style={{ transform: `scaleX(${flip})` }}>
      {/* Füßchen */}
      <ellipse cx="35" cy="88" rx="10" ry="6" fill="#15803d" />
      <ellipse cx="65" cy="88" rx="10" ry="6" fill="#15803d" />
      {/* Hörner */}
      <path d="M28 26 L22 8 L38 20 Z" fill="#fde047" stroke="#a16207" strokeWidth="2" />
      <path d="M72 26 L78 8 L62 20 Z" fill="#fde047" stroke="#a16207" strokeWidth="2" />
      {/* Körper */}
      <ellipse cx="50" cy="55" rx="38" ry="34" fill="#22c55e" stroke="#166534" strokeWidth="3" />
      <ellipse cx="50" cy="66" rx="22" ry="16" fill="#86efac" />
      {/* Augen */}
      <circle cx="37" cy="44" r="10" fill="#fff" stroke="#166534" strokeWidth="2" />
      <circle cx="63" cy="44" r="10" fill="#fff" stroke="#166534" strokeWidth="2" />
      <circle cx={37 + lookX} cy={44 + lookY} r="4.5" fill="#111827" />
      <circle cx={63 + lookX} cy={44 + lookY} r="4.5" fill="#111827" />
      {/* Mund */}
      {mood === 'sad' ? (
        <path d="M38 70 Q50 60 62 70" fill="none" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d="M34 60 Q50 80 66 60 Z" fill="#7f1d1d" stroke="#14532d" strokeWidth="3" strokeLinejoin="round" />
      )}
      {mood !== 'sad' && <path d="M42 62 L46 67 L50 62" fill="#fff" />}
    </svg>
  );
}

function Robot({ mood }: { mood: Props['mood'] }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
      {/* Antenne */}
      <line x1="50" y1="20" x2="50" y2="8" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="8" r="6" fill={mood === 'sad' ? '#ef4444' : '#f43f5e'} className="animate-twinkle" />
      {/* Kopf */}
      <rect x="20" y="20" width="60" height="44" rx="14" fill="#e2e8f0" stroke="#334155" strokeWidth="3" />
      <rect x="28" y="28" width="44" height="26" rx="9" fill="#0f172a" />
      {/* Augen */}
      {mood === 'sad' ? (
        <>
          <path d="M34 44 L46 38" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <path d="M54 38 L66 44" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="40" cy="41" r="6" fill="#38bdf8" />
          <circle cx="60" cy="41" r="6" fill="#38bdf8" />
          <circle cx="42" cy="39" r="2" fill="#fff" />
          <circle cx="62" cy="39" r="2" fill="#fff" />
        </>
      )}
      {/* Körper */}
      <rect x="30" y="64" width="40" height="22" rx="7" fill="#f97316" stroke="#334155" strokeWidth="3" />
      <circle cx="50" cy="75" r="5" fill="#fde047" />
      {/* Räder */}
      <circle cx="34" cy="90" r="6" fill="#334155" />
      <circle cx="66" cy="90" r="6" fill="#334155" />
    </svg>
  );
}
