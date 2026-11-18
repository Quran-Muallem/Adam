// ─────────────────────────────────────────────────────────────
// LIVE-CODE-EDITOR: echter, tippbarer Code (Python / JS / TS)
//  • Textarea über einer Syntax-Highlighting-Ebene + Zeilennummern
//  • Blöcke antippen → Code erscheint live · Code tippen → Blöcke entstehen
//  • Fehlerzeile wird rot markiert, die laufende Zeile leuchtet gelb
//  • Schnelltasten-Leiste: move_forward(), turn_left(), for i in range(): …
// ─────────────────────────────────────────────────────────────
import { RotateCcw } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { quickSnippets } from '../engine/codeparser';
import { codeToText, generateCode, type CodeLang } from '../engine/codegen';
import type { Dict } from '../i18n';
import { scrollWithin } from '../scrollWithin';
import type { Frame, PaletteKind, Program } from '../types';

const C = { kw: '#f472b6', fn: '#67e8f9', num: '#fdba74', punc: '#cbd5e1', cm: '#94a3b8', var: '#fde68a', plain: '#e2e8f0' };
const KW = /^(for|in|range|while|if|else|not|and|or|def|function|let|const|var|return|pass|global|void|number|true|false)$/;
const MONO = 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';
const LH = 24; // Zeilenhöhe in px (Textarea & Highlighting müssen exakt gleich sein)

/** Sehr kleiner Tokenizer fürs Highlighting getippten Codes */
function highlight(line: string) {
  const out: { t: string; c: string; i?: boolean }[] = [];
  const cm = line.search(/#|\/\//);
  const code = cm >= 0 ? line.slice(0, cm) : line;
  const re = /([A-Za-z_][\w]*)|(\d+)|(\s+)|([^\w\s])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m[1]) {
      const next = code.slice(re.lastIndex).trimStart()[0];
      out.push({ t: m[1], c: KW.test(m[1]) ? C.kw : next === '(' ? C.fn : m[1] === 'n' || m[1] === 'i' || m[1] === 'j' ? C.var : C.plain });
    } else if (m[2]) out.push({ t: m[2], c: C.num });
    else if (m[3]) out.push({ t: m[3], c: C.plain });
    else out.push({ t: m[4], c: C.punc });
  }
  if (cm >= 0) out.push({ t: line.slice(cm), c: C.cm, i: true });
  return out;
}

interface Props {
  program: Program;
  /** Getippter Text – null: Text folgt den Blöcken */
  text: string | null;
  setText: (s: string | null) => void;
  lang: CodeLang;
  setLang: (l: CodeLang) => void;
  frame: Frame | null;
  t: Dict;
  pro?: boolean;
  insight?: string | null;
  palette: PaletteKind[];
  editable: boolean;
  /** Zeile mit Fehler (1-basiert) */
  errorLine: number | null;
  /** Block je Zeile, solange der getippte Text gilt */
  lineBlocks: (string | undefined)[];
}

export function CodeEditor(p: Props) {
  const { t, lang } = p;
  const langs: CodeLang[] = p.pro ? ['py', 'ts', 'js'] : ['py', 'js'];
  const generated = useMemo(() => generateCode(p.program, lang, t.code.comment), [p.program, lang, t.code.comment]);
  const value = p.text ?? codeToText(generated);
  const lines = value.split('\n');
  const blockOfLine = p.text === null ? generated.map((l) => l.blockId) : p.lineBlocks;
  const currentId = p.frame?.activeIds[p.frame.activeIds.length - 1];
  const activeLine = currentId ? blockOfLine.findIndex((b) => b === currentId) : -1;

  const taRef = useRef<HTMLTextAreaElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeLine >= 0) scrollWithin(activeRef.current);
  }, [activeLine]);

  /** Snippet an der Cursor-Position einfügen (mit passender Einrückung) */
  const insert = (snippet: string) => {
    const ta = taRef.current;
    const v = value;
    const pos = ta ? ta.selectionStart : v.length;
    const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
    const cur = v.slice(lineStart, pos);
    const baseIndent = cur.match(/^\s*/)![0];
    const prevLine = v.slice(0, lineStart).split('\n').slice(-2)[0] ?? '';
    const opensBlock = /[:{]\s*$/.test(prevLine.replace(/\s*(#|\/\/).*$/, ''));
    const unit = lang === 'py' ? '    ' : '  ';
    const indent = cur.trim() ? baseIndent : opensBlock && !cur.length ? prevLine.match(/^\s*/)![0] + unit : baseIndent;
    let ins = (cur.trim() ? '\n' + indent : cur.length ? '' : indent) + snippet;
    let caretBack = 0;
    if (/[:{]$/.test(snippet)) {
      ins += '\n' + indent + unit;
      if (snippet.endsWith('{')) {
        const close = '\n' + indent + '}';
        ins += close;
        caretBack = close.length;
      }
    }
    // Leere Zeilen am Ende: an der Cursor-Position einfügen
    const next = v.slice(0, pos) + ins + v.slice(pos);
    pendingCaret.current = pos + ins.length - caretBack;
    p.setText(next);
  };

  // Cursor nach dem Einfügen exakt hinter das Snippet setzen (synchron nach dem Rendern)
  const pendingCaret = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = taRef.current;
    const c = pendingCaret.current;
    if (!el || c === null) return;
    pendingCaret.current = null;
    el.focus();
    el.setSelectionRange(c, c);
  }, [value]);

  const snippets = useMemo(() => quickSnippets(lang, p.palette), [lang, p.palette]);

  return (
    <div
      dir="ltr"
      className="card3d flex h-full min-h-0 flex-col overflow-hidden rounded-3xl"
      style={{ background: 'linear-gradient(180deg,#1e1b4b,#0b1020)' }}
    >
      {/* Fenster-Leiste mit Sprachumschalter */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        {p.text !== null && (
          <button
            type="button"
            aria-label={t.editor.reload}
            title={t.editor.reload}
            onClick={() => p.setText(null)}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <div className="ml-auto flex rounded-full bg-white/10 p-0.5">
          {langs.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => p.setLang(l)}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${lang === l ? 'bg-yellow-300 text-slate-900' : 'text-white/80'}`}
            >
              {l === 'js' ? 'JS' : l === 'ts' ? 'TypeScript' : 'Python'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor: Zeilennummern | Highlighting + Textarea */}
      <div className="thin-scroll relative min-h-0 flex-1 overflow-auto" style={{ fontFamily: MONO }}>
        <div className="flex min-h-full min-w-full w-max">
          <div className="sticky left-0 z-10 shrink-0 select-none bg-[#151236] py-2 pl-2 pr-2 text-right text-[13px] text-white/30" aria-hidden>
            {lines.map((_, i) => (
              <div key={i} style={{ height: LH, lineHeight: `${LH}px` }} className={p.errorLine === i + 1 ? 'font-bold text-rose-400' : ''}>
                {p.errorLine === i + 1 ? '●' : i + 1}
              </div>
            ))}
          </div>
          <div className="relative min-w-0 flex-1 py-2 pl-3 pr-6 text-[15px]">
            <div aria-hidden className="pointer-events-none whitespace-pre">
              {lines.map((line, i) => (
                <div
                  key={i}
                  ref={i === activeLine ? activeRef : undefined}
                  style={{ height: LH, lineHeight: `${LH}px` }}
                  className={`-ml-3 pl-3 ${i === activeLine ? 'bg-yellow-300/25 shadow-[inset_3px_0_0_#fde047]' : p.errorLine === i + 1 ? 'bg-rose-500/25 shadow-[inset_3px_0_0_#fb7185]' : ''}`}
                >
                  {line ? highlight(line).map((tok, k) => (
                    <span key={k} style={{ color: tok.c, fontStyle: tok.i ? 'italic' : undefined }}>
                      {tok.t}
                    </span>
                  )) : ' '}
                </div>
              ))}
            </div>
            <textarea
              ref={taRef}
              value={value}
              readOnly={!p.editable}
              onChange={(e) => p.setText(e.target.value)}
              onKeyDown={(e) => {
                // Tab = Einrückung statt Fokuswechsel
                if (e.key === 'Tab') {
                  e.preventDefault();
                  insert(lang === 'py' ? '    ' : '  ');
                }
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              wrap="off"
              aria-label={t.editor.tab}
              className="absolute inset-0 resize-none overflow-hidden whitespace-pre bg-transparent py-2 pl-3 pr-6 text-[15px] text-transparent outline-none"
              style={{ lineHeight: `${LH}px`, caretColor: '#fde047', fontFamily: MONO, WebkitTextFillColor: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {p.insight && <div className="border-t border-white/10 px-3 py-1 font-mono text-[12px] leading-snug text-teal-200">📈 {p.insight}</div>}

      {/* Schnelltasten-Leiste: keine Sonderzeichen-Suche auf dem Handy */}
      {p.editable && (
        <div className="thin-scroll flex shrink-0 gap-1.5 overflow-x-auto border-t border-white/10 bg-black/30 px-2 py-1.5">
          {snippets.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insert(s)}
              className="shrink-0 whitespace-nowrap rounded-full border-2 border-slate-900 bg-slate-700 px-2.5 py-1 text-[13px] font-bold shadow-[0_3px_0_#0f172a] active:translate-y-0.5 active:shadow-none"
              style={{ fontFamily: MONO, color: /[:{]$/.test(s) ? '#fde047' : '#e2e8f0' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
