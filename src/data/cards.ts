// ─────────────────────────────────────────────────────────────
// Entdecker-Karten: welches Programmier-Konzept steckt in einem
// Level – und was bauen echte Programmierer damit?
// (Texte in den Sprachpaketen unter src/i18n → cards.items)
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId } from '../types';
import { LEVELS, levelsFor } from './levels';

export type CardId =
  | 'sequence'
  | 'collect'
  | 'avoid'
  | 'loop'
  | 'jump'
  | 'keygate'
  | 'nested'
  | 'efficiency'
  | 'condition'
  | 'sensor'
  | 'function'
  | 'teleport';

export interface CardDef {
  id: CardId;
  group: AgeGroupId;
  emoji: string;
  /** Bild-Emojis für die Real-World-Beispiele */
  realEmoji: [string, string];
  /** Farbverlauf der Karte */
  colors: [string, string];
}

export const CARDS: CardDef[] = [
  { id: 'sequence', group: 'mini', emoji: '🧩', realEmoji: ['🤖', '🍰'], colors: ['#fde68a', '#f97316'] },
  { id: 'collect', group: 'mini', emoji: '🫐', realEmoji: ['🪙', '📦'], colors: ['#c4b5fd', '#7c3aed'] },
  { id: 'avoid', group: 'mini', emoji: '🐻', realEmoji: ['🗺️', '🚁'], colors: ['#bbf7d0', '#16a34a'] },
  { id: 'loop', group: 'junior', emoji: '🔁', realEmoji: ['⛏️', '🎬'], colors: ['#fed7aa', '#ea580c'] },
  { id: 'jump', group: 'junior', emoji: '🐇', realEmoji: ['🎮', '🐕'], colors: ['#d9f99d', '#65a30d'] },
  { id: 'keygate', group: 'junior', emoji: '🗝️', realEmoji: ['🚪', '🔐'], colors: ['#fef08a', '#ca8a04'] },
  { id: 'nested', group: 'hero', emoji: '🪆', realEmoji: ['🖥️', '🖨️'], colors: ['#fbcfe8', '#db2777'] },
  { id: 'efficiency', group: 'hero', emoji: '⚡', realEmoji: ['🔋', '🏎️'], colors: ['#fef9c3', '#eab308'] },
  { id: 'condition', group: 'hero', emoji: '🔀', realEmoji: ['🚗', '🚦'], colors: ['#a5f3fc', '#0891b2'] },
  { id: 'sensor', group: 'hero', emoji: '📡', realEmoji: ['🛰️', '🧹'], colors: ['#bae6fd', '#2563eb'] },
  { id: 'function', group: 'hero', emoji: '🪄', realEmoji: ['🕹️', '📸'], colors: ['#f5d0fe', '#a21caf'] },
  { id: 'teleport', group: 'hero', emoji: '🌀', realEmoji: ['🔗', '🌍'], colors: ['#c7d2fe', '#4f46e5'] },
];

/** Welche Karte gehört zu welchem Level (nach Position in der Welt, 1-basiert) */
const RANGES: Record<AgeGroupId, [number, CardId][]> = {
  mini: [[5, 'sequence'], [12, 'collect'], [20, 'avoid']],
  junior: [[6, 'loop'], [13, 'jump'], [20, 'keygate']],
  hero: [[4, 'nested'], [6, 'efficiency'], [9, 'condition'], [13, 'sensor'], [14, 'function'], [15, 'teleport'], [16, 'function'], [18, 'teleport'], [19, 'function'], [20, 'teleport']],
};

export function cardForLevel(levelId: string): CardDef {
  const level = LEVELS.find((l) => l.id === levelId)!;
  const n = levelsFor(level.group).indexOf(level) + 1;
  const id = RANGES[level.group].find(([max]) => n <= max)![1];
  return CARDS.find((c) => c.id === id)!;
}

/** Freigeschaltete Karten = Karten, deren Level mindestens 1 Stern hat */
export function unlockedCards(stars: Record<string, number>): Set<CardId> {
  return new Set(LEVELS.filter((l) => (stars[l.id] ?? 0) > 0).map((l) => cardForLevel(l.id).id));
}
