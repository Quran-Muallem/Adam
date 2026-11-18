// Struktur eines Sprachpakets – jede Sprache muss ALLE Schlüssel liefern
import type { CardId } from '../data/cards';
import type { CostumeId } from '../data/costumes';
import type { AgeGroupId, Condition, FailReason, PaletteKind } from '../types';

export type Lang = 'ar' | 'en' | 'de' | 'fr' | 'es' | 'it';

export interface WorldTexts {
  name: string;
  ages: string;
  world: string;
  tagline: string;
  /** Hohes Hindernis mit Artikel, z. B. „den Baum“ (für Fehlermeldungen) */
  wallName: string;
  /** Niedriges Hindernis mit Artikel, z. B. „den Stein“ */
  lowName: string;
}

/** Texte für Erklär-Kino, Code-Brücke und Entdecker-Karten */
export interface BridgeTexts {
  movie: {
    /** Button oben: „🎬 Wie geht's? (Freund zeigen)“ */
    button: string;
    skip: string;
    replay: string;
    play: string;
    /** Untertitel der Filme (Mini-Entdecker kommt ohne Text aus) */
    junior: string[];
    hero: string[];
  };
  code: { toggle: string; comment: string; empty: string };
  cards: {
    album: string;
    albumTitle: string;
    albumIntro: string;
    newCard: string;
    concept: string;
    realWorld: string;
    locked: string;
    items: Record<CardId, { name: string; what: string; real: [string, string] }>;
  };
}

export interface Dict extends BridgeTexts {
  /** Name der Sprache in der Sprache selbst */
  langName: string;
  titleTop: string;
  titleBottom: string;
  home: {
    whereTo: string;
    costumes: string;
    reset: string;
    resetConfirm: string;
    language: string;
  };
  worlds: Record<AgeGroupId, WorldTexts>;
  ui: {
    back: string;
    toMap: string;
    soundOn: string;
    soundOff: string;
    normal: string;
    turbo: string;
    level: (n: number) => string;
    levelLocked: (n: number) => string;
    myProgram: string;
    macro: string;
    newBlocksHere: string;
    emptyMain: string;
    emptyMacro: string;
    bodyTarget: string;
    bodyTap: string;
    bodyMore: string;
    removeBlock: string;
    howOften: string;
    more: string;
    less: string;
    round: (a: number, b: number) => string;
    yes: string;
    no: string;
    collectFor3: string;
    starsWith: (n: number) => string;
    go: string;
    stop: string;
    start: string;
    clearAll: string;
    resetSparky: string;
  };
  blocks: Record<PaletteKind, { label: string; short: string }>;
  conds: Record<Condition, string>;
  result: {
    map: string;
    retry: string;
    next: string;
    newCostume: (emoji: string, name: string) => string;
  };
  wardrobe: { title: string; intro: string; wear: string; worn: string };
  costumes: Record<CostumeId, string>;
  /** Fehlermeldungen; {wall} und {low} werden durch die Hindernis-Namen der Welt ersetzt */
  fail: Record<FailReason, string[]>;
  win: string[];
  start: string[];
  /** Level-Titel & Sparkys Tipps je Level-ID */
  levels: Record<string, { t: string; h?: string }>;
}
