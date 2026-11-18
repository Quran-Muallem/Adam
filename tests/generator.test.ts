// Der Generator muss für JEDE Levelnummer ein lösbares Level liefern
import { describe, expect, it } from 'vitest';
import { levelAt } from '../src/data/levels';
import { parseMap } from '../src/engine/world';
import type { AgeGroupId } from '../src/types';

describe('Prozeduraler Level-Generator', () => {
  for (const g of ['mini', 'junior', 'hero'] as AgeGroupId[]) {
    it(`${g}: Level 21–220 sind gültig, deterministisch und passen aufs Handy`, () => {
      for (let n = 21; n <= 220; n++) {
        const l = levelAt(g, n);
        expect(l.id).toBe(`${g}-${n}`);
        const m = parseMap(l);
        expect(m.cols).toBeLessThanOrEqual(7);
        expect(m.rows).toBeLessThanOrEqual(7);
        expect(l.parBlocks).toBeGreaterThan(0);
        expect(l.parBlocks).toBeLessThanOrEqual(l.maxBlocks);
      }
      // gleiche Nummer → gleiches Level
      expect(levelAt(g, 77).grid).toEqual(levelAt(g, 77).grid);
    });
  }

  it('Level werden abwechslungsreich (nicht alle gleich)', () => {
    const grids = new Set(Array.from({ length: 40 }, (_, i) => levelAt('junior', 21 + i).grid.join('|')));
    expect(grids.size).toBeGreaterThan(35);
  });
});
