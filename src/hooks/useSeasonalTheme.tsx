// ─────────────────────────────────────────────────────────────
// useSeasonalTheme: zentrale Theme-Engine (Jahreszeiten, Feste, Region)
//   – berechnet das heutige Theme aus dem Gerätedatum (offline)
//   – Region: automatisch / islamisch / europäisch / Weltbürger
//   – Vorschau: jedes Theme in den Einstellungen live testen
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { detectRegion, themeFor, THEMES, type Region, type ThemeConfig, type ThemeId } from '../data/seasons';
import { useStoredState } from './useStoredState';

export interface SeasonApi {
  theme: ThemeConfig;
  /** Theme nach Kalender (ohne Vorschau) */
  live: ThemeId;
  region: Region;
  setRegion: (r: Region) => void;
  /** aufgelöste Region (bei „auto“ aus Zeitzone/Sprache) */
  effectiveRegion: Exclude<Region, 'auto'>;
  preview: ThemeId | null;
  setPreview: (t: ThemeId | null) => void;
}

const SeasonCtx = createContext<SeasonApi | null>(null);

/** Datum als Tages-Schlüssel – nach Mitternacht wird neu berechnet */
function useToday() {
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      if (now.toDateString() !== today.toDateString()) setToday(now);
    }, 60_000);
    return () => clearInterval(id);
  }, [today]);
  return today;
}

export function SeasonProvider({ lang, children }: { lang: string; children: ReactNode }) {
  const [region, setRegion] = useStoredState<Region>('sparky:region', 'auto');
  const [previewRaw, setPreviewRaw] = useStoredState<string>('sparky:themePreview', '');
  const today = useToday();
  const effectiveRegion = region === 'auto' ? detectRegion(lang) : region;
  const live = useMemo(() => themeFor(today, effectiveRegion), [today, effectiveRegion]);
  const preview = previewRaw && previewRaw in THEMES ? (previewRaw as ThemeId) : null;
  const api = useMemo<SeasonApi>(
    () => ({
      theme: THEMES[preview ?? live],
      live,
      region,
      setRegion,
      effectiveRegion,
      preview,
      setPreview: (t) => setPreviewRaw(t ?? ''),
    }),
    [preview, live, region, setRegion, effectiveRegion, setPreviewRaw],
  );
  return <SeasonCtx.Provider value={api}>{children}</SeasonCtx.Provider>;
}

const FALLBACK: SeasonApi = {
  theme: THEMES.normal,
  live: 'normal',
  region: 'auto',
  setRegion: () => {},
  effectiveRegion: 'european',
  preview: null,
  setPreview: () => {},
};

export const useSeasonalTheme = () => useContext(SeasonCtx) ?? FALLBACK;
