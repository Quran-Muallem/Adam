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
  /** Spielfeld-Untergrund im Tablet-Rahmen */
  boardBg: string;
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
    bg: 'from-[#15803d] via-[#22a04b] to-[#4cc35a]',
    tileA: '#a3e635',
    tileB: '#84cc16',
    wallTile: '#3f6212',
    frame: '#f59e0b',
    boardBg: 'radial-gradient(circle at 50% 25%, #86efac 0%, #16a34a 55%, #14532d 100%)',
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
    bg: 'from-[#0369a1] via-[#0ea5e9] to-[#22c3e6]',
    tileA: '#fde68a',
    tileB: '#fcd34d',
    wallTile: '#0e7490',
    frame: '#38bdf8',
    boardBg: 'radial-gradient(circle at 50% 25%, #7dd3fc 0%, #0284c7 55%, #0c4a6e 100%)',
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
    bg: 'from-[#2b1170] via-[#3c1a8c] to-[#1a0b4d]',
    tileA: '#8b7cf8',
    tileB: '#7a69ef',
    wallTile: '#0f0a2e',
    frame: '#6b8cff',
    boardBg: 'radial-gradient(circle at 30% 25%, #7c3aed 0%, #3b1d8f 45%, #160b40 100%)',
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
    tileA: '#7c3aed',
    tileB: '#6d28d9',
    wallTile: '#020617',
    frame: '#e879f9',
    boardBg: 'radial-gradient(circle at 30% 25%, #a21caf 0%, #3b0764 45%, #0b0626 100%)',
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
    tileA: '#0e7490',
    tileB: '#0b6680',
    wallTile: '#020617',
    frame: '#2dd4bf',
    boardBg: 'radial-gradient(circle at 30% 25%, #0f766e 0%, #0b2f3a 50%, #020617 100%)',
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
