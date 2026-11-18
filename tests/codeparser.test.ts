import { describe, expect, it } from 'vitest';
import { parseCode } from '../src/engine/codeparser';
import { codeToText, generateCode } from '../src/engine/codegen';
import { uid } from '../src/engine/program';
import type { Block, Program } from '../src/types';

const strip = (bs: Block[]): unknown[] => bs.map((b) => { const { id: _id, ...rest } = b as Block & { body?: Block[] }; return 'body' in rest && rest.body ? { ...rest, body: strip(rest.body) } : rest; });
const F = (): Block => ({ id: uid(), type: 'forward' });
const R = (): Block => ({ id: uid(), type: 'turnRight' });
const J = (): Block => ({ id: uid(), type: 'jump' });

const PROGRAMS: Program[] = [
  { main: [{ id: uid(), type: 'repeat', count: 3, body: [F(), R()] }], macro: [] },
  { main: [{ id: uid(), type: 'move', dir: 'up' }, { id: uid(), type: 'repeat', count: 2, body: [{ id: uid(), type: 'move', dir: 'right' }, J()] }], macro: [] },
  { main: [{ id: uid(), type: 'while', cond: 'atGoal', not: true, body: [{ id: uid(), type: 'if', cond: 'pathBlocked', op: 'or', cond2: 'laserAhead', body: [R()] }, F()] }], macro: [] },
  { main: [{ id: uid(), type: 'setVar', value: 6 }, { id: uid(), type: 'while', cond: 'varPositive', body: [F(), { id: uid(), type: 'decVar' }] }, R()], macro: [] },
  { main: [{ id: uid(), type: 'call' }], macro: [{ id: uid(), type: 'if', cond: 'pathClear', body: [F(), { id: uid(), type: 'call' }] }] },
  { main: [{ id: uid(), type: 'repeat', count: 2, body: [{ id: uid(), type: 'repeat', count: 3, body: [F()] }, R()] }, { id: uid(), type: 'call' }], macro: [F(), { id: uid(), type: 'if', cond: 'obstacleAhead', body: [J()] }] },
];

describe('Live-Code-Parser', () => {
  for (const lang of ['py', 'js', 'ts'] as const) {
    it(`Rundreise Blöcke → ${lang} → Blöcke`, () => {
      for (const p of PROGRAMS) {
        const src = codeToText(generateCode(p, lang, 'Kommentar'));
        const r = parseCode(src, lang);
        expect(r.error, src).toBeUndefined();
        expect(strip(r.program!.main)).toEqual(strip(p.main));
        expect(strip(r.program!.macro)).toEqual(strip(p.macro));
      }
    });
  }
  it('tolerant: camelCase in Python, ohne Klammern, Semikolons', () => {
    const r = parseCode('moveForward\nturn_left();\nfor i in range(2):\n    jump()', 'py');
    expect(r.error).toBeUndefined();
    expect(r.program!.main.map((b) => b.type)).toEqual(['forward', 'turnLeft', 'repeat']);
    const j = parseCode('move_forward(); turnRight(); moveForward()', 'js');
    expect(j.program!.main).toHaveLength(3);
  });
  it('Tippfehler → Vorschlag mit Zeilennummer', () => {
    const r = parseCode('move_forward()\nmove_forwrd()', 'py');
    expect(r.error).toMatchObject({ line: 2, kind: 'unknown', word: 'move_forwrd()', suggestion: 'move_forward()' });
    const c = parseCode('while not at_gaol():\n    move_forward()', 'py');
    expect(c.error).toMatchObject({ line: 1, kind: 'unknown', suggestion: 'at_goal()' });
  });
  it('Palette & Einrückung werden geprüft', () => {
    expect(parseCode('jump()', 'py', ['forward']).error?.kind).toBe('notAllowed');
    expect(parseCode('for i in range():\n    jump()', 'py').error?.kind).toBe('number');
    expect(parseCode('move_forward()\n    jump()', 'py').error?.kind).toBe('indent');
  });
  it('Zeilen kennen ihren Block (für die Hervorhebung)', () => {
    const r = parseCode('# hallo\nmove_forward()\nturn_left()', 'py');
    expect(r.lineBlocks[1]).toBe(r.program!.main[0].id);
    expect(r.lineBlocks[2]).toBe(r.program!.main[1].id);
  });
});
