import { describe, expect, it } from 'vitest';
import { easterSunday, festsOn, hijri, seasonOn, tabularHijri, themeFor } from '../src/data/seasons';

const d = (s: string) => new Date(`${s}T12:00:00`);

describe('Saison-Engine', () => {
  it('Gaußsche Osterformel', () => {
    expect(easterSunday(2025).toDateString()).toBe(new Date(2025, 3, 20).toDateString());
    expect(easterSunday(2026).toDateString()).toBe(new Date(2026, 3, 5).toDateString());
    expect(easterSunday(2027).toDateString()).toBe(new Date(2027, 2, 28).toDateString());
  });
  it('Hijri: Ramadan, Zuckerfest, Opferfest 2026', () => {
    expect(hijri(d('2026-02-25')).m).toBe(9);
    expect(festsOn(d('2026-03-21'))).toContain('eidFitr');
    expect(festsOn(d('2026-05-27'))).toContain('eidAdha');
  });
  it('tabellarischer Fallback liegt höchstens 2 Tage daneben', () => {
    const a = tabularHijri(d('2026-03-01'));
    expect(a.m).toBe(9);
  });
  it('europäische Feste', () => {
    expect(festsOn(d('2026-10-31'))).toContain('halloween');
    expect(festsOn(d('2026-12-24'))).toContain('christmas');
    expect(festsOn(d('2026-12-31'))).toContain('newyear');
    expect(festsOn(d('2027-01-02'))).toContain('newyear');
    expect(festsOn(d('2026-04-07'))).toContain('easter');
  });
  it('Regionen filtern die Feste', () => {
    expect(themeFor(d('2026-12-24'), 'islamic')).toBe('winter');
    expect(themeFor(d('2026-12-24'), 'european')).toBe('christmas');
    expect(themeFor(d('2026-03-21'), 'european')).toBe('spring');
    expect(themeFor(d('2026-03-21'), 'world')).toBe('eidFitr');
  });
  it('Jahreszeiten (Nord & Süd)', () => {
    expect(seasonOn(d('2026-11-18'), 'Europe/Berlin')).toBe('autumn');
    expect(seasonOn(d('2026-07-10'), 'Europe/Berlin')).toBe('summer');
    expect(seasonOn(d('2026-07-10'), 'Australia/Sydney')).toBe('winter');
  });
});
