// ─────────────────────────────────────────────────────────────
// Sparky – der kleine Drache mit Fliegerbrille, Kopfhörern & Schal (gemaltes Bild)
// Mimik: idle (neugierig, blinzelt), walk, happy, boing, sad, think
// Kostüme und Saison-Accessoires liegen als SVG-Ebenen auf dem Kopf.
// ─────────────────────────────────────────────────────────────
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import type { ThemeConfig } from '../data/seasons';
import { createContext, useContext, useId } from 'react';
import { type CostumeId, type SkinId } from '../data/costumes';
import type { Dir } from '../types';

export type SparkyMood = 'idle' | 'walk' | 'happy' | 'boing' | 'sad' | 'think';

interface Props {
  mood?: SparkyMood;
  dir?: Dir;
  /** Ohne Angabe: das gewählte Kostüm aus dem LookContext */
  costume?: CostumeId;
  skin?: SkinId;
  className?: string;
}

/** Aktuelles Aussehen (Kostüm + Farbe) – wird in App gesetzt */
export const SparkyLook = createContext<{ costume: CostumeId; skin: SkinId }>({ costume: 'none', skin: 'violet' });

const MOOD_ANIM: Record<SparkyMood, string> = {
  idle: 'animate-breathe',
  walk: 'animate-wobble',
  happy: 'animate-happy-hop',
  boing: 'animate-boing',
  sad: '',
  think: 'animate-breathe',
};

/** Farbvarianten als Farbton-Drehung des gemalten Sparky */
const SKIN_FILTER: Record<string, string> = {
  violet: '',
  mint: 'hue-rotate(-105deg) saturate(1.1)',
  sunset: 'hue-rotate(115deg) saturate(1.2)',
  ocean: 'hue-rotate(-50deg) saturate(1.15)',
  gold: 'hue-rotate(150deg) saturate(1.3) brightness(1.08)',
  rainbow: '',
  neon: 'hue-rotate(35deg) saturate(1.5) brightness(1.05)',
  holo: 'hue-rotate(-95deg) saturate(0.9) brightness(1.15)',
};

/** Hut-Ebenen wurden für einen Kopf oben rechts gezeichnet → auf den gemalten Kopf verschieben */
const HEAD = 'translate(-14 -30) scale(1.02)';
/** Kostüme, die als Hut/Kopfschmuck funktionieren (Gesichts-Teile passen nicht zur Fliegerbrille) */
const HAT_COSTUMES = new Set<CostumeId>(['party', 'wizard', 'crown', 'flowers', 'astronaut', 'quantum', 'holofox', 'drone', 'cyber', 'ninja', 'pirate']);
/** Saison-Accessoires, die auf dem Kopf sitzen */
const HEAD_ACCESSORIES = new Set(['santa', 'partyhat', 'bunny', 'festcap', 'flowercrown', 'beanie']);

export function Sparky({ mood = 'idle', dir = 'right', costume: costumeProp, skin: skinProp, className = '', large = false }: Props & { large?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const lookCtx = useContext(SparkyLook);
  const costume = costumeProp ?? lookCtx.costume;
  const { theme: season } = useSeasonalTheme();
  const skin = skinProp ?? lookCtx.skin;
  const flip = dir === 'left';
  const filter = [SKIN_FILTER[skin] ?? '', mood === 'sad' ? 'saturate(0.7) brightness(0.95)' : '', 'drop-shadow(0 5px 3px rgba(20,10,50,.35))'].join(' ');

  return (
    <div className={`relative h-full w-full origin-bottom ${MOOD_ANIM[mood]} ${className}`}>
      <div className="absolute inset-0" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        {costume === 'cape' && (
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible">
            <Cape />
          </svg>
        )}
        <img
          src={large ? './sparky.webp' : './sparky-sm.webp'}
          alt=""
          draggable={false}
          className={`absolute inset-0 h-full w-full select-none object-contain object-bottom ${skin === 'rainbow' ? 'animate-rainbow' : ''}`}
          style={{ filter }}
        />
        <svg viewBox="0 0 120 120" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <radialGradient id={`horn${uid}`} cx="40%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <g transform={HEAD}>
            {costume !== 'none' && costume !== 'cape' && HAT_COSTUMES.has(costume) && <Hat costume={costume} uid={uid} />}
            {costume === 'none' && season.accessory && HEAD_ACCESSORIES.has(season.accessory) && <SeasonAccessory kind={season.accessory} />}
          </g>
        </svg>
      </div>
      {/* Stimmungs-Effekte */}
      {mood === 'happy' && (
        <>
          <span className="absolute -top-[2%] left-[4%] animate-twinkle text-[0.9em] text-yellow-300 drop-shadow">✦</span>
          <span className="absolute right-[2%] top-[16%] animate-twinkle text-[0.7em] text-yellow-200 drop-shadow [animation-delay:.4s]">✦</span>
        </>
      )}
      {mood === 'sad' && <span className="absolute left-[36%] top-[36%] h-[9%] w-[6%] animate-bounce rounded-b-full rounded-t-[40%] bg-sky-300/90 shadow" />}
      {mood === 'think' && (
        <span className="absolute -right-[8%] -top-[6%] flex h-[30%] w-[30%] items-center justify-center rounded-full border-2 border-[#1d1530] bg-white text-[0.7em] font-black text-violet-700 shadow">
          ?
        </span>
      )}
      {mood === 'boing' && <span className="absolute left-[18%] top-[-6%] animate-wiggle text-[0.8em]">💫</span>}
    </div>
  );
}

function Hat({ costume, uid }: { costume: CostumeId; uid: string }) {
  switch (costume) {
    case 'party':
      return (
        <g>
          <path d="M62 38 L72 6 L84 36 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="2" strokeLinejoin="round" />
          <path d="M66 26 L80 24 M68 18 L77 17" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
          <circle cx="72" cy="6" r="5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
        </g>
      );
    case 'wizard':
      return (
        <g>
          <ellipse cx="72" cy="38" rx="30" ry="7" fill="#4338ca" stroke="#1e1b4b" strokeWidth="2" />
          <path d="M54 37 Q64 6 84 -6 Q80 14 90 37 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 18 l2 4 4 .5 -3 2.6 .8 4 -3.8 -2 -3.8 2 .8 -4 -3 -2.6 4 -.5z" fill="#fde047" />
          <circle cx="80" cy="30" r="2" fill="#fde047" />
          <circle cx="62" cy="30" r="1.5" fill="#fff" />
        </g>
      );
    case 'pirate':
      return (
        <g>
          <path d="M44 44 Q70 18 100 40 Q72 34 44 44 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
          <circle cx="56" cy="36" r="2" fill="#fff" />
          <circle cx="70" cy="30" r="2" fill="#fff" />
          <circle cx="86" cy="32" r="2" fill="#fff" />
          <path d="M44 44 l-10 6 l4 -10" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" strokeLinejoin="round" />
          {/* Augenklappe */}
          <path d="M60 48 L100 66" stroke="#111827" strokeWidth="2.5" />
          <ellipse cx="87" cy="56" rx="10" ry="11" fill="#111827" />
          <path d="M83 52 l8 8 M91 52 l-8 8" stroke="#f9fafb" strokeWidth="1.6" />
        </g>
      );
    case 'flowers':
      return (
        <g>
          {[46, 58, 72, 86, 98].map((x, i) => (
            <g key={x} transform={`translate(${x} ${40 - (i === 2 ? 6 : i % 2 ? 4 : 0)})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-5" rx="3.6" ry="5" fill={['#f472b6', '#fde047', '#a78bfa', '#fb923c', '#34d399'][i]} transform={`rotate(${a})`} />
              ))}
              <circle r="3" fill="#fff7ed" />
            </g>
          ))}
        </g>
      );
    case 'astronaut':
      return (
        <g>
          <circle cx="64" cy="64" r="54" fill="#bae6fd" fillOpacity="0.22" stroke="#e0f2fe" strokeWidth="4" />
          <path d="M28 44 Q40 20 64 16" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <rect x="40" y="108" width="48" height="10" rx="4" fill="#e5e7eb" stroke="#64748b" strokeWidth="2" />
          <line x1="96" y1="20" x2="104" y2="4" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="104" cy="4" r="4" fill="#f43f5e" />
        </g>
      );
    case 'crown':
      return (
        <g>
          <path
            d="M54 40 L52 18 L62 28 L70 12 L78 28 L88 16 L88 40 Z"
            fill={`url(#horn${uid})`}
            stroke="#92400e"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="53" y="36" width="36" height="6" rx="2" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="70" cy="30" r="3" fill="#ef4444" />
          <circle cx="60" cy="33" r="2" fill="#3b82f6" />
          <circle cx="80" cy="33" r="2" fill="#10b981" />
        </g>
      );
    case 'ninja':
      return (
        <g>
          {/* Stirnband mit flatternden Enden */}
          <path d="M26 46 Q62 30 100 42 L99 50 Q62 38 27 54 Z" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
          <rect x="58" y="38" width="12" height="9" rx="2" fill="#9ca3af" transform="rotate(-8 64 42)" />
          <path d="M28 50 Q14 46 6 54 M28 52 Q16 58 10 66" fill="none" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'cyber':
      return (
        <g>
          {/* Visier + Rüstung */}
          <rect x="54" y="47" width="46" height="18" rx="9" fill="#22d3ee" fillOpacity="0.45" stroke="#0e7490" strokeWidth="2.5" />
          <path d="M58 51 L72 51" stroke="#ecfeff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M52 76 Q68 70 84 76 L82 96 Q68 100 54 96 Z" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
          <circle cx="68" cy="85" r="4" fill="#22d3ee" stroke="#0e7490" strokeWidth="1.5" />
          <line x1="66" y1="34" x2="70" y2="16" stroke="#475569" strokeWidth="3" />
          <circle cx="70" cy="15" r="4" fill="#22d3ee" />
        </g>
      );
    case 'drone':
      return (
        <g>
          {/* schwebende Mini-Drohne + Neon-Visier */}
          <g className="animate-float">
            <rect x="58" y="2" width="28" height="10" rx="5" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <circle cx="72" cy="7" r="3" fill="#f0abfc" />
            <path d="M58 6 L46 2 M86 6 L98 2" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="44" cy="1" rx="9" ry="2.2" fill="#22d3ee" fillOpacity="0.7" />
            <ellipse cx="100" cy="1" rx="9" ry="2.2" fill="#22d3ee" fillOpacity="0.7" />
            <path d="M72 12 L72 22" stroke="#f0abfc" strokeWidth="2" strokeDasharray="2 2" />
          </g>
          <path d="M56 52 L100 52 L98 62 L58 62 Z" fill="#c026d3" fillOpacity="0.55" stroke="#f0abfc" strokeWidth="2" strokeLinejoin="round" />
          <path d="M62 56 L94 56" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'holofox':
      return (
        <g opacity="0.95">
          {/* holografische Fuchsohren + Scanlinien */}
          <path d="M48 42 L44 10 L66 34 Z" fill="#22d3ee" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M78 34 L96 8 L94 42 Z" fill="#22d3ee" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M50 34 L48 18 L58 30 Z M84 32 L93 18 L92 34 Z" fill="#f0abfc" fillOpacity="0.6" />
          {[52, 60, 68, 76, 84].map((y) => (
            <line key={y} x1="30" y1={y} x2="98" y2={y} stroke="#a5f3fc" strokeWidth="1" opacity="0.35" />
          ))}
          <path d="M18 70 Q4 58 10 44" fill="none" stroke="#67e8f9" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    case 'quantum':
      return (
        <g>
          {/* Atom-Orbits um den Kopf + KI-Kern */}
          <ellipse cx="66" cy="30" rx="34" ry="9" fill="none" stroke="#5eead4" strokeWidth="2" opacity="0.85" />
          <ellipse cx="66" cy="30" rx="34" ry="9" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.85" transform="rotate(60 66 30)" />
          <ellipse cx="66" cy="30" rx="34" ry="9" fill="none" stroke="#f0abfc" strokeWidth="2" opacity="0.85" transform="rotate(-60 66 30)" />
          <circle cx="66" cy="30" r="6" fill="#ecfeff" stroke="#14b8a6" strokeWidth="2" />
          <circle cx="100" cy="30" r="3" fill="#5eead4" className="animate-twinkle" />
          <circle cx="49" cy="0" r="2.5" fill="#a78bfa" className="animate-twinkle" />
          <rect x="56" y="78" width="24" height="12" rx="3" fill="#0f172a" fillOpacity="0.7" stroke="#5eead4" strokeWidth="1.5" />
          <text x="68" y="87.5" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#5eead4">AI</text>
        </g>
      );
    default:
      return null;
  }
}

type Accessory = NonNullable<ThemeConfig['accessory']>;

/** Saison- & Festtags-Accessoires für Sparky */
function SeasonAccessory({ kind }: { kind: Accessory }) {
  const O = '#1d1530';
  switch (kind) {
    case 'santa':
      return (
        <g>
          <path d="M50 40 Q66 4 96 14 Q104 18 102 30 L98 40 Z" fill="#dc2626" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="46" y="34" width="56" height="10" rx="5" fill="#fff" stroke={O} strokeWidth="2.5" />
          <circle cx="102" cy="28" r="6" fill="#fff" stroke={O} strokeWidth="2.5" />
        </g>
      );
    case 'partyhat':
      return (
        <g>
          <path d="M62 38 L72 4 L84 36 Z" fill="#22d3ee" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M65 28 L80 26 M68 18 L77 17" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="72" cy="4" r="5" fill="#facc15" stroke={O} strokeWidth="2" />
        </g>
      );
    case 'bunny':
      return (
        <g>
          <path d="M58 36 Q48 2 58 0 Q68 2 66 34" fill="#fff" stroke={O} strokeWidth="2.5" />
          <path d="M58 30 Q53 8 58 6 Q62 8 62 30" fill="#fbcfe8" />
          <path d="M78 34 Q82 0 94 4 Q100 10 86 38" fill="#fff" stroke={O} strokeWidth="2.5" />
          <path d="M82 30 Q86 10 92 9 Q94 14 85 32" fill="#fbcfe8" />
        </g>
      );
    case 'vampire':
      return (
        <g>
          <path d="M40 96 Q30 74 44 64 L52 84 Z M96 96 Q106 74 92 64 L84 84 Z" fill="#7f1d1d" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M88 78 L90 84 L92 78 Z M94 76 L95.5 81 L97 76 Z" fill="#fff" stroke={O} strokeWidth="1" />
          <path d="M58 36 Q72 30 86 36 L72 44 Z" fill="#111827" stroke={O} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    case 'goldscarf':
      return (
        <g>
          <path d="M46 92 Q68 104 94 90 L96 98 Q68 112 44 100 Z" fill="#047857" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 97 Q68 106 92 95" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M86 96 L92 116 L80 112 Z" fill="#047857" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="86" cy="106" r="2" fill="#facc15" />
        </g>
      );
    case 'festcap':
      return (
        <g>
          <path d="M54 40 Q54 22 72 20 Q90 22 90 40 Z" fill="#7c2d12" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M56 34 L88 34" stroke="#facc15" strokeWidth="3" />
          <path d="M62 28 L66 24 L70 28 L74 24 L78 28 L82 24" fill="none" stroke="#facc15" strokeWidth="2" />
          <path d="M72 20 L72 14" stroke={O} strokeWidth="2" />
          <circle cx="72" cy="12" r="3" fill="#facc15" stroke={O} strokeWidth="1.5" />
        </g>
      );
    case 'flowercrown':
      return (
        <g>
          <path d="M50 40 Q72 28 96 40" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
          {[[54, 37, '#f9a8d4'], [64, 33, '#fde047'], [74, 32, '#f0abfc'], [84, 33, '#93c5fd'], [93, 37, '#f9a8d4']].map(([x, y, c], i) => (
            <g key={i}>
              <circle cx={Number(x)} cy={Number(y)} r="5" fill={String(c)} stroke={O} strokeWidth="1.8" />
              <circle cx={Number(x)} cy={Number(y)} r="1.6" fill="#f59e0b" />
            </g>
          ))}
        </g>
      );
    case 'sunglasses':
      return (
        <g>
          <path d="M58 54 L100 54" stroke={O} strokeWidth="3" />
          <rect x="60" y="50" width="16" height="11" rx="4" fill="#0f172a" stroke={O} strokeWidth="2" />
          <rect x="82" y="50" width="16" height="11" rx="4" fill="#0f172a" stroke={O} strokeWidth="2" />
          <path d="M63 53 L67 53 M85 53 L89 53" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d="M50 40 Q50 12 72 12 Q94 12 94 40 Z" fill="#2563eb" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="47" y="34" width="50" height="9" rx="4" fill="#bfdbfe" stroke={O} strokeWidth="2.5" />
          <circle cx="72" cy="10" r="6" fill="#fff" stroke={O} strokeWidth="2.5" />
        </g>
      );
  }
}

function Cape() {
  return <path d="M34 54 Q14 96 30 112 L96 112 Q104 92 86 54 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" strokeLinejoin="round" />;
}
