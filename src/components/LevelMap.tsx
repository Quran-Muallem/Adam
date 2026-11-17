// Scrollbare Abenteuer-Karte einer Welt: geschwungener Pfad mit 20 Level-Inseln
import { ChevronLeft, Lock, Star } from 'lucide-react';
import { useEffect, useRef, type CSSProperties } from 'react';
import type { CostumeId } from '../data/costumes';
import { levelsFor } from '../data/levels';
import { WORLDS } from '../data/worlds';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { AgeGroupId } from '../types';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

interface Props {
  group: AgeGroupId;
  sound: SoundApi;
  stars: Record<string, number>;
  costume: CostumeId;
  isUnlocked: (g: AgeGroupId, i: number) => boolean;
  onBack: () => void;
  onOpen: (levelId: string) => void;
}

const STEP = 118; // Abstand der Inseln in px
const TOP = 130;
const W = 360; // Koordinatensystem-Breite für den Pfad

/** Schlangenlinie: x-Position (0–1) für Level i */
const xAt = (i: number) => 0.5 + Math.sin(i * 0.95) * 0.3;

export function LevelMap({ group, sound, stars, costume, isUnlocked, onBack, onOpen }: Props) {
  const w = WORLDS[group];
  const levels = levelsFor(group);
  const total = levels.reduce((n, l) => n + (stars[l.id] ?? 0), 0);
  const current = Math.max(
    0,
    levels.findIndex((l, i) => isUnlocked(group, i) && !(stars[l.id] > 0)),
  );
  const currentIdx = levels.every((l) => stars[l.id] > 0) ? levels.length - 1 : current;
  const height = TOP * 2 + (levels.length - 1) * STEP + 40;
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  // Pfad durch alle Inseln (kubische Kurven)
  const pts = levels.map((_, i) => ({ x: xAt(i) * W, y: TOP + i * STEP }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const my = (prev.y + p.y) / 2;
    return `${acc} C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }, '');

  return (
    <div className={`safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-b ${w.bg}`}>
      <Particles kind={w.particles} />

      <header className="relative z-10 flex items-center gap-3 p-3">
        <RoundBtn
          label="Zurück"
          onClick={() => {
            sound.play('click');
            onBack();
          }}
          color="#ffffff"
          dark
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </RoundBtn>
        <div className={`min-w-0 flex-1 ${w.text} drop-shadow`}>
          <h2 className="truncate text-xl font-bold leading-tight">
            {w.emoji} {w.world}
          </h2>
          <p className="text-sm font-semibold opacity-90">
            {w.name} · {w.ages}
          </p>
        </div>
        <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 text-lg font-bold text-slate-700">
          <Star className="h-5 w-5 fill-yellow-300 text-amber-500" /> {total}/{levels.length * 3}
        </div>
      </header>

      <div ref={scrollRef} className="thin-scroll relative z-10 flex-1 overflow-y-auto">
        <div className="relative mx-auto w-full max-w-md" style={{ height }}>
          {/* Pfad */}
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden>
            <path d={d} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="22" strokeLinecap="round" vectorEffect="non-scaling-stroke" transform="translate(0 5)" />
            <path d={d} fill="none" stroke={w.path} strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.9" />
            <path d={d} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Deko */}
          {levels.map((_, i) => (
            <span
              key={`d${i}`}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl opacity-90 drop-shadow"
              style={{ left: `${xAt(i) > 0.5 ? 12 + (i % 3) * 4 : 84 - (i % 3) * 4}%`, top: TOP + i * STEP + 30, animationDelay: `${i * 0.3}s` }}
            >
              {w.decor[i % w.decor.length]}
            </span>
          ))}

          {/* Level-Inseln */}
          {levels.map((l, i) => {
            const open = isUnlocked(group, i);
            const s = stars[l.id] ?? 0;
            const isCurrent = i === currentIdx;
            const color = !open ? '#94a3b8' : s === 3 ? '#f59e0b' : w.accent;
            return (
              <button
                key={l.id}
                ref={isCurrent ? currentRef : undefined}
                type="button"
                disabled={!open}
                aria-label={open ? `Level ${i + 1}` : `Level ${i + 1} gesperrt`}
                onClick={() => {
                  sound.play('unlock');
                  onOpen(l.id);
                }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${xAt(i) * 100}%`, top: TOP + i * STEP }}
              >
                {isCurrent && (
                  <div className={`absolute top-1/2 h-16 w-16 -translate-y-[70%] ${xAt(i) > 0.5 ? '-left-[66px]' : '-right-[66px]'}`}>
                    <Sparky mood="happy" costume={costume} />
                  </div>
                )}
                <span
                  className={`squish flex h-[76px] w-[76px] items-center justify-center rounded-full text-3xl font-bold ${isCurrent ? 'ring-4 ring-white' : ''}`}
                  style={{ '--c': color } as CSSProperties}
                >
                  {open ? i + 1 : <Lock className="h-8 w-8" strokeWidth={3} />}
                </span>
                {open && (
                  <span className="glass -mt-2 flex rounded-full px-1.5 py-0.5">
                    {[1, 2, 3].map((k) => (
                      <Star key={k} className={`h-4 w-4 ${k <= s ? 'fill-yellow-300 text-amber-500' : 'fill-slate-100 text-slate-300'}`} />
                    ))}
                  </span>
                )}
                {open && w.showText && (
                  <span className={`mt-0.5 max-w-[120px] text-center text-xs font-bold leading-tight ${w.text} drop-shadow`}>{l.title}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
