// ─────────────────────────────────────────────────────────────
// useProgramRunner – spielt die vorab berechneten Frames ab.
// Ein Lauf-Token (runIdRef) verhindert Race-Conditions: wird ein
// Lauf gestoppt oder neu gestartet, ignorieren alte Timer sich selbst.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from 'react';
import { runProgram } from '../engine/interpreter';
import type { Frame, LevelDef, Program, RunResult, SoundName } from '../types';

export type Speed = 'normal' | 'turbo';

export const STEP_MS: Record<Speed, number> = { normal: 620, turbo: 210 };

interface Options {
  level: LevelDef;
  speed: Speed;
  play: (s: SoundName) => void;
  onFinish: (result: RunResult) => void;
}

export function useProgramRunner({ level, speed, play, onFinish }: Options) {
  const [frame, setFrame] = useState<Frame | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef(0);
  // Refs, damit Änderungen (z. B. Turbo mitten im Lauf) sofort greifen
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const playRef = useRef(play);
  playRef.current = play;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const clearTimer = () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const stop = useCallback(() => {
    runIdRef.current++;
    clearTimer();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setFrame(null);
    setFrameIndex(0);
  }, [stop]);

  const start = useCallback(
    (program: Program) => {
      stop();
      const result = runProgram(level, program);
      const myRun = ++runIdRef.current;
      setIsRunning(true);
      let i = 0;

      const next = () => {
        if (runIdRef.current !== myRun) return; // veralteter Timer
        const f = result.frames[i];
        setFrame(f);
        setFrameIndex(i);
        if (f.sound) playRef.current(f.sound);
        i++;
        const base = STEP_MS[speedRef.current];
        if (i >= result.frames.length) {
          timerRef.current = setTimeout(() => {
            if (runIdRef.current !== myRun) return;
            setIsRunning(false);
            onFinishRef.current(result);
          }, base * 0.9);
          return;
        }
        const wait =
          f.motion === 'think'
            ? base * 0.55
            : f.motion === 'teleportOut' || f.motion === 'teleportIn'
              ? base * 0.6
              : i === 1
                ? base * 0.4
                : base;
        timerRef.current = setTimeout(next, wait);
      };
      next();
    },
    [level, stop],
  );

  // Level-Wechsel oder Unmount: alles aufräumen
  useEffect(() => {
    reset();
    return () => {
      runIdRef.current++;
      clearTimer();
    };
  }, [level, reset]);

  return { frame, frameIndex, isRunning, start, stop, reset };
}
