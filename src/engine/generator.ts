// ─────────────────────────────────────────────────────────────
// PROZEDURALER LEVEL-GENERATOR (nach den handgefertigten Leveln bis ∞)
//
// Jedes Level entsteht deterministisch aus (Altersstufe, Nummer) als
// Seed – Level 37 sieht also auf jedem Gerät gleich aus. Jede Karte
// wird beim Erzeugen mit dem echten Interpreter durchgespielt:
// nur garantiert lösbare Level verlassen den Generator. parBlocks
// (3 Sterne) = kürzestes gefundenes Programm.
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId, Block, CondExpr, Dir, LevelDef, PaletteKind, Program } from '../types';
import { runProgram } from './interpreter';
import { countProgram } from './program';
import { rate } from './rating';
import { add, DIR_VEC, isBlocked, initialState, parseMap, posKey, TURN_LEFT, TURN_RIGHT, twinMove } from './world';

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
const difficulty = (n: number, base = 20) => {
  // Tages-Rätsel (S-Bahn-Express): mittlere Schwierigkeit – in 3 Minuten lösbar
  const eff = n >= 100000 ? base + 15 + (n % 25) : n;
  return Math.min(1, Math.max(0, (eff - base) / 60));
};

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

function corridorGrid(c: Corridor, extras: { stars?: number; keyGate?: boolean; laser?: boolean }, r: Rng): string[] {
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
  if (extras.laser && inner.length >= 4) {
    // Schalter VOR der Laser-Schranke → der Weg ist garantiert frei
    const xi = int(r, 0, Math.floor(inner.length / 2) - 1);
    const li = int(r, xi + 2, inner.length - 1);
    g[inner[xi].y][inner[xi].x] = 'X';
    g[inner[li].y][inner[li].x] = 'L';
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


// ═════════ Stufe 4: Teenager (Neon-Metropole) ═════════
const F_ = (): Block => ({ id: bid(), type: 'forward' });
const L_ = (): Block => ({ id: bid(), type: 'turnLeft' });
const R_ = (): Block => ({ id: bid(), type: 'turnRight' });
const J_ = (): Block => ({ id: bid(), type: 'jump' });
const ifx = (e: CondExpr, ...body: Block[]): Block => ({ id: bid(), type: 'if', ...e, body });
const whx = (e: CondExpr, ...body: Block[]): Block => ({ id: bid(), type: 'while', ...e, body });
const NOT_GOAL: CondExpr = { cond: 'atGoal', not: true };
const BLOCKED: CondExpr = { cond: 'pathClear', not: true };

/** Solange-nicht-am-Ziel-Wandfolger (Teenager) */
function whileFollowers(withJump: boolean): Program[] {
  const jump = withJump ? [ifx({ cond: 'obstacleAhead' }, J_())] : [];
  const step = withJump ? ifx({ cond: 'pathClear' }, F_()) : F_();
  const turnCond: CondExpr = withJump ? { cond: 'pathBlocked', op: 'or', cond2: 'laserAhead' } : BLOCKED;
  const w = (body: Block[]): Program => ({ main: [whx(NOT_GOAL, ...body)], macro: [] });
  return [
    w([...jump, ifx(turnCond, R_()), step]),
    w([...jump, ifx(turnCond, L_()), step]),
    w([...jump, ifx(turnCond, L_()), ifx(turnCond, R_(), R_()), step]),
  ];
}

/** Rekursive Wandfolger: F1 ruft sich selbst auf (Erwachsene) */
function recursiveFollowers(withJump: boolean): Program[] {
  const call = (): Block => ({ id: bid(), type: 'call' });
  const jump = withJump ? [ifx({ cond: 'obstacleAhead' }, J_())] : [];
  const step = withJump ? ifx({ cond: 'pathClear' }, F_()) : F_();
  const turn: CondExpr = { cond: 'pathBlocked' };
  const m = (body: Block[]): Program => ({ main: [call()], macro: [...body, call()] });
  return [
    m([...jump, ifx(turn, R_()), step]),
    m([...jump, ifx(turn, L_()), step]),
    m([...jump, ifx(turn, L_()), ifx(turn, R_(), R_()), step]),
  ];
}

function bestOf(level: LevelDef, programs: Program[]): number {
  let best = Infinity;
  for (const p of programs) if (runProgram(level, p).outcome === 'success') best = Math.min(best, countProgram(p));
  return best;
}

/** Zähler-Level: ein Korridor mit Sackgasse – nur wer zählt, biegt richtig ab */
function counterGrid(r: Rng, diff: number) {
  // passt aufs Handy: max. 7 × 6 Felder
  const a = int(r, 3, 4);
  const decoy = int(r, 1, 2);
  const b = int(r, 2, 3 + Math.round(diff * 2));
  const c = r() < 0.5 ? int(r, 1, 6 - a) : 0;
  const width = Math.max(a + decoy + 1, a + c + 1);
  const h = b + 1;
  const g = Array.from({ length: h }, () => Array.from({ length: width }, () => '#'));
  for (let x = 0; x < a + decoy + 1; x++) g[0][x] = '.';
  for (let y = 1; y <= b; y++) g[y][a] = '.';
  let goal = { x: a, y: b };
  if (c) {
    for (let x = a + 1; x <= a + c; x++) g[b][x] = '.';
    goal = { x: a + c, y: b };
    // Sackgasse unten nach links verhindert pures Wandfolgen
  }
  g[0][0] = 'S';
  g[goal.y][goal.x] = 'G';
  return { grid: g.map((row) => row.join('')), a, b, c };
}

function genTeen(n: number, r: Rng): LevelDef | null {
  const diff = difficulty(n, 10);
  const kind = n % 4;
  const base = { id: `teen-${n}`, group: 'teen' as const, title: '' };

  if (kind === 2) {
    // Zähler + Kreuzung (ohne Wiederhole-Block!)
    const { grid, a, b, c } = counterGrid(r, diff);
    const palette: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', 'while', 'if', 'setVar', 'decVar'];
    const level: LevelDef = { ...base, grid, startDir: 'right', palette, maxBlocks: 0, parBlocks: 0 };
    const counter: Program = {
      main: [
        { id: bid(), type: 'setVar', value: a },
        whx({ cond: 'varPositive' }, F_(), { id: bid(), type: 'decVar' }),
        R_(),
        ...(c ? [whx(NOT_GOAL, ifx(BLOCKED, L_()), F_())] : [whx(NOT_GOAL, F_())]),
      ],
      macro: [],
    };
    const explicit: Program = { main: [...Array.from({ length: a }, F_), R_(), ...Array.from({ length: b }, F_), ...(c ? [L_(), ...Array.from({ length: c }, F_)] : [])], macro: [] };
    if (runProgram(level, counter).outcome !== 'success' || runProgram(level, explicit).outcome !== 'success') return null;
    const par = Math.min(countProgram(counter), countProgram(explicit), bestOf(level, whileFollowers(false)));
    return { ...level, parBlocks: par, maxBlocks: Math.min(countProgram(explicit), par + 3) };
  }

  const withJump = kind === 1 || (kind === 3 && n % 8 === 3);
  const c = carveCorridor(r, {
    maxW: 7,
    maxH: 7,
    segments: int(r, 3, 4 + Math.round(diff * 3)),
    segMin: 2,
    segMax: 3 + Math.round(diff * 2),
    jumpChance: withJump ? 0.3 : 0,
  });
  if (!c) return null;
  const grid = corridorGrid(c, { laser: kind === 0 || (withJump && n % 3 === 0), keyGate: kind === 3 && n % 5 === 0 }, r);
  if (kind === 0 && !grid.join('').includes('L')) return null;
  const palette: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', ...(withJump ? (['jump'] as PaletteKind[]) : []), 'repeat', 'while', 'if'];
  const level: LevelDef = { ...base, grid, startDir: c.startDir, palette, maxBlocks: 0, parBlocks: 0 };
  const explicit = heroExplicit(c.steps, c.startDir);
  if (runProgram(level, explicit).outcome !== 'success') return null;
  const par = Math.min(countProgram(explicit), bestOf(level, whileFollowers(withJump)));
  return { ...level, parBlocks: par, maxBlocks: Math.min(24, countProgram(explicit) + 2) };
}

// ═════════ Stufe 5: Erwachsene (Quantum-Lab) ═════════

/** Zwei-Bot-Rätsel: zwei Mini-Labore, ein Programm. Breitensuche findet die Bestlösung. */
function genTwin(n: number, r: Rng, diff: number): LevelDef | null {
  const w = int(r, 4, 5);
  const h = 3;
  const half = () => {
    const g = Array.from({ length: h }, () => Array.from({ length: w }, () => (r() < 0.22 + diff * 0.1 ? '#' : '.')));
    return g;
  };
  const top = half();
  const bot = half();
  const place = (g: string[][], a: string, b: string) => {
    const cells: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) cells.push({ x, y });
    const p = cells.splice(int(r, 0, cells.length - 1), 1)[0];
    const q = cells[int(r, 0, cells.length - 1)];
    if (Math.abs(p.x - q.x) + Math.abs(p.y - q.y) < 3) return false;
    g[p.y][p.x] = a;
    g[q.y][q.x] = b;
    return true;
  };
  if (!place(top, 'S', 'G') || !place(bot, 'T', 'H')) return null;
  const grid = [...top.map((row) => row.join('')), '#'.repeat(w), ...bot.map((row) => row.join(''))];
  const level: LevelDef = { id: `adult-${n}`, group: 'adult', title: '', grid, startDir: 'right', palette: [...ARROWS, 'repeat', 'call'], maxBlocks: 0, parBlocks: 0 };
  // Breitensuche über beide Bot-Positionen
  const map = parseMap(level);
  const s0 = initialState(level, map);
  const k = (a: { x: number; y: number }, b: { x: number; y: number }) => `${a.x},${a.y}|${b.x},${b.y}`;
  let frontier = [{ a: s0.pos, b: s0.pos2!, path: [] as Dir[] }];
  const seen = new Set([k(s0.pos, s0.pos2!)]);
  let path: Dir[] | null = null;
  for (let d = 0; d < 16 && !path && frontier.length; d++) {
    const next: typeof frontier = [];
    for (const st of frontier) {
      for (const dir of DIRS) {
        const m = twinMove(map, s0, st.a, st.b, dir);
        if (!m.moved) continue;
        const p2 = [...st.path, dir];
        if (m.a.x === map.goal.x && m.a.y === map.goal.y && m.b.x === map.goal2!.x && m.b.y === map.goal2!.y) {
          path = p2;
          break;
        }
        const key = k(m.a, m.b);
        if (!seen.has(key)) {
          seen.add(key);
          next.push({ a: m.a, b: m.b, path: p2 });
        }
      }
      if (path) break;
    }
    frontier = next;
  }
  if (!path || path.length < 5 + Math.round(diff * 3) || path.length > 14) return null;
  // gleiche Richtungen hintereinander → Schleife
  const main: Block[] = [];
  for (let i = 0; i < path.length; ) {
    let j = i;
    while (j < path.length && path[j] === path[i]) j++;
    main.push(j - i >= 2 ? rep(j - i, [mv(path[i])]) : mv(path[i]));
    i = j;
  }
  const sol: Program = { main, macro: [] };
  if (runProgram(level, sol).outcome !== 'success') return null;
  const par = countProgram(sol);
  return { ...level, parBlocks: par, maxBlocks: par + 1 };
}

function genAdult(n: number, r: Rng): LevelDef | null {
  const diff = difficulty(n, 10);
  const kind = n % 3;
  if (kind === 0) return genTwin(n, r, diff);

  if (kind === 2) {
    // Register + Rekursion: F1 = WENN n > 0 { vor; n−1; F1 }
    const { grid, a, b, c } = counterGrid(r, diff);
    const call = (): Block => ({ id: bid(), type: 'call' });
    const set = (v: number): Block => ({ id: bid(), type: 'setVar', value: v });
    const level: LevelDef = { id: `adult-${n}`, group: 'adult', title: '', grid, startDir: 'right', palette: ['forward', 'turnLeft', 'turnRight', 'if', 'call', 'setVar', 'decVar'], maxBlocks: 0, parBlocks: 0 };
    const sol: Program = {
      main: [set(a), call(), R_(), set(b), call(), ...(c ? [L_(), set(c), call()] : [])],
      macro: [ifx({ cond: 'varPositive' }, F_(), { id: bid(), type: 'decVar' }, call())],
    };
    if (runProgram(level, sol).outcome !== 'success') return null;
    const par = Math.min(countProgram(sol), bestOf(level, recursiveFollowers(false)));
    return { ...level, parBlocks: par, maxBlocks: par + 1 };
  }

  // Rekursiver Wandfolger durch einen Korridor (mit Sprüngen)
  const withJump = n % 2 === 1;
  const c = carveCorridor(r, {
    maxW: 7,
    maxH: 7,
    segments: int(r, 3, 4 + Math.round(diff * 3)),
    segMin: 2,
    segMax: 3 + Math.round(diff * 2),
    jumpChance: withJump ? 0.25 : 0,
  });
  if (!c) return null;
  const grid = corridorGrid(c, { laser: n % 4 === 1 }, r);
  const palette: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', ...(withJump ? (['jump'] as PaletteKind[]) : []), 'if', 'call'];
  const level: LevelDef = { id: `adult-${n}`, group: 'adult', title: '', grid, startDir: c.startDir, palette, maxBlocks: 0, parBlocks: 0 };
  const par = bestOf(level, recursiveFollowers(withJump));
  if (!Number.isFinite(par)) return null;
  // Knappes Limit: nur die rekursive Lösung passt
  return { ...level, parBlocks: par, maxBlocks: par + 1 };
}

const GENERATORS: Record<AgeGroupId, (n: number, r: Rng) => LevelDef | null> = { mini: genMini, junior: genJunior, hero: genHero, teen: genTeen, adult: genAdult };

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
