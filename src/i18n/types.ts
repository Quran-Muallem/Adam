import type { FestId, Region, ThemeId } from '../data/seasons';
// Struktur eines Sprachpakets – jede Sprache muss ALLE Schlüssel liefern
import type { CardId } from '../data/cards';
import type { CostumeId, SkinId } from '../data/costumes';
import type { BadgeId } from '../data/rewards';
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
    teen: string[];
    adult: string[];
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

/** Texte für Einstellungen, Schleifen-Fokus, Endlos-Level & Belohnungen */
export interface MoreTexts {
  settings: { title: string; music: string; sfx: string; speed: string; on: string; off: string; done: string };
  loop: {
    inside: string;
    insideIf: string;
    after: string;
    focusInto: (label: string) => string;
    focusMain: string;
    focusMacro: string;
    exit: string;
  };
  gen: { title: (n: number) => string; hints: Record<AgeGroupId, string[]> };
  map: {
    chest: string;
    chestReady: string;
    chestWon: string;
    milestone: (n: number) => string;
    milestoneReward: string;
    newSticker: string;
    bonusStars: (n: number) => string;
  };
  rewards: {
    trophies: string;
    badgesTitle: string;
    stickersTitle: string;
    noTitle: string;
    colors: string;
    costumesTab: string;
    badges: Record<BadgeId, { name: string; desc: string }>;
  };
  daily: { button: string; spin: string; comeBack: string; streak: (n: number) => string; streakBonus: string; sticker: string };
  skins: Record<SkinId, string>;
}

/** Texte für Teenager & Erwachsene, S-Bahn-Modus und Logik-Gatter */
export interface ProTexts {
  pro: {
    not: string;
    and: string;
    or: string;
    roundN: (n: number) => string;
    undo: string;
    resumed: string;
    vibration: string;
    codeToggle: string;
    expressButton: string;
    expressSub: string;
    expressDone: string;
    expressLevel: string;
    expressTitle: string;
    /** Erfolgsmeldungen im Profi-Ton */
    win: string[];
    /** Fehlermeldungen im Profi-Ton */
    fail: Record<FailReason, string>;
    /** „4 Blöcke statt 12 Einzelbefehle“ */
    efficiency: (blocks: number, actions: number) => string;
    /** Live-Analyse unter dem Code */
    insight: (blocks: number, actions: number, pattern: string) => string;
    patterns: Record<'recursion' | 'parallel' | 'register' | 'whileLoop' | 'loop' | 'sequence', string>;
  };
}

/** Saison-, Feiertags- & Kultur-System */
export interface ExtraTexts {
  season: {
    names: Record<ThemeId, string>;
    banner: Record<FestId, string>;
    regions: Record<Region, string>;
    regionTitle: string;
    previewTitle: string;
    previewLive: (name: string) => string;
    doubleWheel: string;
    festBadges: string;
  };
  /** Live-Code-Editor: Fehlerhilfe & Bedienung */
  editor: {
    tab: string;
    hint: string;
    unknown: (line: number, word: string, suggestion: string | null) => string;
    syntax: (line: number) => string;
    notAllowed: (line: number, word: string) => string;
    tooMany: (n: number, max: number) => string;
    indent: (line: number) => string;
    number: (line: number) => string;
    applied: string;
    reload: string;
  };
  /** Kurze, knackige Labels für den Startbildschirm */
  home2: { costumes: string; knowledge: string; trophies: string; gift: string; play: string; level: string };
  /** Einheitliches Spiel-Design: Unterseiten, Dialoge, Belohnungen */
  ui2: {
    levelDone: string; almost: string; yourReward: string; menu: string; youGet: string; super: string;
    apply: string; chooseLanguage: string; save: string; achievements: string; yourAchievements: string;
    costumeEditor: string; settings: string; knowledge: string; stickers: string; locked: string;
    sound: string; music: string; vibration: string; speed: string; language: string; worldDone: string;
    eventPlay: string; festsSeason: string; gameSound: string; daysLeft: (n: number) => string; spinTitle: string;
  };
}

export interface Dict extends BridgeTexts, MoreTexts, ProTexts, ExtraTexts {
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
