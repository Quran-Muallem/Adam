import type { ProTexts } from '../types';

// Teenager & Erwachsene, S-Bahn-Modus, Logik-Gatter (en)
export const proEn: ProTexts = {
  pro: {
    not: "NOT",
    and: "AND",
    or: "OR",
    roundN: (n) => `Round ${n}`,
    undo: "Undo",
    resumed: "Back where you left off",
    vibration: "Vibration (silent mode)",
    codeToggle: "👀 Real code (Python / TS)",
    expressButton: "🚆 Commuter Express (3-min puzzle)",
    expressSub: "A new puzzle every day – pick a level ↓",
    expressDone: "Done for today – a new one tomorrow",
    expressLevel: "Level for the daily puzzle",
    expressTitle: "Daily puzzle",
    win: ["Cleanly solved. ✓", "Compiles, runs, goal reached.", "Elegant – that survives any code review.", "Strong. That’s how developers think.", "Goal reached. Next problem?"],
    fail: {
      wall: "Wall collision. Which block was it? Debug!",
      obstacle: "Obstacle in the way – jump or sensor?",
      bear: "A sleeping bear. Plan a detour.",
      puddle: "Puddle in the way. Alternative route?",
      edge: "Out of bounds – you left the map.",
      locked: "Access denied: get the key first.",
      tooHigh: "Too high to jump. Only low obstacles work.",
      laser: "Laser active. Flip the switch first – or dodge it with a sensor.",
      overflow: "Stack overflow: your recursion has no base case.",
      notReached: "Program finished, goal not reached. Missing a step?",
      tooLong: "Infinite loop: the exit condition never becomes true.",
      empty: "Empty program. A few blocks, please.",
    },
    efficiency: (b, a) => (a > b ? `⚡ ${b} blocks instead of ${a} single commands – that’s the power of abstraction.` : `⚡ ${b} blocks for ${a} actions. Can you make it tighter?`),
    insight: (b, a, p) => `${p} · ${b} blocks → ${a} actions` + ' · ' + (a > b ? "code size O(1) ✓" : "code size O(n)"),
    patterns: {"recursion": "Recursion", "parallel": "Parallel", "register": "Register", "whileLoop": "While loop", "loop": "Loop", "sequence": "Sequence"},
  },
};
