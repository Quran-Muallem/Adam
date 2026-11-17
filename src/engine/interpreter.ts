// ─────────────────────────────────────────────────────────────
// Interpreter: führt ein Block-Programm vollständig vorab aus und
// erzeugt eine Liste von Animations-Frames. Die UI spielt diese
// Frames dann nur noch ab – dadurch gibt es keine Race-Conditions
// zwischen Spiel-Logik und Animation.
// ─────────────────────────────────────────────────────────────
import type { Block, Dir, FailReason, Frame, LevelDef, Program, RunResult, SoundName, WorldState } from '../types';
import { add, initialState, isBlocked, inBounds, parseMap, posKey, TURN_LEFT, TURN_RIGHT, type ParsedMap } from './world';

/** Sicherheitsnetz gegen extrem lange Programme */
const MAX_ACTIONS = 400;

class Halt {
  constructor(
    public outcome: 'success' | 'fail',
    public reason?: FailReason,
  ) {}
}

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

  /** Betritt ein Feld (nach Gehen oder Springen) */
  const enter = (stack: string[], target: { x: number; y: number }, motion: 'walk' | 'jump', dir: Dir) => {
    if (!inBounds(map, target)) {
      push(stack, { motion: 'bump', bumpDir: dir, sound: 'bump' });
      throw new Halt('fail', 'edge');
    }
    if (isBlocked(map, target)) {
      push(stack, { motion: 'bump', bumpDir: dir, sound: 'bump' });
      throw new Halt('fail', 'rock');
    }
    const tile = map.tiles[target.y][target.x];
    const isGoal = target.x === map.goal.x && target.y === map.goal.y;

    if (isGoal && map.goalIsChest && !state.hasKey) {
      // Vor der verschlossenen Truhe abprallen
      push(stack, { motion: 'bump', bumpDir: dir, sound: 'bump' });
      throw new Halt('fail', 'locked');
    }

    let sound: SoundName = motion === 'jump' ? 'jump' : 'step';
    state = { ...state, pos: target, dir };
    if (tile === '*' && !state.collected.includes(posKey(target))) {
      state = { ...state, collected: [...state.collected, posKey(target)] };
      sound = 'collect';
    }
    if (tile === 'K' && !state.hasKey) {
      state = { ...state, hasKey: true };
      sound = 'key';
    }
    if (isGoal) {
      if (map.goalIsChest) state = { ...state, chestOpen: true };
      push(stack, { motion, sound });
      throw new Halt('success');
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
    enter(stack, add(state.pos, dir, 2), 'jump', dir);
  };

  const evalCond = (cond: 'pathClear' | 'pathBlocked', m: ParsedMap) => {
    const blocked = isBlocked(m, add(state.pos, state.dir));
    return cond === 'pathBlocked' ? blocked : !blocked;
  };

  const exec = (blocks: Block[], parentStack: string[], depth: number) => {
    if (depth > 12) throw new Halt('fail', 'tooLong');
    for (const b of blocks) {
      const stack = [...parentStack, b.id];
      switch (b.type) {
        case 'move':
          for (let i = 0; i < b.times; i++) {
            if (b.times > 1) loops[b.id] = i + 1;
            step(stack, b.dir);
          }
          delete loops[b.id];
          break;
        case 'jump':
          for (let i = 0; i < b.times; i++) {
            if (b.times > 1) loops[b.id] = i + 1;
            jump(stack);
          }
          delete loops[b.id];
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
            push(stack, { motion: 'think', sound: 'click' });
            exec(b.body, stack, depth + 1);
          }
          delete loops[b.id];
          break;
        case 'if': {
          tick();
          const ok = evalCond(b.cond, map);
          push(stack, { motion: 'think', condResult: ok, sound: 'click' });
          if (ok) exec(b.body, stack, depth + 1);
          break;
        }
        case 'call':
          tick();
          push(stack, { motion: 'think', sound: 'click' });
          // Makro darf sich nicht selbst aufrufen
          exec(
            program.macro.filter((m) => m.type !== 'call'),
            stack,
            depth + 1,
          );
          break;
      }
    }
  };

  // Startframe
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
  return { ...s, pos: { ...s.pos }, collected: [...s.collected] };
}
