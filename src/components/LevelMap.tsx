// ─────────────────────────────────────────────────────────────
// Endlose Abenteuer-Karte einer Welt: Level 1 unten, nach oben ∞.
// Meilenstein-Inseln alle 10 Level, Schatztruhen-Balken oben.
// ─────────────────────────────────────────────────────────────
import { Clapperboard } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { handcrafted, levelAt } from '../data/levels';
import { CHEST_EVERY, isMilestone } from '../data/rewards';
import { WORLDS } from '../data/worlds';
import type { ProgressApi, Reward } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { scrollWithin } from '../scrollWithin';
import type { AgeGroupId } from '../types';
import { MoviePlayer } from './MoviePlayer';
import { Particles } from './Particles';
import { SeasonBanner, SeasonLayer } from './SeasonLayer';
import { Sprite, WORLD_SPRITES } from './sprites';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import { RewardPopup } from './RewardPopup';
import { IconBtn, ScreenHeader, StatPill } from './ui';
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
  const sp = WORLD_SPRITES[group];
  const { theme: season } = useSeasonalTheme();
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
      <SeasonLayer dense />

      {/* ── Kopf: ← · Welt-Pille · ⚙ – darunter Sterne & Alter ── */}
      <ScreenHeader
        title={wt.world}
        backLabel={t.ui.back}
        onBack={() => {
          sound.play('click');
          onBack();
        }}
        onSettings={onSettings}
        settingsLabel={t.settings.title}
        sub={
          <div className="flex items-center gap-2">
            <StatPill value={total} />
            <span className="ui-stat-pill font-game flex items-center px-3 text-[13px] text-[#1b2a55]">{wt.ages}</span>
          </div>
        }
      />

      <div className="relative z-10 mt-2">
        <SeasonBanner />
      </div>

      {/* Erklär-Kino + Schatztruhen-Balken */}
      <div className="relative z-10 flex items-center gap-2 px-3 pb-2 pt-2">
        <IconBtn
          tone="yellow"
          size={52}
          label={t.movie.button}
          onClick={() => {
            sound.play('click');
            setMovieOpen(true);
          }}
        >
          <Clapperboard className="h-7 w-7 text-[#5a2d00]" strokeWidth={2.6} />
        </IconBtn>
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
            <path d={d} fill="none" stroke="#1d1530" strokeWidth="24" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.55" />
            <path d={d} fill="none" stroke={season.fest ? '#fbbf24' : w.path} strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.95" />
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
            const label = !w.showText ? null : milestone ? t.map.milestone(n) : n <= handcrafted(group) && open ? levelTitle(levelAt(group, n)) : null;
            return (
              <div key={id}>
                {/* Deko neben dem Pfad */}
                <span
                  className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-95 drop-shadow-lg"
                  style={{ left: `${x > 0.5 ? 14 + (n % 3) * 4 : 84 - (n % 3) * 4}%`, top: yOf(n) + 34 }}
                >
                  <Sprite name={milestone ? 'chest' : n % 4 === 0 && season.decor.length ? season.decor[n % season.decor.length] : sp.deco[n % sp.deco.length]} />
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
                  {/* Level-Knopf als glänzende Edelstein-Kugel mit Goldrand */}
                  <span
                    className={`orb relative flex items-center justify-center rounded-full font-black ${isCurrent ? 'orb-current' : ''} ${milestone && open ? 'animate-breathe' : ''} ${open ? '' : 'orb-locked'}`}
                    style={{ '--c': color, width: size, height: size, fontSize: milestone ? 36 : 32 } as CSSProperties}
                  >
                    {open ? <span className="outline-text">{n}</span> : <Sprite name="lock" className="h-[55%] w-[55%]" />}
                    {milestone && (
                      <span className="absolute -right-3 -top-4 h-10 w-10 drop-shadow">
                        <Sprite name={s > 0 ? 'trophy' : 'gift'} />
                      </span>
                    )}
                  </span>
                  <span className="-mt-3 flex">
                    {[1, 2, 3].map((k) => (
                      <span key={k} className={`h-6 w-6 ${k === 2 ? 'translate-y-1.5' : ''} ${open && k <= s ? '' : 'opacity-60 grayscale'}`}>
                        <Sprite name="star" />
                      </span>
                    ))}
                  </span>
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
      className={`ui-tile flex min-h-[52px] min-w-0 flex-1 items-center gap-2 !rounded-full px-2 py-1 text-start ${p.ready ? 'ui-tile-selected animate-breathe' : ''}`}
    >
      <span className={`h-10 w-10 shrink-0 ${p.ready ? 'animate-wiggle' : ''}`}>
        <Sprite name={p.ready ? 'gift' : 'chest'} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-game block truncate text-[14px] text-[#1b2a55]">{p.ready ? p.readyLabel : p.label}</span>
        <span className="mt-0.5 block h-3.5 overflow-hidden rounded-full bg-[#cfdcef] shadow-[inset_0_2px_2px_rgba(0,0,0,.2),0_0_0_2px_#2a3f78]">
          <span
            className="block h-full rounded-full bg-gradient-to-b from-[#ffe680] via-[#f8c51c] to-[#e88a0c] transition-[width] duration-700"
            style={{ width: `${(p.fill / CHEST_EVERY) * 100}%` }}
          />
        </span>
      </span>
      <span className="font-game flex shrink-0 items-center gap-0.5 pe-1 text-[14px] text-[#1b2a55]">
        {p.fill}/{CHEST_EVERY}
        <span className="h-5 w-5">
          <Sprite name="star" />
        </span>
      </span>
    </button>
  );
}
