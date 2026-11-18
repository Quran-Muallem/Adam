// ─────────────────────────────────────────────────────────────
// Langzeit-Belohnungen: Schatztruhen, Sticker, Abzeichen & Titel,
// Glücksrad (tägliche Überraschung) und Meilenstein-Schätze
// (Texte in den Sprachpaketen unter src/i18n → rewards / daily)
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId } from '../types';
import { levelGroup, levelNumber } from './levels';

/** Alle 15 Sterne füllt sich eine Schatztruhe */
export const CHEST_EVERY = 15;
/** Meilenstein-Inseln auf der Karte */
export const MILESTONE_EVERY = 10;
export const isMilestone = (n: number) => n % MILESTONE_EVERY === 0;

export const STICKERS = [
  '🦄', '🐙', '🦖', '🚀', '🌈', '🍩', '🎸', '🏆', '🐳', '🦊',
  '🍕', '⚽', '🎨', '🧁', '🦋', '🐼', '🛸', '🍉', '🎮', '🦁',
  '🐢', '🌋', '🎪', '🦜', '🍭', '🧸', '🌟', '🐲', '🪐', '🎈',
];

/** Zufälliger, noch nicht gesammelter Sticker (oder null, wenn alle da sind) */
export function randomNewSticker(owned: string[]): string | null {
  const left = STICKERS.filter((s) => !owned.includes(s));
  return left.length ? left[Math.floor(Math.random() * left.length)] : null;
}

// ── Glücksrad ──
export type WheelPrize = { kind: 'stars'; amount: number } | { kind: 'sticker' };
export const WHEEL: WheelPrize[] = [
  { kind: 'stars', amount: 1 },
  { kind: 'stars', amount: 2 },
  { kind: 'sticker' },
  { kind: 'stars', amount: 1 },
  { kind: 'stars', amount: 3 },
  { kind: 'sticker' },
  { kind: 'stars', amount: 2 },
  { kind: 'stars', amount: 5 },
];
export const WHEEL_COLORS = ['#f472b6', '#facc15', '#34d399', '#60a5fa', '#fb923c', '#a78bfa', '#2dd4bf', '#f43f5e'];

/** Datum als YYYY-MM-DD in Ortszeit */
export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

// ── Abzeichen & Titel ──
export type BadgeId =
  | 'firstSteps'
  | 'loopMaster'
  | 'jumpPro'
  | 'conditionPro'
  | 'macroMage'
  | 'worldTraveler'
  | 'starCollector'
  | 'perfectionist'
  | 'champ25'
  | 'champ50'
  | 'champ100'
  | 'loyal';

export interface BadgeDef {
  id: BadgeId;
  emoji: string;
}

/** Reihenfolge = Rang: der höchste erreichte Titel wird angezeigt */
export const BADGES: BadgeDef[] = [
  { id: 'firstSteps', emoji: '👣' },
  { id: 'loopMaster', emoji: '🔁' },
  { id: 'jumpPro', emoji: '🐇' },
  { id: 'worldTraveler', emoji: '🧭' },
  { id: 'conditionPro', emoji: '🔀' },
  { id: 'macroMage', emoji: '🪄' },
  { id: 'starCollector', emoji: '⭐' },
  { id: 'loyal', emoji: '🔥' },
  { id: 'perfectionist', emoji: '💎' },
  { id: 'champ25', emoji: '🥉' },
  { id: 'champ50', emoji: '🥈' },
  { id: 'champ100', emoji: '🥇' },
];

export interface BadgeStats {
  stars: Record<string, number>;
  totalStars: number;
  bestStreak: number;
}

/** Höchste geschaffte Levelnummer je Welt */
export function highestDone(stars: Record<string, number>, group: AgeGroupId) {
  let best = 0;
  for (const [id, s] of Object.entries(stars)) if (s > 0 && levelGroup(id) === group) best = Math.max(best, levelNumber(id));
  return best;
}

export function earnedBadges(st: BadgeStats): Set<BadgeId> {
  const done = (id: string) => (st.stars[id] ?? 0) > 0;
  const groups: AgeGroupId[] = ['mini', 'junior', 'hero'];
  const highest = Math.max(...groups.map((g) => highestDone(st.stars, g)));
  const threeStar = Object.values(st.stars).filter((s) => s >= 3).length;
  const out = new Set<BadgeId>();
  if (Object.values(st.stars).some((s) => s > 0)) out.add('firstSteps');
  if (done('junior-6')) out.add('loopMaster');
  if (done('junior-13')) out.add('jumpPro');
  if (groups.every((g) => highestDone(st.stars, g) > 0)) out.add('worldTraveler');
  if (done('hero-13')) out.add('conditionPro');
  if (done('hero-14')) out.add('macroMage');
  if (st.totalStars >= 50) out.add('starCollector');
  if (st.bestStreak >= 7) out.add('loyal');
  if (threeStar >= 20) out.add('perfectionist');
  if (highest >= 25) out.add('champ25');
  if (highest >= 50) out.add('champ50');
  if (highest >= 100) out.add('champ100');
  return out;
}

/** Bester Titel (oder null) */
export function bestTitle(earned: Set<BadgeId>): BadgeDef | null {
  for (let i = BADGES.length - 1; i >= 0; i--) if (earned.has(BADGES[i].id)) return BADGES[i];
  return null;
}
