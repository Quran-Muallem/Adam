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

export type Tile = '.' | '#' | 'S' | 'G' | '*' | 'K' | 'C';

export interface ParsedMap {
  cols: number;
  rows: number;
  tiles: Tile[][];
  start: Pos;
  goal: Pos;
  /** true, wenn das Ziel eine Truhe ist (Schlüssel nötig) */
  goalIsChest: boolean;
  stars: Pos[];
  key: Pos | null;
}

export const posKey = (p: Pos) => `${p.x},${p.y}`;

export function parseMap(level: LevelDef): ParsedMap {
  const rows = level.map.length;
  const cols = Math.max(...level.map.map((r) => r.length));
  const tiles: Tile[][] = [];
  let start: Pos | null = null;
  let goal: Pos | null = null;
  let goalIsChest = false;
  let key: Pos | null = null;
  const stars: Pos[] = [];

  for (let y = 0; y < rows; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < cols; x++) {
      const ch = (level.map[y][x] ?? '#') as Tile;
      row.push(ch);
      if (ch === 'S') start = { x, y };
      if (ch === 'G') goal = { x, y };
      if (ch === 'C') {
        goal = { x, y };
        goalIsChest = true;
      }
      if (ch === 'K') key = { x, y };
      if (ch === '*') stars.push({ x, y });
    }
    tiles.push(row);
  }
  if (!start || !goal) throw new Error(`Level ${level.id}: Start (S) und Ziel (G/C) sind Pflicht.`);
  return { cols, rows, tiles, start, goal, goalIsChest, stars, key };
}

export function initialState(level: LevelDef, map = parseMap(level)): WorldState {
  return { pos: map.start, dir: level.startDir, hasKey: false, collected: [], chestOpen: false };
}

export function inBounds(map: ParsedMap, p: Pos) {
  return p.x >= 0 && p.y >= 0 && p.x < map.cols && p.y < map.rows;
}

export function isBlocked(map: ParsedMap, p: Pos) {
  return !inBounds(map, p) || map.tiles[p.y][p.x] === '#';
}

export function add(p: Pos, d: Dir, n = 1): Pos {
  return { x: p.x + DIR_VEC[d].x * n, y: p.y + DIR_VEC[d].y * n };
}
