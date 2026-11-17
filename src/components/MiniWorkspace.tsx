// Workspace für die Kleinsten: große Slots, nur Symbole, Antippen = entfernen
import type { Block, Frame } from '../types';
import { BLOCK_META, kindOf } from './blockMeta';

interface Props {
  blocks: Block[];
  slots: number;
  frame: Frame | null;
  locked: boolean;
  remove: (id: string) => void;
}

export function MiniWorkspace({ blocks, slots, frame, locked, remove }: Props) {
  const currentId = frame?.activeIds[frame.activeIds.length - 1];
  return (
    <div className="flex items-center justify-center gap-2 rounded-3xl bg-white/80 p-3 sm:gap-3">
      {Array.from({ length: slots }).map((_, i) => {
        const b = blocks[i];
        if (!b) {
          return (
            <div
              key={`empty-${i}`}
              className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-dashed border-slate-300 text-3xl font-black text-slate-300 sm:h-20 sm:w-20"
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
            disabled={locked}
            onClick={() => remove(b.id)}
            className={`flex h-[72px] w-[72px] animate-pop items-center justify-center rounded-2xl ${meta.color} text-white shadow-lg transition-all duration-200 active:scale-90 sm:h-20 sm:w-20 ${
              current ? 'scale-110 ring-[6px] ring-yellow-300 shadow-[0_0_24px_rgba(253,224,71,1)]' : ''
            }`}
          >
            <Icon className="h-12 w-12" strokeWidth={3.5} />
          </button>
        );
      })}
    </div>
  );
}
