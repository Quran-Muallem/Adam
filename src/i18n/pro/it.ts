import type { ProTexts } from '../types';

// Teenager & Erwachsene, S-Bahn-Modus, Logik-Gatter (it)
export const proIt: ProTexts = {
  pro: {
    not: "NON",
    and: "E",
    or: "O",
    roundN: (n) => `Giro ${n}`,
    undo: "Annulla",
    resumed: "Riprendi da dove eri",
    vibration: "Vibrazione (modalità silenziosa)",
    codeToggle: "👀 Codice vero (Python / TS)",
    expressButton: "🚆 Express del pendolare (sfida 3 min)",
    expressSub: "Una nuova sfida ogni giorno: scegli il livello ↓",
    expressDone: "Fatto per oggi: domani ce n’è un’altra",
    expressLevel: "Livello della sfida del giorno",
    expressTitle: "Sfida del giorno",
    win: ["Risolto con pulizia. ✓", "Compila, gira, traguardo raggiunto.", "Elegante: supererebbe qualsiasi code review.", "Ottimo. È così che ragionano gli sviluppatori.", "Traguardo raggiunto. Prossimo problema?"],
    fail: {
      wall: "Collisione con un muro. Quale blocco? Fai debug!",
      obstacle: "Ostacolo sulla strada: salto o sensore?",
      bear: "Un orso che dorme. Pianifica una deviazione.",
      puddle: "Pozzanghera sulla strada. Percorso alternativo?",
      edge: "Fuori dai limiti: sei uscito dalla mappa.",
      locked: "Accesso negato: prima prendi la chiave.",
      tooHigh: "Troppo alto per saltare. Solo ostacoli bassi.",
      laser: "Laser attivo. Prima l’interruttore, o evitalo con un sensore.",
      overflow: "Stack overflow: la tua ricorsione non ha un caso base.",
      notReached: "Programma finito, traguardo non raggiunto. Manca un passo?",
      tooLong: "Ciclo infinito: la condizione di uscita non diventa mai vera.",
      empty: "Programma vuoto. Qualche blocco, per favore.",
    },
    efficiency: (b, a) => (a > b ? `⚡ ${b} blocchi invece di ${a} comandi singoli: questa è la forza dell’astrazione.` : `⚡ ${b} blocchi per ${a} azioni. Più compatto?`),
    insight: (b, a, p) => `${p} · ${b} blocchi → ${a} azioni` + ' · ' + (a > b ? "dimensione del codice O(1) ✓" : "dimensione del codice O(n)"),
    patterns: {"recursion": "Ricorsione", "parallel": "Parallelo", "register": "Registro", "whileLoop": "Ciclo finché", "loop": "Ciclo", "sequence": "Sequenza"},
  },
};
