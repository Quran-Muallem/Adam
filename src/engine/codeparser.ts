// ─────────────────────────────────────────────────────────────
// TOLERANTER CODE-PARSER: getippter Python- / JavaScript-Code → Blöcke
//
// Versteht alles, was die Code-Brücke erzeugt (move_forward(), for i in
// range(3):, while not at_goal():, if path_blocked() or laser_ahead():,
// def f1():, n = 3, n -= 1 …) und ist dabei nachsichtig:
//  • snake_case und camelCase, mit oder ohne (), ; oder Klammern
//  • Python per Einrückung, JavaScript per { }
//  • Tippfehler → freundlicher Vorschlag per Levenshtein-Distanz
// Jede Quellzeile merkt sich ihren Block → Live-Hervorhebung beim Lauf.
// ─────────────────────────────────────────────────────────────
import type { Block, CondExpr, Condition, Dir, PaletteKind, Program } from '../types';
import type { CodeLang } from './codegen';
import { uid } from './program';

export type ParseErrorKind = 'unknown' | 'syntax' | 'notAllowed' | 'indent' | 'number';
export interface ParseError {
  /** 1-basierte Zeilennummer */
  line: number;
  kind: ParseErrorKind;
  word?: string;
  suggestion?: string | null;
}
export interface ParseResult {
  program?: Program;
  error?: ParseError;
  /** Block-ID je Quellzeile (0-basiert) für die Hervorhebung */
  lineBlocks: (string | undefined)[];
}

type Simple = { kind: PaletteKind; make: () => Block; py: string; js: string };

const mv = (dir: Dir): Simple => ({
  kind: dir,
  make: () => ({ id: uid(), type: 'move', dir }),
  py: `move_${dir}()`,
  js: `move${dir[0].toUpperCase()}${dir.slice(1)}()`,
});

/** Befehle: normalisierter Name → Block */
const COMMANDS: Record<string, Simple> = {
  moveforward: { kind: 'forward', make: () => ({ id: uid(), type: 'forward' }), py: 'move_forward()', js: 'moveForward()' },
  forward: { kind: 'forward', make: () => ({ id: uid(), type: 'forward' }), py: 'move_forward()', js: 'moveForward()' },
  turnleft: { kind: 'turnLeft', make: () => ({ id: uid(), type: 'turnLeft' }), py: 'turn_left()', js: 'turnLeft()' },
  turnright: { kind: 'turnRight', make: () => ({ id: uid(), type: 'turnRight' }), py: 'turn_right()', js: 'turnRight()' },
  jump: { kind: 'jump', make: () => ({ id: uid(), type: 'jump' }), py: 'jump()', js: 'jump()' },
  moveup: mv('up'),
  movedown: mv('down'),
  moveleft: mv('left'),
  moveright: mv('right'),
  f1: { kind: 'call', make: () => ({ id: uid(), type: 'call' }), py: 'f1()', js: 'f1()' },
};

const CONDS: Record<string, { cond: Condition; py: string; js: string }> = {
  pathclear: { cond: 'pathClear', py: 'path_clear()', js: 'pathClear()' },
  pathblocked: { cond: 'pathBlocked', py: 'path_blocked()', js: 'pathBlocked()' },
  obstacleahead: { cond: 'obstacleAhead', py: 'obstacle_ahead()', js: 'obstacleAhead()' },
  laserahead: { cond: 'laserAhead', py: 'laser_ahead()', js: 'laserAhead()' },
  atgoal: { cond: 'atGoal', py: 'at_goal()', js: 'atGoal()' },
  'n>0': { cond: 'varPositive', py: 'n > 0', js: 'n > 0' },
};

/** Name vereinheitlichen: klein, ohne _ ( ) ; Leerzeichen */
const norm = (s: string) => s.toLowerCase().replace(/[\s_;]/g, '').replace(/\(\)$/, '').replace(/[()]/g, '');

export function levenshtein(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** Bester Vorschlag aus einer Liste (Abstand ≤ 40 % der Länge, mind. 2) */
function suggest(word: string, options: string[]): string | null {
  const w = norm(word);
  let best: string | null = null;
  let bestD = Infinity;
  for (const o of options) {
    const dd = levenshtein(w, norm(o));
    if (dd < bestD) {
      bestD = dd;
      best = o;
    }
  }
  return best && bestD <= Math.max(2, Math.round(w.length * 0.4)) ? best : null;
}

interface Frame {
  list: Block[];
  /** Einrückung der Kinder (Python), null = noch unbekannt */
  indent: number | null;
  /** Einrückung der Kopfzeile */
  head: number;
  macro?: boolean;
}

export function parseCode(src: string, lang: CodeLang, palette?: PaletteKind[]): ParseResult {
  const py = lang === 'py';
  const L = py ? 'py' : 'js';
  const allowed = (k: PaletteKind) => !palette || palette.includes(k);
  const main: Block[] = [];
  const macro: Block[] = [];
  const stack: Frame[] = [{ list: main, indent: 0, head: -1 }];
  const lineBlocks: (string | undefined)[] = [];
  let seenStatement = false;

  const cmdOptions = () => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of Object.values(COMMANDS)) if (allowed(c.kind) && !seen.has(c[L])) (seen.add(c[L]), out.push(c[L]));
    return out;
  };
  const fail = (line: number, kind: ParseErrorKind, word?: string, suggestion?: string | null): ParseResult => ({
    error: { line: line + 1, kind, word, suggestion },
    lineBlocks,
  });

  /** Bedingung: [not|!] a [and|&&|or|||] b */
  const parseCond = (raw: string, line: number): CondExpr | ParseResult => {
    let s = raw.trim();
    while (s.startsWith('(') && s.endsWith(')') && balanced(s.slice(1, -1))) s = s.slice(1, -1).trim();
    let not = false;
    const notM = s.match(/^(not\s+|!\s*)/i);
    if (notM) {
      not = true;
      s = s.slice(notM[0].length).trim();
      if (s.startsWith('(') && s.endsWith(')') && balanced(s.slice(1, -1))) s = s.slice(1, -1).trim();
    }
    const parts = s.split(/\s+(and|or)\s+|\s*(&&|\|\|)\s*/i).filter((p) => p !== undefined && p !== '');
    const atom = (a: string): Condition | ParseResult => {
      const k = norm(a).replace(/\s/g, '');
      if (CONDS[k]) return CONDS[k].cond;
      const word = a.trim();
      return fail(line, 'unknown', word, suggest(word, Object.values(CONDS).map((c) => c[L])));
    };
    const a = atom(parts[0] ?? '');
    if (typeof a !== 'string') return a;
    if (parts.length === 1) return { cond: a, ...(not ? { not } : {}) };
    if (parts.length !== 3) return fail(line, 'syntax');
    const op = /^(and|&&)$/i.test(parts[1]) ? 'and' : 'or';
    const b = atom(parts[2]);
    if (typeof b !== 'string') return b;
    return { cond: a, ...(not ? { not } : {}), op, cond2: b };
  };

  const rawLines = src.replace(/\t/g, '    ').split('\n');
  for (let i = 0; i < rawLines.length; i++) {
    // Kommentare entfernen
    let text = rawLines[i].replace(/\s*(#|\/\/).*$/, '');
    if (!text.trim()) continue;
    const ind = text.match(/^ */)![0].length;
    text = text.trim();

    // ── JavaScript: schließende Klammern ──
    if (!py) {
      while (text.startsWith('}')) {
        if (stack.length > 1) stack.pop();
        text = text.slice(1).trim();
      }
      if (!text) continue;
    } else {
      // ── Python: Einrückung bestimmt die Verschachtelung ──
      let top = stack[stack.length - 1];
      if (top.indent === null) {
        if (ind > top.head) top.indent = ind;
        else stack.pop(); // leerer Körper – tolerant
      }
      top = stack[stack.length - 1];
      while (stack.length > 1 && ind < (top.indent ?? 0)) {
        stack.pop();
        top = stack[stack.length - 1];
      }
      if (ind !== (top.indent ?? 0)) return fail(i, 'indent');
    }

    // mehrere Befehle in einer Zeile (a(); b();)
    const isHeader = /[:{]\s*$/.test(text);
    const stmts = isHeader ? [text] : text.split(';').map((x) => x.trim()).filter(Boolean);
    for (const stmt of stmts) {
      const top = stack[stack.length - 1];
      const r = parseStatement(stmt, i);
      if ('error' in r && r.error) return r as ParseResult;
      if ('skip' in r) continue;
      const { block, opens, macroDef } = r as { block?: Block; opens?: Block[]; macroDef?: boolean };
      if (macroDef) {
        if (stack.length > 1) return fail(i, 'indent');
        stack.push({ list: macro, indent: py ? null : 0, head: ind, macro: true });
        continue;
      }
      if (block) {
        top.list.push(block);
        lineBlocks[i] = block.id;
        seenStatement = true;
        if (opens) stack.push({ list: opens, indent: py ? null : 0, head: ind });
      }
    }
  }

  return { program: { main, macro }, lineBlocks };

  // ── eine Anweisung ──
  function parseStatement(s: string, line: number): { block?: Block; opens?: Block[]; macroDef?: boolean } | { skip: true } | ParseResult {
    const header = s.replace(/\s*[:{]\s*$/, '').trim();
    const isHeader = header !== s.trim();

    if (/^(pass|global\s+n|let\s+n(\s*:\s*number)?|return)$/i.test(header)) return { skip: true };

    // def f1(): / function f1() {
    if (/^(def|function)\s+f1\s*\(\s*\)(\s*:\s*void)?$/i.test(header)) {
      if (!allowed('call')) return fail(line, 'notAllowed', 'f1');
      return { macroDef: true };
    }

    // for i in range(3): / for (let i = 0; i < 3; i++) / repeat 3
    if (/^(for|repeat|wiederhole)\b/i.test(header)) {
      if (!allowed('repeat')) return fail(line, 'notAllowed', header.split(/[\s(]/)[0]);
      const m = header.match(/range\s*\(\s*(\d+)\s*\)/i) ?? header.match(/<\s*=?\s*(\d+)/) ?? header.match(/^(?:repeat|wiederhole)\s*\(?\s*(\d+)/i);
      if (!m) return fail(line, 'number');
      const count = Math.max(1, Math.min(30, Number(m[1]) + (/<\s*=/.test(header) ? 1 : 0)));
      const body: Block[] = [];
      return { block: { id: uid(), type: 'repeat', count, body }, opens: body };
    }

    // while / if
    const wm = header.match(/^(while|if|solange|wenn)\b\s*(.*)$/i);
    if (wm) {
      const isWhile = /^(while|solange)$/i.test(wm[1]);
      const kind: PaletteKind = isWhile ? 'while' : 'if';
      if (!allowed(kind)) return fail(line, 'notAllowed', wm[1]);
      const c = parseCond(wm[2], line);
      if ('lineBlocks' in c) return c;
      if (!isHeader && !wm[2]) return fail(line, 'syntax');
      const body: Block[] = [];
      return { block: { id: uid(), type: isWhile ? 'while' : 'if', ...c, body } as Block, opens: body };
    }

    // Variablen: n = 3 · let n = 3 · n -= 1 · n-- · n = n - 1
    const set = header.match(/^(?:let\s+|var\s+|const\s+)?n(?:\s*:\s*number)?\s*=\s*(\d+)$/i);
    if (set) {
      const value = Math.min(12, Number(set[1]));
      // „n = 0“ ganz am Anfang ist nur die Deklaration aus der Code-Brücke
      if (value === 0 && !seenStatement) return { skip: true };
      if (!allowed('setVar')) return fail(line, 'notAllowed', 'n');
      return { block: { id: uid(), type: 'setVar', value } };
    }
    if (/^n\s*(-=\s*1|--|=\s*n\s*-\s*1)$/i.test(header)) {
      if (!allowed('decVar')) return fail(line, 'notAllowed', 'n -= 1');
      return { block: { id: uid(), type: 'decVar' } };
    }

    if (isHeader) return fail(line, 'syntax');

    // einfacher Befehl
    const word = header;
    const key = norm(word);
    const cmd = COMMANDS[key];
    if (cmd) {
      if (!allowed(cmd.kind)) return fail(line, 'notAllowed', cmd[L]);
      return { block: cmd.make() };
    }
    const shown = /\(.*\)$/.test(word) ? word : `${word}`;
    return fail(line, 'unknown', shown, suggest(word, cmdOptions()));
  }
}

function balanced(s: string) {
  let d = 0;
  for (const c of s) {
    if (c === '(') d++;
    if (c === ')') d--;
    if (d < 0) return false;
  }
  return d === 0;
}

/** Schnelltasten-Leiste: Snippets passend zur Palette */
export function quickSnippets(lang: CodeLang, palette: PaletteKind[]): string[] {
  const py = lang === 'py';
  const out: string[] = [];
  const add = (k: PaletteKind, s: string) => palette.includes(k) && out.push(s);
  add('forward', py ? 'move_forward()' : 'moveForward();');
  add('turnLeft', py ? 'turn_left()' : 'turnLeft();');
  add('turnRight', py ? 'turn_right()' : 'turnRight();');
  add('up', py ? 'move_up()' : 'moveUp();');
  add('down', py ? 'move_down()' : 'moveDown();');
  add('left', py ? 'move_left()' : 'moveLeft();');
  add('right', py ? 'move_right()' : 'moveRight();');
  add('jump', py ? 'jump()' : 'jump();');
  add('repeat', py ? 'for i in range(3):' : 'for (let i = 0; i < 3; i++) {');
  add('while', py ? 'while not at_goal():' : 'while (!atGoal()) {');
  add('if', py ? 'if path_blocked():' : 'if (pathBlocked()) {');
  add('call', py ? 'f1()' : 'f1();');
  add('call', py ? 'def f1():' : 'function f1() {');
  add('setVar', py ? 'n = 3' : 'n = 3;');
  add('decVar', py ? 'n -= 1' : 'n -= 1;');
  return out;
}
