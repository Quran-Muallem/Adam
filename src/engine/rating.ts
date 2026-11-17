import type { LevelDef, RunResult } from '../types';
import { parseMap } from './world';

/**
 * Sterne-Bewertung (1–3):
 * - Level MIT Bonus-Items (Beeren/Kristalle): 1 ⭐ fürs Ziel + 1 ⭐ je Bonus-Item (max. 3)
 * - Level OHNE Bonus-Items: Effizienz zählt
 *     Mini-Entdecker: ≤ parBlocks = 3 ⭐, sonst 2 ⭐
 *     Junior/Helden:  ≤ parBlocks = 3 ⭐, ≤ parBlocks + 2 = 2 ⭐, sonst 1 ⭐
 */
export function rate(level: LevelDef, result: RunResult, blockCount: number): number {
  if (result.outcome !== 'success') return 0;
  const bonusCount = parseMap(level).stars.length;
  if (bonusCount > 0) return Math.min(3, 1 + result.starsCollected);
  if (blockCount <= level.parBlocks) return 3;
  if (level.group === 'mini') return 2;
  return blockCount <= level.parBlocks + 2 ? 2 : 1;
}

export const hasBonus = (level: LevelDef) => parseMap(level).stars.length > 0;
