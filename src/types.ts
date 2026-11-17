// ─────────────────────────────────────────────────────────────
// Zentrale Typen – Level-Schema, Programm-Blöcke, Weltzustand
// ─────────────────────────────────────────────────────────────

export type Dir = 'up' | 'down' | 'left' | 'right';

/** Die drei Altersstufen / Themenwelten */
export type AgeGroupId = 'mini' | 'junior' | 'hero';

/**
 * Block-Arten, die in einer Palette angeboten werden können.
 * - up/down/left/right: absolute Richtung (Stufe 1 & 2)
 * - jump: springt 2 Felder in Blickrichtung über ein niedriges Hindernis
 * - forward/turnLeft/turnRight: relative Bewegung (Stufe 3)
 * - repeat: Schleifen-Container
 * - if: Bedingungs-Container (Stufe 3)
 * - call: ruft das Zauber-Makro F1 auf (Stufe 3)
 */
export type PaletteKind =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'jump'
  | 'forward'
  | 'turnLeft'
  | 'turnRight'
  | 'repeat'
  | 'if'
  | 'call';

/** Bedingungen: frei / versperrt (Wand, Rand, Hindernis, Tor) / niedriges Hindernis voraus */
export type Condition = 'pathClear' | 'pathBlocked' | 'obstacleAhead';

export type Block =
  | { id: string; type: 'move'; dir: Dir }
  | { id: string; type: 'jump' }
  | { id: string; type: 'forward' }
  | { id: string; type: 'turnLeft' }
  | { id: string; type: 'turnRight' }
  | { id: string; type: 'repeat'; count: number; body: Block[] }
  | { id: string; type: 'if'; cond: Condition; body: Block[] }
  | { id: string; type: 'call' };

export type ContainerBlock = Extract<Block, { body: Block[] }>;

/** Ein Programm besteht aus Hauptprogramm + optionalem Zauber-Makro F1 */
export interface Program {
  main: Block[];
  macro: Block[];
}

/** Wohin neue Blöcke eingefügt werden */
export interface InsertTarget {
  root: 'main' | 'macro';
  /** id eines repeat/if-Blocks – oder null für die oberste Ebene */
  parentId: string | null;
}

/**
 * Kompaktes Grid-String-Level-Schema.
 *
 * Karten-Legende:
 *   S = Start            G = Ziel
 *   . = freies Feld      # = hohes Hindernis (Baum/Palme/Asteroid – nicht überspringbar)
 *   o = niedriges Hindernis (Stein/Fass/Kiste – überspringbar)
 *   B = schlafender Bär  P = Pfütze   (beide niedrig, blockieren den Weg)
 *   * = Bonus (Beere / Kristall / Stern)
 *   K = Schlüssel        D = magisches Tor (öffnet sich mit Schlüssel)
 *   1, 2, 3 = Teleporter-Paare (jede Ziffer kommt genau zweimal vor)
 */
export interface LevelDef {
  id: string;
  group: AgeGroupId;
  title: string;
  /** Sprechblase von Sparky (bei Stufe 1 nicht angezeigt) */
  hint?: string;
  grid: string[];
  startDir: Dir;
  palette: PaletteKind[];
  /** Harte Obergrenze für die Anzahl Blöcke */
  maxBlocks: number;
  /** Blöcke für 3 Sterne (nur relevant, wenn das Level keine Bonus-Items hat) */
  parBlocks: number;
}

export interface Pos {
  x: number;
  y: number;
}

export interface WorldState {
  pos: Pos;
  dir: Dir;
  hasKey: boolean;
  /** "x,y" der eingesammelten Bonus-Items */
  collected: string[];
  /** "x,y" der geöffneten Tore */
  openGates: string[];
}

export type FailReason =
  | 'wall'
  | 'obstacle'
  | 'bear'
  | 'puddle'
  | 'edge'
  | 'locked'
  | 'tooHigh'
  | 'notReached'
  | 'tooLong'
  | 'empty';

export type SoundName =
  | 'click'
  | 'step'
  | 'turn'
  | 'jump'
  | 'boing'
  | 'collect'
  | 'key'
  | 'gate'
  | 'teleport'
  | 'win'
  | 'fail'
  | 'remove'
  | 'unlock'
  | 'tick';

/** Ein Animations-Frame der vorab berechneten Ausführung */
export interface Frame {
  /** Stapel der aktiven Block-ids (äußerster zuerst) – alle leuchten auf */
  activeIds: string[];
  state: WorldState;
  sound?: SoundName;
  /** Animationsart der Figur */
  motion?: 'walk' | 'jump' | 'turn' | 'bump' | 'think' | 'teleportOut' | 'teleportIn';
  /** Richtung des "Anstupsens" bei einem Fehler */
  bumpDir?: Dir;
  /** Aktueller Schleifen-Durchlauf je repeat-Block-id */
  loops: Record<string, number>;
  /** Ergebnis einer ausgewerteten Bedingung (für Hervorhebung) */
  condResult?: boolean;
}

export interface RunResult {
  frames: Frame[];
  outcome: 'success' | 'fail';
  reason?: FailReason;
  starsCollected: number;
}
