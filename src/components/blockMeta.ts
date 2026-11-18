// Aussehen der Blöcke: Farbe (für die Glossy-Buttons) und Icon
import {
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Rabbit,
  Repeat,
  RotateCcw,
  RotateCw,
  Split,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Block, Condition, PaletteKind } from '../types';

export interface BlockMeta {
  Icon: LucideIcon;
  /** Grundfarbe (Hex) – erzeugt den Glossy-Verlauf */
  color: string;
  /** Helle Fläche für Container-Körper */
  soft: string;
}

export const BLOCK_META: Record<PaletteKind, BlockMeta> = {
  up: { Icon: ArrowUp, color: '#0ea5e9', soft: '#e0f2fe' },
  down: { Icon: ArrowDown, color: '#f59e0b', soft: '#fef3c7' },
  left: { Icon: ArrowLeft, color: '#8b5cf6', soft: '#ede9fe' },
  right: { Icon: ArrowRight, color: '#ec4899', soft: '#fce7f3' },
  jump: { Icon: Rabbit, color: '#65a30d', soft: '#ecfccb' },
  forward: { Icon: ArrowBigUp, color: '#10b981', soft: '#d1fae5' },
  turnLeft: { Icon: RotateCcw, color: '#8b5cf6', soft: '#ede9fe' },
  turnRight: { Icon: RotateCw, color: '#ec4899', soft: '#fce7f3' },
  repeat: { Icon: Repeat, color: '#f97316', soft: '#fff7ed' },
  if: { Icon: Split, color: '#0891b2', soft: '#ecfeff' },
  call: { Icon: WandSparkles, color: '#c026d3', soft: '#fae8ff' },
};

export function kindOf(b: Block): PaletteKind {
  return b.type === 'move' ? b.dir : b.type;
}

/** Texte der Blöcke/Bedingungen kommen aus den Sprachpaketen (src/i18n) */
export const COND_EMOJI: Record<Condition, string> = { pathClear: '🟢', pathBlocked: '🚧', obstacleAhead: '📦' };

export const COND_ORDER: Condition[] = ['pathBlocked', 'pathClear', 'obstacleAhead'];
