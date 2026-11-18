// ─────────────────────────────────────────────────────────────
// Die fünf Themenwelten (eine pro Altersstufe):
// Design, Spielfeld-Grafik, Partikel und UI-Komplexität
// (Namen & Texte der Welten stehen in den Sprachpaketen unter src/i18n)
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId } from '../types';

export interface WorldConfig {
  id: AgeGroupId;
  emoji: string;
  showText: boolean;
  /** Spielfeld-Emojis */
  goal: string;
  bonus: string;
  wall: string;
  low: string;
  key: string;
  gate: string;
  /** Hintergrund (Tailwind-Gradient) */
  bg: string;
  /** Farben der Bodenkacheln (CSS) */
  tileA: string;
  tileB: string;
  wallTile: string;
  /** Rahmenfarbe des Spielfelds */
  frame: string;
  /** Akzentfarbe für Buttons */
  accent: string;
  /** Partikel-Art im Hintergrund */
  particles: 'fireflies' | 'bubbles' | 'stars' | 'neon' | 'quantum';
  /** Dekoration auf der Level-Karte */
  decor: string[];
  /** Pfadfarbe auf der Level-Karte */
  path: string;
  /** Textfarbe auf dem Hintergrund */
  text: string;
  /** Mindestgröße der Touch-Buttons */
  buttonSize: number;
  /** Teen/Erwachsene: sachlicher Ton, TypeScript in der Code-Brücke, Glas-Design */
  pro?: boolean;
  /** Laser-Schranke / Schalter / Ziel des zweiten Bots */
  laser?: string;
  switchOn?: string;
  goal2?: string;
}

export const WORLDS: Record<AgeGroupId, WorldConfig> = {
  mini: {
    id: 'mini',
    emoji: '🌳',
    showText: false,
    goal: '🍓',
    bonus: '🫐',
    wall: '🌳',
    low: '🪨',
    key: '🗝️',
    gate: '🚪',
    bg: 'from-emerald-700 via-teal-600 to-lime-500',
    tileA: '#a3e635',
    tileB: '#84cc16',
    wallTile: '#3f6212',
    frame: '#fef9c3',
    accent: '#f97316',
    particles: 'fireflies',
    decor: ['🌲', '🍄', '🌸', '🌳', '🦋', '🌼', '🐞', '🌿'],
    path: '#fef08a',
    text: 'text-white',
    buttonSize: 68,
  },
  junior: {
    id: 'junior',
    emoji: '🏴‍☠️',
    showText: true,
    goal: '💰',
    bonus: '💎',
    wall: '🌴',
    low: '🛢️',
    key: '🗝️',
    gate: '🚪',
    bg: 'from-sky-500 via-cyan-400 to-teal-300',
    tileA: '#fde68a',
    tileB: '#fcd34d',
    wallTile: '#0e7490',
    frame: '#ffffff',
    accent: '#0ea5e9',
    particles: 'bubbles',
    decor: ['🏝️', '🐚', '🦀', '⚓', '🐠', '🦜', '🌊', '🐙'],
    path: '#ffffff',
    text: 'text-slate-900',
    buttonSize: 64,
  },
  hero: {
    id: 'hero',
    emoji: '🚀',
    showText: true,
    goal: '🏆',
    bonus: '⭐',
    wall: '☄️',
    low: '📦',
    key: '🗝️',
    gate: '🚪',
    bg: 'from-indigo-950 via-violet-900 to-fuchsia-800',
    tileA: '#4338ca',
    tileB: '#3730a3',
    wallTile: '#0f0a2e',
    frame: '#a5b4fc',
    accent: '#d946ef',
    particles: 'stars',
    decor: ['🪐', '🛰️', '🌙', '🤖', '🌟', '👽', '🔭', '🌌'],
    path: '#c4b5fd',
    text: 'text-white',
    buttonSize: 60,
  },
  teen: {
    id: 'teen',
    emoji: '🌆',
    showText: true,
    goal: '💾',
    bonus: '🔋',
    wall: '🏢',
    low: '🚧',
    key: '🔑',
    gate: '🔒',
    bg: 'from-slate-950 via-fuchsia-950 to-cyan-900',
    tileA: '#1e1b4b',
    tileB: '#172554',
    wallTile: '#020617',
    frame: '#22d3ee',
    accent: '#f0abfc',
    particles: 'neon',
    decor: ['🌃', '🛸', '📡', '🏙️', '🤖', '⚡', '🕹️', '🌐'],
    path: '#22d3ee',
    text: 'text-white',
    buttonSize: 56,
    pro: true,
    laser: '🟥',
    switchOn: '🔘',
    goal2: '📀',
  },
  adult: {
    id: 'adult',
    emoji: '⚛️',
    showText: true,
    goal: '💠',
    bonus: '✨',
    wall: '🧊',
    low: '🔹',
    key: '🗝️',
    gate: '🔐',
    bg: 'from-zinc-950 via-slate-900 to-teal-950',
    tileA: '#1e293b',
    tileB: '#172133',
    wallTile: '#020617',
    frame: '#5eead4',
    accent: '#2dd4bf',
    particles: 'quantum',
    decor: ['⚛️', '🧬', '🔬', '🧪', '💡', '♾️', '🧠', '🌀'],
    path: '#5eead4',
    text: 'text-white',
    buttonSize: 54,
    pro: true,
    laser: '🟥',
    switchOn: '🔘',
    goal2: '🔷',
  },
};

export const WORLD_ORDER: AgeGroupId[] = ['mini', 'junior', 'hero', 'teen', 'adult'];

/** Ab hier gilt der Profi-Ton (Teenager & Erwachsene) */
export const isPro = (g: AgeGroupId) => g === 'teen' || g === 'adult';
