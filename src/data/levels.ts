// ─────────────────────────────────────────────────────────────
// ALLE 80 LEVEL im kompakten Grid-String-Format
// (20 pro Stufe 1–3, je 10 für Teenager & Erwachsene – danach übernimmt der Generator)
//
// Legende:
//   S Start · G Ziel · . frei · # hohes Hindernis (nicht überspringbar)
//   o niedriges Hindernis (überspringbar) · B schlafender Bär · P Pfütze
//   * Bonus (Beere/Kristall) · K Schlüssel · D magisches Tor · 1/2/3 Teleporter-Paare
//   L Laser-Schranke · X Schalter (Laser an/aus) · T/H Start/Ziel des zweiten Bots
//
// Kompakte Schreibweise:  L(id, titel, grid, startDir, palette, maxBlocks, parBlocks, hint?)
// Jedes Level hat in tests/levels.test.ts eine geprüfte Lösung.
// ─────────────────────────────────────────────────────────────
import { generateLevel } from '../engine/generator';
import type { AgeGroupId, Dir, LevelDef, PaletteKind } from '../types';

const ARROWS: PaletteKind[] = ['up', 'down', 'left', 'right'];
const J_LOOP: PaletteKind[] = [...ARROWS, 'repeat'];
const J_JUMP: PaletteKind[] = [...ARROWS, 'jump', 'repeat'];
const H_LOOP: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', 'repeat'];
const H_IF: PaletteKind[] = [...H_LOOP, 'if'];
const H_JUMP_IF: PaletteKind[] = ['forward', 'turnLeft', 'turnRight', 'jump', 'repeat', 'if'];
const H_ALL: PaletteKind[] = [...H_JUMP_IF, 'call'];
// Teenager
const TURN: PaletteKind[] = ['forward', 'turnLeft', 'turnRight'];
const T_WHILE: PaletteKind[] = [...TURN, 'while'];
const T_LOGIC: PaletteKind[] = [...TURN, 'while', 'if'];
const T_VAR: PaletteKind[] = [...TURN, 'while', 'setVar', 'decVar'];
const T_NEST: PaletteKind[] = [...TURN, 'repeat', 'while', 'if'];
const T_JUMP: PaletteKind[] = [...TURN, 'jump', 'while', 'if'];
const T_ALL: PaletteKind[] = [...TURN, 'jump', 'repeat', 'while', 'if', 'setVar', 'decVar'];
// Erwachsene
const A_REC: PaletteKind[] = [...TURN, 'if', 'call'];
const A_REC_J: PaletteKind[] = [...TURN, 'jump', 'if', 'call'];
const A_TWIN: PaletteKind[] = [...ARROWS, 'repeat', 'call'];
const A_REG: PaletteKind[] = [...TURN, 'if', 'call', 'setVar', 'decVar'];

function L(
  group: AgeGroupId,
  n: number,
  title: string,
  grid: string[],
  startDir: Dir,
  palette: PaletteKind[],
  maxBlocks: number,
  parBlocks: number,
  hint?: string,
): LevelDef {
  return { id: `${group}-${n}`, group, title, grid, startDir, palette, maxBlocks, parBlocks, hint };
}

// ═════════ Stufe 1: Mini-Entdecker · Zauberwald der Glühwürmchen ═════════
const MINI: LevelDef[] = [
  // 1–5: gerade Wege & einfache Richtungswechsel
  L('mini', 1, 'Erdbeer-Hunger', ['...', 'S.G', '...'], 'right', ARROWS, 3, 2),
  L('mini', 2, 'Hinunter!', ['S..', '...', 'G..'], 'down', ARROWS, 3, 2),
  L('mini', 3, 'Hinauf!', ['#.G', '#..', '..S'], 'up', ARROWS, 3, 2),
  L('mini', 4, 'Um den Baum', ['S.#', '..#', '#G#'], 'right', ARROWS, 4, 3),
  L('mini', 5, 'Ums Eck', ['.G.', '.#.', 'S..'], 'up', ARROWS, 4, 3),
  // 6–12: Kurven & Zauberbeeren
  L('mini', 6, 'Beerenpfad', ['S*.', '..*', '..G'], 'right', ARROWS, 5, 4),
  L('mini', 7, 'Beeren-Kurve', ['S.#', '*.#', '.*G'], 'down', ARROWS, 5, 4),
  L('mini', 8, 'Der kleine Umweg', ['G*.', '#.*', 'S..'], 'right', ARROWS, 6, 6),
  L('mini', 9, 'Durchs Wäldchen', ['S.*.', '##.#', '..*G'], 'right', ARROWS, 6, 5),
  L('mini', 10, 'Die Schlange', ['S#G', '.#.', '*.*'], 'down', ARROWS, 6, 6),
  L('mini', 11, 'Glühwürmchen-Weg', ['S*..', '.#*.', '.#G.', '....'], 'right', ARROWS, 6, 4),
  L('mini', 12, 'Zurück und hoch', ['..*G', '.#..', '*S#.'], 'left', ARROWS, 6, 6),
  // 13–20: kleine Labyrinthe mit Bären & Pfützen
  L('mini', 13, 'Pssst, Bären!', ['S.B.', 'P..P', 'B.G.'], 'right', ARROWS, 6, 4),
  L('mini', 14, 'Pfützen-Hüpfer', ['SP..', '.B.B', '...G'], 'down', ARROWS, 6, 5),
  L('mini', 15, 'Bärenhöhle', ['S.P', 'B..', 'P.G'], 'right', ARROWS, 6, 4),
  L('mini', 16, 'Beeren beim Bären', ['S.B.', 'P*..', '.*PB', 'B..G'], 'right', ARROWS, 6, 6),
  L('mini', 17, 'Mini-Labyrinth', ['S#G.', '.#.B', '...P', 'B.#.'], 'down', ARROWS, 6, 6),
  L('mini', 18, 'Oben herum', ['.*..', 'S.B*', 'PB.G'], 'right', ARROWS, 6, 6),
  L('mini', 19, 'Doppel-Beere', ['B..G', '.P#.', 'S.**', 'P.B.'], 'right', ARROWS, 6, 5),
  L('mini', 20, 'Waldfest', ['S.BG', 'P.**', 'B.PB', '....'], 'right', ARROWS, 6, 5),
];

// ═════════ Stufe 2: Junior-Coder · Kristall-Lagune der Piraten ═════════
const JUNIOR: LevelDef[] = [
  // 1–6: Schleifen
  L('junior', 1, 'Ahoi, Schleife!', ['#####', 'S...G', '#####'], 'right', J_LOOP, 6, 2,
    'Ahoi! Statt 4× „Rechts“ nimm den Wiederholen-Block! Tipp auf die Zahl, um sie zu ändern.'),
  L('junior', 2, 'Runter und rüber', ['S###', '.###', '.###', '...G'], 'down', J_LOOP, 8, 4,
    'Zwei Schleifen hintereinander – eine nach unten, eine nach rechts!'),
  L('junior', 3, 'Die Piraten-Treppe', ['S.##', '#..#', '##..', '###G'], 'right', J_LOOP, 8, 3,
    'Ein Treppenschritt ist „Rechts, Runter“. Pack ihn in eine Schleife!'),
  L('junior', 4, 'Hoch zum Ausguck', ['###.G', '##..#', '#..##', '..###', 'S####'], 'up', J_LOOP, 8, 3,
    'Diesmal geht die Treppe nach oben. Wie oft musst du wiederholen?'),
  L('junior', 5, 'Große Stufen', ['S..####', '##...##', '####...', '######G'], 'right', J_LOOP, 8, 4,
    'Jede Stufe ist 2× Rechts und 1× Runter.'),
  L('junior', 6, 'Um die Lagune', ['S....', '####.', '####.', '##G..'], 'right', J_LOOP, 10, 6,
    'Drei Schleifen bringen dich um die Lagune herum!'),
  // 7–13: Sprünge & Kristalle
  L('junior', 7, 'Hüpf übers Fass!', ['#####', 'S*o*G', '#####'], 'right', J_JUMP, 6, 3,
    'Springen bringt mich 2 Felder weit – über niedrige Fässer! Sammle die Kristalle.'),
  L('junior', 8, 'Doppelsprung', ['#######', 'S*o.o*G', '#######'], 'right', J_JUMP, 8, 4,
    'Zwei Fässer? Zwei Sprünge! Oder eine Schleife…'),
  L('junior', 9, 'Sprung nach unten', ['#S#', '#*#', '#o#', '#*#', '#o#', '#G#'], 'down', J_JUMP, 8, 3,
    'Ich springe immer in die Richtung, in die ich zuletzt gelaufen bin.'),
  L('junior', 10, 'Kristall-Ecke', ['S*o.#', '###.#', '###*#', '###o#', '###.G'], 'right', J_JUMP, 8, 6,
    'Erst rechts springen, dann nach unten. Aufpassen bei der Ecke!'),
  L('junior', 11, 'Lauf, hüpf, lauf!', ['########', 'S*o.*o.G', '########'], 'right', J_JUMP, 8, 4,
    'Erkennst du das Muster „Rechts, Springen“? Schleife!'),
  L('junior', 12, 'Der Mast', ['..o*G', '.####', 'o####', '*####', 'S####'], 'up', J_JUMP, 8, 6,
    'Nach oben springen, dann nach rechts springen.'),
  L('junior', 13, 'Kristall-Rutsche', ['S.#', '#*#', '#o#', '#..', '##*', '##o', '##G'], 'right', J_JUMP, 8, 4,
    'Rechts, Runter, Springen – und das zweimal!'),
  // 14–20: Schlüssel, Tore & Kombinationen
  L('junior', 14, 'Das magische Tor', ['S.D.G', '#.###', '#K###'], 'right', J_JUMP, 12, 7,
    'Das Tor ist zu! Hol zuerst den Schlüssel unten im Gang.'),
  L('junior', 15, 'Schlüssel unterwegs', ['S.K', '##.', 'G.D'], 'right', J_JUMP, 12, 6,
    'Der Schlüssel liegt direkt auf dem Weg. Dann öffnet sich das Tor!'),
  L('junior', 16, 'Fass, Schlüssel, Tor', ['S.o.K', '####.', 'G..D.'], 'right', J_JUMP, 12, 7,
    'Spring übers Fass, schnapp den Schlüssel und lauf durchs Tor zurück.'),
  L('junior', 17, 'Die Schatzrunde', ['S.*..', '####.', '####.', '####K', 'G*D..'], 'right', J_JUMP, 12, 6,
    'Drei lange Wege – drei Schleifen. Kristalle nicht vergessen!'),
  L('junior', 18, 'Kapitäns-Prüfung', ['S.o*o*K', '######.', 'G.D....'], 'right', J_JUMP, 12, 8,
    'Zwei Sprünge, ein Schlüssel und ein langer Weg zurück.'),
  L('junior', 19, 'Die Piraten-Festung', ['S.o*K', '####.', 'Go*D.'], 'right', J_JUMP, 12, 8,
    'Am Ende musst du nach links über ein Fass springen!'),
  L('junior', 20, 'Der große Schatz', ['S.o*.o*K', '#######.', 'G.o.D...'], 'right', J_JUMP, 14, 10,
    'Das große Finale! Schleifen, Sprünge, Schlüssel und Tor.'),
];

// ═════════ Stufe 3: Code-Helden · Sternen-Akademie der Roboter ═════════
const HERO: LevelDef[] = [
  // 1–6: verschachtelte Schleifen & Effizienz
  L('hero', 1, 'Doppel-Schleife', ['S...', '###.', '###.', '###G'], 'right', H_LOOP, 12, 4,
    'Ich laufe immer in Blickrichtung (gelber Pfeil)! „Links/Rechts drehen“ dreht mich auf der Stelle. Tipp: Schleife in Schleife – „3× Vorwärts, Rechts drehen“ und das 2×.'),
  L('hero', 2, 'Treppe zu den Sternen', ['####G', '###..', '##..#', '#..##', 'S.###'], 'right', H_LOOP, 18, 5,
    'Ein Treppenschritt: Vorwärts, Links drehen, Vorwärts, Rechts drehen. Nach dem Links-Drehen schaue ich nach oben!'),
  L('hero', 3, 'Riesen-Treppe', ['S...###', '###.###', '###.###', '###....', '######.', '######.', '######G'], 'right', H_LOOP, 20, 7,
    'Jede Stufe ist 3 Felder lang. Verschachtle deine Schleifen!'),
  L('hero', 4, 'Die große Kurve', ['S....', '####.', '####.', '####.', 'G....'], 'right', H_LOOP, 16, 4,
    '3× „4× Vorwärts, Rechts drehen“ – nur 4 Blöcke für 3 Sterne!'),
  L('hero', 5, 'Sternschnuppen-Pfad', ['S..####', '##...##', '####...', '######G'], 'right', H_LOOP, 16, 6,
    'Finde das Muster und schreibe es so kurz wie möglich.'),
  L('hero', 6, 'Effizienz-Meister', ['######G', '######.', '######.', '###....', '###.###', '###.###', 'S...###'], 'right', H_LOOP, 20, 7,
    'Nur 7 Blöcke für 3 Sterne. Schaffst du das?'),
  // 7–13: Bedingungen
  L('hero', 7, 'Wenn der Weg versperrt ist…', ['S.....', '#####.', '#####.', 'G.....'], 'right', H_IF, 16, 4,
    '„Wenn Weg versperrt → Rechts drehen“, dann Vorwärts. Alles in eine Schleife!'),
  L('hero', 8, 'Die Spirale', ['S#.....', '.#.###.', '.#.#G#.', '.#.#.#.', '.#...#.', '.#####.', '.......'], 'down', H_IF, 16, 4,
    'Die Spirale dreht immer nach links. Wie viele Runden brauchst du?'),
  L('hero', 9, 'Links oder rechts?', ['S...##', '###.##', '###.##', '#...##', '#.####', '#....G'], 'right', H_IF, 20, 7,
    'Versperrt? Probier „Links drehen“. Immer noch versperrt? Dann zweimal „Rechts drehen“!'),
  L('hero', 10, 'Hindernis voraus!', ['########', 'S.o.o..G', '########'], 'right', H_JUMP_IF, 16, 5,
    '„Wenn Hindernis voraus → Springen“. Und wenn der Weg frei ist → Vorwärts.'),
  L('hero', 11, 'Kisten-Parcours', ['#S.o..', '#####.', '#####o', '#####.', 'G.o...'], 'right', H_JUMP_IF, 20, 7,
    'Springen, drehen oder laufen? Drei Bedingungen erledigen alles.'),
  L('hero', 12, 'Wenn frei, dann los!', ['G.....', '#####.', 'S.....'], 'right', H_IF, 16, 5,
    'Wenn Weg frei → Vorwärts. Wenn versperrt → Links drehen.'),
  L('hero', 13, 'Asteroiden-Gürtel', ['S.o..###..G', '####.###.##', '####..o..##'], 'right', H_JUMP_IF, 24, 10,
    'Die Meisterprüfung der Bedingungen: springen, links, rechts und vorwärts!'),
  // 14–20: Zauber-Makro F1 & Teleporter
  L('hero', 14, 'Das Zauber-Makro F1', ['S.##', '#..#', '##..', '###.', '##..', '#G.#'], 'right', H_ALL, 20, 9,
    'Speichere „Vorwärts, Rechts drehen, Vorwärts, Links drehen“ im Zauber-Makro F1 und rufe es auf!'),
  L('hero', 15, 'Der erste Teleporter', ['S..#', '##.#', '##.1', '####', '1..#', '##.#', '##G#'], 'right', H_ALL, 20, 8,
    'Betritt das Portal 🌀 und du landest beim anderen Portal derselben Farbe!'),
  L('hero', 16, 'Zauber-Treppe', ['##..####', '#....###', 'S.##..#G', '#####...'], 'right', H_ALL, 24, 12,
    'Hoch, runter, hoch: Der Treppenschritt passt in jede Richtung. Benutze F1!'),
  L('hero', 17, 'Teleporter-Express', ['S..1', '####', '1..2', '####', '2..G'], 'right', H_ALL, 12, 2,
    'Portale behalten deine Blickrichtung. Wie oft musst du nur vorwärts gehen?'),
  L('hero', 18, 'Portal um die Ecke', ['S...1', '#####', '#####', '1...#', '###.#', '###G#'], 'right', H_ALL, 16, 4,
    'Kombiniere Bedingung und Portal!'),
  L('hero', 19, 'Portal-Kette', ['S.##', '#..1', '####', '1.##', '#..2', '####', '2.##', '#..G'], 'right', H_ALL, 20, 7,
    'Drei gleiche Abschnitte, zwei Portale. Makro oder Schleife?'),
  L('hero', 20, 'Das Sternen-Diplom', ['S.o.1', '#####', '#####', '1.###', '#.###', '#o###', '#.###', '#G###'], 'right', H_ALL, 24, 7,
    'Das Finale! Springen, Portal, Drehen – ein cleveres Programm schafft alles.'),
];

// ═════════ Stufe 4: Cyber-Pioniere (13–17) · Neon-Metropole ═════════
const TEEN: LevelDef[] = [
  L('teen', 1, 'Bis zum Ziel', ['#######', 'S.....G', '#######'], 'right', T_WHILE, 3, 2,
    'Neuer Block: SOLANGE. Läuft, bis die Bedingung falsch ist. Zwei Blöcke reichen hier.'),
  L('teen', 2, 'Sensor an', ['S...#', '###.#', 'G...#'], 'right', T_LOGIC, 6, 4,
    'Schleife + Sensor = Autopilot. Dreh dich nur, wenn der Weg versperrt ist.'),
  L('teen', 3, 'Laser-Schalter', ['..X..', 'S.L.G'], 'right', T_WHILE, 12, 10,
    'Der Schalter ⏻ kippt ALLE Laser. Erst Strom aus, dann durch.'),
  L('teen', 4, 'Zähler-Kreuzung', ['S.......', '######.#', '######.#', '######G#'], 'right', T_VAR, 8, 7,
    'Ein Zähler weiß, wann Schluss ist: n = 6, dann SOLANGE n > 0 { vor; n−1 }.'),
  L('teen', 5, 'NICHT-Gatter', ['S..L', '##.#', 'G..#'], 'right', T_LOGIC, 6, 4,
    '„Versperrt“ ignoriert Laser. Aber NICHT „frei“ erwischt beides. Logik!'),
  L('teen', 6, 'Schleife in Schleife', ['S..####', '##.####', '##...##', '####.##', '####...', '######.', '######G'], 'right', T_NEST, 9, 7,
    'Verschachtelte Schleifen: Ein Treppenschritt ist selbst eine Schleife.'),
  L('teen', 7, 'Sprung-Sensor', ['###########', 'S.o.X.L.o.G', '###########'], 'right', T_JUMP, 5, 4,
    'WENN Hindernis → springen. Sonst vorwärts. Den Rest erledigt die Schleife.'),
  L('teen', 8, 'ODER-Gatter', ['S.o..L', '####.#', '####o#', '####.#', 'G....#'], 'right', T_JUMP, 8, 6,
    'Versperrt ODER Laser → abbiegen. Ein Gatter, zwei Gefahren.'),
  L('teen', 9, 'Doppel-Schalter', ['###########', 'S.X.L.X.L.G', '###########'], 'right', T_ALL, 7, 5,
    'Jeder Schalter KIPPT den Zustand. Zweimal kippen = wieder an. Spring drüber!'),
  L('teen', 10, 'Neon-Finale', ['S........', '###X#####', '###.#####', '###o#####', '###.#####', '###.L...G'], 'right', T_ALL, 13, 11,
    'Zähler, Sensoren, Schalter: alles, was du gelernt hast, in einem Programm.'),
];

// ═════════ Stufe 5: Code-Architekten (18+) · Quantum-Lab ═════════
const ADULT: LevelDef[] = [
  L('adult', 1, 'Rekursion', ['#########', 'S.......G', '#########'], 'right', A_REC, 5, 4,
    'F1 darf sich selbst aufrufen: WENN frei { vor; F1 }. Basisfall inklusive.'),
  L('adult', 2, 'Zwei Bots, ein Programm', ['S..G#', '#####', 'T...H'], 'right', A_TWIN, 3, 2,
    'Beide Bots führen jeden Befehl gleichzeitig aus. Ein blockierter Bot wartet einfach.'),
  L('adult', 3, 'Rekursive Spirale', ['S....', '####.', '..G#.', '.###.', '.....'], 'right', A_REC, 6, 5,
    'Wand-Folger als Rekursion. Keine Schleife in Sicht – und trotzdem endlos.'),
  L('adult', 4, 'Rekursive Treppe', ['S.####', '#..###', '##..##', '###..#', '####.G'], 'right', A_REC, 7, 6,
    'Ein Schritt, dann derselbe Plan nochmal. Tail Recursion in Reinform.'),
  L('adult', 5, 'Synchron-Labyrinth', ['S...#', '.##.#', '...G#', '#####', 'T....', '.###.', 'H....'], 'right', A_TWIN, 8, 7,
    'Wände sind deine Synchronisations-Punkte. Nutze sie, um einen Bot warten zu lassen.'),
  L('adult', 6, 'Speicher-Register', ['S.......', '######.#', '######.#', '######G#'], 'right', A_REG, 9, 9,
    'Kein SOLANGE, nur Rekursion + Register n. Knappes Limit – jeder Block zählt.'),
  L('adult', 7, 'Rekursion mit Sprung', ['##############', 'S.o.o..o.o...G', '##############'], 'right', A_REC_J, 7, 6,
    'Zwei Fälle, ein rekursiver Aufruf. So sieht ein sauberer Parser aus.'),
  L('adult', 8, 'Phasenversatz', ['S.#G', '..#.', '#...', '####', 'T...', '.##.', '...H'], 'right', A_TWIN, 8, 7,
    'Wiederkehrende Muster erkennen und komprimieren. Big-O lässt grüßen.'),
  L('adult', 9, 'Parallel-Ausführung', ['S..#..', '.#...#', '...#.G', '######', 'T.#...', '...#..', '.#...H'], 'right', A_TWIN, 7, 7,
    'Kein Block zu viel: das Limit ist exakt die optimale Lösung.'),
  L('adult', 10, 'Quantum-Finale', ['S.o.X', '####.', '..G#L', 'o###o', '.....'], 'right', A_REC_J, 9, 8,
    'Springen, Abbiegen, Laufen – rekursiv, bis der Basisfall (das Ziel) erreicht ist.'),
];

export const LEVELS: LevelDef[] = [...MINI, ...JUNIOR, ...HERO, ...TEEN, ...ADULT];

/** Handgefertigte Level pro Welt – danach übernimmt der Generator (∞) */
export const HANDCRAFTED_COUNT: Record<AgeGroupId, number> = { mini: 20, junior: 20, hero: 20, teen: 10, adult: 10 };
export const handcrafted = (group: AgeGroupId) => HANDCRAFTED_COUNT[group];

/** Nur die handgefertigten Level einer Welt */
export const levelsFor = (group: AgeGroupId) => LEVELS.filter((l) => l.group === group);

/** Level n (1-basiert) einer Welt – handgefertigt oder prozedural erzeugt */
export function levelAt(group: AgeGroupId, n: number): LevelDef {
  return n <= handcrafted(group) ? levelsFor(group)[n - 1] : generateLevel(group, n);
}

export const levelNumber = (id: string) => Number(id.split('-')[1]);

// ── S-Bahn-Express: ein Tages-Rätsel pro Altersstufe ──
export const EXPRESS_BASE = 100000;
export const isExpress = (id: string) => levelNumber(id) >= EXPRESS_BASE;
/** Tag seit 1970 (lokale Zeit) – jeden Tag ein neues Rätsel, auf allen Geräten gleich */
export function dayIndex(d = new Date()) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}
export const expressId = (group: AgeGroupId, d = new Date()) => `${group}-${EXPRESS_BASE + dayIndex(d)}`;
/** Datum eines Tages-Rätsels */
export const expressDate = (id: string) => new Date((levelNumber(id) - EXPRESS_BASE) * 86400000);
export const levelGroup = (id: string) => id.split('-')[0] as AgeGroupId;

export function getLevel(id: string): LevelDef | undefined {
  const g = levelGroup(id);
  const n = levelNumber(id);
  if (!['mini', 'junior', 'hero', 'teen', 'adult'].includes(g) || !(n >= 1)) return undefined;
  return levelAt(g, n);
}
