// ─────────────────────────────────────────────────────────────
// Zentrales Spiel-Design-System (nach den Design-Vorlagen):
// Himmel-Szene mit schwebenden Inseln & Wolken, Kopfzeile mit
// Glanz-Knöpfen + blauer Titel-Pille, weiße Panels, Creme-Panels,
// rote Banderole, grüner Schalter, Lichtstrahlen, Sternzähler.
// Alle Unterseiten bauen hierauf auf → überall gleicher Look.
// ─────────────────────────────────────────────────────────────
import { ChevronLeft, Settings } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { Sprite } from './sprites';

const O = '#1b2a55';

/** Himmel mit Sonne, Funkeln, schwebenden Inseln und Wolkenmeer (oder Wiese) */
export function SkyScene({ variant = 'clouds', className = '' }: { variant?: 'clouds' | 'meadow'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const u = (s: string) => `${id}${s}`;
  const sparkles = [
    [40, 70, 7], [120, 40, 4], [330, 60, 6], [370, 150, 4], [70, 210, 5], [210, 120, 4], [300, 250, 6], [30, 330, 4], [380, 380, 5], [160, 300, 3],
  ];
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 400 860"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={u('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1590ee" />
          <stop offset="0.38" stopColor="#3fb7fa" />
          <stop offset="0.72" stopColor="#8fdcff" />
          <stop offset="1" stopColor="#d9f5ff" />
        </linearGradient>
        <radialGradient id={u('sun')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#fff3b0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u('cl')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f2f9ff" />
          <stop offset="1" stopColor="#c7e3fb" />
        </linearGradient>
        <linearGradient id={u('gr')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b6f25a" />
          <stop offset="0.5" stopColor="#5fd13d" />
          <stop offset="1" stopColor="#2f9e2c" />
        </linearGradient>
        <linearGradient id={u('rk')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a6b" />
          <stop offset="0.5" stopColor="#9a6a42" />
          <stop offset="1" stopColor="#5e3d26" />
        </linearGradient>
        <linearGradient id={u('hill')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3e635" />
          <stop offset="1" stopColor="#3f9b2a" />
        </linearGradient>
        <linearGradient id={u('hill2')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd43a" />
          <stop offset="1" stopColor="#2c7d22" />
        </linearGradient>
      </defs>
      <rect width="400" height="860" fill={`url(#${u('sky')})`} />
      <circle cx="320" cy="110" r="170" fill={`url(#${u('sun')})`} />
      {/* Funkeln */}
      {sparkles.map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x} ${y - r * 2} Q${x} ${y} ${x + r * 2} ${y} Q${x} ${y} ${x} ${y + r * 2} Q${x} ${y} ${x - r * 2} ${y} Q${x} ${y} ${x} ${y - r * 2}Z`}
          fill="#fff"
          opacity={0.85}
          className="season-twinkle"
          style={{ animationDuration: `${2.4 + (i % 4) * 0.7}s`, animationDelay: `${i * 0.3}s`, transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' } as CSSProperties}
        />
      ))}
      {/* ferne Wolken */}
      <g fill="#fff" opacity="0.75">
        <ellipse cx="60" cy="190" rx="60" ry="18" />
        <ellipse cx="95" cy="176" rx="34" ry="22" />
        <ellipse cx="345" cy="300" rx="70" ry="18" />
        <ellipse cx="320" cy="286" rx="34" ry="20" />
      </g>
      {/* kleine ferne Insel */}
      <g transform="translate(250 360) scale(0.55)" opacity="0.92">
        <Island u={u} />
      </g>
      {/* große Insel links */}
      <g transform="translate(-34 470) scale(1.05)">
        <Island u={u} trees={2} />
      </g>
      {/* Insel rechts */}
      <g transform="translate(300 430) scale(0.9)">
        <Island u={u} trees={1} castle />
      </g>
      {variant === 'clouds' ? (
        <g>
          {[
            [10, 800, 70], [90, 830, 64], [170, 812, 72], [250, 836, 66], [330, 806, 72], [400, 828, 60],
            [-20, 760, 46], [60, 778, 40], [350, 770, 48], [140, 860, 70], [290, 870, 70],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={`url(#${u('cl')})`} />
          ))}
          <rect x="0" y="840" width="400" height="20" fill="#eaf6ff" />
        </g>
      ) : (
        <g>
          <path d="M0 700 Q100 640 200 690 T400 670 V860 H0Z" fill={`url(#${u('hill2')})`} />
          <path d="M0 760 Q120 700 230 750 T400 740 V860 H0Z" fill={`url(#${u('hill')})`} />
          {[30, 75, 330, 372].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i % 2 ? 660 : 680})`}>
              <rect x="-3" y="10" width="6" height="22" rx="2" fill="#7c4a24" />
              <circle cx="0" cy="4" r="17" fill="#2f9e2c" />
              <circle cx="-5" cy="-2" r="10" fill="#5fd13d" />
            </g>
          ))}
          {[[60, 800], [120, 780], [280, 800], [340, 790], [200, 820]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="4" fill={['#f472b6', '#facc15', '#fff', '#fb7185', '#a78bfa'][i]} />
              <circle r="1.6" fill="#fde047" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

function Island({ u, trees = 0, castle = false }: { u: (s: string) => string; trees?: number; castle?: boolean }) {
  return (
    <g>
      <path d="M8 34 Q60 22 112 34 L96 58 Q78 98 58 104 Q40 98 24 60 Z" fill={`url(#${u('rk')})`} />
      <path d="M30 60 Q58 72 90 58" stroke="#5e3d26" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M44 80 Q58 86 74 80" stroke="#5e3d26" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M2 34 Q60 14 118 34 Q116 44 60 46 Q4 44 2 34Z" fill={`url(#${u('gr')})`} />
      <ellipse cx="44" cy="28" rx="20" ry="4" fill="#fff" opacity="0.35" />
      {trees >= 1 && (
        <g transform="translate(84 4)">
          <rect x="-2.5" y="8" width="5" height="18" fill="#7c4a24" />
          <path d="M0 -20 L14 10 H-14Z" fill="#1f8a3a" />
          <path d="M0 -10 L16 18 H-16Z" fill="#26a447" />
        </g>
      )}
      {trees >= 2 && (
        <g transform="translate(30 10)">
          <rect x="-2.5" y="6" width="5" height="16" fill="#7c4a24" />
          <circle r="13" fill="#2f9e2c" />
          <circle cx="-4" cy="-4" r="7" fill="#6ee05a" />
        </g>
      )}
      {castle && (
        <g transform="translate(46 -18)">
          <rect x="0" y="10" width="26" height="26" fill="#e9e3f7" />
          <rect x="-8" y="2" width="10" height="34" fill="#d8cff0" />
          <rect x="24" y="2" width="10" height="34" fill="#d8cff0" />
          <path d="M-9 2 L-3 -12 L3 2Z M23 2 L29 -12 L35 2Z" fill="#8b5cf6" />
          <path d="M-1 10 L13 -8 L27 10Z" fill="#a78bfa" />
          <rect x="9" y="22" width="8" height="14" rx="4" fill="#6d4aa8" />
        </g>
      )}
    </g>
  );
}

/** Quadratischer Glanz-Knopf (Zurück, Einstellungen …) */
export function IconBtn({
  label,
  onClick,
  children,
  tone = 'light',
  size = 48,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  tone?: 'light' | 'yellow';
  size?: number;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`ui-icon-btn ${tone === 'yellow' ? 'ui-icon-btn-yellow' : ''} flex shrink-0 items-center justify-center`}
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  );
}

/** Blaue Titel-Pille mit weißer Comic-Schrift */
export function TitlePill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ui-title-pill font-game outline-text px-5 text-center leading-tight ${className}`}>{children}</div>;
}

/** Kopfzeile aller Unterseiten: ← · Titel · ⚙ (oder eigener rechter Inhalt) */
export function ScreenHeader({
  title,
  onBack,
  backLabel,
  right,
  onSettings,
  settingsLabel,
  sub,
}: {
  title: ReactNode;
  onBack?: () => void;
  backLabel: string;
  right?: ReactNode;
  onSettings?: () => void;
  settingsLabel?: string;
  sub?: ReactNode;
}) {
  return (
    <header className="relative z-10 flex items-start gap-2 px-3 pt-3">
      {onBack ? (
        <IconBtn label={backLabel} onClick={onBack}>
          <BackArrow />
        </IconBtn>
      ) : (
        <span className="w-12 shrink-0" />
      )}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
        <TitlePill className="max-w-full text-[1.3rem]">{title}</TitlePill>
        {sub}
      </div>
      {right ??
        (onSettings ? (
          <IconBtn label={settingsLabel ?? ''} onClick={onSettings}>
            <Settings className="h-7 w-7 text-[#1f4fa8]" strokeWidth={2.6} />
          </IconBtn>
        ) : (
          <span className="w-12 shrink-0" />
        ))}
    </header>
  );
}

export function BackArrow() {
  return <ChevronLeft className="h-8 w-8 text-[#1f4fa8] rtl:rotate-180" strokeWidth={3.4} />;
}

/** Vollbild-Unterseite: Himmel + Kopfzeile + scrollbarer Inhalt */
export function ScreenShell({
  header,
  children,
  variant = 'clouds',
  footer,
  className = '',
}: {
  header: ReactNode;
  children: ReactNode;
  variant?: 'clouds' | 'meadow';
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`safe-area relative flex h-[100dvh] flex-col overflow-hidden ${className}`}>
      <SkyScene variant={variant} />
      {header}
      <div className="thin-scroll relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-3">{children}</div>
      {footer && <div className="relative z-10 shrink-0 px-6 pb-5 pt-2">{footer}</div>}
    </div>
  );
}

/** Einheitlicher Container: dicker dunkler Rand, 3D-Sockel, farbiger Kopf, Lesefläche weiß/95 */
export function Panel({
  title,
  color = '#2f95f3',
  icon,
  children,
  className = '',
  bodyClass = 'px-3 py-1',
}: {
  title?: ReactNode;
  color?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <div className={`ui-panel ${className}`}>
      {title && (
        <div className="ui-panel-head flex items-center gap-2 px-3 py-2" style={{ '--c': color } as CSSProperties}>
          {icon && <span className="h-8 w-8 shrink-0">{icon}</span>}
          <span className="font-game ui-head-text min-w-0 flex-1 text-[1.15rem] leading-tight">{title}</span>
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </div>
  );
}

/** Farbiges Icon-Abzeichen für Listenzeilen */
export function IconBadge({ color, children, size = 40 }: { color: string; children: ReactNode; size?: number }) {
  return (
    <span className="ui-icon-badge shrink-0" style={{ '--c': color, width: size, height: size } as CSSProperties}>
      {children}
    </span>
  );
}

/** Rote Banderole mit gefalteten Enden */
export function Ribbon({ children, color = 'red', className = '' }: { children: ReactNode; color?: 'red' | 'gold' | 'purple' | 'green'; className?: string }) {
  const c = {
    red: ['#ff6b5e', '#e02f2f', '#9c1717', '#7a1010'],
    gold: ['#ffe27a', '#f6a91e', '#b86a07', '#8a4d04'],
    purple: ['#c58cff', '#8b3fe8', '#5a1fa6', '#43147e'],
    green: ['#7ef29a', '#22b84f', '#137a32', '#0d5a24'],
  }[color];
  return (
    <div className={`relative mx-auto flex w-fit max-w-full items-center justify-center ${className}`} style={{ '--r1': c[0], '--r2': c[1], '--r3': c[2], '--r4': c[3] } as CSSProperties}>
      <span className="ui-ribbon-end ui-ribbon-end-l" />
      <span className="ui-ribbon-end ui-ribbon-end-r" />
      <div className="ui-ribbon font-game outline-text relative z-10 px-6 py-1.5 text-center text-[1.55rem] leading-tight">{children}</div>
    </div>
  );
}

/** Grüner Spiel-Schalter */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`ui-toggle ${on ? 'ui-toggle-on' : ''}`}>
      <span className="ui-toggle-knob" />
    </button>
  );
}

/** Rotierende Lichtstrahlen hinter Belohnungen */
export function Rays({ className = '', color = '#fff6c2' }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="-100 -100 200 200" className={`pointer-events-none ui-rays-spin ${className}`}>
      <defs>
        <radialGradient id="rays-fade">
          <stop offset="0" stopColor={color} stopOpacity="1" />
          <stop offset="0.7" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M0 0 L-9 -100 L9 -100Z" fill="url(#rays-fade)" transform={`rotate(${i * 22.5})`} />
      ))}
      <circle r="42" fill="url(#rays-fade)" />
    </svg>
  );
}

/** Weiße Zähler-Pille mit Stern (oder anderem Sprite) */
export function StatPill({ value, icon = 'star', className = '' }: { value: ReactNode; icon?: 'star' | 'gem' | 'trophy'; className?: string }) {
  return (
    <div className={`ui-stat-pill flex items-center gap-1 ps-1 pe-3 ${className}`}>
      <span className="h-7 w-7 shrink-0">
        <Sprite name={icon} />
      </span>
      <span className="font-game text-[1.05rem] leading-none text-[#1b2a55]">{value}</span>
    </div>
  );
}

/** Großer Spiel-Knopf (Pille) mit Glanz und 3D-Sockel */
export function GameButton({
  children,
  onClick,
  color = 'green',
  className = '',
  disabled,
  label,
  big,
}: {
  children: ReactNode;
  onClick: () => void;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow';
  className?: string;
  disabled?: boolean;
  label?: string;
  big?: boolean;
}) {
  const c = { green: '#34c84a', blue: '#1e9bf0', purple: '#9b4dea', orange: '#fb8c1a', red: '#ef3b3b', yellow: '#f8c51c' }[color];
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`squish font-game flex items-center justify-center gap-2 rounded-full px-6 ${big ? 'h-16 text-[1.75rem]' : 'h-14 text-[1.4rem]'} ${className}`}
      style={{ '--c': c } as CSSProperties}
    >
      {children}
    </button>
  );
}

/** Emojis aus Sprachtexten entfernen (Grafiken kommen als SVG) */
export const noEmoji = (s: string) => s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s{2,}/g, ' ').trim();

/** Prunkvolle, geöffnete Schatztruhe mit Edelsteinen und Leuchten (Belohnungen) */
export function TreasureChest({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const u = (s: string) => `${id}${s}`;
  return (
    <svg viewBox="0 0 200 180" className={className} aria-hidden>
      <defs>
        <linearGradient id={u('wood')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b57bff" />
          <stop offset="0.55" stopColor="#7b3fe0" />
          <stop offset="1" stopColor="#4a1d9c" />
        </linearGradient>
        <linearGradient id={u('lid')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99bff" />
          <stop offset="1" stopColor="#6a2fd0" />
        </linearGradient>
        <linearGradient id={u('gold')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2a8" />
          <stop offset="0.5" stopColor="#f6b928" />
          <stop offset="1" stopColor="#b7700a" />
        </linearGradient>
        <radialGradient id={u('glow')} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="0.6" stopColor="#ffe36b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffe36b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* geöffneter Deckel */}
      <path d="M30 70 Q30 20 100 18 Q170 20 170 70 Z" fill={`url(#${u('lid')})`} stroke={O} strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 66 Q46 34 100 32 Q154 34 156 66" fill="none" stroke="#e5ccff" strokeWidth="4" opacity="0.6" />
      <path d="M86 19 H114 V70 H86 Z" fill={`url(#${u('gold')})`} stroke={O} strokeWidth="4" />
      <path d="M30 70 Q30 20 100 18 Q170 20 170 70" fill="none" stroke={`url(#${u('gold')})`} strokeWidth="9" />
      <path d="M30 70 Q30 20 100 18 Q170 20 170 70" fill="none" stroke={O} strokeWidth="3" />
      {/* Leuchten & Schatz */}
      <ellipse cx="100" cy="84" rx="86" ry="40" fill={`url(#${u('glow')})`} />
      <g stroke={O} strokeWidth="3" strokeLinejoin="round">
        <path d="M58 86 L70 64 L84 86 L70 96Z" fill="#38bdf8" />
        <path d="M120 84 L134 60 L148 84 L134 94Z" fill="#f472b6" />
        <path d="M86 80 L100 52 L114 80 L100 92Z" fill="#a78bfa" />
        <circle cx="76" cy="90" r="9" fill={`url(#${u('gold')})`} />
        <circle cx="126" cy="92" r="9" fill={`url(#${u('gold')})`} />
        <circle cx="102" cy="94" r="10" fill={`url(#${u('gold')})`} />
      </g>
      <path d="M100 58 L104 70 L116 72 L106 79 L109 91 L100 84 L91 91 L94 79 L84 72 L96 70Z" fill="#ffe14d" stroke={O} strokeWidth="3" strokeLinejoin="round" />
      {/* Korpus */}
      <path d="M22 86 H178 L170 166 H30 Z" fill={`url(#${u('wood')})`} stroke={O} strokeWidth="5" strokeLinejoin="round" />
      <path d="M22 86 H178 L177 100 H23Z" fill={`url(#${u('gold')})`} stroke={O} strokeWidth="4" />
      <path d="M28 150 H172 L170 166 H30Z" fill={`url(#${u('gold')})`} stroke={O} strokeWidth="4" />
      <path d="M50 100 V158 M150 100 V158" stroke={`url(#${u('gold')})`} strokeWidth="10" />
      <path d="M50 100 V158 M150 100 V158" stroke={O} strokeWidth="2" opacity="0.6" />
      <rect x="82" y="100" width="36" height="40" rx="8" fill={`url(#${u('gold')})`} stroke={O} strokeWidth="4" />
      <circle cx="100" cy="116" r="6" fill={O} />
      <path d="M97 118 H103 L102 130 H98Z" fill={O} />
      <path d="M60 112 Q64 108 70 110" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" fill="none" />
    </svg>
  );
}

export { O as OUTLINE_COLOR };
