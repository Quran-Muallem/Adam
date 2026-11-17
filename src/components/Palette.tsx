// Block-Palette: Antippen fügt einen Block zum Programm hinzu
import type { AgeGroupConfig } from '../data/ageGroups';
import type { PaletteKind } from '../types';
import { BLOCK_META } from './blockMeta';

interface Props {
  kinds: PaletteKind[];
  group: AgeGroupConfig;
  onAdd: (k: PaletteKind) => void;
  disabled: boolean;
  /** Einzelne Blöcke sperren (z. B. Makro-Aufruf im Makro selbst) */
  isKindDisabled?: (k: PaletteKind) => boolean;
}

export function Palette({ kinds, group, onAdd, disabled, isKindDisabled }: Props) {
  const size = group.buttonSize;
  const iconOnly = !group.showText;

  // Für die Kleinsten: Steuerkreuz statt Liste – intuitiv wie ein Gamepad
  const isDpad = iconOnly && ['up', 'down', 'left', 'right'].every((k) => kinds.includes(k as PaletteKind));
  if (isDpad) {
    const cell = (k: PaletteKind, area: string) => {
      const meta = BLOCK_META[k];
      const Icon = meta.Icon;
      return (
        <button
          key={k}
          type="button"
          aria-label={meta.label}
          disabled={disabled}
          onClick={() => onAdd(k)}
          style={{ gridArea: area, width: size, height: size }}
          className={`flex items-center justify-center rounded-3xl ${meta.color} text-white shadow-[0_6px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none disabled:opacity-40`}
        >
          <Icon className="h-12 w-12" strokeWidth={3.5} />
        </button>
      );
    };
    return (
      <div
        className="mx-auto grid gap-2"
        style={{ gridTemplateAreas: '". u ." "l c r" ". d ."', gridTemplateColumns: `repeat(3, ${size}px)` }}
      >
        {cell('up', 'u')}
        {cell('left', 'l')}
        <div style={{ gridArea: 'c' }} className="flex items-center justify-center text-4xl">
          👾
        </div>
        {cell('right', 'r')}
        {cell('down', 'd')}
      </div>
    );
  }

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-1.5">
      {kinds.map((k) => {
        const meta = BLOCK_META[k];
        const Icon = meta.Icon;
        const off = disabled || (isKindDisabled?.(k) ?? false);
        return (
          <button
            key={k}
            type="button"
            aria-label={meta.label}
            disabled={off}
            onClick={() => onAdd(k)}
            style={{ minHeight: size }}
            className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl ${meta.color} px-1 py-1 text-white shadow-[0_5px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:shadow-none`}
          >
            <Icon className="h-7 w-7" strokeWidth={3} />
            <span className="text-[11px] font-extrabold leading-[1.1]">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
