// Freischaltbare Kostüme & Farben für Sparky – je mehr Sterne, desto mehr
// (Namen stehen in den Sprachpaketen unter src/i18n)
export type CostumeId = 'none' | 'wizard' | 'pirate' | 'astronaut' | 'crown' | 'flowers' | 'cape' | 'party' | 'ninja' | 'cyber';

export interface Costume {
  id: CostumeId;
  emoji: string;
  /** Benötigte Sterne (über alle Welten, inkl. Bonus-Sterne) */
  stars: number;
}

export const COSTUMES: Costume[] = [
  { id: 'none', emoji: '🐉', stars: 0 },
  { id: 'party', emoji: '🥳', stars: 3 },
  { id: 'wizard', emoji: '🧙', stars: 10 },
  { id: 'pirate', emoji: '🏴‍☠️', stars: 25 },
  { id: 'ninja', emoji: '🥷', stars: 35 },
  { id: 'flowers', emoji: '🌸', stars: 45 },
  { id: 'astronaut', emoji: '👩‍🚀', stars: 70 },
  { id: 'cyber', emoji: '🤖', stars: 90 },
  { id: 'crown', emoji: '👑', stars: 110 },
  { id: 'cape', emoji: '🦸', stars: 150 },
];

export const unlockedCostumes = (totalStars: number) => COSTUMES.filter((c) => totalStars >= c.stars);

// ── Farben (Haut) ──
export type SkinId = 'violet' | 'mint' | 'sunset' | 'ocean' | 'gold' | 'rainbow';

export interface Skin {
  id: SkinId;
  stars: number;
  /** Verlauf des Körpers: hell → mittel → dunkel → Rand */
  body: [string, string, string, string];
  outline: string;
  feet: string;
}

export const SKINS: Skin[] = [
  { id: 'violet', stars: 0, body: ['#ddd6fe', '#a78bfa', '#7c3aed', '#5b21b6'], outline: '#4c1d95', feet: '#6d28d9' },
  { id: 'mint', stars: 15, body: ['#d1fae5', '#6ee7b7', '#10b981', '#047857'], outline: '#065f46', feet: '#059669' },
  { id: 'sunset', stars: 30, body: ['#ffedd5', '#fdba74', '#f97316', '#c2410c'], outline: '#9a3412', feet: '#ea580c' },
  { id: 'ocean', stars: 55, body: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0369a1'], outline: '#075985', feet: '#0284c7' },
  { id: 'gold', stars: 80, body: ['#fef9c3', '#fde047', '#eab308', '#a16207'], outline: '#854d0e', feet: '#ca8a04' },
  { id: 'rainbow', stars: 130, body: ['#f472b6', '#facc15', '#34d399', '#6366f1'], outline: '#4c1d95', feet: '#8b5cf6' },
];
