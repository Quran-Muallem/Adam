import { describe, expect, it } from 'vitest';
import { codeToText, generateCode } from '../src/engine/codegen';
import { uid } from '../src/engine/program';
import type { Block, Program } from '../src/types';

const F = (): Block => ({ id: uid(), type: 'forward' });
const R = (): Block => ({ id: uid(), type: 'turnRight' });
const rep = (count: number, ...body: Block[]): Block => ({ id: uid(), type: 'repeat', count, body });
const iff = (...body: Block[]): Block => ({ id: uid(), type: 'if', cond: 'pathClear', body });
const call = (): Block => ({ id: uid(), type: 'call' });

const prog: Program = { main: [rep(2, rep(3, F()), R()), iff(F()), call()], macro: [F()] };

describe('Code-Brücke', () => {
  it('erzeugt korrektes JavaScript', () => {
    expect(codeToText(generateCode(prog, 'js', 'Sparky'))).toBe(
      [
        '// Sparky',
        'function f1() {',
        '  moveForward();',
        '}',
        '',
        'for (let i = 0; i < 2; i++) {',
        '  for (let j = 0; j < 3; j++) {',
        '    moveForward();',
        '  }',
        '  turnRight();',
        '}',
        'if (pathClear()) {',
        '  moveForward();',
        '}',
        'f1();',
      ].join('\n'),
    );
  });

  it('erzeugt korrektes Python (mit Einrückung und pass)', () => {
    const p: Program = { main: [rep(3, F()), iff()], macro: [] };
    expect(codeToText(generateCode(p, 'py', 'Sparky'))).toBe(
      ['# Sparky', 'for i in range(3):', '    move_forward()', 'if path_clear():', '    pass'].join('\n'),
    );
  });

  it('jede Block-Zeile kennt ihren Block', () => {
    const lines = generateCode(prog, 'js', 'x');
    expect(lines.filter((l) => l.blockId).length).toBe(8);
  });
});
