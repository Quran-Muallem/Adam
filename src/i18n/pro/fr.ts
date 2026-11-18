import type { ProTexts } from '../types';

// Teenager & Erwachsene, S-Bahn-Modus, Logik-Gatter (fr)
export const proFr: ProTexts = {
  pro: {
    not: "NON",
    and: "ET",
    or: "OU",
    roundN: (n) => `Tour ${n}`,
    undo: "Annuler",
    resumed: "Reprise là où tu étais",
    vibration: "Vibration (mode silencieux)",
    codeToggle: "👀 Vrai code (Python / TS)",
    expressButton: "🚆 Express du trajet (énigme 3 min)",
    expressSub: "Une nouvelle énigme chaque jour – choisis le niveau ↓",
    expressDone: "Fait pour aujourd’hui – nouvelle énigme demain",
    expressLevel: "Niveau de l’énigme du jour",
    expressTitle: "Énigme du jour",
    win: ["Proprement résolu. ✓", "Compile, tourne, but atteint.", "Élégant – ça passe n’importe quelle revue de code.", "Fort. C’est comme ça que pensent les développeurs.", "But atteint. Problème suivant ?"],
    fail: {
      wall: "Collision avec un mur. Quel bloc ? Débogue !",
      obstacle: "Obstacle sur le chemin – saut ou capteur ?",
      bear: "Un ours endormi. Prévois un détour.",
      puddle: "Flaque sur le chemin. Autre route ?",
      edge: "Hors limites – tu as quitté la carte.",
      locked: "Accès refusé : récupère d’abord la clé.",
      tooHigh: "Trop haut pour sauter. Seuls les obstacles bas passent.",
      laser: "Laser actif. Bascule d’abord l’interrupteur – ou évite-le avec un capteur.",
      overflow: "Débordement de pile : ta récursion n’a pas de cas de base.",
      notReached: "Programme terminé, but non atteint. Il manque une étape ?",
      tooLong: "Boucle infinie : la condition de sortie n’est jamais vraie.",
      empty: "Programme vide. Quelques blocs, s’il te plaît.",
    },
    efficiency: (b, a) => (a > b ? `⚡ ${b} blocs au lieu de ${a} commandes – voilà la puissance de l’abstraction.` : `⚡ ${b} blocs pour ${a} actions. Plus compact ?`),
    insight: (b, a, p) => `${p} · ${b} blocs → ${a} actions` + ' · ' + (a > b ? "taille du code O(1) ✓" : "taille du code O(n)"),
    patterns: {"recursion": "Récursion", "parallel": "Parallèle", "register": "Registre", "whileLoop": "Boucle tant que", "loop": "Boucle", "sequence": "Séquence"},
  },
};
