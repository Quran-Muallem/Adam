import type { AgeGroupId, FailReason } from '../types';
import { WORLDS } from './worlds';

/** Ermutigende, witzige Rückmeldungen von Sparky */
export function failMessages(reason: FailReason, group: AgeGroupId): string[] {
  const w = WORLDS[group];
  switch (reason) {
    case 'wall':
      return [
        `Boing! Gegen ${group === 'hero' ? 'den Asteroiden' : group === 'junior' ? 'die Palme' : 'den Baum'} geknuddelt! Versuch es nochmal!`,
        'Aua, meine Nase! Da geht’s nicht weiter. Noch ein Versuch?',
      ];
    case 'obstacle':
      return [
        `Ups, gegen ${group === 'hero' ? 'die Kiste' : group === 'junior' ? 'das Fass' : 'den Stein'} gestolpert! Vielleicht drüberspringen?`,
        'Bonk! Das Ding steht im Weg. Hast du eine Idee?',
      ];
    case 'bear':
      return ['Pssst! Der Bär schläft – nicht anstupsen! Geh lieber außen herum.', 'Huch, ein brummiger Bär! Schnell einen anderen Weg finden!'];
    case 'puddle':
      return ['Platsch! Sparky mag keine nassen Füße. Um die Pfütze herum!', 'Iiih, Matsch! Lieber trockenen Fußes weiter.'];
    case 'edge':
      return ['Huch! Da ist der Rand der Welt. Lieber zurück!', 'Fast vom Spielfeld gepurzelt! Probier einen anderen Weg.'];
    case 'locked':
      return [`Das magische Tor ist zu! Ob da irgendwo ein Schlüssel ${w.key} liegt?`, 'Klopf, klopf … das Tor will erst den Schlüssel sehen!'];
    case 'tooHigh':
      return ['Wow, viel zu hoch zum Springen! Nur niedrige Hindernisse gehen.', 'Hops – und plumps! Darüber kann ich nicht springen.'];
    case 'notReached':
      return ['Fast! Ich bin noch nicht am Ziel. Füge noch ein paar Blöcke hinzu.', 'Guter Anfang! Aber der Weg ist noch nicht zu Ende.'];
    case 'tooLong':
      return ['Puh, mir ist ganz schwindelig! Dein Programm läuft viel zu lange.'];
    case 'empty':
      return ['Ich warte auf Befehle! Lege zuerst ein paar Blöcke hin.'];
  }
}

export const WIN_MESSAGES = [
  'Juhuu! Du bist ein Coding-Star! 🌟',
  'Wow, das war genial programmiert!',
  'Sparky tanzt vor Freude!',
  'Grandios! Weiter so!',
  'Volltreffer! Du bist der Hammer!',
];

export const START_LINES = ['Los geht’s!', 'Auf ins Abenteuer!', 'Ich bin bereit!', 'Wuuusch!'];

export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
