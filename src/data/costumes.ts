// Freischaltbare Kostüme für Sparky – je mehr Sterne, desto mehr Kostüme
export type CostumeId = 'none' | 'wizard' | 'pirate' | 'astronaut' | 'crown' | 'flowers' | 'cape' | 'party';

export interface Costume {
  id: CostumeId;
  name: string;
  emoji: string;
  /** Benötigte Sterne (über alle Welten) */
  stars: number;
}

export const COSTUMES: Costume[] = [
  { id: 'none', name: 'Einfach Sparky', emoji: '🐉', stars: 0 },
  { id: 'party', name: 'Partyhut', emoji: '🥳', stars: 3 },
  { id: 'wizard', name: 'Zauberhut', emoji: '🧙', stars: 10 },
  { id: 'pirate', name: 'Piratenklappe', emoji: '🏴‍☠️', stars: 25 },
  { id: 'flowers', name: 'Blumenkranz', emoji: '🌸', stars: 45 },
  { id: 'astronaut', name: 'Astronautenhelm', emoji: '👩‍🚀', stars: 70 },
  { id: 'crown', name: 'Königskrone', emoji: '👑', stars: 110 },
  { id: 'cape', name: 'Superhelden-Umhang', emoji: '🦸', stars: 150 },
];

export const unlockedCostumes = (totalStars: number) => COSTUMES.filter((c) => totalStars >= c.stars);
