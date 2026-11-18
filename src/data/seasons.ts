// ─────────────────────────────────────────────────────────────
// SAISON-, FEIERTAGS- & KULTUR-ENGINE (komplett offline, ohne App-Update)
//
// Erkennt anhand des Gerätedatums:
//  • Islamische Feste über den Hijri-Kalender (Intl umalqura, Fallback: tabellarisch)
//    Ramadan (9. Monat) · Zuckerfest (1.–5. Schawwal) · Opferfest (8.–13. Dhu l-Hiddscha)
//  • Europäische Feste: Halloween (24.10.–2.11.), Weihnachten (18.–27.12.),
//    Silvester/Neujahr (28.12.–3.1.), Ostern (Ostersonntag ± 4 Tage, Gauß)
//  • Sonst die Jahreszeit (Südhalbkugel wird gespiegelt)
// ─────────────────────────────────────────────────────────────

import type { SpriteName } from '../components/sprites';

export type SeasonId = 'normal' | 'spring' | 'summer' | 'autumn' | 'winter';
export type FestId = 'halloween' | 'christmas' | 'newyear' | 'easter' | 'ramadan' | 'eidFitr' | 'eidAdha';
export type ThemeId = SeasonId | FestId;
export type Region = 'auto' | 'islamic' | 'european' | 'world';

export const THEME_ORDER: ThemeId[] = ['normal', 'spring', 'summer', 'autumn', 'winter', 'halloween', 'christmas', 'newyear', 'easter', 'ramadan', 'eidFitr', 'eidAdha'];
export const REGIONS: Region[] = ['auto', 'islamic', 'european', 'world'];
export const REGION_EMOJI: Record<Region, string> = { auto: '🌍', islamic: '🌙', european: '🎄', world: '✨' };

/** Partikel, die über Startseite & Karte schweben */
export type SeasonParticle = 'petals' | 'sun' | 'leaves' | 'snow' | 'bats' | 'fireworks' | 'lanterns' | 'confetti' | 'eggs' | 'goldstars' | null;

/** Sprites (siehe components/sprites) als Deko am Bildrand */
export type DecorSprite = SpriteName;

export interface ThemeConfig {
  id: ThemeId;
  emoji: string;
  /** Fest (mit Banner & Abzeichen) oder nur Jahreszeit */
  fest: boolean;
  particles: SeasonParticle;
  decor: DecorSprite[];
  /** Sammel-Item, das im Level den Bonus ersetzt */
  collectible?: DecorSprite;
  /** Accessoire für Sparky (nur wenn kein Kostüm getragen wird) */
  accessory?: 'goldscarf' | 'vampire' | 'santa' | 'partyhat' | 'bunny' | 'festcap' | 'flowercrown' | 'sunglasses' | 'beanie';
  /** Eigene Melodie auf Start & Karte */
  song?: 'ramadan' | 'eid' | 'halloween' | 'christmas' | 'easter';
  /** Doppelte Sterne am Glücksrad */
  doubleWheel?: boolean;
  /** Farbschleier über dem Hintergrund */
  tint: string;
  /** Kultur-Kreis für die Regions-Steuerung */
  culture?: 'islamic' | 'european';
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  normal: { id: 'normal', emoji: '⭐', fest: false, particles: null, decor: [], tint: 'transparent' },
  spring: { id: 'spring', emoji: '🌸', fest: false, particles: 'petals', decor: ['blossom', 'blossom'], accessory: 'flowercrown', tint: 'rgba(251,207,232,0.18)' },
  summer: { id: 'summer', emoji: '☀️', fest: false, particles: 'sun', decor: ['sunny'], accessory: 'sunglasses', tint: 'rgba(253,224,71,0.14)' },
  autumn: { id: 'autumn', emoji: '🍂', fest: false, particles: 'leaves', decor: ['leaf', 'leaf'], tint: 'rgba(251,146,60,0.16)' },
  winter: { id: 'winter', emoji: '❄️', fest: false, particles: 'snow', decor: ['snowflake'], accessory: 'beanie', tint: 'rgba(191,219,254,0.18)' },
  halloween: { id: 'halloween', emoji: '🎃', fest: true, culture: 'european', particles: 'bats', decor: ['pumpkin', 'bat', 'pumpkin'], collectible: 'pumpkin', accessory: 'vampire', song: 'halloween', tint: 'rgba(124,45,18,0.28)' },
  christmas: { id: 'christmas', emoji: '🎄', fest: true, culture: 'european', particles: 'snow', decor: ['xmastree', 'gift', 'candycane'], collectible: 'gift', accessory: 'santa', song: 'christmas', tint: 'rgba(22,101,52,0.2)' },
  newyear: { id: 'newyear', emoji: '🎆', fest: true, culture: 'european', particles: 'fireworks', decor: ['firework', 'garland'], accessory: 'partyhat', tint: 'rgba(30,27,75,0.3)' },
  easter: { id: 'easter', emoji: '🐣', fest: true, culture: 'european', particles: 'eggs', decor: ['egg', 'blossom', 'egg'], collectible: 'egg', accessory: 'bunny', song: 'easter', tint: 'rgba(187,247,208,0.2)' },
  ramadan: { id: 'ramadan', emoji: '🌙', fest: true, culture: 'islamic', particles: 'lanterns', decor: ['moon', 'lantern', 'lantern'], collectible: 'date', accessory: 'goldscarf', song: 'ramadan', tint: 'rgba(15,23,42,0.4)' },
  eidFitr: { id: 'eidFitr', emoji: '🎉', fest: true, culture: 'islamic', particles: 'confetti', decor: ['garland', 'baklava', 'lantern'], collectible: 'baklava', accessory: 'festcap', song: 'eid', doubleWheel: true, tint: 'rgba(250,204,21,0.14)' },
  eidAdha: { id: 'eidAdha', emoji: '🐑', fest: true, culture: 'islamic', particles: 'goldstars', decor: ['sheep', 'moon', 'sheep'], accessory: 'festcap', song: 'eid', tint: 'rgba(180,83,9,0.18)' },
};

// ── Kalender ────────────────────────────────────────────────

/** Hijri-Datum (Monat 1–12, Tag) – Umm-al-Qura über Intl, sonst tabellarische Näherung */
export function hijri(d: Date): { y: number; m: number; day: number } {
  for (const cal of ['islamic-umalqura', 'islamic-civil', 'islamic']) {
    try {
      const f = new Intl.DateTimeFormat(`en-u-ca-${cal}`, { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
      if (!f.resolvedOptions().calendar.startsWith('islamic')) continue;
      const parts = f.formatToParts(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12)));
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
      const m = get('month');
      const day = get('day');
      const y = get('year') || parseInt(parts.find((p) => (p.type as string) === 'relatedYear' || p.type === 'year')?.value ?? '0', 10);
      if (m >= 1 && m <= 12 && day >= 1) return { y, m, day };
    } catch {
      /* Kalender nicht verfügbar */
    }
  }
  return tabularHijri(d);
}

/** Tabellarischer (arithmetischer) Hijri-Kalender – ±1 Tag genau */
export function tabularHijri(d: Date) {
  const jd = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000) + 2440588; // Julianischer Tag
  const l0 = jd - 1948440 + 10632;
  const n = Math.floor((l0 - 1) / 10631);
  const l1 = l0 - 10631 * n + 354;
  const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { y, m, day };
}

/** Ostersonntag nach der Gaußschen Osterformel (gregorianisch) */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const dayNo = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
const inRange = (d: Date, m1: number, d1: number, m2: number, d2: number) => {
  const v = (d.getMonth() + 1) * 100 + d.getDate();
  const a = m1 * 100 + d1;
  const b = m2 * 100 + d2;
  return a <= b ? v >= a && v <= b : v >= a || v <= b;
};

// ── Region ──────────────────────────────────────────────────

const ISLAMIC_ZONES =
  /^(Asia\/(Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Aden|Baghdad|Tehran|Karachi|Dhaka|Jakarta|Makassar|Jayapura|Kuala_Lumpur|Kuching|Amman|Damascus|Beirut|Gaza|Hebron|Kabul|Tashkent|Samarkand|Dushanbe|Bishkek|Ashgabat|Baku|Almaty|Brunei)|Africa\/(Cairo|Tripoli|Tunis|Algiers|Casablanca|El_Aaiun|Khartoum|Nouakchott|Dakar|Mogadishu|Djibouti|Niamey|Bamako|Conakry|Banjul|Ndjamena)|Europe\/(Istanbul|Sarajevo)|Indian\/Maldives)$/;
const SOUTHERN = /^(Australia|Pacific\/Auckland|America\/(Sao_Paulo|Argentina|Santiago|Montevideo|Asuncion|La_Paz|Lima)|Africa\/(Johannesburg|Maputo|Harare|Windhoek|Lusaka|Gaborone)|Indian\/(Mauritius|Reunion))/;

function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

/** Automatische Region aus Zeitzone & App-Sprache */
export function detectRegion(lang?: string): Exclude<Region, 'auto'> {
  if (lang === 'ar' || ISLAMIC_ZONES.test(timeZone())) return 'islamic';
  return 'european';
}

// ── Aktives Theme ───────────────────────────────────────────

export function festsOn(d: Date): FestId[] {
  const out: FestId[] = [];
  const h = hijri(d);
  if (h.m === 10 && h.day <= 5) out.push('eidFitr');
  if (h.m === 12 && h.day >= 8 && h.day <= 13) out.push('eidAdha');
  if (h.m === 9) out.push('ramadan');
  if (inRange(d, 12, 18, 12, 27)) out.push('christmas');
  if (inRange(d, 12, 28, 1, 3)) out.push('newyear');
  if (Math.abs(dayNo(d) - dayNo(easterSunday(d.getFullYear()))) <= 4) out.push('easter');
  if (inRange(d, 10, 24, 11, 2)) out.push('halloween');
  return out;
}

export function seasonOn(d: Date, tz = timeZone()): SeasonId {
  let m = d.getMonth(); // 0–11
  if (SOUTHERN.test(tz)) m = (m + 6) % 12;
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

/** Das Theme für ein Datum und eine Region (Weltbürger: alle Feste) */
export function themeFor(d: Date, region: Exclude<Region, 'auto'>): ThemeId {
  const fests = festsOn(d).filter((f) => region === 'world' || THEMES[f].culture === region);
  return fests[0] ?? seasonOn(d);
}
