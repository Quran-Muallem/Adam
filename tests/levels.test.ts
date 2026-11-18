// Prüft, dass ALLE 60 Level lösbar sind und mit der Referenzlösung 3 Sterne bringen.
// Mini-Level werden zusätzlich per Breitensuche (BFS) geprüft.
// Wer ein neues Level in levels.ts anlegt, ergänzt hier eine Lösung.
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../src/data/levels';
import { runProgram } from '../src/engine/interpreter';
import { countProgram, uid } from '../src/engine/program';
import { hasBonus, rate } from '../src/engine/rating';
import { add, initialState, isBlocked, parseMap, posKey } from '../src/engine/world';
import type { Block, Condition, Dir, LevelDef, Program } from '../src/types';

// ── kleine DSL für Lösungen ──
const U = (): Block => ({ id: uid(), type: 'move', dir: 'up' });
const D = (): Block => ({ id: uid(), type: 'move', dir: 'down' });
const Le = (): Block => ({ id: uid(), type: 'move', dir: 'left' });
const Ri = (): Block => ({ id: uid(), type: 'move', dir: 'right' });
const J = (): Block => ({ id: uid(), type: 'jump' });
const F = (): Block => ({ id: uid(), type: 'forward' });
const L = (): Block => ({ id: uid(), type: 'turnLeft' });
const R = (): Block => ({ id: uid(), type: 'turnRight' });
const rep = (count: number, ...body: Block[]): Block => ({ id: uid(), type: 'repeat', count, body });
const iff = (cond: Condition, ...body: Block[]): Block => ({ id: uid(), type: 'if', cond, body });
const call = (): Block => ({ id: uid(), type: 'call' });
const P = (main: Block[], macro: Block[] = []): Program => ({ main, macro });

const SOLUTIONS: Record<string, () => Program> = {
  // ── Junior ──
  'junior-1': () => P([rep(4, Ri())]),
  'junior-2': () => P([rep(3, D()), rep(3, Ri())]),
  'junior-3': () => P([rep(3, Ri(), D())]),
  'junior-4': () => P([rep(4, U(), Ri())]),
  'junior-5': () => P([rep(3, Ri(), Ri(), D())]),
  'junior-6': () => P([rep(4, Ri()), rep(3, D()), rep(2, Le())]),
  'junior-7': () => P([Ri(), J(), Ri()]),
  'junior-8': () => P([Ri(), J(), J(), Ri()]),
  'junior-9': () => P([D(), rep(2, J())]),
  'junior-10': () => P([Ri(), J(), D(), D(), J(), Ri()]),
  'junior-11': () => P([rep(2, Ri(), J()), Ri()]),
  'junior-12': () => P([U(), J(), U(), Ri(), J(), Ri()]),
  'junior-13': () => P([rep(2, Ri(), D(), J())]),
  'junior-14': () => P([Ri(), rep(2, D()), rep(2, U()), rep(3, Ri())]),
  'junior-15': () => P([rep(2, Ri()), rep(2, D()), rep(2, Le())]),
  'junior-16': () => P([Ri(), J(), Ri(), rep(2, D()), rep(4, Le())]),
  'junior-17': () => P([rep(4, Ri()), rep(4, D()), rep(4, Le())]),
  'junior-18': () => P([Ri(), rep(2, J()), Ri(), rep(2, D()), rep(6, Le())]),
  'junior-19': () => P([Ri(), J(), Ri(), rep(2, D()), rep(2, Le()), J()]),
  'junior-20': () => P([rep(2, Ri(), J()), Ri(), rep(2, D()), rep(4, Le()), J(), Le()]),
  // ── Helden ──
  'hero-1': () => P([rep(2, rep(3, F()), R())]),
  'hero-2': () => P([rep(4, F(), L(), F(), R())]),
  'hero-3': () => P([rep(2, rep(3, F()), R(), rep(3, F()), L())]),
  'hero-4': () => P([rep(3, rep(4, F()), R())]),
  'hero-5': () => P([rep(3, rep(2, F()), R(), F(), L())]),
  'hero-6': () => P([rep(2, rep(3, F()), L(), rep(3, F()), R())]),
  'hero-7': () => P([rep(13, iff('pathBlocked', R()), F())]),
  'hero-8': () => P([rep(30, iff('pathBlocked', L()), F())]),
  'hero-9': () => P([rep(14, iff('pathBlocked', L()), iff('pathBlocked', R(), R()), F())]),
  'hero-10': () => P([rep(6, iff('obstacleAhead', J()), iff('pathClear', F()))]),
  'hero-11': () => P([rep(12, iff('obstacleAhead', J()), iff('pathBlocked', R()), iff('pathClear', F()))]),
  'hero-12': () => P([rep(16, iff('pathClear', F()), iff('pathBlocked', L()))]),
  'hero-13': () =>
    P([rep(14, iff('obstacleAhead', J()), iff('pathBlocked', L()), iff('pathBlocked', R(), R()), iff('pathClear', F()))]),
  'hero-14': () => P([rep(3, call()), R(), call(), call()], [F(), R(), F(), L()]),
  'hero-15': () => P([rep(2, F(), F(), R(), F(), F(), L(), F())]),
  'hero-16': () => P([rep(2, call()), F(), R(), rep(3, call()), L(), call()], [F(), L(), F(), R()]),
  'hero-17': () => P([rep(9, F())]),
  'hero-18': () => P([rep(10, iff('pathBlocked', R()), F())]),
  'hero-19': () => P([rep(3, F(), R(), F(), L(), F(), F())]),
  'hero-20': () => P([rep(5, iff('obstacleAhead', J()), iff('pathBlocked', R()), iff('pathClear', F()))]),
};

/** Alternative Lösungen, die das Makro benutzen (müssen nur gelingen) */
const MACRO_SOLUTIONS: Record<string, () => Program> = {
  'hero-15': () => P([call(), F(), call()], [F(), F(), R(), F(), F(), L()]),
  'hero-19': () => P([rep(3, call(), F())], [F(), R(), F(), L(), F()]),
};

/** BFS für Mini-Level: beste erreichbare Sternzahl & kürzester Weg (absolute Pfeile, kein Springen) */
function solveMini(level: LevelDef) {
  const map = parseMap(level);
  const dirs: Dir[] = ['up', 'down', 'left', 'right'];
  const starIdx = new Map(map.stars.map((s, i) => [posKey(s), i]));
  const s0 = initialState(level, map);
  let best = 0;
  let shortest = Infinity;
  let frontier = [{ pos: s0.pos, mask: 0 }];
  const seen = new Set([`${posKey(s0.pos)}|0`]);
  for (let steps = 1; steps <= level.maxBlocks; steps++) {
    const next: typeof frontier = [];
    for (const st of frontier) {
      for (const d of dirs) {
        const p = add(st.pos, d);
        if (isBlocked(map, p, s0)) continue;
        let mask = st.mask;
        const si = starIdx.get(posKey(p));
        if (si !== undefined) mask |= 1 << si;
        if (p.x === map.goal.x && p.y === map.goal.y) {
          shortest = Math.min(shortest, steps);
          const bits = mask.toString(2).replace(/0/g, '').length;
          best = Math.max(best, map.stars.length ? Math.min(3, 1 + bits) : steps <= level.parBlocks ? 3 : 2);
          continue;
        }
        const key = `${posKey(p)}|${mask}`;
        if (!seen.has(key)) {
          seen.add(key);
          next.push({ pos: p, mask });
        }
      }
    }
    frontier = next;
  }
  return { best, shortest };
}

describe('60 Level', () => {
  it('es gibt genau 20 Level pro Altersstufe', () => {
    for (const g of ['mini', 'junior', 'hero'] as const) {
      expect(LEVELS.filter((l) => l.group === g)).toHaveLength(20);
    }
  });

  it('alle Level-IDs sind eindeutig', () => {
    expect(new Set(LEVELS.map((l) => l.id)).size).toBe(LEVELS.length);
  });

  for (const level of LEVELS.filter((l) => l.group === 'mini')) {
    it(`${level.id}: 3 Sterne erreichbar, parBlocks stimmt`, () => {
      const { best, shortest } = solveMini(level);
      expect(best, 'beste Sternzahl').toBe(3);
      if (!hasBonus(level)) expect(shortest, 'kürzester Weg = parBlocks').toBe(level.parBlocks);
    });
  }

  for (const level of LEVELS.filter((l) => l.group === 'junior' || l.group === 'hero')) {
    it(`${level.id}: Referenzlösung schafft 3 Sterne`, () => {
      const make = SOLUTIONS[level.id];
      expect(make, `Lösung für ${level.id} fehlt`).toBeDefined();
      const p = make();
      const res = runProgram(level, p);
      expect(res.outcome, `Grund: ${res.reason}`).toBe('success');
      const n = countProgram(p);
      expect(n).toBeLessThanOrEqual(level.maxBlocks);
      if (!hasBonus(level)) expect(n, 'Blöcke = parBlocks').toBe(level.parBlocks);
      expect(rate(level, res, n)).toBe(3);
    });
  }

  for (const [id, make] of Object.entries(MACRO_SOLUTIONS)) {
    it(`${id}: Makro-Lösung funktioniert`, () => {
      const level = LEVELS.find((l) => l.id === id)!;
      expect(runProgram(level, make()).outcome).toBe('success');
    });
  }
});

describe('Spielregeln', () => {
  const lvl = (id: string) => LEVELS.find((l) => l.id === id)!;

  it('Bär blockiert den Weg', () => {
    const res = runProgram(lvl('mini-13'), P([Ri(), Ri()]));
    expect(res.reason).toBe('bear');
  });

  it('Tor bleibt ohne Schlüssel zu', () => {
    const res = runProgram(lvl('junior-14'), P([Ri(), Ri()]));
    expect(res.reason).toBe('locked');
  });

  it('über hohe Hindernisse kann man nicht springen', () => {
    const res = runProgram(lvl('junior-2'), P([D(), Ri(), U(), J()]));
    expect(res.outcome).toBe('fail');
  });

  it('Teleporter versetzt die Figur', () => {
    const res = runProgram(lvl('hero-17'), P([rep(4, F())]));
    const last = res.frames[res.frames.length - 1].state.pos;
    expect(last).toEqual({ x: 1, y: 2 });
  });

  it('Kollision mit der Wand schlägt fehl', () => {
    expect(runProgram(lvl('hero-1'), P([R(), F()])).reason).toBe('wall');
  });
});
