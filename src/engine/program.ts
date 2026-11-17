// Unveränderliche (immutable) Hilfsfunktionen für den Programm-Baum
import type { Block, InsertTarget, PaletteKind, Program } from '../types';

let counter = 0;
export const uid = () => `b${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const emptyProgram = (): Program => ({ main: [], macro: [] });

export function createBlock(kind: PaletteKind): Block {
  const id = uid();
  switch (kind) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
      return { id, type: 'move', dir: kind };
    case 'jump':
      return { id, type: 'jump' };
    case 'forward':
      return { id, type: 'forward' };
    case 'turnLeft':
      return { id, type: 'turnLeft' };
    case 'turnRight':
      return { id, type: 'turnRight' };
    case 'repeat':
      return { id, type: 'repeat', count: 2, body: [] };
    case 'if':
      return { id, type: 'if', cond: 'pathBlocked', body: [] };
    case 'call':
      return { id, type: 'call' };
  }
}

export const isContainer = (b: Block): b is Extract<Block, { body: Block[] }> => b.type === 'repeat' || b.type === 'if';

/** Zählt alle Blöcke (inkl. verschachtelter Blöcke und Makro-Definition) */
export function countBlocks(blocks: Block[]): number {
  return blocks.reduce((n, b) => n + 1 + (isContainer(b) ? countBlocks(b.body) : 0), 0);
}

export const countProgram = (p: Program) => countBlocks(p.main) + countBlocks(p.macro);

function mapTree(blocks: Block[], fn: (b: Block) => Block | null): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    const mapped = fn(b);
    if (!mapped) continue;
    out.push(isContainer(mapped) ? { ...mapped, body: mapTree(mapped.body, fn) } : mapped);
  }
  return out;
}

export function insertBlock(program: Program, target: InsertTarget, block: Block): Program {
  const root = program[target.root];
  const next =
    target.parentId === null
      ? [...root, block]
      : mapTree(root, (b) => (b.id === target.parentId && isContainer(b) ? { ...b, body: [...b.body, block] } : b));
  return { ...program, [target.root]: next };
}

export function removeBlock(program: Program, id: string): Program {
  const fn = (b: Block) => (b.id === id ? null : b);
  return { main: mapTree(program.main, fn), macro: mapTree(program.macro, fn) };
}

export function updateBlock(program: Program, id: string, patch: (b: Block) => Block): Program {
  const fn = (b: Block) => (b.id === id ? patch(b) : b);
  return { main: mapTree(program.main, fn), macro: mapTree(program.macro, fn) };
}

export function findBlock(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (isContainer(b)) {
      const f = findBlock(b.body, id);
      if (f) return f;
    }
  }
  return null;
}

/** Ist das Einfügeziel (noch) gültig? */
export function targetExists(program: Program, t: InsertTarget) {
  return t.parentId === null || findBlock(program[t.root], t.parentId) !== null;
}
