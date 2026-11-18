// Freischaltbare Kostüme für Sparky – je mehr Sterne, desto mehr Kostüme
// (Namen stehen in den Sprachpaketen unter src/i18n)
export type CostumeId = 'none' | 'wizard' | 'pirate' | 'astronaut' | 'crown' | 'flowers' | 'cape' | 'party';

export interface Costume {
  id: CostumeId;
  emoji: string;
  /** Benötigte Sterne (über alle Welten) */
  stars: number;
}

export const COSTUMES: Costume[] = [
  { id: 'none', emoji: '🐉', stars: 0 },
  { id: 'party', emoji: '🥳', stars: 3 },
  { id: 'wizard', emoji: '🧙', stars: 10 },
  { id: 'pirate', emoji: '🏴‍☠️', stars: 25 },
  { id: 'flowers', emoji: '🌸', stars: 45 },
  { id: 'astronaut', emoji: '👩‍🚀', stars: 70 },
  { id: 'crown', emoji: '👑', stars: 110 },
  { id: 'cape', emoji: '🦸', stars: 150 },
];

export const unlockedCostumes = (totalStars: number) => COSTUMES.filter((c) => totalStars >= c.stars);
