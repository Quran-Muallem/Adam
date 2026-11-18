// Spielfeld: 3D-Kacheln, Gegenstände, Portale und Sparky
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { CostumeId } from '../data/costumes';
import type { WorldConfig } from '../data/worlds';
import { DIR_ANGLE, DIR_VEC, initialState, parseMap, posKey } from '../engine/world';
import type { Frame, LevelDef } from '../types';
import { Sparky, type SparkyMood } from './Sparky';
import { Sprite, WORLD_SPRITES } from './sprites';
import type { ThemeConfig } from '../data/seasons';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';

interface Props {
  level: LevelDef;
  world: WorldConfig;
  frame: Frame | null;
  frameIndex: number;
  stepMs: number;
  mood: SparkyMood;
  /** Ohne Angabe: Kostüm aus dem SparkyLook-Kontext */
  costume?: CostumeId;
}

const PORTAL_COLORS: Record<string, string> = {
  '1': 'conic-gradient(#22d3ee,#a78bfa,#22d3ee,#a78bfa,#22d3ee)',
  '2': 'conic-gradient(#f472b6,#fde047,#f472b6,#fde047,#f472b6)',
  '3': 'conic-gradient(#4ade80,#38bdf8,#4ade80,#38bdf8,#4ade80)',
};

export function Board({ level, world, frame, frameIndex, stepMs, mood, costume }: Props) {
  const map = useMemo(() => parseMap(level), [level]);
  const { theme: season } = useSeasonalTheme();
  const state = frame?.state ?? initialState(level, map);
  const { cols, rows } = map;

  const moveMs = Math.round(stepMs * 0.75);
  const bump = frame?.motion === 'bump' && frame.bumpDir ? DIR_VEC[frame.bumpDir] : null;
  const teleportIn = frame?.motion === 'teleportIn';
  const showArrow = world.id !== 'mini';
  // Kachelgröße in Pixeln messen (statt cqw/cqh – funktioniert in jedem Android-WebView)
  const boxRef = useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = useState(40);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setCellPx(Math.max(8, Math.min(el.clientWidth / cols, el.clientHeight / rows)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols, rows]);
  const fontSize = `${Math.round(cellPx * 0.58)}px`;

  return (
    <div
      ref={boxRef}
      className="relative mx-auto my-[10px] w-[calc(100%-22px)] shrink-0"
      style={{ aspectRatio: `${cols} / ${rows}`, maxWidth: `min(calc(100% - 22px), calc(var(--board-h) * ${cols} / ${rows}))` }}
    >
      {/* Tablet-Rahmen mit Metall-Rand (wie im Casual-Game) */}
      <div className="board-frame absolute -inset-[10px]" style={{ '--rim': world.frame } as CSSProperties} />
      <div
        className="absolute inset-0 grid gap-[3px] overflow-hidden rounded-[1.2rem] p-[4px]"
        style={{
          // minmax(0,1fr): alle Reihen/Spalten exakt gleich groß, egal wie groß der Inhalt ist
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          background: world.boardBg,
          boxShadow: 'inset 0 4px 14px rgba(0,0,0,.45)',
        }}
      >
        {map.tiles.flatMap((row, y) =>
          row.map((tile, x) => {
            const k = posKey({ x, y });
            const wall = tile === '#';
            const base = (x + y) % 2 === 0 ? world.tileA : world.tileB;
            return (
              <div
                key={k}
                className={`relative flex min-h-0 min-w-0 items-center justify-center rounded-[20%] leading-none ${wall ? '' : 'path-tile'}`}
                style={{ ['--t' as string]: base, fontSize }}
              >
                <TileContent tile={tile} world={world} state={state} k={k} season={season} />
              </div>
            );
          }),
        )}
      </div>

      {/* Register-Anzeige (Variable n) */}
      {level.palette.includes('setVar') && (
        <div
          key={`n${state.n}`}
          className="pointer-events-none absolute -top-3 start-3 z-20 animate-pop rounded-full border border-indigo-300/60 bg-indigo-950/90 px-2.5 py-0.5 font-mono text-sm font-bold text-indigo-100 shadow-lg"
          dir="ltr"
        >
          n = {state.n}
        </div>
      )}

      {/* Zweiter Bot (Zwei-Bot-Synchronisation) */}
      {state.pos2 && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            left: `${(state.pos2.x / cols) * 100}%`,
            top: `${(state.pos2.y / rows) * 100}%`,
            transition: `left ${moveMs}ms cubic-bezier(.45,.05,.35,1.25), top ${moveMs}ms cubic-bezier(.45,.05,.35,1.25)`,
            filter: 'hue-rotate(150deg) saturate(1.3) drop-shadow(0 0 6px rgba(94,234,212,.8))',
            opacity: 0.92,
          }}
        >
          <div className="h-full w-full scale-100">
            <Sparky mood={mood} dir={state.dir} costume="none" />
          </div>
        </div>
      )}

      {/* Sparky */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          width: `${100 / cols}%`,
          height: `${100 / rows}%`,
          left: `${((state.pos.x + (bump ? bump.x * 0.32 : 0)) / cols) * 100}%`,
          top: `${((state.pos.y + (bump ? bump.y * 0.32 : 0)) / rows) * 100}%`,
          transition: teleportIn
            ? 'none'
            : `left ${moveMs}ms cubic-bezier(.45,.05,.35,1.25), top ${moveMs}ms cubic-bezier(.45,.05,.35,1.25)`,
        }}
      >
        {showArrow && (
          <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `rotate(${DIR_ANGLE[state.dir]}deg)` }}>
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
              <path d="M98 50 L82 38 L82 62 Z" fill="#fde047" stroke="#92400e" strokeWidth="4" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div
          key={frameIndex}
          className={`h-full w-full ${frame?.motion === 'jump' ? 'animate-hop' : ''} ${
            frame?.motion === 'teleportOut' ? 'animate-teleport-out' : teleportIn ? 'animate-teleport-in' : ''
          }`}
          style={{
            ['--hop-dur' as string]: `${moveMs}ms`,
            ['--tp' as string]: `${Math.round(stepMs * 0.5)}ms`,
            ['--wob' as string]: `${moveMs}ms`,
          }}
        >
          <div className="h-full w-full">
            <Sparky mood={mood} dir={state.dir} costume={costume} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TileContent({ tile, world, state, k, season }: { tile: string; world: WorldConfig; state: Frame['state']; k: string; season: ThemeConfig }) {
  const sp = WORLD_SPRITES[world.id];
  switch (tile) {
    case '#':
      return <Sprite name={sp.wall} className="h-[108%] w-[108%] drop-shadow-[0_4px_4px_rgba(0,0,0,.45)]" />;
    case 'o':
      return <Sprite name={sp.low} className="h-[80%] w-[80%] drop-shadow-md" />;
    case 'B':
      return <Sprite name="bear" className="h-[86%] w-[86%] drop-shadow-md" />;
    case 'P':
      return (
        <span
          className="block h-[62%] w-[82%] rounded-[50%]"
          style={{
            background: 'radial-gradient(ellipse at 35% 35%, #e0f2fe 0%, #38bdf8 35%, #0369a1 100%)',
            boxShadow: 'inset 0 -3px 6px rgba(3,105,161,.6), 0 2px 0 rgba(0,0,0,.15)',
          }}
        />
      );
    case '*':
      return state.collected.includes(k) ? null : (
        <span className="h-[74%] w-[74%] animate-float drop-shadow-[0_0_8px_rgba(255,255,255,.9)]">
          <Sprite name={season.collectible ?? sp.bonus} />
        </span>
      );
    case 'K':
      return state.hasKey ? null : (
        <span className="h-[76%] w-[76%] animate-wiggle drop-shadow-[0_0_8px_rgba(253,224,71,.9)]">
          <Sprite name="key" />
        </span>
      );
    case 'D':
      return state.openGates.includes(k) ? (
        <span className="animate-pop opacity-80">✨</span>
      ) : (
        <span className="relative h-[86%] w-[86%]">
          <Sprite name="gate" />
          <span className="absolute -bottom-[8%] -right-[12%] h-[45%] w-[45%]">
            <Sprite name="lock" />
          </span>
        </span>
      );
    case 'G':
      return (
        <span className="h-[84%] w-[84%] animate-float drop-shadow-[0_0_12px_rgba(255,255,255,.95)]">
          <Sprite name={sp.goal} />
        </span>
      );
    case 'H':
      return (
        <span className="relative h-[80%] w-[80%] animate-float drop-shadow-[0_0_12px_rgba(94,234,212,.95)]" style={{ filter: 'hue-rotate(150deg)' }}>
          <Sprite name={sp.goal} />
          <span className="absolute -bottom-[15%] -right-[25%] rounded-full bg-teal-400 px-[0.3em] text-[38%] font-black text-slate-900">2</span>
        </span>
      );
    case 'T':
      return <span className="absolute inset-[18%] rounded-full border-[3px] border-dashed border-teal-300/80" />;
    case 'L':
      return state.lasersOn ? (
        <span className="relative flex h-full w-full items-center justify-center">
          <span className="absolute inset-y-[8%] w-[22%] animate-pulse rounded-full bg-red-500" style={{ boxShadow: '0 0 10px 4px rgba(239,68,68,.85), 0 0 22px 8px rgba(244,63,94,.45)' }} />
          <span className="absolute inset-y-[8%] w-[8%] rounded-full bg-white/90" />
        </span>
      ) : (
        <span className="h-[70%] w-[22%] rounded-full border-2 border-dashed border-red-400/40" />
      );
    case 'X':
      return (
        <span
          className="flex h-[66%] w-[66%] items-center justify-center rounded-full border-[3px] font-black"
          style={{
            borderColor: state.lasersOn ? '#f87171' : '#4ade80',
            background: state.lasersOn ? 'radial-gradient(circle,#7f1d1d,#450a0a)' : 'radial-gradient(circle,#14532d,#052e16)',
            boxShadow: state.lasersOn ? '0 0 10px rgba(248,113,113,.8)' : '0 0 10px rgba(74,222,128,.8)',
            color: state.lasersOn ? '#fecaca' : '#bbf7d0',
            fontSize: '45%',
          }}
        >
          ⏻
        </span>
      );
    case 'S':
      return <span className="absolute inset-[18%] rounded-full border-[3px] border-dashed border-white/70" />;
    default:
      if (/[1-9]/.test(tile))
        return (
          <span className="relative flex h-[78%] w-[78%] items-center justify-center">
            <span className="absolute inset-0 animate-portal-spin rounded-full" style={{ background: PORTAL_COLORS[tile] ?? PORTAL_COLORS['1'] }} />
            <span className="absolute inset-[18%] rounded-full bg-indigo-950/80" />
            <span className="relative text-[45%] font-black text-white">{tile}</span>
          </span>
        );
      return null;
  }
}
