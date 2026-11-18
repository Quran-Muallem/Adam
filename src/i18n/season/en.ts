import type { ExtraTexts } from '../types';

// Saison & Feste, Live-Code-Editor, kurze Labels (en)
export const seasonEn: ExtraTexts = {
  season: {
    names: {"normal": "Normal", "spring": "Spring", "summer": "Summer", "autumn": "Autumn", "winter": "Winter", "halloween": "Halloween", "christmas": "Christmas", "newyear": "New Year", "easter": "Easter", "ramadan": "Ramadan", "eidFitr": "Eid al-Fitr", "eidAdha": "Eid al-Adha"},
    banner: {"ramadan": "Ramadan Event · Collect dates!", "eidFitr": "Eid Mubarak! Happy Eid al-Fitr!", "eidAdha": "Eid Mubarak! Happy Eid al-Adha!", "halloween": "Halloween Week · Collect pumpkins!", "christmas": "Merry Christmas · Collect presents!", "newyear": "Happy New Year!", "easter": "Happy Easter · Collect eggs!"},
    regions: {"auto": "Automatic (my region)", "islamic": "Islamic holidays", "european": "European holidays", "world": "World citizen (all holidays)"},
    regionTitle: "Holidays & region",
    previewTitle: "Season preview",
    previewLive: (n) => `Calendar: ${n}`,
    doubleWheel: "Holiday: double stars!",
    festBadges: "Holiday badges",
  },
  editor: {
    tab: "Live code",
    hint: "Type code yourself – or use the blocks below.",
    unknown: (l, w, s) => (s ? `In line ${l} I don’t know “${w}” – did you mean “${s}”?` : `In line ${l} I don’t know “${w}”.`),
    syntax: (l) => `Line ${l}: I don’t quite get that. Check brackets and colons.`,
    notAllowed: (l, w) => `Line ${l}: “${w}” isn’t available in this level yet.`,
    tooMany: (n, m) => `That’s ${n} blocks – ${m} are allowed.`,
    indent: (l) => `Line ${l}: the indentation doesn’t fit.`,
    number: (l) => `Line ${l}: a number is missing, e.g. range(3).`,
    applied: "Code applied ✓",
    reload: "Reload from blocks",
  },
  home2: {"costumes": "Outfits", "knowledge": "Knowledge", "trophies": "Trophies", "gift": "Gift", "play": "PLAY", "level": "Level"},
};
