import type { ProTexts } from '../types';

// Teenager & Erwachsene, S-Bahn-Modus, Logik-Gatter (de)
export const proDe: ProTexts = {
  pro: {
    not: "NICHT",
    and: "UND",
    or: "ODER",
    roundN: (n) => `Runde ${n}`,
    undo: "Rückgängig",
    resumed: "Weiter, wo du warst",
    vibration: "Vibration (Stumm-Modus)",
    codeToggle: "👀 Echter Code (Python / TS)",
    expressButton: "🚆 S-Bahn-Express (3-Min-Rätsel)",
    expressSub: "Jeden Tag ein neues Rätsel – Stufe wählen ↓",
    expressDone: "Heute geschafft – morgen gibt’s ein neues",
    expressLevel: "Stufe fürs Tages-Rätsel",
    expressTitle: "Tages-Rätsel",
    win: ["Sauber gelöst. ✓", "Kompiliert, läuft, Ziel erreicht.", "Elegant – das übersteht jedes Code-Review.", "Stark. Genau so denken Entwickler.", "Ziel erreicht. Nächstes Problem?"],
    fail: {
      wall: "Kollision mit einer Wand. Welcher Block war’s? Debuggen!",
      obstacle: "Hindernis im Weg – Sprung oder Sensor?",
      bear: "Ein schlafender Bär. Umweg einplanen.",
      puddle: "Pfütze im Weg. Alternative Route?",
      edge: "Out of bounds – du hast die Karte verlassen.",
      locked: "Zugriff verweigert: erst den Schlüssel holen.",
      tooHigh: "Zu hoch zum Springen. Nur niedrige Hindernisse gehen.",
      laser: "Laser aktiv. Erst den Schalter umlegen – oder per Sensor ausweichen.",
      overflow: "Stack Overflow: Deine Rekursion hat keinen Basisfall.",
      notReached: "Programm beendet, Ziel nicht erreicht. Fehlt ein Schritt?",
      tooLong: "Endlosschleife: Die Abbruchbedingung wird nie wahr.",
      empty: "Leeres Programm. Ein paar Blöcke, bitte.",
    },
    efficiency: (b, a) => (a > b ? `⚡ ${b} Blöcke statt ${a} Einzelbefehle – das ist die Macht der Abstraktion.` : `⚡ ${b} Blöcke für ${a} Aktionen. Geht’s kompakter?`),
    insight: (b, a, p) => `${p} · ${b} Blöcke → ${a} Aktionen` + ' · ' + (a > b ? "Code-Größe O(1) ✓" : "Code-Größe O(n)"),
    patterns: {"recursion": "Rekursion", "parallel": "Parallel", "register": "Register", "whileLoop": "While-Schleife", "loop": "Schleife", "sequence": "Sequenz"},
  },
};
