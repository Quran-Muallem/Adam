// Aussehen der Blöcke: Farbe, Icon, Beschriftung
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
import type { Block, PaletteKind } from '../types';

export interface BlockMeta {
  label: string;
  Icon: LucideIcon;
  /** Tailwind-Hintergrund */
  color: string;
  /** Hellere Variante für Container-Körper */
  soft: string;
  border: string;
}

export const BLOCK_META: Record<PaletteKind, BlockMeta> = {
  up: { label: 'Hoch', Icon: ArrowUp, color: 'bg-sky-500', soft: 'bg-sky-100', border: 'border-sky-500' },
  down: { label: 'Runter', Icon: ArrowDown, color: 'bg-amber-500', soft: 'bg-amber-100', border: 'border-amber-500' },
  left: { label: 'Links', Icon: ArrowLeft, color: 'bg-violet-500', soft: 'bg-violet-100', border: 'border-violet-500' },
  right: { label: 'Rechts', Icon: ArrowRight, color: 'bg-pink-500', soft: 'bg-pink-100', border: 'border-pink-500' },
  jump: { label: 'Springen', Icon: Rabbit, color: 'bg-lime-600', soft: 'bg-lime-100', border: 'border-lime-600' },
  forward: { label: 'Vorwärts', Icon: ArrowBigUp, color: 'bg-emerald-500', soft: 'bg-emerald-100', border: 'border-emerald-500' },
  turnLeft: { label: 'Links drehen', Icon: RotateCcw, color: 'bg-violet-500', soft: 'bg-violet-100', border: 'border-violet-500' },
  turnRight: { label: 'Rechts drehen', Icon: RotateCw, color: 'bg-pink-500', soft: 'bg-pink-100', border: 'border-pink-500' },
  repeat: { label: 'Wiederhole', Icon: Repeat, color: 'bg-orange-500', soft: 'bg-orange-50', border: 'border-orange-500' },
  if: { label: 'Wenn', Icon: Split, color: 'bg-cyan-600', soft: 'bg-cyan-50', border: 'border-cyan-600' },
  call: { label: 'Zauber-Makro', Icon: WandSparkles, color: 'bg-fuchsia-600', soft: 'bg-fuchsia-50', border: 'border-fuchsia-600' },
};

export function kindOf(b: Block): PaletteKind {
  return b.type === 'move' ? b.dir : b.type;
}

export const COND_LABEL = {
  pathClear: 'Weg frei',
  pathBlocked: 'Weg blockiert',
} as const;
