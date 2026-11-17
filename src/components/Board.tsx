// Spielfeld: Kacheln, Gegenstände und animierte Spielfigur
import { useMemo } from 'react';
import type { AgeGroupConfig } from '../data/ageGroups';
import { DIR_VEC, initialState, parseMap, posKey } from '../engine/world';
import type { Frame, LevelDef } from '../types';
import { Character } from './Character';

interface Props {
  level: LevelDef;
  group: AgeGroupConfig;
  frame: Frame | null;
  frameIndex: number;
  stepMs: number;
  mood: 'happy' | 'sad' | 'normal';
}

export function Board({ level, group, frame, frameIndex, stepMs, mood }: Props) {
  const map = useMemo(() => parseMap(level), [level]);
  const state = frame?.state ?? initialState(level, map);
  const { cols, rows } = map;
  const t = group.theme;

  const moveMs = Math.round(stepMs * 0.75);
  const bump = frame?.motion === 'bump' && frame.bumpDir ? DIR_VEC[frame.bumpDir] : null;
  const isSpace = group.id === 'hero';

  return (
    <div
      className="relative mx-auto w-full"
      style={{
        aspectRatio: `${cols} / ${rows}`,
        maxWidth: `min(100%, calc(var(--board-h) * ${cols} / ${rows}))`,
      }}
    >
      <div
        className={`absolute inset-0 grid overflow-hidden rounded-3xl border-4 shadow-xl ${
          isSpace ? 'border-indigo-400/60' : 'border-white/80'
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          containerType: 'size',
        }}
      >
        {map.tiles.flatMap((row, y) =>
          row.map((tile, x) => {
            const checker = (x + y) % 2 === 0 ? t.tileA : t.tileB;
            const rock = tile === '#';
            const k = posKey({ x, y });
            let item: string | null = null;
            if (rock) item = group.rockEmoji;
            else if (tile === '*' && !state.collected.includes(k)) item = '⭐';
            else if (tile === 'K' && !state.hasKey) item = '🔑';
            else if (tile === 'G') item = group.goalEmoji;
            else if (tile === 'C') item = state.chestOpen ? '💰' : '🧰';
            return (
              <div
                key={k}
                className={`relative flex items-center justify-center ${rock ? t.rockTile : checker}`}
              >
                {isSpace && !rock && (x * 7 + y * 3) % 5 === 0 && (
                  <span className="absolute left-1 top-1 h-1 w-1 animate-twinkle rounded-full bg-white/70" />
                )}
                {item && (
                  <span
                    className={`select-none leading-none ${tile === 'G' || tile === 'C' ? 'animate-float' : ''} ${
                      tile === '*' ? 'animate-pulse' : ''
                    }`}
                    style={{ fontSize: `min(${58 / cols}cqw, ${58 / rows}cqh)` }}
                  >
                    {item}
                  </span>
                )}
                {tile === 'S' && (
                  <span className="absolute inset-[18%] rounded-full border-4 border-dashed border-white/50" />
                )}
              </div>
            );
          }),
        )}
      </div>

      {/* Spielfigur */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          width: `${100 / cols}%`,
          height: `${100 / rows}%`,
          left: `${((state.pos.x + (bump ? bump.x * 0.3 : 0)) / cols) * 100}%`,
          top: `${((state.pos.y + (bump ? bump.y * 0.3 : 0)) / rows) * 100}%`,
          transition: `left ${moveMs}ms cubic-bezier(.45,.05,.35,1.2), top ${moveMs}ms cubic-bezier(.45,.05,.35,1.2)`,
        }}
      >
        <div
          key={frameIndex}
          className={`h-full w-full scale-[0.86] ${frame?.motion === 'jump' ? 'animate-hop' : ''} ${
            frame?.motion === 'bump' ? 'animate-shake' : ''
          }`}
          style={{ ['--hop-dur' as string]: `${moveMs}ms` }}
        >
          <Character kind={group.hero} dir={state.dir} mood={mood} />
        </div>
      </div>
    </div>
  );
}
