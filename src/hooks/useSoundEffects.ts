// ─────────────────────────────────────────────────────────────
// useSoundEffects – fröhliche Marimba-/Harfen-Klänge, lustiges
// "Boing" und Sieges-Fanfare, komplett synthetisch mit der Web
// Audio API (keine MP3-Dateien). Inklusive Mute (gespeichert).
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SoundName } from '../types';

const MUTE_KEY = 'sparky:muted';
const SFX_KEY = 'sparky:sfx';
const MUSIC_KEY = 'sparky:music';

type Timbre = 'marimba' | 'harp' | 'bell' | 'boing' | 'whoosh' | 'soft' | 'chip' | 'bass' | 'synth' | 'keys' | 'pad';

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
  // Laser-Schalter: elektrisches Zischen
  zap: [{ f: 1800, to: 300, at: 0, dur: 0.25, timbre: 'chip', vol: 0.07 }, { f: 2400, to: 900, at: 0.08, dur: 0.2, timbre: 'chip', vol: 0.05 }],
};

/** Vibrationsmuster (ms) für die Stumm-Visualisierung */
const VIBES: Partial<Record<SoundName, number | number[]>> = {
  boing: [40, 30, 40],
  fail: [120],
  win: [30, 50, 30, 50, 80],
  collect: 15,
  key: 25,
  gate: 30,
  teleport: [15, 20, 15],
  zap: [10, 15, 10],
  unlock: [20, 40, 20],
};

export const VIBE_KEY = 'sparky:vibe';
/** Visuelles Echo jedes Sounds – die FxLayer zeigt Blitze/Shakes, auch im Stumm-Modus */
export const FX_EVENT = 'sparky:fx';

function readBool(key: string, fallback: boolean) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === '1';
  } catch {
    return fallback;
  }
}
function writeBool(key: string, v: boolean) {
  try {
    localStorage.setItem(key, v ? '1' : '0');
  } catch {
    /* Speicher nicht verfügbar */
  }
}

// ─────────────────────────────────────────────────────────────
// ARCADE-MUSIK: kleine fröhliche Loops (4 Takte, Achtelnoten),
// eine Melodie pro Welt. Zahlen = Stufen der Tonleiter, null = Pause.
// ─────────────────────────────────────────────────────────────
export type MusicTheme = 'home' | 'mini' | 'junior' | 'hero' | 'teen' | 'adult';

interface Song {
  bpm: number;
  root: number;
  scale: number[];
  lead: (number | null)[];
  bass: (number | null)[];
  leadTimbre: Timbre;
  leadVol: number;
  bassTimbre?: Timbre;
  /** Optionaler Flächen-Akkord pro Takt (Stufen) – für Synthwave/Lo-Fi */
  pads?: number[][];
}

const PENTA = [0, 2, 4, 7, 9];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const MINOR_PENTA = [0, 3, 5, 7, 10];
const _ = null;

const SONGS: Record<MusicTheme, Song> = {
  // Start-Karte: ruhige Marimba in C-Dur
  home: {
    bpm: 96, root: N.C5, scale: PENTA, leadTimbre: 'marimba', leadVol: 0.11,
    lead: [0, _, 2, _, 4, _, 2, _, 3, _, 4, _, 5, _, _, _, 5, _, 4, _, 2, _, 4, _, 3, _, 2, _, 0, _, _, _],
    bass: [0, _, _, _, 0, _, _, _, 3, _, _, _, 3, _, _, _, 2, _, _, _, 2, _, _, _, 3, _, _, _, 0, _, _, _],
  },
  // Zauberwald: verspielt & hüpfend
  mini: {
    bpm: 92, root: N.F4 * 2, scale: PENTA, leadTimbre: 'marimba', leadVol: 0.1,
    lead: [0, 2, 4, _, 4, _, 2, _, 3, _, 4, 5, 4, _, _, _, 2, _, 0, 2, 4, _, 4, _, 3, 2, 1, _, 0, _, _, _],
    bass: [0, _, _, _, 3, _, _, _, 0, _, _, _, 3, _, _, _, 1, _, _, _, 4, _, _, _, 3, _, _, _, 0, _, _, _],
  },
  // Kristall-Lagune: schaukelnde Piraten-Melodie (dorisch)
  junior: {
    bpm: 108, root: N.D5, scale: DORIAN, leadTimbre: 'harp', leadVol: 0.09,
    lead: [0, _, 2, 3, 4, _, 3, 2, 4, _, 6, _, 4, _, _, _, 3, _, 4, 5, 6, _, 5, 4, 3, _, 1, _, 0, _, _, _],
    bass: [0, _, 4, _, 0, _, 4, _, 3, _, 0, _, 3, _, 0, _, 5, _, 2, _, 5, _, 2, _, 4, _, 1, _, 0, _, 4, _],
  },
  // Sternen-Akademie: flotter Chiptune mit Arpeggios
  hero: {
    bpm: 118, root: N.A4, scale: MINOR_PENTA, leadTimbre: 'chip', leadVol: 0.045,
    lead: [0, 2, 4, 5, 4, 2, 0, _, 1, 3, 5, 6, 5, 3, 1, _, 2, 4, 6, 7, 6, 4, 2, _, 3, 2, 1, 0, 1, _, 0, _],
    bass: [0, _, 0, _, 0, _, 0, _, 3, _, 3, _, 3, _, 3, _, 1, _, 1, _, 1, _, 1, _, 4, _, 4, _, 2, _, 2, _],
  },
  // Neon-Metropole: treibender Synthwave (Moll, pulsierender Achtel-Bass)
  teen: {
    bpm: 112, root: N.E4, scale: [0, 2, 3, 5, 7, 8, 10], leadTimbre: 'synth', leadVol: 0.05, bassTimbre: 'synth',
    lead: [7, _, _, 6, 7, _, 9, _, 8, _, 7, _, 5, _, _, _, 5, _, _, 4, 5, _, 7, _, 6, _, 5, _, 4, _, 2, _],
    bass: [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 6, 6],
    pads: [[0, 2, 4], [5, 7, 9], [3, 5, 7], [4, 6, 8]],
  },
  // Quantum-Lab: entspannter Lo-Fi (langsame E-Piano-Akkorde, Jazz-Septimen)
  adult: {
    bpm: 76, root: N.F4, scale: [0, 2, 4, 5, 7, 9, 11], leadTimbre: 'keys', leadVol: 0.07, bassTimbre: 'bass',
    lead: [_, _, 4, _, 6, _, _, 7, _, _, 6, _, 4, _, _, _, _, _, 3, _, 5, _, _, 4, _, _, 2, _, 1, _, _, _],
    bass: [0, _, _, _, _, _, 0, _, 3, _, _, _, _, _, 4, _, 5, _, _, _, _, _, 5, _, 1, _, _, _, 4, _, _, _],
    pads: [[0, 2, 4, 6], [3, 5, 7, 9], [5, 7, 9, 11], [1, 3, 5, 7]],
  },
};

const degreeFreq = (song: Song, deg: number, octave = 0) => {
  const len = song.scale.length;
  const semis = song.scale[((deg % len) + len) % len] + 12 * (Math.floor(deg / len) + octave);
  return song.root * Math.pow(2, semis / 12);
};

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
              : n.timbre === 'chip'
                ? [[1, 0.6, 'square'], [2, 0.12, 'square']]
                : n.timbre === 'bass'
                  ? [[1, 1, 'triangle'], [2, 0.2, 'sine']]
                  : n.timbre === 'synth'
                    ? [[1, 0.7, 'sawtooth'], [1.006, 0.5, 'sawtooth']]
                    : n.timbre === 'keys'
                      ? [[1, 1, 'sine'], [2, 0.18, 'sine'], [3, 0.05, 'triangle']]
                      : n.timbre === 'pad'
                        ? [[1, 0.6, 'triangle'], [1.004, 0.5, 'sawtooth']]
                        : [[1, 1, 'triangle']];

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  const attack = n.timbre === 'whoosh' ? 0.08 : n.timbre === 'pad' ? n.dur * 0.35 : n.timbre === 'keys' ? 0.02 : 0.006;
  gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t1);

  let dest: AudioNode = out;
  if (n.timbre === 'whoosh') {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(800, t0);
    lp.frequency.exponentialRampToValueAtTime(4000, t1);
    lp.connect(out);
    dest = lp;
  } else if (n.timbre === 'synth' || n.timbre === 'pad') {
    // warmer Tiefpass – typisch Synthwave
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = n.timbre === 'synth' ? 6 : 1;
    lp.frequency.setValueAtTime(n.timbre === 'synth' ? 2400 : 900, t0);
    lp.frequency.exponentialRampToValueAtTime(n.timbre === 'synth' ? 600 : 700, t1);
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
  const musicGainRef = useRef<GainNode | null>(null);
  const [sfxOn, setSfxOnState] = useState<boolean>(() => readBool(SFX_KEY, !readBool(MUTE_KEY, false)));
  const [musicOn, setMusicOnState] = useState<boolean>(() => readBool(MUSIC_KEY, true));
  const sfxRef = useRef(sfxOn);
  sfxRef.current = sfxOn;
  const musicRef = useRef(musicOn);
  musicRef.current = musicOn;
  const themeRef = useRef<MusicTheme>('home');
  const seq = useRef({ step: 0, next: 0, timer: 0 as ReturnType<typeof setInterval> | 0, playing: false });

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
      const music = ctx.createGain();
      music.gain.value = 0;
      music.connect(comp);
      ctxRef.current = ctx;
      masterRef.current = master;
      musicGainRef.current = music;
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const [vibeOn, setVibeOnState] = useState<boolean>(() => readBool(VIBE_KEY, true));
  const vibeRef = useRef(vibeOn);
  vibeRef.current = vibeOn;
  const setVibeOn = useCallback((v: boolean) => {
    setVibeOnState(v);
    vibeRef.current = v;
    writeBool(VIBE_KEY, v);
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      // Stumm-Visualisierung: Vibration + visuelles Echo – unabhängig vom Ton
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(FX_EVENT, { detail: name }));
        const v = VIBES[name];
        if (v && vibeRef.current && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(v);
          } catch {
            /* nicht unterstützt */
          }
        }
      }
      if (!sfxRef.current) return;
      const ctx = ensureCtx();
      if (!ctx || !masterRef.current) return;
      const now = ctx.currentTime + 0.01;
      for (const n of RECIPES[name]) voice(ctx, masterRef.current, n, now);
    },
    [ensureCtx],
  );

  // ── Musik-Sequenzer (Lookahead-Scheduler) ──
  const stopMusic = useCallback(() => {
    const s = seq.current;
    if (s.timer) clearInterval(s.timer);
    s.timer = 0;
    s.playing = false;
    const ctx = ctxRef.current;
    const g = musicGainRef.current;
    if (ctx && g) {
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    }
  }, []);

  const startMusic = useCallback(() => {
    if (!musicRef.current) return;
    const ctx = ensureCtx();
    const g = musicGainRef.current;
    if (!ctx || !g || seq.current.playing) return;
    const s = seq.current;
    s.playing = true;
    s.step = 0;
    s.next = ctx.currentTime + 0.1;
    // sanft einblenden
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
    s.timer = setInterval(() => {
      const song = SONGS[themeRef.current];
      const eighth = 60 / song.bpm / 2;
      while (s.next < ctx.currentTime + 0.25) {
        const i = s.step % song.lead.length;
        const l = song.lead[i];
        const b = song.bass[i];
        if (l !== null) voice(ctx, g, { f: degreeFreq(song, l), at: 0, dur: eighth * 1.8, timbre: song.leadTimbre, vol: song.leadVol }, s.next);
        if (b !== null) {
          const synthBass = song.bassTimbre === 'synth';
          voice(ctx, g, { f: degreeFreq(song, b, -2), at: 0, dur: synthBass ? eighth * 0.9 : eighth * 3.5, timbre: song.bassTimbre ?? 'bass', vol: synthBass ? 0.05 : 0.09 }, s.next);
        }
        // Flächen-Akkord zu jedem Takt (8 Achtel)
        if (song.pads && i % 8 === 0) {
          const chord = song.pads[(i / 8) % song.pads.length];
          for (const d of chord) voice(ctx, g, { f: degreeFreq(song, d, -1), at: 0, dur: eighth * 8.5, timbre: 'pad', vol: 0.018 }, s.next);
        }
        // leiser Glitzer-Akzent alle 2 Takte
        if (i === 0 && s.step % 64 === 0) voice(ctx, g, { f: degreeFreq(song, 4, 1), at: 0, dur: 1.2, timbre: 'bell', vol: 0.025 }, s.next);
        s.next += eighth;
        s.step++;
      }
    }, 40);
  }, [ensureCtx]);

  /** Welt-Musik wechseln (startet beim nächsten Takt neu) */
  const setTheme = useCallback((t: MusicTheme) => {
    if (themeRef.current === t) return;
    themeRef.current = t;
    seq.current.step = 0;
  }, []);

  const setMusicOn = useCallback(
    (v: boolean) => {
      setMusicOnState(v);
      musicRef.current = v;
      writeBool(MUSIC_KEY, v);
      if (v) startMusic();
      else stopMusic();
    },
    [startMusic, stopMusic],
  );

  const setSfxOn = useCallback((v: boolean) => {
    setSfxOnState(v);
    sfxRef.current = v;
    writeBool(SFX_KEY, v);
  }, []);

  // Musik startet beim ersten Antippen (Browser-Autoplay-Regeln)
  useEffect(() => {
    const kick = () => {
      ensureCtx();
      startMusic();
    };
    window.addEventListener('pointerdown', kick);
    return () => window.removeEventListener('pointerdown', kick);
  }, [ensureCtx, startMusic]);

  // App im Hintergrund → Ton pausieren
  useEffect(() => {
    const onVis = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(
    () => () => {
      stopMusic();
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [stopMusic],
  );

  return { play, sfxOn, setSfxOn, musicOn, setMusicOn, setTheme, vibeOn, setVibeOn };
}

export type SoundApi = ReturnType<typeof useSoundEffects>;
