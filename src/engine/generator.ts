// ─────────────────────────────────────────────────────────────
// PROZEDURALER LEVEL-GENERATOR (Level 21 bis ∞)
//
// Jedes Level entsteht deterministisch aus (Altersstufe, Nummer) als
// Seed – Level 37 sieht also auf jedem Gerät gleich aus. Jede Karte
// wird beim Erzeugen mit dem echten Interpreter durchgespielt:
// nur garantiert lösbare Level verlassen den Generator. parBlocks
// (3 Sterne) = kürzestes gefundenes Programm.
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId, Block, Dir, LevelDef, PaletteKind, Program } from '../types';
import { runProgram } from './interpreter';
import { countProgram } from './program';
import { rate } from './rating';
import { add, DIR_VEC, isBlocked, initialState, parseMap, posKey, TURN_LEFT, TURN_RIGHT } from './world';

// ── Zufall mit Seed ──
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
type Rng = () => number;
const int = (r: Rng, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
const pick = <T,>(r: Rng, arr: T[]) => arr[Math.floor(r() * arr.length)];

let idc = 0;
const bid = () => `g${(idc++).toString(36)}`;
const mv = (dir: Dir): Block => ({ id: bid(), type: 'move', dir });
const rep = (count: number, body: Block[]): Block => ({ id: bid(), type: 'repeat', count, body });

const ARROWS: PaletteKind[] = ['up', 'down', 'left', 'right'];
const DIRS: Dir[] = ['up', 'down', 'left', 'right'];

/** Schwierigkeit 0…1 wächst langsam mit der Levelnummer */
const difficulty = (n: number) => Math.min(1, (n - 20) / 60);

// ═════════ Korridor-Pfad (Junior & Helden) ═════════
interface PathStep {
  kind: 'walk' | 'jump';
  dir: Dir;
}
interface Corridor {
  steps: PathStep[];
  cells: { x: number; y: number; t: '.' | 'o' }[];
  startDir: Dir;
}

/**
 * Selbstmeidender Korridor: neue Felder berühren den bisherigen Weg nur am
 * Vorgänger – dadurch gibt es keine Abkürzungen und Wand-Folge-Programme
 * (Bedingungen) funktionieren zuverlässig.
 */
function carveCorridor(r: Rng, o: { maxW: number; maxH: number; segments: number; segMin: number; segMax: number; jumpChance: number }): Corridor | null {
  const key = (x: number, y: number) => `${x},${y}`;
  const used = new Map<string, '.' | 'o'>();
  const order: { x: number; y: number; t: '.' | 'o' }[] = [];
  let x = 0;
  let y = 0;
  used.set(key(0, 0), '.');
  order.push({ x: 0, y: 0, t: '.' });
  const steps: PathStep[] = [];
  let dir: Dir = pick(r, DIRS);
  const startDir = dir;
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  const fits = (nx: number, ny: number) =>
    Math.max(maxX, nx) - Math.min(minX, nx) < o.maxW && Math.max(maxY, ny) - Math.min(minY, ny) < o.maxH;
  // Darf (nx,ny) belegt werden? Kein Nachbar außer (px,py)
  const free = (nx: number, ny: number, px: number, py: number) => {
    if (used.has(key(nx, ny)) || !fits(nx, ny)) return false;
    for (const d of DIRS) {
      const ax = nx + DIR_VEC[d].x;
      const ay = ny + DIR_VEC[d].y;
      if (ax === px && ay === py) continue;
      if (used.has(key(ax, ay))) return false;
    }
    return true;
  };
  const occupy = (nx: number, ny: number, t: '.' | 'o') => {
    used.set(key(nx, ny), t);
    order.push({ x: nx, y: ny, t });
    minX = Math.min(minX, nx); maxX = Math.max(maxX, nx);
    minY = Math.min(minY, ny); maxY = Math.max(maxY, ny);
  };

  for (let s = 0; s < o.segments; s++) {
    if (s > 0) dir = r() < 0.5 ? TURN_LEFT[dir] : TURN_RIGHT[dir];
    const len = int(r, o.segMin, o.segMax);
    let walked = 0;
    for (let k = 0; k < len; k++) {
      const v = DIR_VEC[dir];
      // Sprung: nur in Laufrichtung (die Figur muss schon so schauen)
      const canFaceForward = walked > 0 || s === 0;
      if (canFaceForward && k < len - 1 && r() < o.jumpChance) {
        const mx = x + v.x, my = y + v.y, lx = x + 2 * v.x, ly = y + 2 * v.y;
        if (free(mx, my, x, y)) {
          occupy(mx, my, 'o');
          if (free(lx, ly, mx, my)) {
            occupy(lx, ly, '.');
            x = lx; y = ly;
            steps.push({ kind: 'jump', dir });
            walked++;
            k++;
            continue;
          }
          // Rückgängig: kein Platz zum Landen
          used.delete(key(mx, my));
          order.pop();
        }
      }
      const nx = x + v.x, ny = y + v.y;
      if (!free(nx, ny, x, y)) break;
      occupy(nx, ny, '.');
      x = nx; y = ny;
      steps.push({ kind: 'walk', dir });
      walked++;
    }
    if (walked === 0) {
      // Abzweig klappt nicht → die andere Richtung versuchen, sonst aufhören
      if (s === 0) return null;
      break;
    }
  }
  if (steps.length < 3) return null;
  // Koordinaten auf 0,0 verschieben
  return { steps, startDir, cells: order.map((c) => ({ x: c.x - minX, y: c.y - minY, t: c.t })) };
}

function corridorGrid(c: Corridor, extras: { stars?: number; keyGate?: boolean }, r: Rng): string[] {
  const w = Math.max(...c.cells.map((p) => p.x)) + 1;
  const h = Math.max(...c.cells.map((p) => p.y)) + 1;
  const g = Array.from({ length: h }, () => Array.from({ length: w }, () => '#'));
  c.cells.forEach((p) => (g[p.y][p.x] = p.t));
  const first = c.cells[0];
  const last = c.cells[c.cells.length - 1];
  g[first.y][first.x] = 'S';
  g[last.y][last.x] = 'G';
  // freie Weg-Felder (ohne Start/Ziel/Hindernis) in Weg-Reihenfolge
  const inner = c.cells.slice(1, -1).filter((p) => p.t === '.');
  if (extras.keyGate && inner.length >= 4) {
    const ki = int(r, 0, Math.floor(inner.length / 2) - 1);
    const gi = int(r, ki + 2, inner.length - 1);
    g[inner[ki].y][inner[ki].x] = 'K';
    g[inner[gi].y][inner[gi].x] = 'D';
  }
  if (extras.stars) {
    const freeCells = inner.filter((p) => g[p.y][p.x] === '.');
    for (let i = 0; i < extras.stars && freeCells.length; i++) {
      const p = freeCells.splice(int(r, 0, freeCells.length - 1), 1)[0];
      g[p.y][p.x] = '*';
    }
  }
  return g.map((row) => row.join(''));
}

// ═════════ Lösungen bauen ═════════

/** Junior: absolute Pfeile, gleiche Richtungen zu Schleifen zusammengefasst */
function juniorSolution(steps: PathStep[]): Program {
  const main: Block[] = [];
  let i = 0;
  while (i < steps.length) {
    const s = steps[i];
    if (s.kind === 'jump') {
      main.push({ id: bid(), type: 'jump' });
      i++;
      continue;
    }
    let n = 0;
    while (i < steps.length && steps[i].kind === 'walk' && steps[i].dir === s.dir) {
      n++;
      i++;
    }
    while (n > 0) {
      const c = Math.min(n, 6);
      main.push(c >= 2 ? rep(c, [mv(s.dir)]) : mv(s.dir));
      n -= c;
    }
  }
  return { main, macro: [] };
}

/** Helden: relative Befehle, gerade Strecken als Schleifen */
function heroExplicit(steps: PathStep[], startDir: Dir): Program {
  const main: Block[] = [];
  let facing = startDir;
  let i = 0;
  while (i < steps.length) {
    const s = steps[i];
    if (s.dir !== facing) {
      main.push({ id: bid(), type: TURN_LEFT[facing] === s.dir ? 'turnLeft' : 'turnRight' });
      facing = s.dir;
    }
    if (s.kind === 'jump') {
      main.push({ id: bid(), type: 'jump' });
      i++;
      continue;
    }
    let n = 0;
    while (i < steps.length && steps[i].kind === 'walk' && steps[i].dir === facing) {
      n++;
      i++;
    }
    main.push(n >= 2 ? rep(n, [{ id: bid(), type: 'forward' }]) : { id: bid(), type: 'forward' });
  }
  return { main, macro: [] };
}

/** Wand-Folge-Programme mit Bedingungen (oft viel kürzer!) */
function followers(withJump: boolean): Program[] {
  const F = (): Block => ({ id: bid(), type: 'forward' });
  const L = (): Block => ({ id: bid(), type: 'turnLeft' });
  const R = (): Block => ({ id: bid(), type: 'turnRight' });
  const J = (): Block => ({ id: bid(), type: 'jump' });
  const iff = (cond: 'pathClear' | 'pathBlocked' | 'obstacleAhead', ...body: Block[]): Block => ({ id: bid(), type: 'if', cond, body });
  const wrap = (body: Block[]): Program => ({ main: [rep(30, body)], macro: [] });
  const jump = withJump ? [iff('obstacleAhead', J())] : [];
  const step = withJump ? iff('pathClear', F()) : F();
  return [
    wrap([...jump, iff('pathBlocked', R()), step]),
    wrap([...jump, iff('pathBlocked', L()), step]),
    wrap([...jump, iff('pathBlocked', L()), iff('pathBlocked', R(), R()), step]),
  ];
}

// ═════════ Mini: freies Feld + Breitensuche ═════════
function bfsShortest(level: LevelDef): { dist: number; path: { x: number; y: number }[] } | null {
  const map = parseMap(level);
  const s0 = initialState(level, map);
  const prev = new Map<string, string | null>([[posKey(map.start), null]]);
  let frontier = [map.start];
  for (let d = 1; d <= 8 && frontier.length; d++) {
    const next: typeof frontier = [];
    for (const p of frontier) {
      for (const dir of DIRS) {
        const q = add(p, dir);
        if (isBlocked(map, q, s0) || prev.has(posKey(q))) continue;
        prev.set(posKey(q), posKey(p));
        if (q.x === map.goal.x && q.y === map.goal.y) {
          const path: { x: number; y: number }[] = [];
          let k: string | null = posKey(q);
          while (k) {
            const [x, y] = k.split(',').map(Number);
            path.unshift({ x, y });
            k = prev.get(k) ?? null;
          }
          return { dist: d, path };
        }
        next.push(q);
      }
    }
    frontier = next;
  }
  return null;
}

function genMini(n: number, r: Rng): LevelDef | null {
  const diff = difficulty(n);
  const w = int(r, 3, diff > 0.4 ? 5 : 4);
  const h = int(r, 2, diff > 0.3 ? 4 : 3);
  const g = Array.from({ length: h }, () => Array.from({ length: w }, () => '.'));
  const obstacles = ['#', 'B', 'P'];
  const density = 0.18 + diff * 0.2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (r() < density) g[y][x] = pick(r, obstacles);
  const sx = int(r, 0, w - 1), sy = int(r, 0, h - 1);
  let gx = int(r, 0, w - 1), gy = int(r, 0, h - 1);
  if (Math.abs(gx - sx) + Math.abs(gy - sy) < 2) return null;
  g[sy][sx] = 'S';
  g[gy][gx] = 'G';
  const base: LevelDef = { id: `mini-${n}`, group: 'mini', title: '', grid: g.map((row) => row.join('')), startDir: 'right', palette: ARROWS, maxBlocks: 6, parBlocks: 6 };
  const sol = bfsShortest(base);
  const minDist = 3 + Math.round(diff * 2);
  if (!sol || sol.dist < minDist || sol.dist > 6) return null;
  // Jedes zweite Level: Beeren auf den kürzesten Weg legen
  if (n % 2 === 0 && sol.path.length >= 4) {
    const inner = sol.path.slice(1, -1);
    const a = inner.splice(int(r, 0, inner.length - 1), 1)[0];
    g[a.y][a.x] = '*';
    if (inner.length) {
      const b = inner[int(r, 0, inner.length - 1)];
      g[b.y][b.x] = '*';
    }
  }
  return { ...base, grid: g.map((row) => row.join('')), parBlocks: sol.dist };
}

function genJunior(n: number, r: Rng): LevelDef | null {
  const diff = difficulty(n);
  const c = carveCorridor(r, {
    maxW: 7,
    maxH: 6,
    segments: int(r, 2, 3 + Math.round(diff * 2)),
    segMin: 2,
    segMax: 4 + Math.round(diff * 2),
    jumpChance: 0.15 + diff * 0.2,
  });
  if (!c) return null;
  const withStars = n % 2 === 1;
  const keyGate = n % 3 === 0;
  const grid = corridorGrid(c, { stars: withStars ? 2 : 0, keyGate }, r);
  const solution = juniorSolution(c.steps);
  const par = countProgram(solution);
  const level: LevelDef = {
    id: `junior-${n}`,
    group: 'junior',
    title: '',
    grid,
    startDir: c.startDir,
    palette: [...ARROWS, 'jump', 'repeat'],
    maxBlocks: Math.min(16, par + 5),
    parBlocks: par,
  };
  const res = runProgram(level, solution);
  if (res.outcome !== 'success' || rate(level, res, par) < 3) return null;
  return level;
}

function genHero(n: number, r: Rng): LevelDef | null {
  const diff = difficulty(n);
  const withJump = n % 2 === 0;
  const c = carveCorridor(r, {
    maxW: 7,
    maxH: 7,
    segments: int(r, 3, 4 + Math.round(diff * 3)),
    segMin: 2,
    segMax: 3 + Math.round(diff * 2),
    jumpChance: withJump ? 0.25 : 0,
  });
  if (!c) return null;
  const grid = corridorGrid(c, { keyGate: n % 5 === 0 }, r);
  const explicit = heroExplicit(c.steps, c.startDir);
  const palette: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', ...(withJump ? (['jump'] as PaletteKind[]) : []), 'repeat', 'if', 'call'];
  const level: LevelDef = {
    id: `hero-${n}`,
    group: 'hero',
    title: '',
    grid,
    startDir: c.startDir,
    palette,
    maxBlocks: 0,
    parBlocks: 0,
  };
  if (runProgram(level, explicit).outcome !== 'success') return null;
  // kürzeste funktionierende Lösung = 3-Sterne-Ziel
  let par = countProgram(explicit);
  for (const p of followers(withJump)) if (runProgram(level, p).outcome === 'success') par = Math.min(par, countProgram(p));
  return { ...level, parBlocks: par, maxBlocks: Math.min(30, countProgram(explicit) + 4) };
}

const GENERATORS: Record<AgeGroupId, (n: number, r: Rng) => LevelDef | null> = { mini: genMini, junior: genJunior, hero: genHero };

const cache = new Map<string, LevelDef>();

/** Erzeugt Level n (ab 21) – deterministisch und garantiert lösbar */
export function generateLevel(group: AgeGroupId, n: number): LevelDef {
  const id = `${group}-${n}`;
  const hit = cache.get(id);
  if (hit) return hit;
  for (let attempt = 0; attempt < 500; attempt++) {
    const r = mulberry32(hash(`${id}:${attempt}`));
    const lvl = GENERATORS[group](n, r);
    if (lvl) {
      cache.set(id, lvl);
      return lvl;
    }
  }
  throw new Error(`Generator: kein Level für ${id}`);
}
