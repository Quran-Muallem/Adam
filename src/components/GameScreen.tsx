// ─────────────────────────────────────────────────────────────
// GameScreen: Spielfeld + Sparky-Sprechblase + Programm + Palette
// ─────────────────────────────────────────────────────────────
import { ChevronLeft, Play, RotateCcw, Square, Star, Trash2, Turtle, Volume2, VolumeX, Zap } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { COSTUMES, type Costume, type CostumeId } from '../data/costumes';
import { levelsFor } from '../data/levels';
import { failMessages, pick, START_LINES, WIN_MESSAGES } from '../data/messages';
import { WORLDS } from '../data/worlds';
import { countProgram, createBlock, emptyProgram, insertBlock, isContainer, removeBlock, targetExists, updateBlock } from '../engine/program';
import { hasBonus, rate } from '../engine/rating';
import { STEP_MS, useProgramRunner, type Speed } from '../hooks/useProgramRunner';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { Block, InsertTarget, LevelDef, PaletteKind, Program, RunResult } from '../types';
import { Board } from './Board';
import { Confetti } from './Confetti';
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
  onToggleSpeed: () => void;
  bestStars: number;
  totalStars: number;
  costume: CostumeId;
  onSaveStars: (levelId: string, stars: number) => void;
  onWear: (id: CostumeId) => void;
  onBack: () => void;
  onOpenLevel: (id: string) => void;
}

const MAIN_TARGET: InsertTarget = { root: 'main', parentId: null };

export function GameScreen(props: Props) {
  const { level, sound, speed, bestStars, totalStars, costume } = props;
  const world = WORLDS[level.group];
  const { play } = sound;
  const isMini = level.group === 'mini';
  const hasMacro = level.palette.includes('call');

  const [program, setProgram] = useState<Program>(emptyProgram);
  const [target, setTarget] = useState<InsertTarget>(MAIN_TARGET);
  const [result, setResult] = useState<{ kind: 'success' | 'fail'; stars: number; message: string; newCostume: Costume | null } | null>(null);
  const [limitFlash, setLimitFlash] = useState(false);
  const [startLine, setStartLine] = useState(START_LINES[0]);
  const programRef = useRef(program);
  programRef.current = program;
  const statsRef = useRef({ bestStars, totalStars });
  statsRef.current = { bestStars, totalStars };

  const siblings = levelsFor(level.group);
  const index = siblings.findIndex((l) => l.id === level.id);
  const nextLevel = siblings[index + 1];
  const blockCount = countProgram(program);
  const bonus = hasBonus(level);

  const handleFinish = useCallback(
    (res: RunResult) => {
      if (res.outcome === 'success') {
        const stars = rate(level, res, countProgram(programRef.current));
        const { bestStars: prevBest, totalStars: prevTotal } = statsRef.current;
        const newTotal = prevTotal - prevBest + Math.max(prevBest, stars);
        const unlocked = COSTUMES.filter((c) => c.stars > prevTotal && c.stars <= newTotal);
        play('win');
        props.onSaveStars(level.id, stars);
        setResult({ kind: 'success', stars, message: pick(WIN_MESSAGES), newCostume: unlocked[unlocked.length - 1] ?? null });
      } else {
        play('fail');
        setResult({ kind: 'fail', stars: 0, message: pick(failMessages(res.reason ?? 'notReached', level.group)), newCostume: null });
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
    play('click');
    if (isRunning) return runner.stop();
    setStartLine(pick(START_LINES));
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

  const isKindDisabled = useMemo(() => (k: PaletteKind) => k === 'call' && target.root === 'macro', [target.root]);
  const bubble = isRunning ? startLine : level.hint;

  return (
    <div className={`safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br ${world.bg}`}>
      <Particles kind={world.particles} />

      {/* ── Kopfzeile ── */}
      <header className="relative z-10 flex items-center gap-2 px-3 pt-2">
        <RoundBtn label="Zur Karte" onClick={props.onBack} color="#ffffff" dark>
          <ChevronLeft className="h-7 w-7" strokeWidth={3} />
        </RoundBtn>
        <div className={`flex min-w-0 flex-1 flex-col leading-tight ${world.text} drop-shadow`}>
          <span className="truncate text-lg font-bold">{world.showText ? `${index + 1}. ${level.title}` : `${world.emoji} ${index + 1}`}</span>
          <span className="flex">
            {[1, 2, 3].map((i) => (
              <Star key={i} className={`h-4 w-4 ${i <= bestStars ? 'fill-yellow-300 text-amber-500' : 'text-white/70'}`} />
            ))}
          </span>
        </div>
        <RoundBtn label={speed === 'turbo' ? 'Turbo' : 'Normal'} onClick={props.onToggleSpeed} color={speed === 'turbo' ? '#facc15' : '#ffffff'} dark>
          {speed === 'turbo' ? <Zap className="h-6 w-6 fill-amber-500 text-amber-700" /> : <Turtle className="h-6 w-6" />}
          {world.showText && <span className="hidden text-sm font-bold sm:inline">{speed === 'turbo' ? 'Turbo' : 'Normal'}</span>}
        </RoundBtn>
        <RoundBtn label={sound.muted ? 'Ton an' : 'Ton aus'} onClick={sound.toggleMute} color="#ffffff" dark>
          {sound.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </RoundBtn>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 p-3 md:flex-row md:gap-5">
        {/* ── Spielfeld ── */}
        <div className={`flex shrink-0 flex-col gap-2 md:w-1/2 md:shrink md:justify-center ${isMini ? '[--board-h:34dvh]' : '[--board-h:27dvh]'} md:[--board-h:62dvh]`}>
          <Board level={level} world={world} frame={frame} frameIndex={frameIndex} stepMs={stepMs} mood={mood} costume={costume} />
          {world.showText && bubble && (
            <div className="flex items-end gap-1">
              <div className="h-11 w-11 shrink-0">
                <Sparky mood={isRunning ? 'think' : 'idle'} costume={costume} />
              </div>
              <div key={bubble} className="glass relative flex-1 animate-bounce-in rounded-2xl rounded-bl-md px-3 py-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
                {bubble}
              </div>
            </div>
          )}
        </div>

        {/* ── Programmierbereich ── */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 md:w-1/2">
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
              />
              <div className="flex flex-1 items-center justify-center gap-4">
                <Palette kinds={level.palette} world={world} onAdd={addBlock} disabled={locked} />
                <div className="flex flex-col items-center gap-3">
                  <RunButton running={isRunning} onClick={runOrStop} disabled={!!result || program.main.length === 0} />
                  <div className="flex gap-2">
                    <RoundBtn label="Zurücksetzen" onClick={() => runner.reset()} disabled={locked || !frame} color="#ffffff" dark big>
                      <RotateCcw className="h-7 w-7" strokeWidth={3} />
                    </RoundBtn>
                    <RoundBtn label="Alles löschen" onClick={clearAll} disabled={locked || program.main.length === 0} color="#ffffff" dark big>
                      <Trash2 className="h-7 w-7" strokeWidth={2.5} />
                    </RoundBtn>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="thin-scroll min-h-[110px] flex-1 overflow-y-auto rounded-[1.8rem] bg-black/15 p-2 shadow-inner">
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
                />
              </div>

              <div className="rounded-[1.8rem] bg-white/25 p-2 shadow-lg backdrop-blur-md">
                <div className={`mb-2 flex items-center justify-between px-1 text-sm font-bold ${world.text}`}>
                  <span className={`rounded-full px-2 transition ${limitFlash ? 'animate-shake bg-red-500 text-white' : ''}`}>
                    🧱 {blockCount} / {level.maxBlocks}
                  </span>
                  {bonus ? (
                    <span>
                      {world.bonus} sammeln = ⭐⭐⭐
                    </span>
                  ) : (
                    <span className={blockCount > 0 && blockCount <= level.parBlocks ? 'text-yellow-300 drop-shadow' : ''}>
                      ⭐⭐⭐ mit ≤ {level.parBlocks} Blöcken
                    </span>
                  )}
                </div>
                <Palette kinds={level.palette} world={world} onAdd={addBlock} disabled={locked} isKindDisabled={isKindDisabled} />
              </div>

              <div className="flex items-center gap-2">
                <RoundBtn label="Alles löschen" onClick={clearAll} disabled={locked || blockCount === 0} color="#ffffff" dark big>
                  <Trash2 className="h-6 w-6" strokeWidth={2.5} />
                </RoundBtn>
                <RoundBtn label="Sparky zurücksetzen" onClick={() => runner.reset()} disabled={locked || !frame} color="#ffffff" dark big>
                  <RotateCcw className="h-6 w-6" strokeWidth={3} />
                </RoundBtn>
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
          world={world}
          costume={costume}
          newCostume={result.newCostume}
          hasNext={!!nextLevel}
          onRetry={retry}
          onNext={() => nextLevel && props.onOpenLevel(nextLevel.id)}
          onMap={props.onBack}
          onWear={(id) => {
            props.onWear(id);
            play('unlock');
            setResult((r) => (r ? { ...r, newCostume: null } : r));
          }}
        />
      )}
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
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      disabled={p.disabled}
      style={{ '--c': p.color } as CSSProperties}
      className={`squish flex items-center justify-center gap-1 rounded-[1.2rem] px-2 ${p.big ? 'h-16 min-w-[64px]' : 'h-12 min-w-[48px]'} ${
        p.dark ? '!text-slate-700 [text-shadow:none]' : ''
      }`}
    >
      {p.children}
    </button>
  );
}

function RunButton(p: { running: boolean; onClick: () => void; disabled: boolean; showText?: boolean; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-label={p.running ? 'Stopp' : 'Start'}
      onClick={p.onClick}
      disabled={p.disabled && !p.running}
      style={{ '--c': p.running ? '#ef4444' : '#22c55e' } as CSSProperties}
      className={`squish flex h-20 items-center justify-center gap-2 rounded-[1.8rem] text-2xl font-bold ${p.wide ? 'w-full' : 'w-24'} ${
        !p.running && !p.disabled ? 'animate-breathe' : ''
      }`}
    >
      {p.running ? <Square className="h-9 w-9 fill-white" /> : <Play className="h-10 w-10 fill-white" />}
      {p.showText && <span>{p.running ? 'Stopp' : 'Los!'}</span>}
    </button>
  );
}
