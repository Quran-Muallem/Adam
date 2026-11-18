// ─────────────────────────────────────────────────────────────
// Entdecker-Karten: welches Programmier-Konzept steckt in einem
// Level – und was bauen echte Programmierer damit?
// (Texte in den Sprachpaketen unter src/i18n → cards.items)
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId } from '../types';
import { getLevel, handcrafted, levelGroup, levelNumber } from './levels';

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
  | 'teleport'
  // Profi-Karten (Teenager & Erwachsene) – mit echtem Code-Schnipsel
  | 'whileLoop'
  | 'variables'
  | 'logic'
  | 'stateMachine'
  | 'recursion'
  | 'parallel'
  | 'registers'
  | 'bigO';

export interface CardDef {
  id: CardId;
  group: AgeGroupId;
  emoji: string;
  /** Bild-Emojis für die Real-World-Beispiele */
  realEmoji: [string, string];
  /** Farbverlauf der Karte */
  colors: [string, string];
  /** Echter Code aus der Praxis (Profi-Karten) */
  code?: { lang: 'Python' | 'TypeScript' | 'SQL'; src: string };
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
  // ── Cyber-Pioniere ──
  {
    id: 'whileLoop', group: 'teen', emoji: '🔄', realEmoji: ['🎮', '📥'], colors: ['#f0abfc', '#c026d3'],
    code: { lang: 'Python', src: 'while game.running:\n    handle_input()\n    update()\n    draw()  # ~60× / s' },
  },
  {
    id: 'variables', group: 'teen', emoji: '🧮', realEmoji: ['❤️', '📊'], colors: ['#a5b4fc', '#4f46e5'],
    code: { lang: 'TypeScript', src: 'let lives: number = 3;\nlives -= 1;\nif (lives === 0) gameOver();' },
  },
  {
    id: 'logic', group: 'teen', emoji: '🔣', realEmoji: ['🔐', '🛡️'], colors: ['#67e8f9', '#0891b2'],
    code: { lang: 'Python', src: 'if logged_in and (is_admin or is_owner):\n    delete_post()\nif not online:\n    use_cache()' },
  },
  {
    id: 'stateMachine', group: 'teen', emoji: '🚦', realEmoji: ['🚥', '🕹️'], colors: ['#fca5a5', '#dc2626'],
    code: { lang: 'TypeScript', src: "type Laser = 'on' | 'off';\nconst toggle = (s: Laser): Laser =>\n  s === 'on' ? 'off' : 'on';" },
  },
  // ── Code-Architekten ──
  {
    id: 'recursion', group: 'adult', emoji: '🪞', realEmoji: ['📁', '🌳'], colors: ['#5eead4', '#0f766e'],
    code: {
      lang: 'SQL',
      src: 'WITH RECURSIVE chain AS (\n  SELECT id, boss_id FROM staff\n  WHERE id = 42\n  UNION ALL\n  SELECT s.id, s.boss_id FROM staff s\n  JOIN chain c ON s.id = c.boss_id\n)\nSELECT * FROM chain;',
    },
  },
  {
    id: 'parallel', group: 'adult', emoji: '👯', realEmoji: ['⚡', '🖥️'], colors: ['#93c5fd', '#1d4ed8'],
    code: { lang: 'TypeScript', src: 'const [user, posts] = await Promise.all([\n  fetchUser(id),\n  fetchPosts(id),\n]);' },
  },
  {
    id: 'registers', group: 'adult', emoji: '🗄️', realEmoji: ['🧠', '💳'], colors: ['#c4b5fd', '#6d28d9'],
    code: { lang: 'Python', src: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a' },
  },
  {
    id: 'bigO', group: 'adult', emoji: '📈', realEmoji: ['🔍', '🗺️'], colors: ['#fde68a', '#b45309'],
    code: { lang: 'Python', src: '# O(n²)\nany(a == b for a in xs for b in xs)\n# O(n)\nlen(set(xs)) < len(xs)' },
  },
];

/** Welche Karte gehört zu welchem Level (nach Position in der Welt, 1-basiert) */
const RANGES: Record<AgeGroupId, [number, CardId][]> = {
  mini: [[5, 'sequence'], [12, 'collect'], [20, 'avoid']],
  junior: [[6, 'loop'], [13, 'jump'], [20, 'keygate']],
  hero: [[4, 'nested'], [6, 'efficiency'], [9, 'condition'], [13, 'sensor'], [14, 'function'], [15, 'teleport'], [16, 'function'], [18, 'teleport'], [19, 'function'], [20, 'teleport']],
  teen: [[2, 'whileLoop'], [3, 'stateMachine'], [4, 'variables'], [8, 'logic'], [9, 'stateMachine'], [10, 'variables']],
  adult: [[1, 'recursion'], [2, 'parallel'], [4, 'recursion'], [5, 'parallel'], [6, 'registers'], [7, 'recursion'], [8, 'bigO'], [9, 'parallel'], [10, 'recursion']],
};

export function cardForLevel(levelId: string): CardDef {
  const group = levelGroup(levelId);
  const n = levelNumber(levelId);
  let id: CardId;
  if (n <= handcrafted(group)) {
    id = RANGES[group].find(([max]) => n <= max)![1];
  } else {
    // Endlos-Level: Karte passend zu dem, was im Level vorkommt
    const grid = getLevel(levelId)?.grid.join('') ?? '';
    if (group === 'mini') id = grid.includes('*') ? 'collect' : 'avoid';
    else if (group === 'junior') id = grid.includes('K') ? 'keygate' : grid.includes('o') ? 'jump' : 'loop';
    else if (group === 'teen') {
      const lvl = getLevel(levelId);
      id = grid.includes('L') ? 'stateMachine' : lvl?.palette.includes('setVar') ? 'variables' : n % 2 ? 'logic' : 'whileLoop';
    } else if (group === 'adult') {
      const lvl = getLevel(levelId);
      id = grid.includes('T') ? (n % 2 ? 'parallel' : 'bigO') : lvl?.palette.includes('setVar') ? 'registers' : 'recursion';
    } else id = grid.includes('o') ? 'sensor' : n % 2 ? 'condition' : 'efficiency';
  }
  return CARDS.find((c) => c.id === id)!;
}

/** Freigeschaltete Karten = Karten, deren Level mindestens 1 Stern hat */
export function unlockedCards(stars: Record<string, number>): Set<CardId> {
  return new Set(
    Object.entries(stars)
      .filter(([, s]) => s > 0)
      .map(([id]) => cardForLevel(id).id),
  );
}
