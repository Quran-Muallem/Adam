import type { Dir, LevelDef, Pos, WorldState } from '../types';

export const DIR_VEC: Record<Dir, Pos> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const TURN_LEFT: Record<Dir, Dir> = { up: 'left', left: 'down', down: 'right', right: 'up' };
export const TURN_RIGHT: Record<Dir, Dir> = { up: 'right', right: 'down', down: 'left', left: 'up' };

export const DIR_ANGLE: Record<Dir, number> = { up: -90, right: 0, down: 90, left: 180 };

/** Niedrige, überspringbare Hindernisse */
export const LOW_OBSTACLES = new Set(['o', 'B', 'P']);

export interface ParsedMap {
  cols: number;
  rows: number;
  tiles: string[][];
  start: Pos;
  goal: Pos;
  stars: Pos[];
  /** Teleporter-Ziel je "x,y" */
  teleports: Record<string, Pos>;
  /** Zwei-Bot-Level: Start & Ziel des zweiten Bots */
  start2: Pos | null;
  goal2: Pos | null;
}

export const posKey = (p: Pos) => `${p.x},${p.y}`;

const cache = new WeakMap<LevelDef, ParsedMap>();

export function parseMap(level: LevelDef): ParsedMap {
  const hit = cache.get(level);
  if (hit) return hit;

  const rows = level.grid.length;
  const cols = Math.max(...level.grid.map((r) => r.length));
  const tiles: string[][] = [];
  let start: Pos | null = null;
  let goal: Pos | null = null;
  let start2: Pos | null = null;
  let goal2: Pos | null = null;
  const stars: Pos[] = [];
  const portals: Record<string, Pos[]> = {};

  for (let y = 0; y < rows; y++) {
    const row: string[] = [];
    for (let x = 0; x < cols; x++) {
      const ch = level.grid[y][x] ?? '#';
      row.push(ch);
      if (ch === 'S') start = { x, y };
      if (ch === 'G') goal = { x, y };
      if (ch === '*') stars.push({ x, y });
      if (ch === 'T') start2 = { x, y };
      if (ch === 'H') goal2 = { x, y };
      if (/[1-9]/.test(ch)) (portals[ch] ??= []).push({ x, y });
    }
    tiles.push(row);
  }
  if (!start || !goal) throw new Error(`Level ${level.id}: Start (S) und Ziel (G) sind Pflicht.`);

  const teleports: Record<string, Pos> = {};
  for (const [digit, ps] of Object.entries(portals)) {
    if (ps.length !== 2) throw new Error(`Level ${level.id}: Teleporter ${digit} braucht genau 2 Felder.`);
    teleports[posKey(ps[0])] = ps[1];
    teleports[posKey(ps[1])] = ps[0];
  }

  const parsed = { cols, rows, tiles, start, goal, stars, teleports, start2, goal2 };
  cache.set(level, parsed);
  return parsed;
}

export function initialState(level: LevelDef, map = parseMap(level)): WorldState {
  return {
    pos: map.start,
    dir: level.startDir,
    hasKey: false,
    collected: [],
    openGates: [],
    lasersOn: true,
    n: 0,
    ...(map.start2 ? { pos2: map.start2 } : {}),
  };
}

export function inBounds(map: ParsedMap, p: Pos) {
  return p.x >= 0 && p.y >= 0 && p.x < map.cols && p.y < map.rows;
}

export function tileAt(map: ParsedMap, p: Pos): string | null {
  return inBounds(map, p) ? map.tiles[p.y][p.x] : null;
}

/** Kann die Figur dieses Feld betreten? */
export function isBlocked(map: ParsedMap, p: Pos, state: WorldState) {
  const t = tileAt(map, p);
  if (t === null || t === '#' || LOW_OBSTACLES.has(t)) return true;
  if (t === 'D' && !state.hasKey && !state.openGates.includes(posKey(p))) return true;
  if (t === 'L' && state.lasersOn) return true;
  return false;
}

/** Wand/Rand/Hindernis/Tor – aber KEIN Laser (dafür gibt es den Laser-Sensor) */
export function isWallLike(map: ParsedMap, p: Pos, state: WorldState) {
  const t = tileAt(map, p);
  if (t === 'L') return false;
  return isBlocked(map, p, state);
}

export function add(p: Pos, d: Dir, n = 1): Pos {
  return { x: p.x + DIR_VEC[d].x * n, y: p.y + DIR_VEC[d].y * n };
}

/**
 * Zwei-Bot-Synchronisation: beide Bots führen denselben Pfeil-Befehl aus.
 * Ein blockierter Bot bleibt stehen; Bots können nicht auf dasselbe Feld.
 */
export function twinMove(map: ParsedMap, state: WorldState, a0: Pos, b0: Pos, dir: Dir) {
  const a = add(a0, dir);
  const b = add(b0, dir);
  let aOk = !isBlocked(map, a, state);
  let bOk = !isBlocked(map, b, state);
  const na = aOk ? a : a0;
  const nb = bOk ? b : b0;
  if (na.x === nb.x && na.y === nb.y) {
    // Zusammenstoß: wer sich bewegen wollte, bleibt stehen
    if (aOk) aOk = false;
    if (bOk) bOk = false;
  }
  return { a: aOk ? a : a0, b: bOk ? b : b0, moved: aOk || bOk, both: aOk && bOk };
}
