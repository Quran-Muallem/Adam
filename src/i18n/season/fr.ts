import type { ExtraTexts } from '../types';

// Saison & Feste, Live-Code-Editor, kurze Labels (fr)
export const seasonFr: ExtraTexts = {
  season: {
    names: {"normal": "Normal", "spring": "Printemps", "summer": "Été", "autumn": "Automne", "winter": "Hiver", "halloween": "Halloween", "christmas": "Noël", "newyear": "Nouvel An", "easter": "Pâques", "ramadan": "Ramadan", "eidFitr": "Aïd el-Fitr", "eidAdha": "Aïd el-Adha"},
    banner: {"ramadan": "Événement Ramadan · Collecte des dattes !", "eidFitr": "Aïd Moubarak ! Bonne fête de l’Aïd el-Fitr !", "eidAdha": "Aïd Moubarak ! Bonne fête de l’Aïd el-Adha !", "halloween": "Semaine d’Halloween · Collecte des citrouilles !", "christmas": "Joyeux Noël · Collecte des cadeaux !", "newyear": "Bonne année !", "easter": "Joyeuses Pâques · Collecte des œufs !"},
    regions: {"auto": "Automatique (ma région)", "islamic": "Fêtes islamiques", "european": "Fêtes européennes", "world": "Citoyen du monde (toutes les fêtes)"},
    regionTitle: "Fêtes & région",
    previewTitle: "Aperçu des saisons",
    previewLive: (n) => `Calendrier : ${n}`,
    doubleWheel: "Jour de fête : étoiles doublées !",
    festBadges: "Badges de fête",
  },
  editor: {
    tab: "Code en direct",
    hint: "Tape le code toi-même – ou utilise les blocs.",
    unknown: (l, w, s) => (s ? `Ligne ${l} : je ne connais pas « ${w} » – tu voulais dire « ${s} » ?` : `Ligne ${l} : je ne connais pas « ${w} ».`),
    syntax: (l) => `Ligne ${l} : je ne comprends pas bien. Vérifie parenthèses et deux-points.`,
    notAllowed: (l, w) => `Ligne ${l} : « ${w} » n’existe pas encore dans ce niveau.`,
    tooMany: (n, m) => `Ça fait ${n} blocs – ${m} sont autorisés.`,
    indent: (l) => `Ligne ${l} : l’indentation ne va pas.`,
    number: (l) => `Ligne ${l} : il manque un nombre, p. ex. range(3).`,
    applied: "Code appliqué ✓",
    reload: "Recharger depuis les blocs",
  },
  home2: {"costumes": "Costumes", "knowledge": "Savoir", "trophies": "Trophées", "gift": "Cadeau", "play": "JOUER", "level": "Niveau"},
};
