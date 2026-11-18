// ─────────────────────────────────────────────────────────────
// Mehrsprachigkeit: 6 Sprachen, Arabisch von rechts nach links.
// Die Sprache wird gespeichert; beim ersten Start gilt die Gerätesprache.
// ─────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AgeGroupId, FailReason, LevelDef } from '../types';
import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import type { Dict, Lang } from './types';

export type { Dict, Lang } from './types';

export const DICTS: Record<Lang, Dict> = { ar, en, de, fr, es, it };

/** Reihenfolge in der Sprachauswahl */
export const LANGS: { id: Lang; flag: string }[] = [
  { id: 'ar', flag: '🇸🇦' },
  { id: 'en', flag: '🇬🇧' },
  { id: 'de', flag: '🇩🇪' },
  { id: 'fr', flag: '🇫🇷' },
  { id: 'es', flag: '🇪🇸' },
  { id: 'it', flag: '🇮🇹' },
];

const KEY = 'sparky:lang';
export const isRtl = (l: Lang) => l === 'ar';

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY) as Lang | null;
    if (saved && saved in DICTS) return saved;
  } catch {
    /* ignorieren */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'de').slice(0, 2) as Lang;
  return nav in DICTS ? nav : 'en';
}

interface I18n {
  lang: Lang;
  t: Dict;
  rtl: boolean;
  setLang: (l: Lang) => void;
  levelTitle: (l: LevelDef) => string;
  levelHint: (l: LevelDef) => string | undefined;
  failLines: (reason: FailReason, group: AgeGroupId) => string[];
}

const Ctx = createContext<I18n | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignorieren */
    }
  }, []);

  // Schreibrichtung & Sprache am <html> setzen (wichtig für Arabisch)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const value = useMemo<I18n>(() => {
    const t = DICTS[lang];
    return {
      lang,
      t,
      rtl: isRtl(lang),
      setLang,
      levelTitle: (l) => t.levels[l.id]?.t ?? l.title,
      levelHint: (l) => (l.hint ? (t.levels[l.id]?.h ?? l.hint) : undefined),
      failLines: (reason, group) =>
        t.fail[reason].map((s) => s.replace('{wall}', t.worlds[group].wallName).replace('{low}', t.worlds[group].lowName)),
    };
  }, [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n braucht einen <LanguageProvider>');
  return v;
}
