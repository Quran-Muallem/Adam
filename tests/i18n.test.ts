// Prüft, dass alle 6 Sprachen vollständig sind (alle 60 Level-Titel, alle Tipps, alle Texte)
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../src/data/levels';
import { DICTS, LANGS } from '../src/i18n';
import { de } from '../src/i18n/de';

/** Alle Schlüssel-Pfade eines Objekts (Funktionen zählen als Blatt) */
function paths(o: unknown, prefix = ''): string[] {
  if (o === null || typeof o !== 'object' || Array.isArray(o)) return [prefix];
  return Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
}

describe('Sprachpakete', () => {
  it('es gibt genau 6 Sprachen', () => {
    expect(LANGS.map((l) => l.id).sort()).toEqual(['ar', 'de', 'en', 'es', 'fr', 'it']);
  });

  const reference = paths({ ...de, levels: {} }).sort();

  for (const [lang, dict] of Object.entries(DICTS)) {
    it(`${lang}: alle UI-Texte vorhanden`, () => {
      expect(paths({ ...dict, levels: {} }).sort()).toEqual(reference);
      for (const p of paths(dict)) {
        const v = p.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], dict);
        if (typeof v === 'string') expect(v.trim(), `${lang}.${p}`).not.toBe('');
        if (Array.isArray(v)) expect(v.length, `${lang}.${p}`).toBeGreaterThan(0);
      }
    });

    it(`${lang}: alle 60 Level übersetzt`, () => {
      for (const l of LEVELS) {
        const tr = dict.levels[l.id];
        expect(tr?.t, `${lang} Titel ${l.id}`).toBeTruthy();
        if (l.hint) expect(tr?.h, `${lang} Tipp ${l.id}`).toBeTruthy();
      }
      expect(Object.keys(dict.levels)).toHaveLength(LEVELS.length);
    });

    it(`${lang}: Platzhalter {wall}/{low} in den Fehlermeldungen`, () => {
      expect(dict.fail.wall.some((s) => s.includes('{wall}'))).toBe(true);
      expect(dict.fail.obstacle.some((s) => s.includes('{low}'))).toBe(true);
    });
  }
});
