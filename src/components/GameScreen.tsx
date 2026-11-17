// ─────────────────────────────────────────────────────────────
// GameScreen: Spielfeld + Programm + Palette + Steuerung
// ─────────────────────────────────────────────────────────────
import { ChevronLeft, Lightbulb, Play, RotateCcw, Square, Star, Trash2, Turtle, Volume2, VolumeX, Zap } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AGE_GROUPS } from '../data/ageGroups';
import { levelsFor } from '../data/levels';
import { FAIL_MESSAGES, pick, WIN_MESSAGES } from '../data/messages';
import {
  countProgram,
  createBlock,
  emptyProgram,
  insertBlock,
  isContainer,
  removeBlock,
  targetExists,
  updateBlock,
} from '../engine/program';
import { rate } from '../engine/rating';
import { STEP_MS, useProgramRunner, type Speed } from '../hooks/useProgramRunner';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { Block, InsertTarget, LevelDef, PaletteKind, Program, RunResult } from '../types';
import { Board } from './Board';
import { Confetti } from './Confetti';
import { MiniWorkspace } from './MiniWorkspace';
import { Palette } from './Palette';
import { ResultOverlay } from './ResultOverlay';
import { Workspace } from './Workspace';

interface Props {
  level: LevelDef;
  sound: SoundApi;
  speed: Speed;
  onToggleSpeed: () => void;
  bestStars: number;
  onSaveStars: (levelId: string, stars: number) => void;
  onBack: () => void;
  onOpenLevel: (id: string) => void;
}

const MAIN_TARGET: InsertTarget = { root: 'main', parentId: null };

export function GameScreen({ level, sound, speed, onToggleSpeed, bestStars, onSaveStars, onBack, onOpenLevel }: Props) {
  const group = AGE_GROUPS[level.group];
  const { play } = sound;
  const isMini = level.group === 'mini';
  const hasMacro = level.palette.includes('call');

  const [program, setProgram] = useState<Program>(emptyProgram);
  const [target, setTarget] = useState<InsertTarget>(MAIN_TARGET);
  const [result, setResult] = useState<{ kind: 'success' | 'fail'; stars: number; message: string } | null>(null);
  const [limitFlash, setLimitFlash] = useState(false);
  const programRef = useRef(program);
  programRef.current = program;

  const siblings = levelsFor(level.group);
  const index = siblings.findIndex((l) => l.id === level.id);
  const nextLevel = siblings[index + 1];
  const blockCount = countProgram(program);

  const handleFinish = useCallback(
    (res: RunResult) => {
      if (res.outcome === 'success') {
        const stars = rate(level, res, countProgram(programRef.current));
        play('win');
        onSaveStars(level.id, stars);
        setResult({ kind: 'success', stars, message: pick(WIN_MESSAGES) });
      } else {
        play('fail');
        setResult({ kind: 'fail', stars: 0, message: pick(FAIL_MESSAGES[res.reason ?? 'notReached']) });
      }
    },
    [level, onSaveStars, play],
  );

  const runner = useProgramRunner({ level, speed, play, onFinish: handleFinish });
  const { frame, frameIndex, isRunning } = runner;
  const locked = isRunning || result !== null;

  // ── Programm bearbeiten ──
  const addBlock = (kind: PaletteKind) => {
    if (locked) return;
    if (blockCount >= level.maxBlocks) {
      play('bump');
      setLimitFlash(true);
      setTimeout(() => setLimitFlash(false), 500);
      return;
    }
    // Wurde der Figur-Zustand nach einem Lauf noch nicht zurückgesetzt? Jetzt tun.
    if (frame) runner.reset();
    const block = createBlock(kind);
    const t = targetExists(program, target) ? target : MAIN_TARGET;
    setProgram((p) => insertBlock(p, t, block));
    if (isContainer(block)) setTarget({ root: t.root, parentId: block.id });
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

  const clearAll = () => {
    if (locked) return;
    runner.reset();
    setProgram(emptyProgram());
    setTarget(MAIN_TARGET);
    play('remove');
  };

  const runOrStop = () => {
    if (result) return;
    if (isRunning) {
      runner.stop();
      play('click');
      return;
    }
    play('click');
    runner.start(program);
  };

  const retry = () => {
    setResult(null);
    runner.reset();
    play('click');
  };

  const mood = result?.kind === 'fail' ? 'sad' : result?.kind === 'success' ? 'happy' : 'normal';
  const isKindDisabled = useMemo(
    () => (k: PaletteKind) => k === 'call' && target.root === 'macro',
    [target.root],
  );

  const pageText = group.id === 'hero' ? 'text-white' : 'text-slate-800';

  return (
    <div className={`safe-area flex h-[100dvh] flex-col bg-gradient-to-br ${group.theme.page}`}>
      {/* ── Kopfzeile ── */}
      <header className="flex items-center gap-2 px-3 pt-2">
        <IconBtn label="Zurück" onClick={onBack}>
          <ChevronLeft className="h-7 w-7" strokeWidth={3} />
        </IconBtn>
        <div className={`flex min-w-0 flex-1 flex-col leading-tight ${pageText}`}>
          <span className="truncate text-lg font-extrabold">
            {group.showText ? `Level ${index + 1}: ${level.title}` : `${group.emoji} ${index + 1}`}
          </span>
          <span className="flex">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i <= bestStars ? 'fill-yellow-300 text-yellow-400' : 'text-white/60'}`}
              />
            ))}
          </span>
        </div>
        <IconBtn label={speed === 'turbo' ? 'Turbo an' : 'Normal'} onClick={onToggleSpeed} active={speed === 'turbo'}>
          {speed === 'turbo' ? <Zap className="h-6 w-6 fill-yellow-300" /> : <Turtle className="h-6 w-6" />}
          {group.showText && <span className="hidden text-sm font-bold sm:inline">{speed === 'turbo' ? 'Turbo' : 'Normal'}</span>}
        </IconBtn>
        <IconBtn label={sound.muted ? 'Ton an' : 'Ton aus'} onClick={sound.toggleMute}>
          {sound.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </IconBtn>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 md:flex-row md:gap-5">
        {/* ── Spielfeld ── */}
        <div
          className={`flex shrink-0 flex-col gap-2 md:w-1/2 md:shrink md:justify-center ${
            isMini ? '[--board-h:36dvh]' : '[--board-h:25dvh]'
          } md:[--board-h:65dvh]`}
        >
          <Board
            level={level}
            group={group}
            frame={frame}
            frameIndex={frameIndex}
            stepMs={STEP_MS[speed]}
            mood={mood}
          />
          {group.showText && (
            <div className="flex items-start gap-2 rounded-2xl bg-white/85 px-3 py-1.5 text-xs font-semibold sm:text-sm text-slate-700 shadow">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className="flex-1">{level.hint}</span>
            </div>
          )}
        </div>

        {/* ── Programmierbereich ── */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 md:w-1/2">
          {isMini ? (
            <>
              <MiniWorkspace blocks={program.main} slots={level.maxBlocks} frame={frame} locked={locked} remove={remove} />
              <div className="flex flex-1 items-center justify-center gap-4">
                <Palette kinds={level.palette} group={group} onAdd={addBlock} disabled={locked} />
                <div className="flex flex-col items-center gap-3">
                  <RunButton running={isRunning} onClick={runOrStop} disabled={!!result || program.main.length === 0} showText={false} />
                  <div className="flex gap-2">
                    <SmallCtl label="Zurücksetzen" onClick={() => runner.reset()} disabled={locked || !frame}>
                      <RotateCcw className="h-7 w-7" />
                    </SmallCtl>
                    <SmallCtl label="Alles löschen" onClick={clearAll} disabled={locked || program.main.length === 0}>
                      <Trash2 className="h-7 w-7" />
                    </SmallCtl>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="thin-scroll min-h-[120px] flex-1 overflow-y-auto rounded-3xl bg-black/10 p-2">
                <Workspace
                  program={program}
                  group={group}
                  frame={frame}
                  target={target}
                  setTarget={(t) => {
                    setTarget(t);
                    play('click');
                  }}
                  remove={remove}
                  update={update}
                  locked={locked}
                  showMacro={hasMacro}
                />
              </div>

              <div className="rounded-3xl bg-white/25 p-2 backdrop-blur-sm">
                <div className={`mb-2 flex items-center justify-between px-1 text-sm font-extrabold ${pageText}`}>
                  <span className={`rounded-full px-2 transition ${limitFlash ? 'animate-shake bg-red-500 text-white' : ''}`}>
                    🧱 {blockCount} / {level.maxBlocks} Blöcke
                  </span>
                  {level.group === 'hero' && (
                    <span className={blockCount <= level.par ? 'text-yellow-300' : ''}>⭐⭐⭐ bei ≤ {level.par}</span>
                  )}
                  {level.group === 'junior' && <span>Sammle die ⭐!</span>}
                </div>
                <Palette
                  kinds={level.palette}
                  group={group}
                  onAdd={addBlock}
                  disabled={locked}
                  isKindDisabled={isKindDisabled}
                />
              </div>

              <div className="flex items-center gap-2">
                <SmallCtl label="Alles löschen" onClick={clearAll} disabled={locked || blockCount === 0}>
                  <Trash2 className="h-6 w-6" />
                </SmallCtl>
                <SmallCtl label="Figur zurücksetzen" onClick={() => runner.reset()} disabled={locked || !frame}>
                  <RotateCcw className="h-6 w-6" />
                </SmallCtl>
                <div className="flex-1">
                  <RunButton running={isRunning} onClick={runOrStop} disabled={!!result || blockCount === 0} showText wide />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {result?.kind === 'success' && <Confetti />}
      {result && (
        <ResultOverlay
          kind={result.kind}
          stars={result.stars}
          message={result.message}
          group={group}
          hasNext={!!nextLevel}
          onRetry={retry}
          onNext={() => nextLevel && onOpenLevel(nextLevel.id)}
          onLevels={onBack}
        />
      )}
    </div>
  );
}

function IconBtn(p: { label: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      className={`flex h-12 min-w-[48px] items-center justify-center gap-1 rounded-2xl px-2 shadow-md active:scale-95 ${
        p.active ? 'bg-yellow-400 text-yellow-950' : 'bg-white/90 text-slate-700'
      }`}
    >
      {p.children}
    </button>
  );
}

function SmallCtl(p: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      disabled={p.disabled}
      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 text-slate-600 shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none disabled:opacity-40"
    >
      {p.children}
    </button>
  );
}

function RunButton(p: { running: boolean; onClick: () => void; disabled: boolean; showText: boolean; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-label={p.running ? 'Stopp' : 'Start'}
      onClick={p.onClick}
      disabled={p.disabled && !p.running}
      className={`flex h-20 items-center justify-center gap-2 rounded-3xl text-2xl font-black text-white shadow-[0_6px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none disabled:opacity-50 ${
        p.wide ? 'w-full' : 'w-24'
      } ${p.running ? 'bg-red-500' : 'bg-green-500'} ${!p.running && !p.disabled ? 'animate-pulse' : ''}`}
    >
      {p.running ? <Square className="h-9 w-9 fill-white" /> : <Play className="h-10 w-10 fill-white" />}
      {p.showText && <span>{p.running ? 'Stopp' : 'Los!'}</span>}
    </button>
  );
}
