// Block-Palette: Antippen fügt einen Block hinzu (runde, glänzende "Squishy"-Buttons)
import type { CSSProperties } from 'react';
import type { WorldConfig } from '../data/worlds';
import type { PaletteKind } from '../types';
import { BLOCK_META } from './blockMeta';

interface Props {
  kinds: PaletteKind[];
  world: WorldConfig;
  onAdd: (k: PaletteKind) => void;
  disabled: boolean;
  isKindDisabled?: (k: PaletteKind) => boolean;
}

export function Palette({ kinds, world, onAdd, disabled, isKindDisabled }: Props) {
  const size = world.buttonSize;

  // Für die Kleinsten: Steuerkreuz wie bei einem Gamepad – ganz ohne Text
  if (!world.showText) {
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
          style={{ gridArea: area, width: size, height: size, '--c': meta.color } as CSSProperties}
          className="squish flex items-center justify-center rounded-[1.6rem]"
        >
          <Icon className="h-11 w-11" strokeWidth={3.5} />
        </button>
      );
    };
    return (
      <div
        className="mx-auto grid gap-2"
        style={{ gridTemplateAreas: '". u ." "l c r" ". d ."', gridTemplateColumns: `repeat(3, ${size}px)`, gridTemplateRows: `repeat(3, ${size}px)` }}
      >
        {cell('up', 'u')}
        {cell('left', 'l')}
        <div style={{ gridArea: 'c' }} className="flex items-center justify-center text-4xl">
          🐉
        </div>
        {cell('right', 'r')}
        {cell('down', 'd')}
      </div>
    );
  }

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-2">
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
            style={{ minHeight: size, '--c': meta.color } as CSSProperties}
            className="squish flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[1.2rem] px-1 py-1"
          >
            <Icon className="h-7 w-7" strokeWidth={3} />
            <span className="text-center text-[11px] font-bold leading-[1.1]">{meta.short}</span>
          </button>
        );
      })}
    </div>
  );
}
