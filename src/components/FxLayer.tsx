// ─────────────────────────────────────────────────────────────
// Stumm-Visualisierung (S-Bahn-Modus): jedes Sound-Ereignis hat ein
// sichtbares Echo – Screen-Shake bei Fehlern, Partikel-Blitze bei
// Erfolg & Sammeln, kurzer Farbblitz bei Laser-Schaltern.
// Funktioniert auch komplett ohne Ton (play() sendet immer ein Event).
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { FX_EVENT } from '../hooks/useSoundEffects';
import type { SoundName } from '../types';

interface Burst {
  id: number;
  kind: 'shake' | 'sparkle' | 'flash' | 'win';
  color: string;
}

const KIND: Partial<Record<SoundName, Burst['kind']>> = {
  boing: 'shake',
  fail: 'shake',
  collect: 'sparkle',
  key: 'sparkle',
  gate: 'sparkle',
  unlock: 'sparkle',
  teleport: 'flash',
  zap: 'flash',
  win: 'win',
};
const COLOR: Partial<Record<SoundName, string>> = {
  boing: '#ef4444',
  fail: '#ef4444',
  collect: '#fde047',
  key: '#facc15',
  gate: '#a78bfa',
  unlock: '#f0abfc',
  teleport: '#22d3ee',
  zap: '#f43f5e',
  win: '#22c55e',
};

let nextId = 1;

export function FxLayer() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const on = (e: Event) => {
      const name = (e as CustomEvent<SoundName>).detail;
      const kind = KIND[name];
      if (!kind) return;
      const b: Burst = { id: nextId++, kind, color: COLOR[name] ?? '#fff' };
      setBursts((bs) => [...bs.slice(-4), b]);
      // Screen-Shake: die ganze App wackelt kurz
      if (kind === 'shake') {
        const root = document.getElementById('root');
        root?.classList.remove('fx-shake');
        void root?.offsetWidth;
        root?.classList.add('fx-shake');
      }
      setTimeout(() => setBursts((bs) => bs.filter((x) => x.id !== b.id)), 900);
    };
    window.addEventListener(FX_EVENT, on);
    return () => window.removeEventListener(FX_EVENT, on);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      {bursts.map((b) =>
        b.kind === 'flash' || b.kind === 'shake' ? (
          <div key={b.id} className="fx-flash absolute inset-0" style={{ boxShadow: `inset 0 0 60px 18px ${b.color}` }} />
        ) : (
          <div key={b.id} className="absolute left-1/2 top-1/3">
            {Array.from({ length: b.kind === 'win' ? 18 : 10 }, (_, i) => {
              const a = (i / (b.kind === 'win' ? 18 : 10)) * Math.PI * 2;
              const d = b.kind === 'win' ? 160 : 90;
              return (
                <span
                  key={i}
                  className="fx-spark absolute block h-3 w-3 rounded-full"
                  style={{
                    background: b.color,
                    boxShadow: `0 0 10px 3px ${b.color}`,
                    ['--dx' as string]: `${Math.cos(a) * d}px`,
                    ['--dy' as string]: `${Math.sin(a) * d}px`,
                  }}
                />
              );
            })}
          </div>
        ),
      )}
    </div>
  );
}
