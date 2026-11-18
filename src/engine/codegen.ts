// ─────────────────────────────────────────────────────────────
// Code-Brücke: übersetzt die bunten Blöcke in echten Code
// (JavaScript oder Python) – mit Tokens fürs Syntax-Highlighting
// und der Block-ID je Zeile, damit die laufende Zeile leuchten kann.
// ─────────────────────────────────────────────────────────────
import type { Block, CondExpr, Condition, Dir, Program } from '../types';

/** js = JavaScript, ts = TypeScript (ab Stufe 4), py = Python */
export type CodeLang = 'js' | 'ts' | 'py';
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
  laserAhead: { js: 'laserAhead', py: 'laser_ahead' },
  atGoal: { js: 'atGoal', py: 'at_goal' },
  varPositive: { js: 'n > 0', py: 'n > 0' },
};

const SIMPLE: Partial<Record<Block['type'], { js: string; py: string }>> = {
  jump: { js: 'jump', py: 'jump' },
  forward: { js: 'moveForward', py: 'move_forward' },
  turnLeft: { js: 'turnLeft', py: 'turn_left' },
  turnRight: { js: 'turnRight', py: 'turn_right' },
  call: { js: 'f1', py: 'f1' },
};

const LOOP_VARS = ['i', 'j', 'k', 'n', 'm'];

const usesVar = (blocks: Block[]): boolean =>
  blocks.some(
    (b) =>
      b.type === 'setVar' ||
      b.type === 'decVar' ||
      ((b.type === 'if' || b.type === 'while') && (b.cond === 'varPositive' || b.cond2 === 'varPositive')) ||
      ('body' in b && usesVar(b.body)),
  );

export function generateCode(program: Program, lang: CodeLang, comment: string): CodeLine[] {
  const lines: CodeLine[] = [];
  const py = lang === 'py';
  const L = py ? 'py' : 'js';
  const semi = py ? [] : [tk(';', 'punc')];
  const pad = (d: number) => tk('  '.repeat(d * (py ? 2 : 1)));
  const cm = py ? '# ' : '// ';

  const call = (name: string, depth: number, blockId: string) =>
    lines.push({ blockId, tokens: [pad(depth), tk(name, 'fn'), tk('()', 'punc'), ...semi] });

  /** Ein Bedingungs-Atom: Funktion () oder Vergleich n > 0 */
  const atom = (c: Condition): Token[] =>
    c === 'varPositive' ? [tk('n', 'var'), tk(' > '), tk('0', 'num')] : [tk(COND[c][L], 'fn'), tk('()')];

  const condTokens = (e: CondExpr): Token[] => {
    const out: Token[] = [];
    if (e.not) out.push(py ? tk('not ', 'kw') : tk('!', 'kw'));
    const a = atom(e.cond);
    if (e.not && e.cond === 'varPositive') out.push(tk('('), ...a, tk(')'));
    else out.push(...a);
    if (e.op && e.cond2) {
      out.push(tk(py ? (e.op === 'and' ? ' and ' : ' or ') : e.op === 'and' ? ' && ' : ' || ', 'kw'), ...atom(e.cond2));
    }
    return out;
  };

  const header = (kw: string, e: CondExpr, depth: number, id: string) =>
    lines.push({
      blockId: id,
      tokens: py
        ? [pad(depth), tk(kw, 'kw'), tk(' '), ...condTokens(e), tk(':', 'punc')]
        : [pad(depth), tk(kw, 'kw'), tk(' ('), ...condTokens(e), tk(') {', 'punc')],
    });

  const close = (depth: number) => {
    if (!py) lines.push({ tokens: [pad(depth), tk('}', 'punc')] });
  };

  const emit = (blocks: Block[], depth: number, loopDepth: number) => {
    if (blocks.length === 0 && py && depth > 0) lines.push({ tokens: [pad(depth), tk('pass', 'kw')] });
    for (const b of blocks) {
      if (b.type === 'move') call(MOVE[b.dir][L], depth, b.id);
      else if (b.type === 'repeat') {
        const v = LOOP_VARS[loopDepth % LOOP_VARS.length];
        lines.push({
          blockId: b.id,
          tokens: py
            ? [pad(depth), tk('for', 'kw'), tk(` ${v}`, 'var'), tk(' in '), tk('range', 'fn'), tk('('), tk(String(b.count), 'num'), tk('):', 'punc')]
            : [pad(depth), tk('for', 'kw'), tk(' ('), tk('let', 'kw'), tk(` ${v}`, 'var'), ...(lang === 'ts' ? [tk(': '), tk('number', 'kw')] : []), tk(' = '), tk('0', 'num'), tk('; '), tk(v, 'var'), tk(' < '), tk(String(b.count), 'num'), tk('; '), tk(`${v}++`, 'var'), tk(') {', 'punc')],
        });
        emit(b.body, depth + 1, loopDepth + 1);
        close(depth);
      } else if (b.type === 'if' || b.type === 'while') {
        header(b.type, b, depth, b.id);
        emit(b.body, depth + 1, loopDepth);
        close(depth);
      } else if (b.type === 'setVar') {
        lines.push({ blockId: b.id, tokens: [pad(depth), tk('n', 'var'), tk(' = '), tk(String(b.value), 'num'), ...semi] });
      } else if (b.type === 'decVar') {
        lines.push({ blockId: b.id, tokens: [pad(depth), tk('n', 'var'), tk(' -= '), tk('1', 'num'), ...semi] });
      } else {
        call(SIMPLE[b.type]![L], depth, b.id);
      }
    }
  };

  lines.push({ tokens: [tk(cm + comment, 'cm')] });

  if (usesVar(program.main) || usesVar(program.macro)) {
    lines.push({
      tokens: py
        ? [tk('n', 'var'), tk(' = '), tk('0', 'num')]
        : [tk('let', 'kw'), tk(' n', 'var'), ...(lang === 'ts' ? [tk(': '), tk('number', 'kw')] : []), tk(' = '), tk('0', 'num'), tk(';', 'punc')],
    });
  }

  if (program.macro.length > 0) {
    lines.push({
      tokens: py
        ? [tk('def', 'kw'), tk(' '), tk('f1', 'fn'), tk('():', 'punc')]
        : [tk('function', 'kw'), tk(' '), tk('f1', 'fn'), tk('()'), ...(lang === 'ts' ? [tk(': '), tk('void', 'kw')] : []), tk(' {', 'punc')],
    });
    if (py && usesVar(program.macro)) lines.push({ tokens: [pad(1), tk('global', 'kw'), tk(' n', 'var')] });
    emit(program.macro, 1, 0);
    close(0);
    lines.push({ tokens: [] });
  }

  emit(program.main, 0, 0);
  return lines;
}

/** Reiner Text (z. B. für Tests) */
export const codeToText = (lines: CodeLine[]) => lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n');
