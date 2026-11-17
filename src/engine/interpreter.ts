// ─────────────────────────────────────────────────────────────
// Interpreter: führt ein Block-Programm vollständig vorab aus und
// erzeugt eine Liste von Animations-Frames. Die UI spielt diese
// Frames dann nur noch ab – dadurch gibt es keine Race-Conditions
// zwischen Spiel-Logik und Animation.
// ─────────────────────────────────────────────────────────────
import type { Block, Condition, Dir, FailReason, Frame, LevelDef, Program, RunResult, SoundName, WorldState } from '../types';
import { add, initialState, isBlocked, LOW_OBSTACLES, parseMap, posKey, tileAt, TURN_LEFT, TURN_RIGHT } from './world';

/** Sicherheitsnetz gegen extrem lange Programme */
const MAX_ACTIONS = 600;

class Halt {
  constructor(
    public outcome: 'success' | 'fail',
    public reason?: FailReason,
  ) {}
}

const BLOCK_REASON: Record<string, FailReason> = { '#': 'wall', o: 'obstacle', B: 'bear', P: 'puddle', D: 'locked' };

export function runProgram(level: LevelDef, program: Program): RunResult {
  const map = parseMap(level);
  let state: WorldState = initialState(level, map);
  const frames: Frame[] = [];
  const loops: Record<string, number> = {};
  let actions = 0;

  const push = (activeIds: string[], extra: Partial<Frame> = {}) => {
    frames.push({ activeIds, state: cloneState(state), loops: { ...loops }, ...extra });
  };

  const tick = () => {
    actions++;
    if (actions > MAX_ACTIONS) throw new Halt('fail', 'tooLong');
  };

  const bump = (stack: string[], dir: Dir, reason: FailReason): never => {
    push(stack, { motion: 'bump', bumpDir: dir, sound: 'boing' });
    throw new Halt('fail', reason);
  };

  /** Betritt ein Feld (nach Gehen oder Springen) */
  const enter = (stack: string[], target: { x: number; y: number }, motion: 'walk' | 'jump', dir: Dir) => {
    const t = tileAt(map, target);
    if (t === null) bump(stack, dir, 'edge');
    if (isBlocked(map, target, state)) bump(stack, dir, BLOCK_REASON[t!] ?? 'wall');

    let sound: SoundName = motion === 'jump' ? 'jump' : 'step';
    const k = posKey(target);
    state = { ...state, pos: target, dir };
    if (t === '*' && !state.collected.includes(k)) {
      state = { ...state, collected: [...state.collected, k] };
      sound = 'collect';
    }
    if (t === 'K' && !state.hasKey) {
      state = { ...state, hasKey: true };
      sound = 'key';
    }
    if (t === 'D' && !state.openGates.includes(k)) {
      state = { ...state, openGates: [...state.openGates, k] };
      sound = 'gate';
    }
    if (target.x === map.goal.x && target.y === map.goal.y) {
      push(stack, { motion, sound });
      throw new Halt('success');
    }
    const portal = map.teleports[k];
    if (portal) {
      push(stack, { motion, sound });
      push(stack, { motion: 'teleportOut', sound: 'teleport' });
      state = { ...state, pos: portal };
      push(stack, { motion: 'teleportIn' });
      return;
    }
    push(stack, { motion, sound });
  };

  const step = (stack: string[], dir: Dir) => {
    tick();
    enter(stack, add(state.pos, dir), 'walk', dir);
  };

  const jump = (stack: string[]) => {
    tick();
    const dir = state.dir;
    const mid = add(state.pos, dir);
    const midTile = tileAt(map, mid);
    // Über hohe Hindernisse und geschlossene Tore kann man nicht springen
    if (midTile === '#' || (midTile === 'D' && isBlocked(map, mid, state))) bump(stack, dir, 'tooHigh');
    enter(stack, add(state.pos, dir, 2), 'jump', dir);
  };

  const evalCond = (cond: Condition) => {
    const ahead = add(state.pos, state.dir);
    if (cond === 'obstacleAhead') {
      const t = tileAt(map, ahead);
      return t !== null && LOW_OBSTACLES.has(t);
    }
    const blocked = isBlocked(map, ahead, state);
    return cond === 'pathBlocked' ? blocked : !blocked;
  };

  const exec = (blocks: Block[], parentStack: string[], depth: number) => {
    if (depth > 12) throw new Halt('fail', 'tooLong');
    for (const b of blocks) {
      const stack = [...parentStack, b.id];
      switch (b.type) {
        case 'move':
          step(stack, b.dir);
          break;
        case 'jump':
          jump(stack);
          break;
        case 'forward':
          step(stack, state.dir);
          break;
        case 'turnLeft':
        case 'turnRight':
          tick();
          state = { ...state, dir: b.type === 'turnLeft' ? TURN_LEFT[state.dir] : TURN_RIGHT[state.dir] };
          push(stack, { motion: 'turn', sound: 'turn' });
          break;
        case 'repeat':
          for (let i = 0; i < b.count; i++) {
            tick();
            loops[b.id] = i + 1;
            push(stack, { motion: 'think', sound: 'tick' });
            exec(b.body, stack, depth + 1);
          }
          delete loops[b.id];
          break;
        case 'if': {
          tick();
          const ok = evalCond(b.cond);
          push(stack, { motion: 'think', condResult: ok, sound: 'tick' });
          if (ok) exec(b.body, stack, depth + 1);
          break;
        }
        case 'call':
          tick();
          push(stack, { motion: 'think', sound: 'tick' });
          exec(program.macro, stack, depth + 1);
          break;
      }
    }
  };

  push([]);
  let outcome: 'success' | 'fail' = 'fail';
  let reason: FailReason | undefined;

  if (program.main.length === 0) {
    reason = 'empty';
  } else {
    try {
      exec(program.main, [], 0);
      reason = 'notReached';
    } catch (e) {
      if (!(e instanceof Halt)) throw e;
      outcome = e.outcome;
      reason = e.reason;
    }
  }

  return { frames, outcome, reason, starsCollected: state.collected.length };
}

function cloneState(s: WorldState): WorldState {
  return { ...s, pos: { ...s.pos }, collected: [...s.collected], openGates: [...s.openGates] };
}
