// ─────────────────────────────────────────────────────────────
// Zentrale Typen – Level-Schema, Programm-Blöcke, Weltzustand
// ─────────────────────────────────────────────────────────────

export type Dir = 'up' | 'down' | 'left' | 'right';

/** Die drei Altersstufen */
export type AgeGroupId = 'mini' | 'junior' | 'hero';

/**
 * Block-Arten, die in einer Palette angeboten werden können.
 * - up/down/left/right: absolute Richtung (Stufe 1 & 2)
 * - jump: springt 2 Felder in Blickrichtung über ein Hindernis (Stufe 2)
 * - forward/turnLeft/turnRight: relative Bewegung (Stufe 3)
 * - repeat: Schleife mit Körper (Stufe 3)
 * - if: Bedingung mit Körper (Stufe 3)
 * - call: ruft das Zauber-Makro auf (Stufe 3)
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

export type Condition = 'pathClear' | 'pathBlocked';

export type Block =
  | { id: string; type: 'move'; dir: Dir; times: number }
  | { id: string; type: 'jump'; times: number }
  | { id: string; type: 'forward' }
  | { id: string; type: 'turnLeft' }
  | { id: string; type: 'turnRight' }
  | { id: string; type: 'repeat'; count: number; body: Block[] }
  | { id: string; type: 'if'; cond: Condition; body: Block[] }
  | { id: string; type: 'call' };

export type ContainerBlock = Extract<Block, { body: Block[] }>;

/** Ein Programm besteht aus Hauptprogramm + optionalem Zauber-Makro (Funktion) */
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
 * JSON-Level-Schema.
 *
 * Karten-Legende (map):
 *   S = Start          G = Ziel (Apfel / Schatz)
 *   . = freies Feld    # = Stein / Hindernis
 *   * = Bonus-Stern    K = Schlüssel
 *   C = Truhe (Ziel, braucht den Schlüssel)
 */
export interface LevelDef {
  id: string;
  group: AgeGroupId;
  title: string;
  /** Kurzer Tipp (wird bei "Mini-Entdecker" nicht angezeigt) */
  hint?: string;
  map: string[];
  startDir: Dir;
  palette: PaletteKind[];
  /** Harte Obergrenze für die Anzahl Blöcke im Programm */
  maxBlocks: number;
  /** Blöcke, mit denen man 3 Sterne bekommt (Stufe 1 & 3) */
  par: number;
}

export interface Pos {
  x: number;
  y: number;
}

export interface WorldState {
  pos: Pos;
  dir: Dir;
  hasKey: boolean;
  /** "x,y" der eingesammelten Sterne */
  collected: string[];
  chestOpen: boolean;
}

export type FailReason = 'rock' | 'edge' | 'locked' | 'notReached' | 'tooLong' | 'empty';

export type SoundName =
  | 'click'
  | 'step'
  | 'turn'
  | 'jump'
  | 'bump'
  | 'collect'
  | 'key'
  | 'win'
  | 'fail'
  | 'remove'
  | 'unlock';

/** Ein Animations-Frame der vorab berechneten Ausführung */
export interface Frame {
  /** Stapel der aktiven Block-ids (äußerster zuerst) – alle leuchten auf */
  activeIds: string[];
  state: WorldState;
  sound?: SoundName;
  /** Animationsart der Figur */
  motion?: 'walk' | 'jump' | 'turn' | 'bump' | 'think';
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
