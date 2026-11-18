// ─────────────────────────────────────────────────────────────
// Die drei Themenwelten (eine pro Altersstufe):
// Design, Spielfeld-Grafik, Partikel und UI-Komplexität
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId } from '../types';

export interface WorldConfig {
  id: AgeGroupId;
  /** Name der Altersstufe */
  name: string;
  ages: string;
  /** Name der Themenwelt */
  world: string;
  emoji: string;
  tagline: string;
  showText: boolean;
  /** Spielfeld-Emojis */
  goal: string;
  bonus: string;
  bonusName: string;
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
  particles: 'fireflies' | 'bubbles' | 'stars';
  /** Dekoration auf der Level-Karte */
  decor: string[];
  /** Pfadfarbe auf der Level-Karte */
  path: string;
  /** Textfarbe auf dem Hintergrund */
  text: string;
  /** Mindestgröße der Touch-Buttons */
  buttonSize: number;
}

export const WORLDS: Record<AgeGroupId, WorldConfig> = {
  mini: {
    id: 'mini',
    name: 'Mini-Entdecker',
    ages: '4–5 Jahre',
    world: 'Zauberwald der Glühwürmchen',
    emoji: '🌳',
    tagline: 'Führe Sparky zu den Erdbeeren!',
    showText: false,
    goal: '🍓',
    bonus: '🫐',
    bonusName: 'Zauberbeere',
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
    name: 'Junior-Coder',
    ages: '6–8 Jahre',
    world: 'Kristall-Lagune der Piraten',
    emoji: '🏴‍☠️',
    tagline: 'Schleifen, Sprünge & Schätze',
    showText: true,
    goal: '💰',
    bonus: '💎',
    bonusName: 'Kristall',
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
    name: 'Code-Helden',
    ages: '9–12 Jahre',
    world: 'Sternen-Akademie der Roboter',
    emoji: '🚀',
    tagline: 'Schleifen, Bedingungen, Makros & Portale',
    showText: true,
    goal: '🏆',
    bonus: '⭐',
    bonusName: 'Stern',
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
};

export const WORLD_ORDER: AgeGroupId[] = ['mini', 'junior', 'hero'];
