// Spielfeld: 3D-Kacheln, Gegenstände, Portale und Sparky
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CostumeId } from '../data/costumes';
import type { WorldConfig } from '../data/worlds';
import { DIR_ANGLE, DIR_VEC, initialState, parseMap, posKey } from '../engine/world';
import type { Frame, LevelDef } from '../types';
import { Sparky, type SparkyMood } from './Sparky';

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
      className="relative mx-auto w-full shrink-0"
      style={{ aspectRatio: `${cols} / ${rows}`, maxWidth: `min(100%, calc(var(--board-h) * ${cols} / ${rows}))` }}
    >
      {/* Sockel mit weichem 3D-Schatten */}
      <div className="absolute inset-0 translate-y-2 rounded-[1.6rem]" style={{ background: 'rgba(0,0,0,.28)', filter: 'blur(6px)' }} />
      <div
        className="absolute inset-0 grid gap-[2px] overflow-hidden rounded-[1.6rem] p-[3px]"
        style={{
          // minmax(0,1fr): alle Reihen/Spalten exakt gleich groß, egal wie groß der Inhalt ist
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          background: world.frame,
          boxShadow: `inset 0 3px 0 rgba(255,255,255,.7), 0 0 0 4px ${world.frame}`,
        }}
      >
        {map.tiles.flatMap((row, y) =>
          row.map((tile, x) => {
            const k = posKey({ x, y });
            const wall = tile === '#';
            const bg = wall ? world.wallTile : (x + y) % 2 === 0 ? world.tileA : world.tileB;
            return (
              <div key={k} className="tile relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-[22%] leading-none" style={{ background: bg, fontSize }}>
                <TileContent tile={tile} world={world} state={state} k={k} />
              </div>
            );
          }),
        )}
      </div>

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
          <div className="h-full w-full scale-110">
            <Sparky mood={mood} dir={state.dir} costume={costume} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TileContent({ tile, world, state, k }: { tile: string; world: WorldConfig; state: Frame['state']; k: string }) {
  switch (tile) {
    case '#':
      return <span className="drop-shadow-md">{world.wall}</span>;
    case 'o':
      return <span className="drop-shadow-md">{world.low}</span>;
    case 'B':
      return (
        <span className="relative drop-shadow-md">
          🐻
          <span className="absolute -right-[30%] -top-[40%] animate-float text-[45%]">💤</span>
        </span>
      );
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
        <span className="animate-float drop-shadow-[0_0_8px_rgba(255,255,255,.9)]">{world.bonus}</span>
      );
    case 'K':
      return state.hasKey ? null : <span className="animate-wiggle drop-shadow-[0_0_8px_rgba(253,224,71,.9)]">{world.key}</span>;
    case 'D':
      return state.openGates.includes(k) ? (
        <span className="animate-pop opacity-80">✨</span>
      ) : (
        <span className="relative">
          {world.gate}
          <span className="absolute -bottom-[10%] -right-[15%] text-[45%]">🔒</span>
        </span>
      );
    case 'G':
      return <span className="animate-float drop-shadow-[0_0_12px_rgba(255,255,255,.95)]">{world.goal}</span>;
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
