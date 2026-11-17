// ─────────────────────────────────────────────────────────────
// LEVEL-DATEN (reines JSON-kompatibles Schema)
//
// Neues Level hinzufügen = einfach ein Objekt in das Array hängen.
// Karten-Legende:
//   S = Start   G = Ziel   . = frei   # = Stein
//   * = Bonus-Stern   K = Schlüssel   C = Truhe (Ziel, braucht Schlüssel)
//
// startDir: Blickrichtung zu Beginn (wichtig für "Springen" & Stufe 3)
// palette:  welche Blöcke das Kind benutzen darf
// maxBlocks: harte Obergrenze an Blöcken
// par:      Blöcke für 3 Sterne (Stufe 1 & 3)
// ─────────────────────────────────────────────────────────────
import type { AgeGroupId, LevelDef } from '../types';

const ARROWS = ['up', 'down', 'left', 'right'] as const;
const JUNIOR = [...ARROWS, 'jump'] as const;
const HERO_BASIC = ['forward', 'turnLeft', 'turnRight', 'repeat'] as const;
const HERO_IF = [...HERO_BASIC, 'if'] as const;
const HERO_ALL = [...HERO_IF, 'call'] as const;

export const LEVELS: LevelDef[] = [
  // ───────── Stufe 1: Mini-Entdecker (4–5 Jahre) ─────────
  {
    id: 'mini-1',
    group: 'mini',
    title: 'Hunger!',
    map: ['...', 'S.G', '...'],
    startDir: 'right',
    palette: [...ARROWS],
    maxBlocks: 4,
    par: 2,
  },
  {
    id: 'mini-2',
    group: 'mini',
    title: 'Um den Stein',
    map: ['S#.', '...', '..G'],
    startDir: 'right',
    palette: [...ARROWS],
    maxBlocks: 4,
    par: 4,
  },
  {
    id: 'mini-3',
    group: 'mini',
    title: 'Nach oben',
    map: ['..G', '.#.', 'S..'],
    startDir: 'right',
    palette: [...ARROWS],
    maxBlocks: 4,
    par: 4,
  },
  {
    id: 'mini-4',
    group: 'mini',
    title: 'Links herum',
    map: ['G#.', '.#.', '..S'],
    startDir: 'left',
    palette: [...ARROWS],
    maxBlocks: 4,
    par: 4,
  },
  {
    id: 'mini-5',
    group: 'mini',
    title: 'Langer Weg',
    map: ['....', '.##G', 'S...'],
    startDir: 'right',
    palette: [...ARROWS],
    maxBlocks: 4,
    par: 4,
  },

  // ───────── Stufe 2: Junior-Coder (6–8 Jahre) ─────────
  {
    id: 'junior-1',
    group: 'junior',
    title: 'Die Zauber-Zahl',
    hint: 'Tippe auf die Zahl am Block: Aus 1× wird 2×, 3×, 4× … So sparst du Blöcke!',
    map: ['.....', 'S*.*G', '.....'],
    startDir: 'right',
    palette: [...JUNIOR],
    maxBlocks: 6,
    par: 1,
  },
  {
    id: 'junior-2',
    group: 'junior',
    title: 'Hüpf, Robo, hüpf!',
    hint: 'Springen bringt Robo 2 Felder weit – in die Richtung, in die er gerade schaut.',
    map: ['.....', 'S*#*G', '.....'],
    startDir: 'right',
    palette: [...JUNIOR],
    maxBlocks: 6,
    par: 3,
  },
  {
    id: 'junior-3',
    group: 'junior',
    title: 'Der Schlüssel zur Truhe',
    hint: 'Die Truhe ist verschlossen. Hol zuerst den Schlüssel! Robo schaut am Anfang nach oben.',
    map: ['K.*..', '##.#*', 'S...C'],
    startDir: 'up',
    palette: [...JUNIOR],
    maxBlocks: 6,
    par: 3,
  },
  {
    id: 'junior-4',
    group: 'junior',
    title: 'Großes Abenteuer',
    hint: 'Sammle beide Sterne, spring über die Mauer und öffne die Truhe!',
    map: ['S..#.', '*..#C', '...#.', '..*#K'],
    startDir: 'down',
    palette: [...JUNIOR],
    maxBlocks: 8,
    par: 4,
  },

  // ───────── Stufe 3: Code-Helden (9–12 Jahre) ─────────
  {
    id: 'hero-1',
    group: 'hero',
    title: 'Die Asteroiden-Treppe',
    hint: 'Erkennst du das Muster? Pack es in eine Schleife! 3 Sterne mit höchstens 5 Blöcken.',
    map: ['S.####', '#..###', '##..##', '###..#', '####.G'],
    startDir: 'right',
    palette: [...HERO_BASIC],
    maxBlocks: 18,
    par: 5,
  },
  {
    id: 'hero-2',
    group: 'hero',
    title: 'Wenn der Weg blockiert ist …',
    hint: 'Benutze "Wenn Weg blockiert → Rechts drehen" in einer Schleife. Ziel: 4 Blöcke.',
    map: ['S....', '####.', '####.', 'G....'],
    startDir: 'right',
    palette: [...HERO_IF],
    maxBlocks: 16,
    par: 4,
  },
  {
    id: 'hero-3',
    group: 'hero',
    title: 'Das Zauber-Makro',
    hint: 'Ein Treppenschritt ist immer: Vorwärts, Rechts, Vorwärts, Links. Speichere ihn im Zauber-Makro! Ziel: 9 Blöcke.',
    map: ['S.##', '#..#', '##..', '###.', '##..', '#G.#'],
    startDir: 'right',
    palette: [...HERO_ALL],
    maxBlocks: 16,
    par: 9,
  },
  {
    id: 'hero-4',
    group: 'hero',
    title: 'Das Meister-Labyrinth',
    hint: 'Kurven nach links UND rechts! Ein schlauer Plan mit zwei Bedingungen schafft alles. Ziel: 7 Blöcke.',
    map: ['S...##', '###.##', '###.##', '#...##', '#.####', '#....G'],
    startDir: 'right',
    palette: [...HERO_ALL],
    maxBlocks: 20,
    par: 7,
  },
];

export const levelsFor = (group: AgeGroupId) => LEVELS.filter((l) => l.group === group);
export const getLevel = (id: string) => LEVELS.find((l) => l.id === id);
