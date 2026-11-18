import type { ProTexts } from '../types';

// Teenager & Erwachsene, S-Bahn-Modus, Logik-Gatter (es)
export const proEs: ProTexts = {
  pro: {
    not: "NO",
    and: "Y",
    or: "O",
    roundN: (n) => `Ronda ${n}`,
    undo: "Deshacer",
    resumed: "Sigues donde lo dejaste",
    vibration: "Vibración (modo silencio)",
    codeToggle: "👀 Código real (Python / TS)",
    expressButton: "🚆 Exprés del tren (reto de 3 min)",
    expressSub: "Un reto nuevo cada día: elige el nivel ↓",
    expressDone: "Hecho por hoy: mañana hay otro",
    expressLevel: "Nivel del reto diario",
    expressTitle: "Reto del día",
    win: ["Resuelto con limpieza. ✓", "Compila, funciona, meta alcanzada.", "Elegante: pasaría cualquier revisión de código.", "Muy bien. Así piensan los desarrolladores.", "Meta alcanzada. ¿Siguiente problema?"],
    fail: {
      wall: "Choque con una pared. ¿Qué bloque fue? ¡Depura!",
      obstacle: "Obstáculo en el camino: ¿salto o sensor?",
      bear: "Un oso dormido. Planea un rodeo.",
      puddle: "Charco en el camino. ¿Otra ruta?",
      edge: "Fuera de límites: saliste del mapa.",
      locked: "Acceso denegado: primero consigue la llave.",
      tooHigh: "Demasiado alto para saltar. Solo obstáculos bajos.",
      laser: "Láser activo. Primero el interruptor, o esquívalo con un sensor.",
      overflow: "Desbordamiento de pila: tu recursión no tiene caso base.",
      notReached: "Programa terminado, meta no alcanzada. ¿Falta un paso?",
      tooLong: "Bucle infinito: la condición de salida nunca se cumple.",
      empty: "Programa vacío. Unos bloques, por favor.",
    },
    efficiency: (b, a) => (a > b ? `⚡ ${b} bloques en vez de ${a} órdenes sueltas: ese es el poder de la abstracción.` : `⚡ ${b} bloques para ${a} acciones. ¿Más compacto?`),
    insight: (b, a, p) => `${p} · ${b} bloques → ${a} acciones` + ' · ' + (a > b ? "tamaño del código O(1) ✓" : "tamaño del código O(n)"),
    patterns: {"recursion": "Recursión", "parallel": "Paralelo", "register": "Registro", "whileLoop": "Bucle mientras", "loop": "Bucle", "sequence": "Secuencia"},
  },
};
