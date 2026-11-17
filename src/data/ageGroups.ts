// Konfiguration der Altersstufen: Design, Komplexität und Mechanik
import type { AgeGroupId } from '../types';

export interface AgeGroupConfig {
  id: AgeGroupId;
  name: string;
  ages: string;
  emoji: string;
  tagline: string;
  /** Spielfigur */
  hero: 'monster' | 'robot';
  /** Emoji für das Ziel-Feld */
  goalEmoji: string;
  /** Emoji für Hindernisse */
  rockEmoji: string;
  /** Texte anzeigen? (Stufe 1: nein – rein visuell) */
  showText: boolean;
  /** Wiederholungs-Zahl an Bewegungsblöcken (Stufe 2) */
  allowTimes: boolean;
  /** Board-Thema */
  theme: {
    page: string;
    card: string;
    tileA: string;
    tileB: string;
    rockTile: string;
    accent: string;
  };
  /** Mindestgröße der Touch-Buttons in px */
  buttonSize: number;
}

export const AGE_GROUPS: Record<AgeGroupId, AgeGroupConfig> = {
  mini: {
    id: 'mini',
    name: 'Mini-Entdecker',
    ages: '4–5 Jahre',
    emoji: '👾',
    tagline: 'Hilf dem hungrigen Monster!',
    hero: 'monster',
    goalEmoji: '🍎',
    rockEmoji: '🪨',
    showText: false,
    allowTimes: false,
    theme: {
      page: 'from-amber-300 via-orange-300 to-pink-400',
      card: 'bg-white/90',
      tileA: 'bg-lime-300',
      tileB: 'bg-lime-400',
      rockTile: 'bg-stone-400',
      accent: 'bg-orange-500',
    },
    buttonSize: 72,
  },
  junior: {
    id: 'junior',
    name: 'Junior-Coder',
    ages: '6–8 Jahre',
    emoji: '🤖',
    tagline: 'Schleifen, Sprünge & Schätze',
    hero: 'robot',
    goalEmoji: '💎',
    rockEmoji: '🪨',
    showText: true,
    allowTimes: true,
    theme: {
      page: 'from-sky-400 via-cyan-400 to-emerald-400',
      card: 'bg-white/90',
      tileA: 'bg-emerald-200',
      tileB: 'bg-emerald-300',
      rockTile: 'bg-slate-400',
      accent: 'bg-sky-600',
    },
    buttonSize: 68,
  },
  hero: {
    id: 'hero',
    name: 'Code-Helden',
    ages: '9–12 Jahre',
    emoji: '🚀',
    tagline: 'Schleifen, Bedingungen & Zauber-Makros',
    hero: 'robot',
    goalEmoji: '💎',
    rockEmoji: '☄️',
    showText: true,
    allowTimes: false,
    theme: {
      page: 'from-indigo-900 via-violet-900 to-fuchsia-900',
      card: 'bg-white/95',
      tileA: 'bg-indigo-800',
      tileB: 'bg-indigo-700',
      rockTile: 'bg-slate-900',
      accent: 'bg-fuchsia-600',
    },
    buttonSize: 64,
  },
};

export const AGE_GROUP_ORDER: AgeGroupId[] = ['mini', 'junior', 'hero'];
