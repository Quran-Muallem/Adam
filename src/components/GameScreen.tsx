// ─────────────────────────────────────────────────────────────
// GameScreen: Spielfeld + Sparky-Sprechblase + Programm + Palette
// ─────────────────────────────────────────────────────────────
import { ChevronLeft, Clapperboard, CornerLeftUp, Crosshair, Play, RotateCcw, Settings, Square, Star, Trash2, Undo2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useStoredState } from '../hooks/useStoredState';
import { cardForLevel, unlockedCards } from '../data/cards';
import { COSTUMES, type Costume } from '../data/costumes';
import { expressDate, handcrafted, isExpress, levelAt, levelNumber } from '../data/levels';
import { pick } from '../data/messages';
import { useI18n } from '../i18n';
import { isPro, WORLDS } from '../data/worlds';
import { runProgram } from '../engine/interpreter';
import { countProgram, createBlock, emptyProgram, findBlock, insertBlock, isContainer, parentTarget, removeBlock, targetExists, updateBlock } from '../engine/program';
import { hasBonus, rate } from '../engine/rating';
import type { CodeLang } from '../engine/codegen';
import { STEP_MS, useProgramRunner, type Speed } from '../hooks/useProgramRunner';
import type { ProgressApi, Reward } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { Block, InsertTarget, LevelDef, PaletteKind, Program, RunResult } from '../types';
import { Board } from './Board';
import { CodeView } from './CodeView';
import { Confetti } from './Confetti';
import { MoviePlayer } from './MoviePlayer';
import { MiniWorkspace } from './MiniWorkspace';
import { Palette } from './Palette';
import { Particles } from './Particles';
import { ResultOverlay } from './ResultOverlay';
import { Sparky, type SparkyMood } from './Sparky';
import { Workspace } from './Workspace';

interface Props {
  level: LevelDef;
  sound: SoundApi;
  speed: Speed;
  prog: ProgressApi;
  onBack: () => void;
  onOpenLevel: (id: string) => void;
  onSettings: () => void;
}

const MAIN_TARGET: InsertTarget = { root: 'main', parentId: null };
const UNDO_MAX = 50;

// ── Auto-Pause & Offline-Sicherheit: jeder Zug wird sofort gespeichert ──
const draftKey = (id: string) => `sparky:draft:${id}`;
function loadDraft(id: string): Program {
  try {
    const raw = localStorage.getItem(draftKey(id));
    if (raw) {
      const p = JSON.parse(raw) as Program;
      if (Array.isArray(p.main) && Array.isArray(p.macro)) return p;
    }
  } catch {
    /* ignorieren */
  }
  return emptyProgram();
}
function saveDraft(id: string, p: Program) {
  try {
    if (p.main.length === 0 && p.macro.length === 0) localStorage.removeItem(draftKey(id));
    else localStorage.setItem(draftKey(id), JSON.stringify(p));
  } catch {
    /* Speicher voll / nicht verfügbar */
  }
}

export function GameScreen(props: Props) {
  const { level, sound, speed, prog } = props;
  const bestStars = prog.progress.stars[level.id] ?? 0;
  const totalStars = prog.totalStars;
  const costume = prog.costume;
  const world = WORLDS[level.group];
  const { t, levelTitle, levelHint, failLines } = useI18n();
  const tRef = useRef({ t, failLines });
  tRef.current = { t, failLines };
  const { play } = sound;
  const isMini = level.group === 'mini';
  const pro = isPro(level.group);
  const express = isExpress(level.id);
  const hasMacro = level.palette.includes('call');

  const [program, setProgramState] = useState<Program>(() => loadDraft(level.id));
  const [resumed] = useState(() => countProgram(program) > 0);
  // Rückgängig: Verlauf der letzten Programm-Stände
  const historyRef = useRef<Program[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const curRef = useRef(program);
  curRef.current = program;
  const setProgram = useCallback((fn: (p: Program) => Program) => {
    const prev = curRef.current;
    const next = fn(prev);
    if (next === prev) return;
    historyRef.current = [...historyRef.current.slice(-(UNDO_MAX - 1)), prev];
    setUndoCount(historyRef.current.length);
    curRef.current = next;
    setProgramState(next);
  }, []);
  useEffect(() => saveDraft(level.id, program), [level.id, program]);
  const [target, setTarget] = useState<InsertTarget>(MAIN_TARGET);
  const [result, setResult] = useState<{
    kind: 'success' | 'fail';
    stars: number;
    message: string;
    newCostume: Costume | null;
    cardIsNew: boolean;
    milestone: Reward | null;
  } | null>(null);
  const card = cardForLevel(level.id);
  const [limitFlash, setLimitFlash] = useState(false);
  const [movieOpen, setMovieOpen] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [showCode, setShowCode] = useStoredState<boolean>('sparky:showCode', false);
  const [codeLang, setCodeLang] = useStoredState<CodeLang>('sparky:codeLang', 'js');
  const programRef = useRef(program);
  programRef.current = program;
  const statsRef = useRef({ bestStars, totalStars, allStars: prog.progress.stars });
  statsRef.current = { bestStars, totalStars, allStars: prog.progress.stars };

  // Endlos-Level: es gibt immer ein nächstes Level
  const levelNo = levelNumber(level.id);
  const nextLevel = express ? null : levelAt(level.group, levelNo + 1);
  const blockCount = countProgram(program);
  const bonus = hasBonus(level);

  const handleFinish = useCallback(
    (res: RunResult) => {
      if (res.outcome === 'success') {
        const stars = rate(level, res, countProgram(programRef.current));
        const { bestStars: prevBest, totalStars: prevTotal, allStars } = statsRef.current;
        const cardIsNew = !unlockedCards(allStars).has(cardForLevel(level.id).id);
        const newTotal = prevTotal - prevBest + Math.max(prevBest, stars);
        const unlocked = COSTUMES.filter((c) => c.stars > prevTotal && c.stars <= newTotal);
        play('win');
        const milestone = prog.saveStars(level.id, stars);
        const { t: tt } = tRef.current;
        // Profi-Ton + Effizienz-Analyse (Big-O) für Teenager & Erwachsene
        const blocks = countProgram(programRef.current);
        const actions = res.frames.filter((f) => f.motion && f.motion !== 'think').length;
        const message = pro ? `${pick(tt.pro.win)}\n${tt.pro.efficiency(blocks, actions)}` : pick(tt.win);
        setResult({ kind: 'success', stars, message, newCostume: unlocked[unlocked.length - 1] ?? null, cardIsNew, milestone });
      } else {
        play('fail');
        const reason = res.reason ?? 'notReached';
        const message = pro ? tRef.current.t.pro.fail[reason] : pick(tRef.current.failLines(reason, level.group));
        setResult({ kind: 'fail', stars: 0, message, newCostume: null, cardIsNew: false, milestone: null });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level, play],
  );

  const runner = useProgramRunner({ level, speed, play, onFinish: handleFinish });
  const { frame, frameIndex, isRunning } = runner;
  const locked = isRunning || result !== null;
  const stepMs = STEP_MS[speed];

  // ── Programm bearbeiten ──
  const addBlock = (kind: PaletteKind) => {
    if (locked) return;
    if (blockCount >= level.maxBlocks) {
      play('boing');
      setLimitFlash(true);
      setTimeout(() => setLimitFlash(false), 500);
      return;
    }
    if (frame) runner.reset();
    const block = createBlock(kind);
    const t = targetExists(program, target) ? target : MAIN_TARGET;
    setProgram((p) => insertBlock(p, t, block));
    // Neue Schleife → Fokus hinein; sonst bei "danach" hinter dem neuen Block weitermachen
    if (isContainer(block)) setTarget({ root: t.root, parentId: block.id });
    else if (t.afterId) setTarget({ ...t, afterId: block.id });
    play('click');
  };

  const remove = (id: string) => {
    if (locked) return;
    if (frame) runner.reset();
    setProgram((p) => removeBlock(p, id));
    if (target.parentId === id) setTarget({ root: target.root, parentId: null });
    play('remove');
  };

  const update = (id: string, patch: (b: Block) => Block) => {
    if (locked) return;
    if (frame) runner.reset();
    setProgram((p) => updateBlock(p, id, patch));
    play('click');
  };

  const undo = () => {
    if (locked || historyRef.current.length === 0) return;
    if (frame) runner.reset();
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setUndoCount(historyRef.current.length);
    setProgramState(prev);
    setTarget(MAIN_TARGET);
    play('remove');
  };

  const clearAll = () => {
    if (locked) return;
    runner.reset();
    setProgram(() => emptyProgram());
    setTarget(MAIN_TARGET);
    play('remove');
  };

  const runOrStop = () => {
    if (result) return;
    play('click');
    if (isRunning) return runner.stop();
    runner.start(program);
  };

  const retry = () => {
    setResult(null);
    runner.reset();
    play('click');
  };

  // ── Sparkys Stimmung ──
  let mood: SparkyMood = 'idle';
  if (result?.kind === 'success') mood = 'happy';
  else if (result?.kind === 'fail') mood = 'sad';
  else if (frame?.motion === 'bump') mood = 'boing';
  else if (isRunning && (frame?.motion === 'walk' || frame?.motion === 'jump')) mood = 'walk';
  else if (isRunning && frame?.motion === 'think') mood = 'think';


  // ── Aktiver Fokus (wohin der nächste Block eingefügt wird) ──
  const effTarget = targetExists(program, target) ? target : MAIN_TARGET;
  const focusContainer = effTarget.parentId ? findBlock(program[effTarget.root], effTarget.parentId) : null;
  const showFocus = !isMini && (hasMacro || program.main.some(isContainer) || program.macro.length > 0);
  const focus = !showFocus
    ? null
    : focusContainer && isContainer(focusContainer)
      ? {
          inside: true,
          label: t.loop.focusInto(
            focusContainer.type === 'repeat'
              ? `${t.blocks.repeat.label} ${focusContainer.count}×`
              : `${t.blocks[focusContainer.type].label} ${focusContainer.not ? `${t.pro.not} ` : ''}${t.conds[focusContainer.cond]}`,
          ),
          exit: parentTarget(program, focusContainer.id),
        }
      : { inside: false, label: effTarget.root === 'macro' ? t.loop.focusMacro : t.loop.focusMain, exit: MAIN_TARGET };

  // Ab Stufe 5 darf F1 sich selbst aufrufen (Rekursion)
  const isKindDisabled = useMemo(() => (k: PaletteKind) => k === 'call' && target.root === 'macro' && level.group !== 'adult', [target.root, level.group]);

  // Live-Analyse für die Profi-Code-Brücke: Blöcke vs. ausgeführte Aktionen
  const insight = useMemo(() => {
    if (!pro || blockCount === 0) return null;
    const res = runProgram(level, program);
    const actions = res.frames.filter((f) => f.motion && f.motion !== 'think').length;
    const has = (pred: (b: Block) => boolean) => {
      const walk = (bs: Block[]): boolean => bs.some((b) => pred(b) || ('body' in b && walk(b.body)));
      return walk(program.main) || walk(program.macro);
    };
    const pattern =
      has((b) => b.type === 'call') && program.macro.some(function rec(b: Block): boolean { return b.type === 'call' || ('body' in b && b.body.some(rec)); })
        ? 'recursion'
        : level.grid.join('').includes('T')
          ? 'parallel'
          : has((b) => b.type === 'setVar')
            ? 'register'
            : has((b) => b.type === 'while')
              ? 'whileLoop'
              : has((b) => b.type === 'repeat')
                ? 'loop'
                : 'sequence';
    return t.pro.insight(blockCount, actions, t.pro.patterns[pattern]);
  }, [pro, blockCount, level, program, t]);
  const bubble = levelHint(level);

  return (
    <div
      className={`world-${level.group} safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br ${world.bg}`}
      onScroll={(e) => {
        if (e.currentTarget.scrollTop) e.currentTarget.scrollTop = 0;
      }}
    >
      <Particles kind={world.particles} />

      {/* ── Kopfzeile ── */}
      <header className="relative z-10 flex items-center gap-2 px-3 pt-2">
        <RoundBtn label={t.ui.toMap} onClick={props.onBack} color="#ffffff" dark>
          <ChevronLeft className="h-7 w-7 rtl:rotate-180" strokeWidth={3} />
        </RoundBtn>
        <div className={`flex min-w-0 flex-1 flex-col leading-tight ${world.text} drop-shadow`}>
          <span className="line-clamp-2 text-base font-bold leading-tight sm:text-lg">{express
              ? `🚆 ${t.pro.expressTitle} · ${expressDate(level.id).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })}`
              : world.showText
                ? levelNo > handcrafted(level.group)
                  ? levelTitle(level)
                  : `${levelNo}. ${levelTitle(level)}`
                : `${world.emoji} ${levelNo}`}</span>
          <span className="flex">
            {[1, 2, 3].map((i) => (
              <Star key={i} className={`h-4 w-4 ${i <= bestStars ? 'fill-yellow-300 text-amber-500' : 'text-white/70'}`} />
            ))}
          </span>
        </div>
        <RoundBtn
          label={t.movie.button}
          onClick={() => {
            play('click');
            runner.stop();
            setMovieOpen(true);
          }}
          color="#facc15"
          dark
        >
          <Clapperboard className="h-6 w-6" strokeWidth={2.5} />
        </RoundBtn>
        <RoundBtn label={t.settings.title} onClick={props.onSettings} color="#ffffff" dark>
          <Settings className="h-6 w-6" />
        </RoundBtn>
      </header>

      <main className="thin-scroll relative z-10 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3 md:flex-row md:gap-5 md:overflow-hidden">
        {/* ── Spielfeld ── */}
        <div className={`flex shrink-0 flex-col gap-2 md:w-1/2 md:shrink md:justify-center ${isMini ? '[--board-h:34dvh]' : '[--board-h:24dvh]'} md:[--board-h:62dvh]`}>
          <div dir="ltr">
            <Board level={level} world={world} frame={frame} frameIndex={frameIndex} stepMs={stepMs} mood={mood} />
          </div>
          {world.showText && bubble && (
            // Tipp-Blase: offen, solange noch keine Blöcke liegen (oder Sparky läuft) – sonst als 💡 eingeklappt
            bubbleOpen || blockCount === 0 ? (
              <button
                type="button"
                onClick={() => setBubbleOpen(false)}
                className="flex items-end gap-1 text-start"
                disabled={blockCount === 0}
              >
                <div className="h-11 w-11 shrink-0">
                  <Sparky mood={isRunning ? 'think' : 'idle'} />
                </div>
                <div key={bubble} className="glass relative flex-1 animate-bounce-in rounded-2xl rounded-bl-md px-3 py-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                  {bubble}
                </div>
              </button>
            ) : null
          )}
        </div>

        {/* ── Programmierbereich ── */}
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 md:w-1/2">
          {isMini ? (
            <>
              <MiniWorkspace
                blocks={program.main}
                slots={level.maxBlocks}
                frame={frame}
                frameIndex={frameIndex}
                pulseMs={stepMs}
                locked={locked}
                remove={remove}
                t={t}
              >
                <RoundBtn label={t.ui.resetSparky} onClick={() => runner.reset()} disabled={locked || !frame} color="#ffffff" dark mini>
                  <RotateCcw className="h-7 w-7" strokeWidth={3} />
                </RoundBtn>
                <RoundBtn label={t.pro.undo} onClick={undo} disabled={locked || undoCount === 0} color="#ffffff" dark mini>
                  <Undo2 className="h-7 w-7 rtl:-scale-x-100" strokeWidth={3} />
                </RoundBtn>
                <RoundBtn label={t.ui.clearAll} onClick={clearAll} disabled={locked || program.main.length === 0} color="#ffffff" dark mini>
                  <Trash2 className="h-7 w-7" strokeWidth={2.5} />
                </RoundBtn>
              </MiniWorkspace>
              <div className="flex flex-1 items-center justify-center gap-3">
                <Palette kinds={level.palette} world={world} onAdd={addBlock} disabled={locked} t={t} />
                <RunButton running={isRunning} onClick={runOrStop} disabled={!!result || program.main.length === 0} labels={t.ui} />
              </div>
            </>
          ) : (
            <>
              {/* Code-Brücke: Umschalter Blöcke ↔ Echter Code
                  Handy: immer nur ein Bereich, dafür in voller Höhe · Tablet: beide sichtbar */}
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-black/25 p-1" role="tablist">
                {world.showText && bubble && blockCount > 0 && !bubbleOpen && (
                  <button
                    type="button"
                    aria-label="💡"
                    onClick={() => {
                      play('click');
                      setBubbleOpen(true);
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-lg shadow"
                  >
                    💡
                  </button>
                )}
                {[
                  { on: false, label: `🧩 ${t.ui.myProgram}` },
                  { on: true, label: pro ? t.pro.codeToggle : t.code.toggle },
                ].map((tab) => (
                  <button
                    key={String(tab.on)}
                    type="button"
                    role="tab"
                    aria-selected={showCode === tab.on}
                    onClick={() => {
                      play('click');
                      setShowCode(tab.on);
                    }}
                    className={`flex min-h-[40px] flex-1 items-center justify-center rounded-full px-2 text-center text-xs font-bold leading-tight transition sm:text-sm ${
                      showCode === tab.on ? (tab.on ? 'bg-slate-900 text-yellow-300 shadow-lg' : 'bg-white text-slate-800 shadow-lg') : 'text-white/85'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div
                className={`thin-scroll min-h-[110px] flex-1 overflow-y-auto rounded-[1.8rem] bg-black/15 p-2 shadow-inner ${showCode ? 'hidden md:block' : ''}`}
              >
                <Workspace
                  program={program}
                  group={level.group}
                  frame={frame}
                  frameIndex={frameIndex}
                  pulseMs={stepMs}
                  target={target}
                  setTarget={(t) => {
                    setTarget(t);
                    play('click');
                  }}
                  remove={remove}
                  update={update}
                  locked={locked}
                  showMacro={hasMacro}
                  t={t}
                />
              </div>
              {showCode && (
                <div className="flex min-h-[110px] flex-1 animate-bounce-in flex-col md:flex-none">
                  <CodeView program={program} lang={codeLang} setLang={setCodeLang} frame={frame} t={t} pro={pro} insight={insight} />
                </div>
              )}

              {/* Aktiver Fokus: Wohin kommt der nächste Block? */}
              {focus && (
                <div
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-bold shadow-lg transition sm:text-sm ${
                    focus.inside ? 'animate-breathe bg-orange-500 text-white ring-4 ring-yellow-300' : 'bg-white/90 text-slate-700'
                  }`}
                >
                  <Crosshair className="h-4 w-4 shrink-0" strokeWidth={3} />
                  <span className="min-w-0 flex-1 leading-tight">{focus.label}</span>
                  {focus.inside && (
                    <button
                      type="button"
                      onClick={() => {
                        play('click');
                        setTarget(focus.exit);
                      }}
                      className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-orange-600 shadow active:scale-95"
                    >
                      <CornerLeftUp className="h-4 w-4 rtl:-scale-x-100" strokeWidth={3} /> {t.loop.exit}
                    </button>
                  )}
                </div>
              )}
              <div className="shrink-0 rounded-[1.8rem] bg-white/25 p-2 shadow-lg backdrop-blur-md">
                <div className={`mb-2 flex items-center justify-between px-1 text-sm font-bold ${world.text}`}>
                  <span className={`rounded-full px-2 transition ${limitFlash ? 'animate-shake bg-red-500 text-white' : ''}`}>
                    🧱 {blockCount} / {level.maxBlocks}
                  </span>
                  {bonus ? (
                    <span>
                      {world.bonus} {t.ui.collectFor3}
                    </span>
                  ) : (
                    <span className={blockCount > 0 && blockCount <= level.parBlocks ? 'text-yellow-300 drop-shadow' : ''}>
                      {t.ui.starsWith(level.parBlocks)}
                    </span>
                  )}
                </div>
                <Palette kinds={level.palette} world={world} onAdd={addBlock} disabled={locked} isKindDisabled={isKindDisabled} t={t} />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <RoundBtn label={t.ui.clearAll} onClick={clearAll} disabled={locked || blockCount === 0} color="#ffffff" dark big>
                  <Trash2 className="h-6 w-6" strokeWidth={2.5} />
                </RoundBtn>
                <RoundBtn label={t.ui.resetSparky} onClick={() => runner.reset()} disabled={locked || !frame} color="#ffffff" dark big>
                  <RotateCcw className="h-6 w-6" strokeWidth={3} />
                </RoundBtn>
                <RoundBtn label={t.pro.undo} onClick={undo} disabled={locked || undoCount === 0} color="#ffffff" dark big>
                  <Undo2 className="h-6 w-6 rtl:-scale-x-100" strokeWidth={3} />
                </RoundBtn>
                <div className="flex-1">
                  <RunButton running={isRunning} onClick={runOrStop} disabled={!!result || blockCount === 0} showText wide labels={t.ui} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {resumed && !frame && !result && <ResumeToast text={t.pro.resumed} />}
      {movieOpen && <MoviePlayer group={level.group} sound={sound} costume={costume} onClose={() => setMovieOpen(false)} />}
      {result?.kind === 'success' && <Confetti />}
      {result && (
        <ResultOverlay
          kind={result.kind}
          stars={result.stars}
          message={result.message}
          world={world}
          t={t}
          costume={costume}
          newCostume={result.newCostume}
          milestone={result.milestone}
          card={card}
          cardIsNew={result.cardIsNew}
          hasNext={!!nextLevel}
          onRetry={retry}
          onNext={() => nextLevel && props.onOpenLevel(nextLevel.id)}
          onMap={props.onBack}
          onWear={(id) => {
            prog.setCostume(id);
            play('unlock');
            setResult((r) => (r ? { ...r, newCostume: null } : r));
          }}
        />
      )}
    </div>
  );
}

function ResumeToast({ text }: { text: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(id);
  }, []);
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-30 flex justify-center">
      <span className="animate-bounce-in rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg">💾 {text}</span>
    </div>
  );
}

export function RoundBtn(p: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color: string;
  dark?: boolean;
  big?: boolean;
  mini?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      disabled={p.disabled}
      style={{ '--c': p.color } as CSSProperties}
      className={`squish flex items-center justify-center gap-1 rounded-[1.2rem] px-2 ${p.mini ? 'h-[68px] w-[68px] rounded-[1.4rem]' : p.big ? 'h-16 min-w-[64px]' : 'h-12 min-w-[48px]'} ${
        p.dark ? '!text-slate-700 [text-shadow:none]' : ''
      }`}
    >
      {p.children}
    </button>
  );
}

function RunButton(p: {
  running: boolean;
  onClick: () => void;
  disabled: boolean;
  showText?: boolean;
  wide?: boolean;
  labels: { go: string; stop: string; start: string };
}) {
  return (
    <button
      type="button"
      aria-label={p.running ? p.labels.stop : p.labels.start}
      onClick={p.onClick}
      disabled={p.disabled && !p.running}
      style={{ '--c': p.running ? '#ef4444' : '#22c55e' } as CSSProperties}
      className={`squish flex items-center justify-center gap-2 rounded-[1.8rem] text-2xl font-bold ${p.wide ? 'h-16 w-full' : 'h-24 w-[88px] shrink-0'} ${
        !p.running && !p.disabled ? 'animate-breathe' : ''
      }`}
    >
      {p.running ? <Square className="h-9 w-9 fill-white" /> : <Play className="h-10 w-10 fill-white" />}
      {p.showText && <span>{p.running ? p.labels.stop : p.labels.go}</span>}
    </button>
  );
}
