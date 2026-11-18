// ─────────────────────────────────────────────────────────────
// Saison-Ebene: Farbschleier, Partikel (Schnee, Blätter, Laternen,
// Fledermäuse, Feuerwerk …) und große Deko-Sprites am Bildrand.
// Plus das Event-Banner („Ramadan-Event · Sammle Datteln!“).
// ─────────────────────────────────────────────────────────────
import { useMemo, type CSSProperties } from 'react';
import type { FestId, SeasonParticle } from '../data/seasons';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import { useI18n } from '../i18n';
import { Sprite, type SpriteName } from './sprites';

/** Welche Grafik fliegt bei welchem Partikel-Typ */
const PARTICLE_SPRITE: Partial<Record<NonNullable<SeasonParticle>, SpriteName>> = {
  petals: 'blossom',
  leaves: 'leaf',
  bats: 'bat',
  lanterns: 'lantern',
  eggs: 'egg',
};
/** Animation: fallen, steigen oder fliegen */
const MOTION: Record<NonNullable<SeasonParticle>, 'fall' | 'rise' | 'fly' | 'pop' | 'twinkle'> = {
  petals: 'fall',
  leaves: 'fall',
  snow: 'fall',
  confetti: 'fall',
  eggs: 'pop',
  bats: 'fly',
  lanterns: 'rise',
  fireworks: 'pop',
  goldstars: 'twinkle',
  sun: 'twinkle',
};

/** Feste Plätze für die großen Deko-Sprites */
const DECOR_SPOTS: CSSProperties[] = [
  { left: '-4%', top: '16%', width: '30%' },
  { right: '-2%', top: '9%', width: '18%' },
  { right: '4%', top: '44%', width: '16%' },
];

export function SeasonLayer({ dense = false }: { dense?: boolean }) {
  const { theme } = useSeasonalTheme();
  const kind = theme.particles;
  const items = useMemo(
    () =>
      Array.from({ length: kind ? (dense ? 16 : 11) : 0 }, (_, i) => ({
        i,
        left: (i * 37 + 11) % 100,
        delay: -((i * 1.7) % 9),
        dur: 7 + ((i * 13) % 6),
        size: 14 + ((i * 7) % 3) * 6,
      })),
    [kind, dense],
  );
  if (theme.id === 'normal') return null;
  const sprite = kind ? PARTICLE_SPRITE[kind] : undefined;
  const motion = kind ? MOTION[kind] : 'fall';

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: theme.tint }} />
      {/* Große Deko */}
      {theme.decor.map((name, i) => (
        <div
          key={`${name}${i}`}
          className={`absolute ${name === 'lantern' ? 'season-swing origin-top' : 'animate-float'}`}
          style={{ ...DECOR_SPOTS[i % DECOR_SPOTS.length], animationDelay: `${-i * 1.3}s`, opacity: 0.95 }}
        >
          {name === 'lantern' && <div className="mx-auto h-8 w-0.5 bg-amber-200/70" />}
          <Sprite name={name} className="h-auto w-full drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]" />
        </div>
      ))}
      {/* Partikel */}
      {items.map((p) => {
        const style: CSSProperties = {
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.dur}s`,
          top: motion === 'rise' ? '105%' : motion === 'fall' ? '-8%' : `${(p.i * 23) % 80}%`,
        };
        const cls = `absolute season-${motion}`;
        if (sprite)
          return (
            <span key={p.i} className={cls} style={style}>
              <Sprite name={sprite} />
            </span>
          );
        if (kind === 'snow')
          return <span key={p.i} className={`${cls} rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,.9)]`} style={{ ...style, width: p.size / 2.2, height: p.size / 2.2 }} />;
        if (kind === 'confetti')
          return <span key={p.i} className={`${cls} rounded-sm`} style={{ ...style, width: 8, height: 12, background: ['#f43f5e', '#facc15', '#22c55e', '#3b82f6', '#a855f7'][p.i % 5] }} />;
        if (kind === 'fireworks') return <span key={p.i} className={cls} style={style}><Sprite name="firework" /></span>;
        // goldstars / sun
        return <span key={p.i} className={cls} style={{ ...style, width: p.size * 0.8, height: p.size * 0.8 }}><Sprite name={kind === 'sun' ? 'sunny' : 'star'} /></span>;
      })}
    </div>
  );
}

/** Verziertes Event-Banner (nur an Festtagen) */
export function SeasonBanner() {
  const { theme } = useSeasonalTheme();
  const { t } = useI18n();
  if (!theme.fest) return null;
  const islamic = theme.culture === 'islamic';
  return (
    <div className="relative z-10 mx-auto w-full max-w-md px-2">
      <div
        className="relative flex items-center justify-center gap-2 rounded-2xl border-[3px] px-4 py-2 text-center shadow-[0_5px_0_rgba(0,0,0,0.35)]"
        style={{
          borderColor: '#facc15',
          background: islamic ? 'linear-gradient(180deg,#065f46,#064e3b)' : theme.id === 'halloween' ? 'linear-gradient(180deg,#7c2d12,#431407)' : 'linear-gradient(180deg,#b91c1c,#7f1d1d)',
        }}
      >
        <span className="h-7 w-7 shrink-0">
          <Sprite name={theme.decor[0]} />
        </span>
        <span className="text-[15px] font-black uppercase leading-tight tracking-wide text-amber-200 [text-shadow:0_2px_0_rgba(0,0,0,.5)]">
          {t.season.banner[theme.id as FestId]}
        </span>
        <span className="h-7 w-7 shrink-0">
          <Sprite name={theme.decor[1] ?? theme.decor[0]} />
        </span>
      </div>
    </div>
  );
}
