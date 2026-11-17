// Prüft, dass jedes Level lösbar ist und mit der Referenzlösung 3 Sterne bringt.
// Wer ein neues Level in levels.ts anlegt, ergänzt hier eine Lösung.
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../src/data/levels';
import { runProgram } from '../src/engine/interpreter';
import { countProgram, uid } from '../src/engine/program';
import { rate } from '../src/engine/rating';
import type { Block, Condition, Dir, Program } from '../src/types';

const mv = (dir: Dir, times = 1): Block => ({ id: uid(), type: 'move', dir, times });
const jump = (times = 1): Block => ({ id: uid(), type: 'jump', times });
const F = (): Block => ({ id: uid(), type: 'forward' });
const L = (): Block => ({ id: uid(), type: 'turnLeft' });
const R = (): Block => ({ id: uid(), type: 'turnRight' });
const rep = (count: number, body: Block[]): Block => ({ id: uid(), type: 'repeat', count, body });
const iff = (cond: Condition, body: Block[]): Block => ({ id: uid(), type: 'if', cond, body });
const call = (): Block => ({ id: uid(), type: 'call' });
const prog = (main: Block[], macro: Block[] = []): Program => ({ main, macro });

const SOLUTIONS: Record<string, () => Program> = {
  'mini-1': () => prog([mv('right'), mv('right')]),
  'mini-2': () => prog([mv('down'), mv('right'), mv('right'), mv('down')]),
  'mini-3': () => prog([mv('right'), mv('right'), mv('up'), mv('up')]),
  'mini-4': () => prog([mv('left'), mv('left'), mv('up'), mv('up')]),
  'mini-5': () => prog([mv('right'), mv('right'), mv('right'), mv('up')]),
  'junior-1': () => prog([mv('right', 4)]),
  'junior-2': () => prog([mv('right'), jump(), mv('right')]),
  'junior-3': () => prog([jump(), mv('right', 4), mv('down', 2)]),
  'junior-4': () => prog([mv('down', 3), mv('right', 2), jump(), mv('up', 2)]),
  'hero-1': () => prog([rep(5, [F(), R(), F(), L()])]),
  'hero-2': () => prog([rep(11, [iff('pathBlocked', [R()]), F()])]),
  'hero-3': () => prog([rep(3, [call()]), R(), call(), call()], [F(), R(), F(), L()]),
  'hero-4': () =>
    prog([rep(14, [iff('pathBlocked', [L()]), iff('pathBlocked', [R(), R()]), F()])]),
};

describe('Level', () => {
  for (const level of LEVELS) {
    it(`${level.id} ist mit 3 Sternen lösbar`, () => {
      const make = SOLUTIONS[level.id];
      expect(make, `Referenzlösung für ${level.id} fehlt`).toBeDefined();
      const p = make();
      const res = runProgram(level, p);
      expect(res.outcome, `Grund: ${res.reason}`).toBe('success');
      expect(countProgram(p)).toBeLessThanOrEqual(level.maxBlocks);
      expect(rate(level, res, countProgram(p))).toBe(3);
    });
  }

  it('Stein-Kollision schlägt fehl', () => {
    const res = runProgram(LEVELS.find((l) => l.id === 'mini-2')!, prog([mv('right')]));
    expect(res.outcome).toBe('fail');
    expect(res.reason).toBe('rock');
  });

  it('Truhe ohne Schlüssel bleibt zu', () => {
    const res = runProgram(LEVELS.find((l) => l.id === 'junior-3')!, prog([mv('right', 4)]));
    expect(res.reason).toBe('locked');
  });

  it('Jede Altersstufe hat mindestens 4 Level', () => {
    for (const g of ['mini', 'junior', 'hero']) {
      expect(LEVELS.filter((l) => l.group === g).length).toBeGreaterThanOrEqual(4);
    }
  });
});
