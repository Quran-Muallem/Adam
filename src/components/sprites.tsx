// ─────────────────────────────────────────────────────────────
// SPRITE-BIBLIOTHEK: handgezeichnete Casual-Game-Grafiken als SVG
// (statt System-Emojis) – mit Farbverläufen, Glanzlichtern und
// dicken Cartoon-Outlines. Alle Sprites: viewBox 0 0 64 64.
//   <Sprite name="meteor" />  ·  <Sprite name="lantern" className="h-10 w-10" />
// ─────────────────────────────────────────────────────────────
import { useId, type ReactNode } from 'react';

export type SpriteName =
  // Spielfeld
  | 'tree' | 'rock' | 'strawberry' | 'berry'
  | 'palm' | 'barrel' | 'treasure' | 'gem'
  | 'meteor' | 'crate' | 'trophy' | 'star'
  | 'tower' | 'barrier' | 'disk' | 'battery'
  | 'icecube' | 'crystal' | 'qcore' | 'spark'
  | 'key' | 'gate' | 'bear' | 'lock'
  // Saison & Feste
  | 'moon' | 'lantern' | 'date' | 'baklava' | 'sheep' | 'pumpkin' | 'bat' | 'gift' | 'candycane'
  | 'xmastree' | 'snowflake' | 'firework' | 'egg' | 'blossom' | 'sunny' | 'leaf' | 'garland'
  // Deko & Embleme
  | 'mushroom' | 'cloud' | 'planet' | 'rocket' | 'robot' | 'atom' | 'skyline' | 'ship' | 'chest' | 'train';

const O = '#1d1530'; // Outline
const SW = 3;

/** Verlauf von oben nach unten */
function Lg({ id, c }: { id: string; c: [string, string] | [string, string, string] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      {c.map((col, i) => (
        <stop key={i} offset={c.length === 2 ? i : i / 2} stopColor={col} />
      ))}
    </linearGradient>
  );
}
function Rg({ id, c }: { id: string; c: [string, string] }) {
  return (
    <radialGradient id={id} cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor={c[0]} />
      <stop offset="1" stopColor={c[1]} />
    </radialGradient>
  );
}
/** Glanzlicht oben links */
const Shine = ({ x, y, rx, ry, rot = -20 }: { x: number; y: number; rx: number; ry: number; rot?: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity="0.65" transform={`rotate(${rot} ${x} ${y})`} />
);

type Draw = (u: (s: string) => string) => ReactNode;

const S: Record<SpriteName, Draw> = {
  // ═════ Zauberwald ═════
  tree: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#86efac', '#16a34a', '#14532d']} />
        <Lg id={u('b')} c={['#b45309', '#78350f']} />
      </defs>
      <rect x="27" y="40" width="10" height="18" rx="3" fill={`url(#${u('b')})`} stroke={O} strokeWidth={SW} />
      <path d="M32 4 C14 8 6 22 10 34 C6 44 18 50 32 47 C46 50 58 44 54 34 C58 22 50 8 32 4Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="22" cy="28" r="3.2" fill="#ef4444" stroke={O} strokeWidth="1.5" />
      <circle cx="40" cy="34" r="3.2" fill="#ef4444" stroke={O} strokeWidth="1.5" />
      <circle cx="35" cy="18" r="3" fill="#f43f5e" stroke={O} strokeWidth="1.5" />
      <Shine x={22} y={15} rx={8} ry={4} />
    </>
  ),
  rock: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#e2e8f0', '#94a3b8', '#475569']} />
      </defs>
      <path d="M8 50 L14 28 L28 16 L44 20 L56 34 L58 50 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M28 16 L30 34 L14 28 M30 34 L56 34" fill="none" stroke="#64748b" strokeWidth="2" />
      <path d="M12 50 Q20 44 28 50" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
      <Shine x={24} y={24} rx={6} ry={3} />
    </>
  ),
  strawberry: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#fb7185', '#be123c']} />
      </defs>
      <path d="M32 58 C14 50 8 32 14 22 C20 14 44 14 50 22 C56 32 50 50 32 58Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M20 16 L26 6 L32 13 L38 6 L44 16 L32 20 Z" fill="#22c55e" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      {[[22, 28], [32, 26], [42, 28], [26, 38], [38, 38], [32, 47]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.4" fill="#fde68a" />
      ))}
      <Shine x={22} y={24} rx={5} ry={3} />
    </>
  ),
  berry: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#a5b4fc', '#3730a3']} />
      </defs>
      {[[22, 38], [42, 38], [32, 24]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="13" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
          <ellipse cx={x - 4} cy={y - 5} rx="4" ry="2.4" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <path d="M32 11 Q36 4 44 6" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  mushroom: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#f0abfc', '#c026d3']} />
      </defs>
      <path d="M24 34 L22 56 L42 56 L40 34Z" fill="#fef3c7" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M6 36 C6 14 58 14 58 36 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="20" cy="27" r="4" fill="#fff" />
      <circle cx="36" cy="22" r="5" fill="#fff" />
      <circle cx="48" cy="30" r="3" fill="#fff" />
    </>
  ),
  bear: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#d6a77a', '#7c4a24']} />
      </defs>
      <circle cx="16" cy="18" r="8" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <circle cx="48" cy="18" r="8" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <ellipse cx="32" cy="36" rx="23" ry="21" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <ellipse cx="32" cy="44" rx="10" ry="7" fill="#f5deb3" stroke={O} strokeWidth="2" />
      <ellipse cx="32" cy="40" rx="3.5" ry="2.5" fill={O} />
      <path d="M20 32 Q24 35 28 32 M36 32 Q40 35 44 32" fill="none" stroke={O} strokeWidth="2.5" strokeLinecap="round" />
      <text x="46" y="14" fontSize="11" fontWeight="900" fill="#e0e7ff" stroke={O} strokeWidth="0.8">z</text>
    </>
  ),
  // ═════ Kristall-Lagune ═════
  palm: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#4ade80', '#15803d']} />
        <Lg id={u('b')} c={['#d97706', '#92400e']} />
      </defs>
      <path d="M30 24 Q26 42 30 60 L38 60 Q34 42 36 24Z" fill={`url(#${u('b')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {['M33 22 Q14 8 4 22 Q18 16 33 24', 'M33 22 Q52 8 60 22 Q46 16 33 24', 'M33 22 Q22 26 14 40 Q26 28 33 24', 'M33 22 Q46 26 52 40 Q40 28 33 24', 'M33 22 Q32 6 40 2 Q36 12 34 22'].map((d, i) => (
        <path key={i} d={d} fill={`url(#${u('a')})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      ))}
      <circle cx="30" cy="25" r="3.5" fill="#78350f" stroke={O} strokeWidth="1.5" />
      <circle cx="37" cy="26" r="3.5" fill="#78350f" stroke={O} strokeWidth="1.5" />
    </>
  ),
  barrel: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#f59e0b', '#b45309', '#78350f']} />
      </defs>
      <path d="M14 10 Q8 32 14 54 L50 54 Q56 32 50 10 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M11 22 L53 22 M11 42 L53 42" stroke="#475569" strokeWidth="5" />
      <path d="M11 22 L53 22 M11 42 L53 42" stroke="#94a3b8" strokeWidth="2" />
      <path d="M26 12 L25 52 M38 12 L39 52" stroke="#92400e" strokeWidth="1.5" />
      <Shine x={20} y={16} rx={4} ry={2} />
    </>
  ),
  treasure: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#b45309', '#78350f']} />
        <Lg id={u('b')} c={['#fde047', '#f59e0b']} />
      </defs>
      <ellipse cx="32" cy="22" rx="18" ry="10" fill={`url(#${u('b')})`} stroke={O} strokeWidth={SW} />
      <circle cx="24" cy="16" r="5" fill="#fde047" stroke={O} strokeWidth="2" />
      <circle cx="38" cy="14" r="5" fill="#fde047" stroke={O} strokeWidth="2" />
      <path d="M8 26 L56 26 L52 56 L12 56 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M8 26 L56 26" stroke="#fbbf24" strokeWidth="5" />
      <rect x="27" y="32" width="10" height="12" rx="2" fill="#fbbf24" stroke={O} strokeWidth="2" />
      <Shine x={18} y={32} rx={5} ry={2} />
    </>
  ),
  gem: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#a5f3fc', '#06b6d4', '#155e75']} />
      </defs>
      <path d="M14 22 L24 10 L40 10 L50 22 L32 56 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M14 22 L50 22 M24 10 L28 22 L32 56 L36 22 L40 10" fill="none" stroke="#0e7490" strokeWidth="1.8" />
      <path d="M20 20 L26 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  ship: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#92400e', '#451a03']} />
      </defs>
      <path d="M30 6 L30 40 M30 8 L50 24 L30 30" fill="#fff" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 10 L12 30 L30 32" fill="#e2e8f0" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M6 40 L58 40 L50 54 L14 54 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M30 6 L40 6 L36 10 L40 14 L30 14" fill="#1e293b" stroke={O} strokeWidth="1.5" />
    </>
  ),
  // ═════ Sternen-Akademie ═════
  meteor: (u) => (
    <>
      <defs>
        <Lg id={u('f')} c={['#fde047', '#f97316', '#dc2626']} />
        <Rg id={u('r')} c={['#78716c', '#292524']} />
      </defs>
      <path d="M58 6 L30 22 L40 26 L28 38 L42 30 L36 44 Z" fill={`url(#${u('f')})`} stroke={O} strokeWidth="2" strokeLinejoin="round" opacity="0.95" />
      <circle cx="26" cy="40" r="17" fill={`url(#${u('r')})`} stroke={O} strokeWidth={SW} />
      <path d="M14 46 Q20 36 30 38 Q36 30 40 36" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="34" r="3.5" fill="#44403c" stroke="#1c1917" strokeWidth="1.2" />
      <circle cx="32" cy="48" r="2.5" fill="#44403c" stroke="#1c1917" strokeWidth="1.2" />
      <Shine x={19} y={29} rx={5} ry={2.5} />
    </>
  ),
  crate: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#c4b5fd', '#7c3aed', '#4c1d95']} />
      </defs>
      <rect x="8" y="14" width="48" height="40" rx="6" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <rect x="14" y="20" width="36" height="28" rx="3" fill="none" stroke="#ddd6fe" strokeWidth="2" />
      <path d="M14 20 L50 48 M50 20 L14 48" stroke="#a78bfa" strokeWidth="2.5" />
      <circle cx="32" cy="34" r="5" fill="#22d3ee" stroke={O} strokeWidth="2" />
      <Shine x={18} y={18} rx={6} ry={2} rot={0} />
    </>
  ),
  trophy: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fef08a', '#facc15', '#b45309']} />
        <Lg id={u('b')} c={['#cbd5e1', '#64748b']} />
      </defs>
      <path d="M16 12 Q4 12 6 22 Q8 32 20 32 M48 12 Q60 12 58 22 Q56 32 44 32" fill="none" stroke={O} strokeWidth="6" />
      <path d="M16 12 Q4 12 6 22 Q8 32 20 32 M48 12 Q60 12 58 22 Q56 32 44 32" fill="none" stroke="#facc15" strokeWidth="3" />
      <path d="M14 8 L50 8 Q50 36 32 40 Q14 36 14 8Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="28" y="40" width="8" height="8" fill="#eab308" stroke={O} strokeWidth="2" />
      <rect x="16" y="48" width="32" height="10" rx="3" fill={`url(#${u('b')})`} stroke={O} strokeWidth={SW} />
      <path d="M32 16 L34 21 L39 21 L35 24 L37 29 L32 26 L27 29 L29 24 L25 21 L30 21Z" fill="#fff" opacity="0.85" />
      <Shine x={20} y={14} rx={3} ry={6} rot={10} />
    </>
  ),
  star: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fef08a', '#facc15', '#ea580c']} />
      </defs>
      <path d="M32 4 L40 22 L60 24 L45 37 L50 58 L32 47 L14 58 L19 37 L4 24 L24 22 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <Shine x={26} y={20} rx={5} ry={3} />
    </>
  ),
  planet: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#f9a8d4', '#9333ea']} />
      </defs>
      <circle cx="32" cy="32" r="18" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <ellipse cx="32" cy="34" rx="29" ry="8" fill="none" stroke={O} strokeWidth="6" transform="rotate(-18 32 34)" />
      <ellipse cx="32" cy="34" rx="29" ry="8" fill="none" stroke="#fde68a" strokeWidth="3" transform="rotate(-18 32 34)" />
      <Shine x={25} y={22} rx={5} ry={3} />
    </>
  ),
  rocket: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#f8fafc', '#cbd5e1']} />
      </defs>
      <path d="M26 46 Q32 62 38 46" fill="#f97316" stroke={O} strokeWidth="2" />
      <path d="M22 36 L12 48 L24 46 Z M42 36 L52 48 L40 46 Z" fill="#ef4444" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 4 Q46 16 42 46 L22 46 Q18 16 32 4Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="32" cy="24" r="6" fill="#38bdf8" stroke={O} strokeWidth="2.5" />
      <Shine x={28} y={14} rx={2} ry={5} rot={10} />
    </>
  ),
  robot: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#bae6fd', '#60a5fa']} />
      </defs>
      <path d="M32 6 L32 14" stroke={O} strokeWidth="3" />
      <circle cx="32" cy="6" r="4" fill="#f472b6" stroke={O} strokeWidth="2" />
      <rect x="10" y="14" width="44" height="38" rx="9" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <circle cx="23" cy="30" r="6" fill="#fff" stroke={O} strokeWidth="2" />
      <circle cx="41" cy="30" r="6" fill="#fff" stroke={O} strokeWidth="2" />
      <circle cx="24" cy="31" r="2.6" fill={O} />
      <circle cx="42" cy="31" r="2.6" fill={O} />
      <rect x="20" y="40" width="24" height="6" rx="2" fill="#fff" stroke={O} strokeWidth="2" />
      <rect x="4" y="26" width="6" height="12" rx="3" fill="#f472b6" stroke={O} strokeWidth="2" />
      <rect x="54" y="26" width="6" height="12" rx="3" fill="#f472b6" stroke={O} strokeWidth="2" />
    </>
  ),
  // ═════ Neon-Metropole ═════
  tower: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#4c1d95', '#1e1b4b']} />
      </defs>
      <rect x="12" y="10" width="26" height="50" rx="3" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <rect x="36" y="22" width="18" height="38" rx="3" fill="#312e81" stroke={O} strokeWidth={SW} />
      {[16, 24, 32, 40, 48].map((y) => (
        <g key={y}>
          <rect x="17" y={y} width="6" height="4" rx="1" fill={y % 16 ? '#22d3ee' : '#f0abfc'} />
          <rect x="27" y={y} width="6" height="4" rx="1" fill={y % 16 ? '#f0abfc' : '#22d3ee'} />
        </g>
      ))}
      {[28, 36, 44].map((y) => (
        <rect key={y} x="41" y={y} width="8" height="3" rx="1" fill="#fde047" />
      ))}
      <path d="M25 10 L25 3" stroke="#f0abfc" strokeWidth="2.5" />
      <circle cx="25" cy="3" r="2" fill="#f43f5e" />
    </>
  ),
  skyline: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#a21caf', '#1e1b4b']} />
      </defs>
      <path d="M2 60 L2 30 L12 30 L12 18 L22 18 L22 36 L30 36 L30 8 L42 8 L42 28 L50 28 L50 20 L62 20 L62 60 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {[[6, 36], [16, 24], [34, 14], [34, 24], [38, 40], [54, 26], [54, 40], [24, 44]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill={i % 2 ? '#22d3ee' : '#f0abfc'} />
      ))}
    </>
  ),
  barrier: () => (
    <>
      <rect x="10" y="40" width="6" height="18" fill="#94a3b8" stroke={O} strokeWidth="2.5" />
      <rect x="48" y="40" width="6" height="18" fill="#94a3b8" stroke={O} strokeWidth="2.5" />
      <rect x="4" y="20" width="56" height="22" rx="4" fill="#facc15" stroke={O} strokeWidth={SW} />
      <path d="M12 20 L4 30 M26 20 L12 42 M40 20 L26 42 M54 20 L40 42 M60 28 L54 42" stroke={O} strokeWidth="5" />
      <circle cx="10" cy="14" r="5" fill="#f43f5e" stroke={O} strokeWidth="2" />
      <circle cx="54" cy="14" r="5" fill="#f43f5e" stroke={O} strokeWidth="2" />
    </>
  ),
  disk: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#e879f9', '#7e22ce']} />
      </defs>
      <path d="M8 8 L48 8 L56 16 L56 56 L8 56 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="18" y="8" width="26" height="16" fill="#e2e8f0" stroke={O} strokeWidth="2.5" />
      <rect x="34" y="11" width="6" height="10" fill="#475569" />
      <rect x="15" y="32" width="34" height="20" rx="2" fill="#22d3ee" stroke={O} strokeWidth="2.5" />
      <path d="M20 38 L44 38 M20 44 L38 44" stroke="#0e7490" strokeWidth="2" />
      <Shine x={14} y={14} rx={2} ry={4} rot={0} />
    </>
  ),
  battery: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#bef264', '#16a34a']} />
      </defs>
      <rect x="24" y="4" width="16" height="8" rx="2" fill="#94a3b8" stroke={O} strokeWidth="2.5" />
      <rect x="14" y="10" width="36" height="50" rx="7" fill="#1e293b" stroke={O} strokeWidth={SW} />
      <rect x="19" y="26" width="26" height="29" rx="3" fill={`url(#${u('a')})`} />
      <path d="M34 16 L24 36 L32 36 L28 52 L42 30 L34 30 Z" fill="#fde047" stroke={O} strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  train: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fb923c', '#dc2626']} />
      </defs>
      <rect x="6" y="20" width="40" height="28" rx="5" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <rect x="44" y="28" width="14" height="20" rx="3" fill="#38bdf8" stroke={O} strokeWidth={SW} />
      <rect x="12" y="10" width="10" height="12" rx="2" fill="#475569" stroke={O} strokeWidth="2.5" />
      <rect x="12" y="26" width="10" height="9" rx="2" fill="#bae6fd" stroke={O} strokeWidth="2" />
      <rect x="28" y="26" width="10" height="9" rx="2" fill="#bae6fd" stroke={O} strokeWidth="2" />
      {[14, 30, 48].map((x) => (
        <circle key={x} cx={x} cy="52" r="6" fill="#334155" stroke={O} strokeWidth="2.5" />
      ))}
    </>
  ),
  // ═════ Quantum-Lab ═════
  icecube: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#e0f2fe', '#7dd3fc', '#0369a1']} />
      </defs>
      <path d="M32 6 L56 18 L56 46 L32 58 L8 46 L8 18 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M8 18 L32 30 L56 18 M32 30 L32 58" fill="none" stroke="#e0f2fe" strokeWidth="2" />
      <path d="M14 22 L26 28" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  crystal: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#ccfbf1', '#2dd4bf', '#0f766e']} />
      </defs>
      <path d="M20 58 L12 30 L20 16 L28 30 Z M44 58 L36 24 L46 8 L54 26 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 58 L24 22 L32 4 L40 22 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M29 20 L32 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  qcore: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#ecfeff', '#14b8a6']} />
      </defs>
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="#5eead4" strokeWidth="3" transform="rotate(30 32 32)" />
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="#a78bfa" strokeWidth="3" transform="rotate(-30 32 32)" />
      <path d="M32 12 L48 32 L32 52 L16 32 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx="32" cy="32" r="5" fill="#fff" />
    </>
  ),
  atom: () => (
    <>
      {[0, 60, -60].map((r) => (
        <ellipse key={r} cx="32" cy="32" rx="28" ry="10" fill="none" stroke={O} strokeWidth="6" transform={`rotate(${r} 32 32)`} />
      ))}
      {[0, 60, -60].map((r, i) => (
        <ellipse key={r} cx="32" cy="32" rx="28" ry="10" fill="none" stroke={['#5eead4', '#a78bfa', '#f0abfc'][i]} strokeWidth="3" transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="7" fill="#ecfeff" stroke={O} strokeWidth={SW} />
    </>
  ),
  spark: () => (
    <>
      <path d="M32 2 L37 27 L62 32 L37 37 L32 62 L27 37 L2 32 L27 27 Z" fill="#a7f3d0" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 14 L34 30 L50 32 L34 34 L32 50 L30 34 L14 32 L30 30 Z" fill="#fff" />
    </>
  ),
  // ═════ Allgemein ═════
  key: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fef08a', '#eab308', '#a16207']} />
      </defs>
      <circle cx="20" cy="22" r="13" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <circle cx="20" cy="22" r="5" fill="#713f12" stroke={O} strokeWidth="2" />
      <path d="M28 32 L52 56 L58 50 M44 48 L50 42 M38 42 L42 38" fill="none" stroke={O} strokeWidth="8" strokeLinecap="round" />
      <path d="M28 32 L52 56 L58 50 M44 48 L50 42 M38 42 L42 38" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
      <Shine x={14} y={16} rx={4} ry={2} />
    </>
  ),
  gate: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#c084fc', '#6d28d9', '#3b0764']} />
      </defs>
      <path d="M10 60 L10 26 Q10 6 32 6 Q54 6 54 26 L54 60 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M22 60 L22 24 M32 60 L32 18 M42 60 L42 24" stroke="#4c1d95" strokeWidth="3" />
      <rect x="23" y="32" width="18" height="16" rx="3" fill="#facc15" stroke={O} strokeWidth="2.5" />
      <circle cx="32" cy="39" r="2.5" fill={O} />
      <path d="M30 26 Q30 20 32 20 Q34 20 34 26" fill="none" stroke="#facc15" strokeWidth="3" />
    </>
  ),
  lock: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#e2e8f0', '#94a3b8', '#475569']} />
      </defs>
      <path d="M20 28 L20 20 Q20 8 32 8 Q44 8 44 20 L44 28" fill="none" stroke={O} strokeWidth="9" />
      <path d="M20 28 L20 20 Q20 8 32 8 Q44 8 44 20 L44 28" fill="none" stroke="#cbd5e1" strokeWidth="4.5" />
      <rect x="12" y="26" width="40" height="32" rx="7" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <circle cx="32" cy="39" r="4.5" fill={O} />
      <rect x="30" y="40" width="4" height="9" rx="1.5" fill={O} />
      <Shine x={20} y={32} rx={4} ry={2} />
    </>
  ),
  chest: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#a855f7', '#6b21a8']} />
      </defs>
      <path d="M8 26 Q8 8 32 8 Q56 8 56 26 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <rect x="8" y="26" width="48" height="30" rx="4" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <path d="M8 26 L56 26 M20 10 L20 56 M44 10 L44 56" stroke="#facc15" strokeWidth="4" />
      <rect x="26" y="22" width="12" height="14" rx="3" fill="#fde047" stroke={O} strokeWidth="2.5" />
      <Shine x={18} y={16} rx={5} ry={2} />
    </>
  ),
  cloud: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#ffffff', '#cbd5e1']} />
      </defs>
      <path d="M12 46 Q2 46 4 36 Q6 28 16 30 Q16 16 30 16 Q42 16 44 26 Q58 24 60 36 Q60 46 50 46 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  // ═════ Ramadan & Eid ═════
  moon: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fef3c7', '#fbbf24', '#b45309']} />
      </defs>
      <path d="M40 4 A28 28 0 1 0 60 44 A22 22 0 1 1 40 4 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M22 18 Q16 30 22 44" fill="none" stroke="#fde68a" strokeWidth="2" strokeDasharray="2 3" />
      <path d="M52 10 L54 15 L59 15 L55 18 L57 23 L52 20 L47 23 L49 18 L45 15 L50 15Z" fill="#fde047" stroke={O} strokeWidth="1.5" />
    </>
  ),
  lantern: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fde68a', '#d97706', '#78350f']} />
        <Rg id={u('g')} c={['#fffbeb', '#f59e0b']} />
      </defs>
      <path d="M32 0 L32 6" stroke={O} strokeWidth="2.5" />
      <circle cx="32" cy="8" r="3" fill="none" stroke="#b45309" strokeWidth="2" />
      <path d="M22 12 L42 12 L46 18 L18 18 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 18 L46 18 L44 46 L20 46 Z" fill={`url(#${u('g')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M26 18 L27 46 M38 18 L37 46 M19 30 L45 30" stroke="#92400e" strokeWidth="2" />
      <path d="M32 22 Q36 30 32 40 Q28 30 32 22Z" fill="#fff7ed" />
      <path d="M20 46 L44 46 L38 54 L26 54 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 54 L32 62" stroke="#b45309" strokeWidth="2.5" />
    </>
  ),
  date: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#b45309', '#7c2d12', '#431407']} />
      </defs>
      <ellipse cx="32" cy="34" rx="16" ry="25" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} transform="rotate(25 32 34)" />
      <path d="M26 20 Q30 34 36 48" fill="none" stroke="#451a03" strokeWidth="2" />
      <path d="M40 8 Q44 4 48 6" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
      <Shine x={26} y={22} rx={3} ry={7} rot={25} />
    </>
  ),
  baklava: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fde68a', '#f59e0b', '#b45309']} />
      </defs>
      <path d="M32 8 L58 32 L32 56 L6 32 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 16 L50 32 L32 48 L14 32 Z" fill="none" stroke="#b45309" strokeWidth="2" />
      <circle cx="32" cy="32" r="5" fill="#4ade80" stroke={O} strokeWidth="2" />
      <Shine x={24} y={22} rx={5} ry={2} rot={-45} />
    </>
  ),
  sheep: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#ffffff', '#e2e8f0']} />
      </defs>
      {[18, 30, 42].map((x) => (
        <rect key={x} x={x} y="44" width="5" height="14" rx="2" fill="#334155" stroke={O} strokeWidth="2" />
      ))}
      <path d="M12 34 Q6 22 18 20 Q20 10 32 12 Q44 8 48 20 Q58 22 54 34 Q58 46 44 46 Q32 52 20 46 Q6 46 12 34Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <ellipse cx="50" cy="26" rx="9" ry="10" fill="#475569" stroke={O} strokeWidth={SW} />
      <circle cx="53" cy="24" r="2" fill="#fff" />
      <path d="M44 20 Q38 18 40 26" fill="none" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  garland: () => (
    <>
      <path d="M0 10 Q32 34 64 10" fill="none" stroke={O} strokeWidth="2.5" />
      {[[6, 13, '#ef4444'], [18, 21, '#facc15'], [32, 24, '#22c55e'], [46, 21, '#3b82f6'], [58, 13, '#a855f7']].map(([x, y, c], i) => (
        <path key={i} d={`M${Number(x) - 6} ${y} L${Number(x) + 6} ${y} L${x} ${Number(y) + 14} Z`} fill={String(c)} stroke={O} strokeWidth="2" strokeLinejoin="round" />
      ))}
    </>
  ),
  // ═════ Halloween ═════
  pumpkin: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fdba74', '#f97316', '#9a3412']} />
      </defs>
      <path d="M32 14 Q30 6 36 4" fill="none" stroke="#3f6212" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="20" cy="36" rx="14" ry="20" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <ellipse cx="44" cy="36" rx="14" ry="20" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <ellipse cx="32" cy="36" rx="13" ry="22" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <path d="M20 30 L26 26 L28 34 Z M44 30 L38 26 L36 34 Z" fill="#422006" />
      <path d="M20 42 Q32 52 44 42 L40 44 L36 41 L32 45 L28 41 L24 44 Z" fill="#422006" />
      <Shine x={26} y={22} rx={4} ry={2} />
    </>
  ),
  bat: () => (
    <>
      <path d="M32 26 Q22 12 4 18 Q12 22 10 30 Q18 26 22 34 Q26 28 32 34 Q38 28 42 34 Q46 26 54 30 Q52 22 60 18 Q42 12 32 26Z" fill="#3b0764" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="32" cy="28" r="7" fill="#581c87" stroke={O} strokeWidth="2.5" />
      <path d="M27 22 L28 16 L31 22 M37 22 L36 16 L33 22" fill="#581c87" stroke={O} strokeWidth="1.5" />
      <circle cx="29.5" cy="27" r="1.8" fill="#fde047" />
      <circle cx="34.5" cy="27" r="1.8" fill="#fde047" />
    </>
  ),
  // ═════ Weihnachten & Silvester ═════
  gift: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#f87171', '#dc2626', '#991b1b']} />
      </defs>
      <rect x="8" y="24" width="48" height="34" rx="4" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <rect x="5" y="18" width="54" height="12" rx="3" fill="#ef4444" stroke={O} strokeWidth={SW} />
      <rect x="27" y="18" width="10" height="40" fill="#facc15" stroke={O} strokeWidth="2" />
      <path d="M32 18 Q18 2 16 14 Q18 20 32 18 Q46 20 48 14 Q46 2 32 18Z" fill="#facc15" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <Shine x={14} y={28} rx={2} ry={5} rot={0} />
    </>
  ),
  candycane: () => (
    <>
      <path d="M26 60 L26 22 Q26 8 38 8 Q50 8 50 22 L50 26" fill="none" stroke={O} strokeWidth="14" strokeLinecap="round" />
      <path d="M26 60 L26 22 Q26 8 38 8 Q50 8 50 22 L50 26" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <path d="M26 60 L26 22 Q26 8 38 8 Q50 8 50 22 L50 26" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="5 6" />
    </>
  ),
  xmastree: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#4ade80', '#15803d', '#14532d']} />
      </defs>
      <rect x="27" y="50" width="10" height="10" fill="#92400e" stroke={O} strokeWidth="2.5" />
      <path d="M32 6 L50 30 L42 30 L56 50 L8 50 L22 30 L14 30 Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 2 L34 7 L39 7 L35 10 L37 15 L32 12 L27 15 L29 10 L25 7 L30 7Z" fill="#facc15" stroke={O} strokeWidth="1.5" />
      {[[26, 26, '#ef4444'], [38, 34, '#facc15'], [22, 42, '#38bdf8'], [42, 44, '#ef4444'], [32, 38, '#f0abfc']].map(([x, y, c], i) => (
        <circle key={i} cx={Number(x)} cy={Number(y)} r="3" fill={String(c)} stroke={O} strokeWidth="1.5" />
      ))}
    </>
  ),
  snowflake: () => (
    <>
      {[0, 60, 120].map((r) => (
        <g key={r} transform={`rotate(${r} 32 32)`}>
          <path d="M32 4 L32 60 M32 14 L26 8 M32 14 L38 8 M32 50 L26 56 M32 50 L38 56" stroke={O} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M32 4 L32 60 M32 14 L26 8 M32 14 L38 8 M32 50 L26 56 M32 50 L38 56" stroke="#e0f2fe" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
      ))}
    </>
  ),
  firework: () => (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const c = ['#f43f5e', '#facc15', '#22d3ee', '#a3e635'][i % 4];
        return <path key={i} d={`M${32 + Math.cos(a) * 8} ${32 + Math.sin(a) * 8} L${32 + Math.cos(a) * 26} ${32 + Math.sin(a) * 26}`} stroke={c} strokeWidth="4" strokeLinecap="round" />;
      })}
      <circle cx="32" cy="32" r="6" fill="#fff" stroke={O} strokeWidth="2" />
    </>
  ),
  // ═════ Ostern & Jahreszeiten ═════
  egg: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#f9a8d4', '#c084fc']} />
      </defs>
      <path d="M32 4 C48 4 56 30 54 42 C52 54 42 60 32 60 C22 60 12 54 10 42 C8 30 16 4 32 4Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <path d="M12 30 Q22 24 32 30 Q42 36 52 30" fill="none" stroke="#fde047" strokeWidth="4" />
      <path d="M11 42 L18 38 L25 42 L32 38 L39 42 L46 38 L53 42" fill="none" stroke="#38bdf8" strokeWidth="3" />
      <Shine x={22} y={16} rx={4} ry={6} rot={20} />
    </>
  ),
  blossom: () => (
    <>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="32" cy="17" rx="10" ry="14" fill="#fbcfe8" stroke={O} strokeWidth="2.5" transform={`rotate(${r} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="7" fill="#facc15" stroke={O} strokeWidth="2.5" />
    </>
  ),
  sunny: (u) => (
    <>
      <defs>
        <Rg id={u('a')} c={['#fef9c3', '#f59e0b']} />
      </defs>
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M32 2 L36 12 L28 12 Z" fill="#fbbf24" stroke={O} strokeWidth="2" strokeLinejoin="round" transform={`rotate(${i * 36} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="17" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} />
      <path d="M24 30 Q26 27 28 30 M36 30 Q38 27 40 30 M25 37 Q32 43 39 37" fill="none" stroke={O} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  leaf: (u) => (
    <>
      <defs>
        <Lg id={u('a')} c={['#fdba74', '#ea580c', '#9a3412']} />
      </defs>
      <path d="M32 58 C10 46 6 22 32 4 C58 22 54 46 32 58Z" fill={`url(#${u('a')})`} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M32 58 L32 12 M32 28 L22 20 M32 38 L44 28 M32 46 L22 38" stroke="#7c2d12" strokeWidth="2" fill="none" />
    </>
  ),
};

export function Sprite({ name, className, title }: { name: SpriteName; className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  const u = (s: string) => `${id}${s}`;
  return (
    <svg viewBox="0 0 64 64" className={className ?? 'h-full w-full'} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {S[name](u)}
    </svg>
  );
}

/** Spielfeld-Grafiken je Welt */
export const WORLD_SPRITES = {
  mini: { wall: 'tree', low: 'rock', goal: 'strawberry', bonus: 'berry', emblem: 'mushroom', deco: ['tree', 'mushroom', 'berry', 'blossom'] },
  junior: { wall: 'palm', low: 'barrel', goal: 'treasure', bonus: 'gem', emblem: 'ship', deco: ['palm', 'gem', 'barrel', 'ship'] },
  hero: { wall: 'meteor', low: 'crate', goal: 'trophy', bonus: 'star', emblem: 'rocket', deco: ['planet', 'rocket', 'star', 'robot'] },
  teen: { wall: 'tower', low: 'barrier', goal: 'disk', bonus: 'battery', emblem: 'skyline', deco: ['skyline', 'battery', 'disk', 'robot'] },
  adult: { wall: 'icecube', low: 'crystal', goal: 'qcore', bonus: 'spark', emblem: 'atom', deco: ['atom', 'crystal', 'qcore', 'spark'] },
} as const satisfies Record<string, { wall: SpriteName; low: SpriteName; goal: SpriteName; bonus: SpriteName; emblem: SpriteName; deco: readonly SpriteName[] }>;
