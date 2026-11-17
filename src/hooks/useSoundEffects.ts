// ─────────────────────────────────────────────────────────────
// useSoundEffects – synthetische Sounds mit der Web Audio API.
// Keine MP3-Dateien nötig. Inklusive Mute (im LocalStorage gemerkt).
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SoundName } from '../types';

const MUTE_KEY = 'robo-code:muted';

type Wave = OscillatorType;

interface Note {
  freq: number;
  /** Startzeit relativ in Sekunden */
  at: number;
  dur: number;
  type?: Wave;
  vol?: number;
  /** Ziel-Frequenz für Gleiten (Glissando) */
  slideTo?: number;
}

/** Sound-Rezepte: jede Zeile ist ein Ton */
const RECIPES: Record<SoundName, Note[]> = {
  click: [{ freq: 660, at: 0, dur: 0.05, type: 'triangle', vol: 0.18 }],
  remove: [{ freq: 420, at: 0, dur: 0.09, type: 'triangle', vol: 0.18, slideTo: 220 }],
  step: [{ freq: 520, at: 0, dur: 0.08, type: 'square', vol: 0.07, slideTo: 640 }],
  turn: [{ freq: 380, at: 0, dur: 0.1, type: 'triangle', vol: 0.14, slideTo: 520 }],
  jump: [{ freq: 300, at: 0, dur: 0.22, type: 'square', vol: 0.09, slideTo: 900 }],
  bump: [
    { freq: 140, at: 0, dur: 0.18, type: 'sawtooth', vol: 0.16, slideTo: 70 },
    { freq: 110, at: 0.12, dur: 0.16, type: 'sawtooth', vol: 0.12, slideTo: 60 },
  ],
  collect: [
    { freq: 988, at: 0, dur: 0.08, type: 'square', vol: 0.08 },
    { freq: 1319, at: 0.07, dur: 0.16, type: 'square', vol: 0.08 },
  ],
  key: [
    { freq: 784, at: 0, dur: 0.08, type: 'triangle', vol: 0.16 },
    { freq: 1047, at: 0.08, dur: 0.08, type: 'triangle', vol: 0.16 },
    { freq: 1568, at: 0.16, dur: 0.18, type: 'triangle', vol: 0.16 },
  ],
  win: [
    { freq: 523, at: 0, dur: 0.12, type: 'triangle', vol: 0.2 },
    { freq: 659, at: 0.12, dur: 0.12, type: 'triangle', vol: 0.2 },
    { freq: 784, at: 0.24, dur: 0.12, type: 'triangle', vol: 0.2 },
    { freq: 1047, at: 0.36, dur: 0.4, type: 'triangle', vol: 0.22 },
    { freq: 1319, at: 0.36, dur: 0.4, type: 'sine', vol: 0.1 },
  ],
  fail: [
    { freq: 392, at: 0, dur: 0.18, type: 'triangle', vol: 0.18 },
    { freq: 330, at: 0.18, dur: 0.18, type: 'triangle', vol: 0.18 },
    { freq: 262, at: 0.36, dur: 0.35, type: 'triangle', vol: 0.18, slideTo: 220 },
  ],
  unlock: [
    { freq: 600, at: 0, dur: 0.1, type: 'sine', vol: 0.18, slideTo: 1200 },
    { freq: 1200, at: 0.1, dur: 0.15, type: 'sine', vol: 0.14 },
  ],
};

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState<boolean>(readMuted);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  /** AudioContext erst bei der ersten Interaktion erzeugen (Autoplay-Regeln der Browser) */
  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (mutedRef.current) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime + 0.01;
      for (const n of RECIPES[name]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = n.type ?? 'sine';
        const t0 = now + n.at;
        const t1 = t0 + n.dur;
        osc.frequency.setValueAtTime(n.freq, t0);
        if (n.slideTo) osc.frequency.exponentialRampToValueAtTime(n.slideTo, t1);
        const vol = n.vol ?? 0.15;
        // Kurze Hüllkurve gegen Knackser
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t1);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0);
        osc.stop(t1 + 0.02);
      }
    },
    [ensureCtx],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      } catch {
        /* Speicher nicht verfügbar – egal */
      }
      return next;
    });
  }, []);

  // Beim Verlassen der App den AudioContext schließen
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
