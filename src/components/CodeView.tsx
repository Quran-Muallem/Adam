// "Echter Code"-Röntgenblick: zeigt das Programm live als JavaScript oder Python
import { useEffect, useMemo, useRef } from 'react';
import { generateCode, type CodeLang, type TokenKind } from '../engine/codegen';
import type { Dict } from '../i18n';
import type { Frame, Program } from '../types';
import { scrollWithin } from '../scrollWithin';

const COLORS: Record<TokenKind, string> = {
  kw: '#f472b6',
  fn: '#67e8f9',
  num: '#fdba74',
  punc: '#cbd5e1',
  cm: '#94a3b8',
  var: '#fde68a',
  plain: '#e2e8f0',
};

interface Props {
  program: Program;
  lang: CodeLang;
  setLang: (l: CodeLang) => void;
  frame: Frame | null;
  t: Dict;
  /** Teenager & Erwachsene: zusätzlich TypeScript + Live-Analyse */
  pro?: boolean;
  insight?: string | null;
}

export function CodeView({ program, lang: langProp, setLang, frame, t, pro, insight }: Props) {
  const langs: CodeLang[] = pro ? ['py', 'ts', 'js'] : ['js', 'py'];
  const lang = langs.includes(langProp) ? langProp : langs[0];
  const lines = useMemo(() => generateCode(program, lang, t.code.comment), [program, lang, t.code.comment]);
  const currentId = frame?.activeIds[frame.activeIds.length - 1];
  const empty = program.main.length === 0 && program.macro.length === 0;
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollWithin(activeRef.current);
  }, [currentId, frame]);

  return (
    <div
      dir="ltr"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl md:h-auto"
      style={{ background: 'linear-gradient(180deg,#1e1b4b,#0f172a)', boxShadow: '0 10px 24px -10px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.15)' }}
    >
      {/* Fenster-Leiste mit Sprachumschalter */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-auto flex rounded-full bg-white/10 p-0.5">
          {langs.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${lang === l ? 'bg-yellow-300 text-slate-900' : 'text-white/80'}`}
            >
              {l === 'js' ? (pro ? 'JS' : 'JavaScript') : l === 'ts' ? 'TypeScript' : 'Python'}
            </button>
          ))}
        </div>
      </div>
      <pre className="thin-scroll min-h-0 flex-1 overflow-auto px-3 py-2 text-[14px] leading-[1.6] md:max-h-[40dvh] md:flex-none md:text-[13px]" style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}>
        {empty ? (
          <span style={{ color: COLORS.cm }}>{(lang === 'py' ? '# ' : '// ') + t.code.empty}</span>
        ) : (
          lines.map((line, i) => {
            const active = !!line.blockId && line.blockId === currentId;
            return (
              <div
                key={i}
                ref={active ? activeRef : undefined}
                className={`-mx-3 flex px-3 transition-colors duration-150 ${active ? 'bg-yellow-300/25' : ''}`}
                style={active ? { boxShadow: 'inset 3px 0 0 #fde047' } : undefined}
              >
                <span className="mr-3 w-5 shrink-0 select-none text-right text-white/25">{i + 1}</span>
                <span className="whitespace-pre">
                  {line.tokens.map((tok, k) => (
                    <span key={k} style={{ color: COLORS[tok.kind], fontStyle: tok.kind === 'cm' ? 'italic' : undefined, fontWeight: tok.kind === 'kw' ? 700 : 500 }}>
                      {tok.text}
                    </span>
                  ))}
                  {line.tokens.length === 0 && ' '}
                </span>
              </div>
            );
          })
        )}
      </pre>
      {insight && (
        <div className="border-t border-white/10 px-3 py-1.5 font-mono text-[12px] leading-snug text-teal-200">📈 {insight}</div>
      )}
    </div>
  );
}
