// Block-Palette: Antippen fügt einen Block hinzu (runde, glänzende "Squishy"-Buttons)
import { Sparky } from './Sparky';
import type { CSSProperties } from 'react';
import type { WorldConfig } from '../data/worlds';
import type { Dict } from '../i18n';
import type { PaletteKind } from '../types';
import { BLOCK_META } from './blockMeta';

interface Props {
  kinds: PaletteKind[];
  world: WorldConfig;
  onAdd: (k: PaletteKind) => void;
  disabled: boolean;
  isKindDisabled?: (k: PaletteKind) => boolean;
  t: Dict;
}

export function Palette({ kinds, world, onAdd, disabled, isKindDisabled, t }: Props) {
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
          aria-label={t.blocks[k].label}
          disabled={disabled}
          onClick={() => onAdd(k)}
          style={{ gridArea: area, width: size, height: size, '--c': meta.color } as CSSProperties}
          className="squish tile-btn flex items-center justify-center"
        >
          <Icon className="h-12 w-12 drop-shadow-[0_2px_0_#1d1530]" strokeWidth={3.5} />
        </button>
      );
    };
    return (
      <div
        dir="ltr"
        className="mx-auto grid gap-2"
        style={{ gridTemplateAreas: '". u ." "l c r" ". d ."', gridTemplateColumns: `repeat(3, ${size}px)`, gridTemplateRows: `repeat(3, ${size}px)` }}
      >
        {cell('up', 'u')}
        {cell('left', 'l')}
        <div style={{ gridArea: 'c' }} className="flex items-center justify-center p-1">
          <Sparky mood="happy" />
        </div>
        {cell('right', 'r')}
        {cell('down', 'd')}
      </div>
    );
  }

  // Viele Befehle (Teenager/Erwachsene): zwei Reihen, damit alles mit dem Daumen erreichbar bleibt
  const twoRows = kinds.length > 6;
  const perRow = twoRows ? Math.ceil(kinds.length / 2) : kinds.length;
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}>
      {kinds.map((k) => {
        const meta = BLOCK_META[k];
        const Icon = meta.Icon;
        const off = disabled || (isKindDisabled?.(k) ?? false);
        return (
          <button
            key={k}
            type="button"
            aria-label={t.blocks[k].label}
            disabled={off}
            onClick={() => onAdd(k)}
            style={{ minHeight: twoRows ? Math.round(size * 0.82) : size, '--c': meta.color } as CSSProperties}
            className="squish tile-btn flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1.5"
          >
            <Icon className={`${twoRows ? 'h-7 w-7' : 'h-9 w-9'} drop-shadow-[0_2px_0_#1d1530]`} strokeWidth={3} />
            <span className="text-center text-[13px] leading-[1.05]">{t.blocks[k].short}</span>
          </button>
        );
      })}
    </div>
  );
}
