// ─────────────────────────────────────────────────────────────
// useSoundEffects – fröhliche Marimba-/Harfen-Klänge, lustiges
// "Boing" und Sieges-Fanfare, komplett synthetisch mit der Web
// Audio API (keine MP3-Dateien). Inklusive Mute (gespeichert).
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SoundName } from '../types';

const MUTE_KEY = 'sparky:muted';

type Timbre = 'marimba' | 'harp' | 'bell' | 'boing' | 'whoosh' | 'soft';

interface Note {
  /** Frequenz in Hz */
  f: number;
  /** Start in Sekunden */
  at: number;
  /** Ausklingzeit */
  dur: number;
  timbre: Timbre;
  vol?: number;
  /** Zielfrequenz (Glissando) */
  to?: number;
}

// Noten-Helfer (C-Dur, wirkt immer fröhlich)
const N: Record<string, number> = {
  C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392.0, A4: 440.0, B4: 493.9,
  C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784.0, A5: 880.0, B5: 987.8,
  C6: 1046.5, E6: 1318.5, G6: 1568.0, C7: 2093.0,
};

const m = (f: number, at: number, dur = 0.35, vol = 0.25): Note => ({ f, at, dur, timbre: 'marimba', vol });
const h = (f: number, at: number, dur = 0.9, vol = 0.2): Note => ({ f, at, dur, timbre: 'harp', vol });

const RECIPES: Record<SoundName, Note[]> = {
  click: [m(N.G5, 0, 0.18, 0.18)],
  tick: [m(N.C6, 0, 0.1, 0.08)],
  remove: [m(N.E5, 0, 0.15, 0.16), m(N.C5, 0.07, 0.2, 0.14)],
  step: [m(N.C5, 0, 0.18, 0.16), m(N.G5, 0.05, 0.16, 0.08)],
  turn: [m(N.E5, 0, 0.15, 0.14), m(N.A5, 0.06, 0.15, 0.1)],
  jump: [{ f: N.C5, to: N.C6, at: 0, dur: 0.3, timbre: 'soft', vol: 0.18 }, m(N.G6, 0.2, 0.25, 0.1)],
  boing: [{ f: 420, to: 110, at: 0, dur: 0.55, timbre: 'boing', vol: 0.32 }],
  collect: [h(N.E6, 0, 0.5, 0.14), h(N.G6, 0.07, 0.6, 0.14), h(N.C7, 0.14, 0.8, 0.12)],
  key: [h(N.C6, 0, 0.6), h(N.E6, 0.08, 0.6), h(N.G6, 0.16, 0.9)],
  gate: [h(N.C5, 0, 1.0, 0.16), h(N.G5, 0.1, 1.0, 0.16), { f: 300, to: 900, at: 0, dur: 0.5, timbre: 'whoosh', vol: 0.06 }],
  teleport: [
    { f: 400, to: 1600, at: 0, dur: 0.45, timbre: 'whoosh', vol: 0.1 },
    h(N.C6, 0.0, 0.4, 0.1), h(N.E6, 0.05, 0.4, 0.1), h(N.G6, 0.1, 0.4, 0.1), h(N.C7, 0.15, 0.6, 0.1),
  ],
  // Sieges-Fanfare: Marimba-Arpeggio + Harfen-Akkord
  win: [
    m(N.C5, 0, 0.3), m(N.E5, 0.12, 0.3), m(N.G5, 0.24, 0.3), m(N.C6, 0.36, 0.35),
    m(N.G5, 0.52, 0.2), m(N.C6, 0.62, 0.6, 0.3),
    h(N.C5, 0.62, 1.6, 0.14), h(N.E5, 0.66, 1.6, 0.14), h(N.G5, 0.7, 1.6, 0.14), h(N.C6, 0.74, 1.8, 0.14),
    { f: N.E6, at: 0.62, dur: 1.4, timbre: 'bell', vol: 0.08 },
  ],
  fail: [m(N.G4, 0, 0.3, 0.2), m(N.E4, 0.18, 0.3, 0.2), m(N.C4, 0.36, 0.5, 0.2)],
  unlock: [h(N.G5, 0, 0.5), h(N.C6, 0.08, 0.5), h(N.E6, 0.16, 0.7)],
};

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Spielt einen einzelnen Ton mit passender Klangfarbe */
function voice(ctx: AudioContext, out: AudioNode, n: Note, now: number) {
  const t0 = now + n.at;
  const t1 = t0 + n.dur;
  const vol = n.vol ?? 0.2;

  // Teiltöne je Klangfarbe: [Frequenz-Verhältnis, Lautstärke, Wellenform]
  const partials: [number, number, OscillatorType][] =
    n.timbre === 'marimba'
      ? [[1, 1, 'sine'], [4, 0.25, 'sine'], [10, 0.05, 'sine']]
      : n.timbre === 'harp'
        ? [[1, 1, 'triangle'], [2, 0.35, 'sine'], [3, 0.12, 'sine']]
        : n.timbre === 'bell'
          ? [[1, 1, 'sine'], [2.76, 0.4, 'sine'], [5.4, 0.2, 'sine']]
          : n.timbre === 'boing'
            ? [[1, 1, 'sine'], [2, 0.2, 'triangle']]
            : n.timbre === 'whoosh'
              ? [[1, 1, 'sawtooth']]
              : [[1, 1, 'triangle']];

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + (n.timbre === 'whoosh' ? 0.08 : 0.006));
  gain.gain.exponentialRampToValueAtTime(0.0001, t1);

  let dest: AudioNode = out;
  if (n.timbre === 'whoosh') {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(800, t0);
    lp.frequency.exponentialRampToValueAtTime(4000, t1);
    lp.connect(out);
    dest = lp;
  }
  gain.connect(dest);

  for (const [ratio, amp, type] of partials) {
    const osc = ctx.createOscillator();
    const pg = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(n.f * ratio, t0);
    if (n.to) osc.frequency.exponentialRampToValueAtTime(n.to * ratio, t1);
    // Höhere Teiltöne klingen schneller aus (typisch für Marimba)
    pg.gain.setValueAtTime(amp, t0);
    if (ratio > 1.5) pg.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.min(n.dur, 0.12 * (n.timbre === 'marimba' ? 1 : 4)));
    osc.connect(pg).connect(gain);

    // Lustiges Wackeln beim "Boing"
    if (n.timbre === 'boing') {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(18, t0);
      lfo.frequency.linearRampToValueAtTime(6, t1);
      lfoGain.gain.setValueAtTime(40 * ratio, t0);
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t1 + 0.05);
    }
    osc.start(t0);
    osc.stop(t1 + 0.05);
  }
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [muted, setMuted] = useState<boolean>(readMuted);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  /** AudioContext erst bei der ersten Interaktion erzeugen (Autoplay-Regeln) */
  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      // Sanfter Kompressor = angenehm & nie zu laut
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 4;
      const master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp).connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (mutedRef.current) return;
      const ctx = ensureCtx();
      if (!ctx || !masterRef.current) return;
      const now = ctx.currentTime + 0.01;
      for (const n of RECIPES[name]) voice(ctx, masterRef.current, n, now);
    },
    [ensureCtx],
  );

  const toggleMute = useCallback(() => {
    setMuted((v) => {
      const next = !v;
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      } catch {
        /* Speicher nicht verfügbar */
      }
      return next;
    });
  }, []);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  return { play, muted, toggleMute };
}

export type SoundApi = ReturnType<typeof useSoundEffects>;
