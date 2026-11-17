import type { FailReason } from '../types';

/** Ermutigende, witzige Rückmeldungen */
export const FAIL_MESSAGES: Record<FailReason, string[]> = {
  rock: [
    'Ups, gegen den Stein geknuddelt! Versuch es nochmal!',
    'Bonk! Der Stein wollte nur kuscheln. Neuer Versuch?',
    'Autsch – Steine sind ziemlich hart. Finde einen Weg drumherum!',
  ],
  edge: [
    'Huch! Da ist der Rand der Welt. Lieber zurück!',
    'Fast aus dem Spielfeld gepurzelt! Probier einen anderen Weg.',
  ],
  locked: [
    'Die Truhe ist verschlossen! Ob da irgendwo ein Schlüssel liegt? 🔑',
    'Klopf, klopf … die Truhe will erst den Schlüssel sehen!',
  ],
  notReached: [
    'Fast! Robo ist noch nicht am Ziel. Füge noch ein paar Blöcke hinzu.',
    'Guter Anfang! Aber der Weg ist noch nicht zu Ende.',
  ],
  tooLong: ['Puh, Robo ist ganz schwindelig! Dein Programm läuft zu lange.'],
  empty: ['Robo wartet auf Befehle! Lege zuerst ein paar Blöcke hin.'],
};

export const WIN_MESSAGES = [
  'Super gemacht! 🎉',
  'Wow, du bist ein echter Coder!',
  'Spitze! Robo ist begeistert!',
  'Grandios programmiert!',
  'Volltreffer!',
];

export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
