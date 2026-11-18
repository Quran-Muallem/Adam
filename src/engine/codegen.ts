// ─────────────────────────────────────────────────────────────
// Code-Brücke: übersetzt die bunten Blöcke in echten Code
// (JavaScript oder Python) – mit Tokens fürs Syntax-Highlighting
// und der Block-ID je Zeile, damit die laufende Zeile leuchten kann.
// ─────────────────────────────────────────────────────────────
import type { Block, Condition, Dir, Program } from '../types';

export type CodeLang = 'js' | 'py';
export type TokenKind = 'kw' | 'fn' | 'num' | 'punc' | 'cm' | 'var' | 'plain';
export interface Token {
  text: string;
  kind: TokenKind;
}
export interface CodeLine {
  tokens: Token[];
  /** Block, zu dem die Zeile gehört (für die Live-Hervorhebung) */
  blockId?: string;
}

const tk = (text: string, kind: TokenKind = 'plain'): Token => ({ text, kind });

const MOVE: Record<Dir, { js: string; py: string }> = {
  up: { js: 'moveUp', py: 'move_up' },
  down: { js: 'moveDown', py: 'move_down' },
  left: { js: 'moveLeft', py: 'move_left' },
  right: { js: 'moveRight', py: 'move_right' },
};

const COND: Record<Condition, { js: string; py: string }> = {
  pathClear: { js: 'pathClear', py: 'path_clear' },
  pathBlocked: { js: 'pathBlocked', py: 'path_blocked' },
  obstacleAhead: { js: 'obstacleAhead', py: 'obstacle_ahead' },
};

const SIMPLE: Partial<Record<Block['type'], { js: string; py: string }>> = {
  jump: { js: 'jump', py: 'jump' },
  forward: { js: 'moveForward', py: 'move_forward' },
  turnLeft: { js: 'turnLeft', py: 'turn_left' },
  turnRight: { js: 'turnRight', py: 'turn_right' },
  call: { js: 'f1', py: 'f1' },
};

const LOOP_VARS = ['i', 'j', 'k', 'n', 'm'];

export function generateCode(program: Program, lang: CodeLang, comment: string): CodeLine[] {
  const lines: CodeLine[] = [];
  const pad = (d: number) => tk('  '.repeat(d * (lang === 'py' ? 2 : 1)));
  const cm = lang === 'js' ? '// ' : '# ';

  const call = (name: string, depth: number, blockId: string) =>
    lines.push({
      blockId,
      tokens: [pad(depth), tk(name, 'fn'), tk('()', 'punc'), ...(lang === 'js' ? [tk(';', 'punc')] : [])],
    });

  const emit = (blocks: Block[], depth: number, loopDepth: number) => {
    if (blocks.length === 0 && lang === 'py' && depth > 0) lines.push({ tokens: [pad(depth), tk('pass', 'kw')] });
    for (const b of blocks) {
      if (b.type === 'move') call(MOVE[b.dir][lang], depth, b.id);
      else if (b.type === 'repeat') {
        const v = LOOP_VARS[loopDepth % LOOP_VARS.length];
        lines.push({
          blockId: b.id,
          tokens:
            lang === 'js'
              ? [pad(depth), tk('for', 'kw'), tk(' ('), tk('let', 'kw'), tk(` ${v}`, 'var'), tk(' = '), tk('0', 'num'), tk('; '), tk(v, 'var'), tk(' < '), tk(String(b.count), 'num'), tk('; '), tk(`${v}++`, 'var'), tk(') {', 'punc')]
              : [pad(depth), tk('for', 'kw'), tk(` ${v}`, 'var'), tk(' in '), tk('range', 'fn'), tk('('), tk(String(b.count), 'num'), tk('):', 'punc')],
        });
        emit(b.body, depth + 1, loopDepth + 1);
        if (lang === 'js') lines.push({ tokens: [pad(depth), tk('}', 'punc')] });
      } else if (b.type === 'if') {
        const c = COND[b.cond][lang];
        lines.push({
          blockId: b.id,
          tokens:
            lang === 'js'
              ? [pad(depth), tk('if', 'kw'), tk(' ('), tk(c, 'fn'), tk('()'), tk(') {', 'punc')]
              : [pad(depth), tk('if', 'kw'), tk(' '), tk(c, 'fn'), tk('()'), tk(':', 'punc')],
        });
        emit(b.body, depth + 1, loopDepth);
        if (lang === 'js') lines.push({ tokens: [pad(depth), tk('}', 'punc')] });
      } else {
        call(SIMPLE[b.type]![lang], depth, b.id);
      }
    }
  };

  lines.push({ tokens: [tk(cm + comment, 'cm')] });

  if (program.macro.length > 0) {
    lines.push({
      tokens:
        lang === 'js'
          ? [tk('function', 'kw'), tk(' '), tk('f1', 'fn'), tk('() {', 'punc')]
          : [tk('def', 'kw'), tk(' '), tk('f1', 'fn'), tk('():', 'punc')],
    });
    emit(program.macro, 1, 0);
    if (lang === 'js') lines.push({ tokens: [tk('}', 'punc')] });
    lines.push({ tokens: [] });
  }

  emit(program.main, 0, 0);
  return lines;
}

/** Reiner Text (z. B. für Tests) */
export const codeToText = (lines: CodeLine[]) => lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n');
