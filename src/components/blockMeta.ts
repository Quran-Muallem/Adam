// Aussehen der Blöcke: Farbe (für die Glossy-Buttons), Icon, Beschriftung
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
  label: string;
  /** Kurzes Label für die Palette */
  short: string;
  Icon: LucideIcon;
  /** Grundfarbe (Hex) – erzeugt den Glossy-Verlauf */
  color: string;
  /** Helle Fläche für Container-Körper */
  soft: string;
}

export const BLOCK_META: Record<PaletteKind, BlockMeta> = {
  up: { label: 'Hoch', short: 'Hoch', Icon: ArrowUp, color: '#0ea5e9', soft: '#e0f2fe' },
  down: { label: 'Runter', short: 'Runter', Icon: ArrowDown, color: '#f59e0b', soft: '#fef3c7' },
  left: { label: 'Links', short: 'Links', Icon: ArrowLeft, color: '#8b5cf6', soft: '#ede9fe' },
  right: { label: 'Rechts', short: 'Rechts', Icon: ArrowRight, color: '#ec4899', soft: '#fce7f3' },
  jump: { label: 'Springen', short: 'Sprung', Icon: Rabbit, color: '#65a30d', soft: '#ecfccb' },
  forward: { label: 'Vorwärts', short: 'Vorwärts', Icon: ArrowBigUp, color: '#10b981', soft: '#d1fae5' },
  turnLeft: { label: 'Links drehen', short: 'Links drehen', Icon: RotateCcw, color: '#8b5cf6', soft: '#ede9fe' },
  turnRight: { label: 'Rechts drehen', short: 'Rechts drehen', Icon: RotateCw, color: '#ec4899', soft: '#fce7f3' },
  repeat: { label: 'Wiederhole', short: 'Schleife', Icon: Repeat, color: '#f97316', soft: '#fff7ed' },
  if: { label: 'Wenn', short: 'Wenn', Icon: Split, color: '#0891b2', soft: '#ecfeff' },
  call: { label: 'Zauber F1', short: 'F1', Icon: WandSparkles, color: '#c026d3', soft: '#fae8ff' },
};

export function kindOf(b: Block): PaletteKind {
  return b.type === 'move' ? b.dir : b.type;
}

export const COND_LABEL: Record<Condition, { text: string; emoji: string }> = {
  pathClear: { text: 'Weg frei', emoji: '🟢' },
  pathBlocked: { text: 'Weg versperrt', emoji: '🚧' },
  obstacleAhead: { text: 'Hindernis voraus', emoji: '📦' },
};

export const COND_ORDER: Condition[] = ['pathBlocked', 'pathClear', 'obstacleAhead'];
