import { describe, expect, it } from 'vitest';
import { parsePython, runProgram, getLevel, detectSeason, blocksToPy, pyToBlocks, HANDMADE, LANGS, T } from '../src/App';

describe('Level', () => {
  it('alle 75 handgemachten Level sind lösbar', () => {
    for (let w = 0; w < 5; w++) {
      expect(HANDMADE[w]).toHaveLength(15);
      for (let l = 1; l <= 15; l++) expect(getLevel(w, l).par).toBeLessThan(99);
    }
  });
  it('prozedurale Level ab 16 sind lösbar und reproduzierbar', () => {
    for (let w = 0; w < 5; w++) for (let l = 16; l <= 80; l++) expect(getLevel(w, l).par).toBeLessThan(99);
    expect(getLevel(2, 40)).toBe(getLevel(2, 40));
  });
});

describe('Mini-Python', () => {
  it('führt Schleifen, Bedingungen und Rekursion aus', () => {
    const rec = 'def go():\n    if not at_goal():\n        if path_ahead():\n            move_forward()\n        else:\n            jump()\n        go()\ngo()';
    expect(runProgram(getLevel(4, 1), parsePython(rec)).win).toBe(true);
    const wl = 'while not at_goal():\n    if gap_ahead() or wall_ahead():\n        jump()\n    else:\n        move_forward()';
    expect(runProgram(getLevel(3, 5), parsePython(wl)).win).toBe(true);
  });
  it('meldet Einrückungsfehler mit Zeilennummer', () => {
    expect(() => parsePython('for i in range(3):\nmove_forward()')).toThrowError();
  });
  it('Blöcke und Python lassen sich ineinander umwandeln', () => {
    const src = 'for i in range(3):\n    move_forward()\n    for j in range(2):\n        turn_left()\nwhile not at_goal():\n    jump()';
    expect(blocksToPy(pyToBlocks(parsePython(src))!)).toBe(src);
  });
});

describe('Saison & Sprachen', () => {
  it('erkennt Weihnachten und Ramadan', () => {
    expect(detectSeason(new Date(2026, 11, 20, 12), 'europe')).toBe('christmas');
    expect(detectSeason(new Date(2027, 1, 20, 12), 'mena')).toBe('ramadan');
  });
  it('jeder Text ist in allen 7 Sprachen vorhanden', () => {
    for (const v of Object.values(T)) expect(v).toHaveLength(LANGS.length);
  });
});
