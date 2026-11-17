import type { LevelDef, RunResult } from '../types';

/**
 * Sterne-Bewertung (1–3):
 * - Mini-Entdecker: Ziel erreicht = 2 ⭐, mit kürzestem Weg = 3 ⭐
 * - Junior-Coder:   Ziel erreicht = 1 ⭐, + 1 ⭐ pro gesammeltem Bonus-Stern
 * - Code-Helden:    ≤ par Blöcke = 3 ⭐, ≤ par+3 = 2 ⭐, sonst 1 ⭐
 */
export function rate(level: LevelDef, result: RunResult, blockCount: number): number {
  if (result.outcome !== 'success') return 0;
  switch (level.group) {
    case 'mini':
      return blockCount <= level.par ? 3 : 2;
    case 'junior':
      return Math.min(3, 1 + result.starsCollected);
    case 'hero':
      if (blockCount <= level.par) return 3;
      if (blockCount <= level.par + 3) return 2;
      return 1;
  }
}
