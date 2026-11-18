// Stufe 4 & 5: neue Konzepte (Variablen, Solange, Logik-Gatter, Laser,
// Rekursion, Zwei-Bot-Sync) + Lösungen für alle 20 neuen Level
import { describe, expect, it } from 'vitest';
import { LEVELS, levelAt } from '../src/data/levels';
import { codeToText, generateCode } from '../src/engine/codegen';
import { runProgram } from '../src/engine/interpreter';
import { countProgram, uid } from '../src/engine/program';
import { rate } from '../src/engine/rating';
import { parseMap } from '../src/engine/world';
import type { Block, CondExpr, Condition, Dir, LevelDef, Program } from '../src/types';

const F = (): Block => ({ id: uid(), type: 'forward' });
const Lt = (): Block => ({ id: uid(), type: 'turnLeft' });
const R = (): Block => ({ id: uid(), type: 'turnRight' });
const J = (): Block => ({ id: uid(), type: 'jump' });
const call = (): Block => ({ id: uid(), type: 'call' });
const sv = (value: number): Block => ({ id: uid(), type: 'setVar', value });
const dec = (): Block => ({ id: uid(), type: 'decVar' });
const rep = (count: number, ...body: Block[]): Block => ({ id: uid(), type: 'repeat', count, body });
/** "!atGoal", "pathBlocked|laserAhead", "obstacleAhead&varPositive" */
const c = (s: string): CondExpr => {
  const not = s.startsWith('!');
  if (not) s = s.slice(1);
  const m = s.match(/^(\w+)(?:([|&])(\w+))?$/)!;
  return { cond: m[1] as Condition, ...(not ? { not } : {}), ...(m[2] ? { op: m[2] === '|' ? 'or' : 'and', cond2: m[3] as Condition } : {}) } as CondExpr;
};
const wh = (s: string, ...body: Block[]): Block => ({ id: uid(), type: 'while', ...c(s), body });
const iff = (s: string, ...body: Block[]): Block => ({ id: uid(), type: 'if', ...c(s), body });
const mv = (d: Dir) => (): Block => ({ id: uid(), type: 'move', dir: d });
const U = mv('up'), D = mv('down'), Le = mv('left'), Ri = mv('right');
const P = (main: Block[], macro: Block[] = []): Program => ({ main, macro });

const SOLUTIONS: Record<string, () => Program> = {
  'teen-1': () => P([wh('!atGoal', F())]),
  'teen-2': () => P([wh('!atGoal', iff('pathBlocked', R()), F())]),
  'teen-3': () => P([F(), Lt(), F(), R(), F(), R(), F(), Lt(), F(), F()]),
  'teen-4': () => P([sv(6), wh('varPositive', F(), dec()), R(), wh('!atGoal', F())]),
  'teen-5': () => P([wh('!atGoal', iff('!pathClear', R()), F())]),
  'teen-6': () => P([rep(3, rep(2, F()), R(), rep(2, F()), Lt())]),
  'teen-7': () => P([wh('!atGoal', iff('obstacleAhead', J()), F())]),
  'teen-8': () => P([wh('!atGoal', iff('obstacleAhead', J()), iff('pathBlocked|laserAhead', R()), F())]),
  'teen-9': () => P([rep(5, F()), J(), rep(3, F())]),
  'teen-10': () => P([sv(3), wh('varPositive', F(), dec()), R(), wh('!atGoal', iff('obstacleAhead', J()), iff('!pathClear', Lt()), F())]),
  'adult-1': () => P([call()], [iff('pathClear', F(), call())]),
  'adult-2': () => P([rep(4, Ri())]),
  'adult-3': () => P([call()], [iff('pathBlocked', R()), F(), call()]),
  'adult-4': () => P([call()], [F(), R(), F(), Lt(), call()]),
  'adult-5': () => P([rep(3, Ri()), D(), rep(3, Le()), rep(2, D())]),
  'adult-6': () => P([sv(6), call(), R(), sv(3), call()], [iff('varPositive', F(), dec(), call())]),
  'adult-7': () => P([call()], [iff('obstacleAhead', J()), iff('pathClear', F()), call()]),
  'adult-8': () => P([rep(2, D(), Ri()), Ri(), rep(2, U()), Ri()]),
  'adult-9': () => P([rep(2, Ri(), D()), rep(2, Ri()), D(), Ri()]),
  'adult-10': () => P([call()], [iff('obstacleAhead', J()), iff('pathBlocked', R()), iff('pathClear', F()), call()]),
};

const lvl = (id: string) => LEVELS.find((l) => l.id === id)!;
const solo = (grid: string[], startDir: Dir = 'right'): LevelDef => ({ id: 'teen-999', group: 'teen', title: '', grid, startDir, palette: [], maxBlocks: 99, parBlocks: 1 });

describe('Stufe 4 & 5: 20 neue Level', () => {
  it('je 10 handgefertigte Level', () => {
    expect(LEVELS.filter((l) => l.group === 'teen')).toHaveLength(10);
    expect(LEVELS.filter((l) => l.group === 'adult')).toHaveLength(10);
  });
  for (const level of LEVELS.filter((l) => l.group === 'teen' || l.group === 'adult')) {
    it(`${level.id}: Referenzlösung schafft 3 Sterne`, () => {
      const p = SOLUTIONS[level.id]();
      const res = runProgram(level, p);
      expect(res.outcome, `Grund: ${res.reason}`).toBe('success');
      const n = countProgram(p);
      expect(n).toBeLessThanOrEqual(level.maxBlocks);
      expect(n, 'Blöcke = parBlocks').toBe(level.parBlocks);
      expect(rate(level, res, n)).toBe(3);
      // jeder benutzte Block muss in der Palette sein
      const kinds = new Set<string>();
      const walk = (bs: Block[]) => bs.forEach((b) => (kinds.add(b.type === 'move' ? b.dir : b.type), 'body' in b && walk(b.body)));
      walk(p.main);
      walk(p.macro);
      for (const k of kinds) expect(level.palette, k).toContain(k);
    });
  }
});

describe('Neue Spielregeln', () => {
  it('Laser blockiert, Schalter schaltet ab', () => {
    expect(runProgram(lvl('teen-9'), P([wh('!atGoal', F())])).reason).toBe('laser');
    expect(runProgram(solo(['S.L.G']), P([F(), F()])).reason).toBe('laser');
    expect(runProgram(solo(['SXL.G']), P([rep(4, F())])).outcome).toBe('success');
  });
  it('aktive Laser kann man nicht überspringen', () => {
    expect(runProgram(solo(['S.L.G']), P([F(), J()])).reason).toBe('laser');
  });
  it('„versperrt“ ignoriert Laser, NICHT „frei“ nicht', () => {
    expect(runProgram(lvl('teen-5'), P([wh('!atGoal', iff('pathBlocked', R()), F())])).reason).toBe('laser');
  });
  it('UND / ODER / NICHT', () => {
    // n = 0 → (frei UND n>0) ist falsch → kein Schritt
    const a = runProgram(solo(['S..G']), P([iff('pathClear&varPositive', F()), F(), F()]));
    expect(a.reason).toBe('notReached');
    const b = runProgram(solo(['S..G']), P([iff('varPositive|pathClear', F()), F(), F()]));
    expect(b.outcome).toBe('success');
  });
  it('Variablen zählen herunter', () => {
    const res = runProgram(solo(['S.....G']), P([sv(4), wh('varPositive', F(), dec())]));
    expect(res.frames[res.frames.length - 1].state.pos.x).toBe(4);
    expect(res.frames[res.frames.length - 1].state.n).toBe(0);
  });
  it('endlose Rekursion → Stack Overflow', () => {
    expect(runProgram(solo(['S.#', '##G']), P([call()], [call()])).reason).toBe('overflow');
  });
  it('endlose Solange-Schleife wird abgebrochen', () => {
    expect(runProgram(solo(['S.#', '##G']), P([wh('!atGoal', R())])).reason).toBe('tooLong');
  });
  it('Zwei Bots: blockierter Bot wartet, Erfolg nur wenn beide am Ziel', () => {
    const res = runProgram(lvl('adult-2'), P([rep(3, Ri())]));
    expect(res.outcome).toBe('fail');
    const last = res.frames[res.frames.length - 1].state;
    expect(last.pos).toEqual({ x: 3, y: 0 });
    expect(last.pos2).toEqual({ x: 3, y: 2 });
  });
});

describe('Code-Brücke für Profis', () => {
  const prog = P([sv(3), wh('!atGoal', iff('pathBlocked|laserAhead', R()), F()), call()], [iff('varPositive', dec(), call())]);
  it('Python', () => {
    const t = codeToText(generateCode(prog, 'py', 'x'));
    expect(t).toContain('while not at_goal():');
    expect(t).toContain('if path_blocked() or laser_ahead():');
    expect(t).toContain('global n');
    expect(t).toContain('n -= 1');
    expect(t).toContain('if n > 0:');
  });
  it('TypeScript', () => {
    const t = codeToText(generateCode(prog, 'ts', 'x'));
    expect(t).toContain('let n: number = 0;');
    expect(t).toContain('function f1(): void {');
    expect(t).toContain('while (!atGoal()) {');
    expect(t).toContain('if (pathBlocked() || laserAhead()) {');
  });
});

describe('Generator Stufe 4 & 5', () => {
  for (const g of ['teen', 'adult'] as const) {
    it(`${g}: Level 11–150 gültig & handytauglich`, () => {
      for (let n = 11; n <= 150; n++) {
        const l = levelAt(g, n);
        expect(l.id).toBe(`${g}-${n}`);
        const m = parseMap(l);
        expect(m.cols).toBeLessThanOrEqual(7);
        expect(m.rows).toBeLessThanOrEqual(7);
        expect(l.parBlocks).toBeGreaterThan(0);
        expect(l.parBlocks).toBeLessThanOrEqual(l.maxBlocks);
      }
    });
  }
});
