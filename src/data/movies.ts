// ─────────────────────────────────────────────────────────────
// DREHBÜCHER des Erklär-Kinos (je 20 Sekunden, eine pro Altersstufe)
//
// Ein Film ist eine Liste von Schritten mit Zeitstempel. Der Zustand
// der Szene zu einem Zeitpunkt = alle Schritte bis dahin
// zusammengefasst. Dadurch ist jeder Film beliebig oft abspielbar.
// ─────────────────────────────────────────────────────────────
import type { SparkyMood } from '../components/Sparky';
import type { AgeGroupId, Condition, Dir, PaletteKind, Program, SoundName } from '../types';

export const MOVIE_SECONDS = 20;

/** Ein Block im Film-Programm (vereinfachte Darstellung) */
export interface Chip {
  id: string;
  kind: PaletteKind;
  count?: number;
  cond?: Condition;
  children?: Chip[];
}

export interface Scene {
  /** Untertitel-Index (Junior/Helden) */
  caption: number | null;
  /** Emoji-Sprechblase (Mini – ganz ohne Text) */
  emoji: string | null;
  pointer: { x: number; y: number; show: boolean };
  /** Erhöht sich bei jedem Tippen → Tipp-Welle */
  tap: number;
  program: Chip[];
  macro: Chip[] | null;
  /** Gerade ausgeführter Block (id) */
  active: string | null;
  sparky: { x: number; y: number; dir: Dir; mood: SparkyMood; hop: number };
  collected: string[];
  /** Hervorgehobener Palette-Knopf */
  highlight: PaletteKind | 'play' | 'code' | null;
  showCode: boolean;
  stars: number;
  confetti: boolean;
}

export interface Step {
  t: number;
  set: Partial<Scene>;
  sound?: SoundName;
}

export interface Movie {
  grid: string[];
  palette: (PaletteKind | 'play')[];
  steps: Step[];
  /** Programm für die Code-Ansicht (nur Helden) */
  codeProgram?: Program;
}

/** Position eines Palette-Knopfs (in % der Bühne) */
export const paletteXY = (i: number, n: number, y = 88.5) => ({ x: 4 + (i + 0.5) * (92 / n), y });
/** Mini & Junior haben kein Code-Fenster → Palette sitzt tiefer, Spielfeld ist größer */
const LOW = 85;

export const INITIAL_SCENE: Scene = {
  caption: null,
  emoji: null,
  pointer: { x: 50, y: 105, show: false },
  tap: 0,
  program: [],
  macro: null,
  active: null,
  sparky: { x: 0, y: 0, dir: 'right', mood: 'idle', hop: 0 },
  collected: [],
  highlight: null,
  showCode: false,
  stars: 0,
  confetti: false,
};

/** Kleine Helfer, damit die Drehbücher lesbar bleiben */
let tapCount = 0;
const tapAt = (t: number, x: number, y: number, extra: Partial<Scene> = {}, sound: SoundName = 'click'): Step[] => [
  { t: t - 0.6, set: { pointer: { x, y, show: true } } },
  { t, set: { tap: ++tapCount, ...extra }, sound },
];
const sparkyAt = (x: number, y: number, mood: SparkyMood = 'walk', hop = 0, dir: Dir = 'right') => ({ x, y, dir, mood, hop });

// ═════════ Mini-Entdecker: rein visuell ═════════
function miniMovie(): Movie {
  const pal: Movie['palette'] = ['up', 'down', 'left', 'right', 'play'];
  const R = paletteXY(3, pal.length, LOW);
  const PLAY = paletteXY(4, pal.length, LOW);
  const chip = (n: number): Chip[] => Array.from({ length: n }, (_, i) => ({ id: `r${i}`, kind: 'right' }));
  return {
    grid: ['#.#.', 'S*.G'],
    palette: pal,
    steps: [
      { t: 0, set: { sparky: sparkyAt(0, 1, 'idle'), emoji: '👋' } },
      { t: 1.4, set: { pointer: { x: 50, y: 75, show: true }, emoji: '👉' } },
      ...tapAt(2.6, R.x, R.y, { program: chip(1), highlight: 'right' }),
      ...tapAt(3.8, R.x, R.y, { program: chip(2) }),
      ...tapAt(5.0, R.x, R.y, { program: chip(3) }),
      ...tapAt(6.8, PLAY.x, PLAY.y, { highlight: 'play', emoji: '▶️', active: 'r0' }),
      { t: 7.4, set: { sparky: sparkyAt(1, 1), collected: ['1,1'], pointer: { x: PLAY.x, y: PLAY.y, show: false } }, sound: 'collect' },
      { t: 8.5, set: { sparky: sparkyAt(2, 1), active: 'r1' }, sound: 'step' },
      { t: 9.6, set: { sparky: sparkyAt(3, 1), active: 'r2' }, sound: 'step' },
      { t: 10.4, set: { sparky: sparkyAt(3, 1, 'happy'), emoji: '🍓😋', stars: 3, confetti: true, active: null, highlight: null }, sound: 'win' },
      { t: 13, set: { emoji: '⭐⭐⭐' } },
      // Wiederholungs-Hinweis: erst Pfeil, dann Play
      { t: 14.2, set: { pointer: { x: R.x, y: R.y, show: true }, highlight: 'right', emoji: '👆' } },
      { t: 15.6, set: { pointer: { x: PLAY.x, y: PLAY.y, show: true }, highlight: 'play' } },
      { t: 17, set: { pointer: { x: R.x, y: R.y, show: true }, highlight: 'right' } },
      { t: 18.4, set: { pointer: { x: PLAY.x, y: PLAY.y, show: true }, highlight: 'play', emoji: '👏' } },
    ],
  };
}

// ═════════ Junior-Coder: Schleifen & Springen ═════════
function juniorMovie(): Movie {
  const pal: Movie['palette'] = ['up', 'down', 'left', 'right', 'jump', 'repeat', 'play'];
  const n = pal.length;
  const [RIGHT, JUMP, REP, PLAY] = [paletteXY(3, n, LOW), paletteXY(4, n, LOW), paletteXY(5, n, LOW), paletteXY(6, n, LOW)];
  const loop = (count: number, kids: Chip[]): Chip => ({ id: 'loop', kind: 'repeat', count, children: kids });
  const r = (id: string): Chip => ({ id, kind: 'right' });
  return {
    grid: ['#######', 'S.*.o*G'],
    palette: pal,
    steps: [
      { t: 0, set: { sparky: sparkyAt(0, 1, 'idle'), caption: 0 } },
      { t: 2.2, set: { caption: 1 } },
      ...tapAt(3.0, RIGHT.x, RIGHT.y, { program: [r('a')], highlight: 'right' }),
      ...tapAt(3.6, RIGHT.x, RIGHT.y, { program: [r('a'), r('b')] }),
      ...tapAt(4.2, RIGHT.x, RIGHT.y, { program: [r('a'), r('b'), r('c')] }),
      { t: 5.0, set: { caption: 2, program: [] }, sound: 'remove' },
      ...tapAt(6.0, REP.x, REP.y, { program: [loop(2, [])], highlight: 'repeat' }),
      ...tapAt(7.0, RIGHT.x, RIGHT.y, { program: [loop(2, [r('lr')])], highlight: 'right' }),
      ...tapAt(8.0, 40, 63, { program: [loop(3, [r('lr')])], highlight: null }),
      { t: 8.8, set: { caption: 3 } },
      ...tapAt(9.8, JUMP.x, JUMP.y, { program: [loop(3, [r('lr')]), { id: 'j', kind: 'jump' }], highlight: 'jump' }),
      ...tapAt(10.8, RIGHT.x, RIGHT.y, { program: [loop(3, [r('lr')]), { id: 'j', kind: 'jump' }, r('end')], highlight: 'right' }),
      { t: 11.4, set: { caption: 4 } },
      ...tapAt(12.2, PLAY.x, PLAY.y, { highlight: 'play', active: 'loop' }),
      { t: 12.8, set: { sparky: sparkyAt(1, 1), active: 'lr', pointer: { x: PLAY.x, y: PLAY.y, show: false } }, sound: 'step' },
      { t: 13.5, set: { sparky: sparkyAt(2, 1), collected: ['2,1'] }, sound: 'collect' },
      { t: 14.2, set: { sparky: sparkyAt(3, 1) }, sound: 'step' },
      { t: 15.0, set: { sparky: sparkyAt(5, 1, 'walk', 1), active: 'j', collected: ['2,1', '5,1'] }, sound: 'jump' },
      { t: 15.9, set: { sparky: sparkyAt(6, 1), active: 'end' }, sound: 'step' },
      { t: 16.5, set: { sparky: sparkyAt(6, 1, 'happy'), caption: 5, stars: 3, confetti: true, active: null, highlight: null }, sound: 'win' },
    ],
  };
}

// ═════════ Code-Helden: Bedingung, Makro F1, echter Code ═════════
function heroMovie(): Movie {
  const pal: Movie['palette'] = ['forward', 'turnLeft', 'turnRight', 'repeat', 'if', 'call', 'play'];
  const n = pal.length;
  const [FWD, REP, IF, F1, PLAY] = [paletteXY(0, n), paletteXY(3, n), paletteXY(4, n), paletteXY(5, n), paletteXY(6, n)];
  const fw: Chip = { id: 'fw', kind: 'forward' };
  const iff = (kids: Chip[]): Chip => ({ id: 'if', kind: 'if', cond: 'pathClear', children: kids });
  const rep = (count: number, kids: Chip[]): Chip => ({ id: 'rep', kind: 'repeat', count, children: kids });
  const full = rep(5, [iff([fw])]);

  const steps: Step[] = [
    { t: 0, set: { sparky: sparkyAt(0, 1, 'idle'), caption: 0 } },
    { t: 1.8, set: { caption: 1 } },
    ...tapAt(2.6, REP.x, REP.y, { program: [rep(2, [])], highlight: 'repeat' }),
    ...tapAt(3.5, 56, 53, { program: [rep(3, [])], highlight: null }),
    { t: 3.9, set: { program: [rep(4, [])], tap: 900 }, sound: 'click' },
    { t: 4.3, set: { program: [rep(5, [])], tap: 901 }, sound: 'click' },
    ...tapAt(5.4, IF.x, IF.y, { program: [rep(5, [iff([])])], highlight: 'if' }),
    ...tapAt(6.4, FWD.x, FWD.y, { program: [full], highlight: 'forward' }),
    { t: 7.0, set: { caption: 2 } },
    ...tapAt(8.0, F1.x, F1.y, { program: [{ id: 'call', kind: 'call' }], macro: [full], highlight: 'call' }, 'unlock'),
    { t: 9.2, set: { caption: 3, highlight: 'code' } },
    ...tapAt(10.0, 50, 68, { showCode: true, highlight: null }, 'gate'),
    { t: 10.6, set: { caption: 4 } },
    { t: 12.0, set: { caption: 5 } },
    ...tapAt(12.6, PLAY.x, PLAY.y, { highlight: 'play', active: 'call' }),
  ];
  for (let k = 1; k <= 5; k++) {
    const t0 = 12.9 + (k - 1) * 1.0;
    steps.push({ t: t0, set: { active: 'if', pointer: { x: PLAY.x, y: PLAY.y, show: false } }, sound: 'tick' });
    steps.push({ t: t0 + 0.45, set: { active: 'fw', sparky: sparkyAt(k, 1) }, sound: 'step' });
  }
  steps.push({ t: 18.2, set: { sparky: sparkyAt(5, 1, 'happy'), caption: 6, stars: 3, confetti: true, active: null, highlight: null }, sound: 'win' });

  return {
    grid: ['######', 'S....G'],
    palette: pal,
    steps,
    codeProgram: {
      main: [{ id: 'call', type: 'call' }],
      macro: [{ id: 'rep', type: 'repeat', count: 5, body: [{ id: 'if', type: 'if', cond: 'pathClear', body: [{ id: 'fw', type: 'forward' }] }] }],
    },
  };
}

const sorted = (m: Movie): Movie => ({ ...m, steps: [...m.steps].sort((a, b) => a.t - b.t) });

export const MOVIES: Record<AgeGroupId, Movie> = {
  mini: sorted(miniMovie()),
  junior: sorted(juniorMovie()),
  hero: sorted(heroMovie()),
};

/** Szene zum Zeitpunkt t: alle Schritte bis t zusammenfassen */
export function sceneAt(movie: Movie, t: number): Scene {
  let s = INITIAL_SCENE;
  for (const step of movie.steps) {
    if (step.t > t) break;
    s = { ...s, ...step.set };
  }
  return s;
}
