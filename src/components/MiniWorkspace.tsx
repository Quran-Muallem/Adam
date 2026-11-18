// Workspace für die Kleinsten: große Slots, nur Symbole, Antippen = entfernen
import type { CSSProperties, ReactNode } from 'react';
import type { Block, Frame } from '../types';
import { BLOCK_META, kindOf } from './blockMeta';

interface Props {
  blocks: Block[];
  slots: number;
  frame: Frame | null;
  frameIndex: number;
  pulseMs: number;
  locked: boolean;
  remove: (id: string) => void;
  /** Zusätzliche Knöpfe (Zurücksetzen, Löschen) */
  children?: ReactNode;
}

export function MiniWorkspace({ blocks, slots, frame, frameIndex, pulseMs, locked, remove, children }: Props) {
  const currentId = frame?.activeIds[frame.activeIds.length - 1];
  return (
    <div className="glass flex flex-wrap items-center justify-center gap-2 rounded-[2rem] p-3">
      {Array.from({ length: slots }).map((_, i) => {
        const b = blocks[i];
        if (!b) {
          return (
            <div
              key={`empty-${i}`}
              className="flex h-[68px] w-[68px] items-center justify-center rounded-[1.4rem] border-4 border-dashed border-slate-300 bg-slate-50 text-3xl font-bold text-slate-300"
            >
              {i + 1}
            </div>
          );
        }
        const meta = BLOCK_META[kindOf(b)];
        const Icon = meta.Icon;
        const current = currentId === b.id;
        return (
          <button
            key={b.id}
            type="button"
            aria-label={`${meta.label} entfernen`}
            onClick={() => !locked && remove(b.id)}
            className={`squish relative flex h-[68px] w-[68px] animate-pop items-center justify-center rounded-[1.4rem] ${
              current ? 'gold-glow scale-110' : ''
            }`}
            style={{ '--c': meta.color } as CSSProperties}
          >
            {current && (
              <span
                key={frameIndex}
                className="pointer-events-none absolute inset-0 animate-gold-pulse rounded-[inherit]"
                style={{ ['--pulse' as string]: `${pulseMs}ms` }}
              />
            )}
            <Icon className="h-11 w-11" strokeWidth={3.5} />
          </button>
        );
      })}
      {children && <div className="ml-1 flex gap-2 border-l-2 border-slate-200 pl-3">{children}</div>}
    </div>
  );
}
