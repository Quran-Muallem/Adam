// ─────────────────────────────────────────────────────────────
// Endlose Abenteuer-Karte einer Welt: Level 1 unten, nach oben ∞.
// Meilenstein-Inseln alle 10 Level, Schatztruhen-Balken oben.
// ─────────────────────────────────────────────────────────────
import { ChevronLeft, Lock, Settings, Star } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { handcrafted, levelAt } from '../data/levels';
import { CHEST_EVERY, isMilestone } from '../data/rewards';
import { WORLDS } from '../data/worlds';
import type { ProgressApi, Reward } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { scrollWithin } from '../scrollWithin';
import type { AgeGroupId } from '../types';
import { RoundBtn } from './GameScreen';
import { MoviePlayer } from './MoviePlayer';
import { Particles } from './Particles';
import { RewardPopup } from './RewardPopup';
import { Sparky } from './Sparky';

interface Props {
  group: AgeGroupId;
  sound: SoundApi;
  prog: ProgressApi;
  onBack: () => void;
  onOpen: (levelId: string) => void;
  onSettings: () => void;
}

const STEP = 132; // Abstand der Inseln in px
const PAD = 120;
const W = 360;
const LOAD_MORE = 20;

/** Schlangenlinie: x-Position (0–1) für Level n */
const xAt = (n: number) => 0.5 + Math.sin(n * 0.95) * 0.28;

export function LevelMap({ group, sound, prog, onBack, onOpen, onSettings }: Props) {
  const w = WORLDS[group];
  const { t, levelTitle } = useI18n();
  const wt = t.worlds[group];
  const stars = prog.progress.stars;
  const current = prog.frontier(group);

  // Wie viele Inseln gezeigt werden – wächst beim Hochscrollen
  const [count, setCount] = useState(() => Math.ceil(Math.max(30, current + 15) / 10) * 10);
  const height = PAD * 2 + (count - 1) * STEP;
  const yOf = (n: number) => PAD + (count - n) * STEP; // Level 1 ganz unten

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  const prevCount = useRef(count);
  const [chestReward, setChestReward] = useState<Reward | null>(null);

  // Erklär-Kino startet beim allerersten Besuch einer Welt automatisch
  const seenKey = `sparky:movieSeen:${group}`;
  const [movieOpen, setMovieOpen] = useState(() => {
    try {
      return localStorage.getItem(seenKey) !== '1';
    } catch {
      return false;
    }
  });
  const closeMovie = () => {
    try {
      localStorage.setItem(seenKey, '1');
    } catch {
      /* ignorieren */
    }
    setMovieOpen(false);
  };

  useEffect(() => {
    scrollWithin(currentRef.current, 'center', false);
  }, []);

  // Neue Inseln kommen OBEN dazu → Scrollposition erhalten
  useLayoutEffect(() => {
    const added = count - prevCount.current;
    if (added > 0 && scrollRef.current) scrollRef.current.scrollTop += added * STEP;
    prevCount.current = count;
  }, [count]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop < 400) setCount((c) => c + LOAD_MORE);
  };

  // Pfad durch alle Inseln
  const pts = Array.from({ length: count }, (_, i) => ({ x: xAt(i + 1) * W, y: yOf(i + 1) }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const my = (prev.y + p.y) / 2;
    return `${acc} C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }, '');

  const total = prog.starsIn(group);

  return (
    <div className={`world-${group} safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-b ${w.bg}`}>
      <Particles kind={w.particles} />

      {/* ── Kopf: 2 Zeilen, Titel nie abgeschnitten ── */}
      <header className="relative z-10 px-3 pt-3">
        <div className="flex items-start gap-3">
          <RoundBtn
            label={t.ui.back}
            onClick={() => {
              sound.play('click');
              onBack();
            }}
            color="#ffffff"
            dark
          >
            <ChevronLeft className="h-8 w-8 rtl:rotate-180" strokeWidth={3} />
          </RoundBtn>
          <h2 className={`min-w-0 flex-1 pt-1 text-base font-bold leading-tight sm:text-xl ${w.text} drop-shadow`}>
            {w.emoji} {wt.world}
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full border border-white/25 bg-slate-900/70 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm sm:text-sm">
            {wt.name} · {wt.ages}
          </span>
          <span className="glass flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold text-slate-700">
            <Star className="h-4 w-4 fill-yellow-300 text-amber-500" /> {total}
          </span>
          <span className="flex-1" />
          <RoundBtn label={t.settings.title} onClick={onSettings} color="#ffffff" dark>
            <Settings className="h-6 w-6" />
          </RoundBtn>
        </div>
      </header>

      {/* Kumpel-Modus + Schatztruhen-Balken */}
      <div className="relative z-10 flex flex-col gap-2 px-3 pb-2 pt-2">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setMovieOpen(true);
          }}
          className="squish flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-1 text-sm font-bold !text-amber-950 [text-shadow:none] sm:text-base"
          style={{ '--c': '#facc15' } as CSSProperties}
        >
          {t.movie.button}
        </button>
        <ChestBar
          fill={prog.chestFill}
          ready={prog.chestReady}
          label={t.map.chest}
          readyLabel={t.map.chestReady}
          onOpen={() => {
            const r = prog.openChest();
            if (r) {
              sound.play('win');
              setChestReward(r);
            }
          }}
        />
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="thin-scroll relative z-10 flex-1 overflow-y-auto">
        <div className="relative mx-auto w-full max-w-md" style={{ height }}>
          {/* Pfad */}
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden>
            <path d={d} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="22" strokeLinecap="round" vectorEffect="non-scaling-stroke" transform="translate(0 5)" />
            <path d={d} fill="none" stroke={w.path} strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.9" />
            <path d={d} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {Array.from({ length: count }, (_, i) => {
            const n = i + 1;
            const id = `${group}-${n}`;
            const open = prog.isUnlocked(group, n);
            const s = stars[id] ?? 0;
            const isCurrent = n === current;
            const milestone = isMilestone(n);
            const x = xAt(n);
            const color = !open ? '#94a3b8' : milestone ? '#f59e0b' : s === 3 ? '#eab308' : w.accent;
            const size = milestone ? 96 : 76;
            // Namensschild: handgefertigte Level und Meilensteine
            const label = !w.showText ? null : milestone ? `🎁 ${t.map.milestone(n)}` : n <= handcrafted(group) && open ? levelTitle(levelAt(group, n)) : null;
            return (
              <div key={id}>
                {/* Deko neben dem Pfad */}
                <span
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl opacity-90 drop-shadow"
                  style={{ left: `${x > 0.5 ? 12 + (n % 3) * 4 : 84 - (n % 3) * 4}%`, top: yOf(n) + 34 }}
                >
                  {milestone ? '💎' : w.decor[n % w.decor.length]}
                </span>
                <button
                  ref={isCurrent ? currentRef : undefined}
                  type="button"
                  disabled={!open}
                  aria-label={open ? t.ui.level(n) : t.ui.levelLocked(n)}
                  onClick={() => {
                    sound.play('unlock');
                    onOpen(id);
                  }}
                  className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${x * 100}%`, top: yOf(n) }}
                >
                  {isCurrent && (
                    <div className={`absolute top-1/2 h-16 w-16 -translate-y-[70%] ${x > 0.5 ? '-left-[66px]' : '-right-[66px]'}`}>
                      <Sparky mood="happy" />
                    </div>
                  )}
                  <span
                    className={`squish relative flex items-center justify-center rounded-full font-bold ${isCurrent ? 'ring-4 ring-white' : ''} ${milestone && open ? 'animate-breathe' : ''}`}
                    style={{ '--c': color, width: size, height: size, fontSize: milestone ? 34 : 30 } as CSSProperties}
                  >
                    {open ? n : <Lock className="h-8 w-8" strokeWidth={3} />}
                    {milestone && <span className="absolute -right-2 -top-3 text-3xl drop-shadow">{s > 0 ? '🏆' : '🎁'}</span>}
                  </span>
                  {open && (
                    <span className="glass -mt-2 flex rounded-full px-1.5 py-0.5">
                      {[1, 2, 3].map((k) => (
                        <Star key={k} className={`h-4 w-4 ${k <= s ? 'fill-yellow-300 text-amber-500' : 'fill-slate-100 text-slate-300'}`} />
                      ))}
                    </span>
                  )}
                  {label && (
                    <span
                      className={`z-20 mt-2 max-w-[170px] rounded-full border border-white/25 px-3 py-1 text-center text-xs font-extrabold leading-tight tracking-wide text-white shadow-lg backdrop-blur-sm sm:text-sm ${
                        milestone ? 'bg-amber-600/90' : 'bg-slate-900/85'
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {movieOpen && <MoviePlayer group={group} sound={sound} costume={prog.costume} onClose={closeMovie} />}
      {chestReward && <RewardPopup title={t.map.chestWon} icon="🎁" reward={chestReward} onClose={() => setChestReward(null)} />}
    </div>
  );
}

/** Magische Schatztruhe: füllt sich mit jedem Stern, platzt bei CHEST_EVERY auf */
export function ChestBar(p: { fill: number; ready: boolean; label: string; readyLabel: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      disabled={!p.ready}
      onClick={p.onOpen}
      className={`glass flex w-full items-center gap-3 rounded-full px-3 py-1.5 text-start ${p.ready ? 'animate-breathe ring-4 ring-yellow-300' : ''}`}
    >
      <span className={`text-3xl ${p.ready ? 'animate-wiggle' : ''}`}>{p.ready ? '🎁' : '🧰'}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-slate-600">{p.ready ? p.readyLabel : p.label}</span>
        <span className="mt-0.5 block h-3 overflow-hidden rounded-full bg-slate-200">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 transition-[width] duration-700"
            style={{ width: `${(p.fill / CHEST_EVERY) * 100}%` }}
          />
        </span>
      </span>
      <span className="text-sm font-bold text-slate-700">
        {p.fill}/{CHEST_EVERY} ⭐
      </span>
    </button>
  );
}
