// ─────────────────────────────────────────────────────────────
// Workspace: zeigt das Programm als Glossy-Blöcke. Der gerade
// ausgeführte Block leuchtet golden und pulsiert im Takt der
// Schritte (visuelles Debugging).
// ─────────────────────────────────────────────────────────────
import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { isContainer } from '../engine/program';
import type { AgeGroupId, Block, Frame, InsertTarget, Program } from '../types';
import type { Dict } from '../i18n';
import { BLOCK_META, COND_EMOJI, COND_ORDER, kindOf } from './blockMeta';
import { scrollWithin } from '../scrollWithin';

interface Ctx {
  activeIds: string[];
  currentId: string | null;
  loops: Record<string, number>;
  condResult?: boolean;
  frameIndex: number;
  pulseMs: number;
  target: InsertTarget;
  setTarget: (t: InsertTarget) => void;
  remove: (id: string) => void;
  update: (id: string, patch: (b: Block) => Block) => void;
  locked: boolean;
  group: AgeGroupId;
  root: 'main' | 'macro';
  t: Dict;
}

interface Props {
  program: Program;
  group: AgeGroupId;
  frame: Frame | null;
  frameIndex: number;
  pulseMs: number;
  target: InsertTarget;
  setTarget: (t: InsertTarget) => void;
  remove: (id: string) => void;
  update: (id: string, patch: (b: Block) => Block) => void;
  locked: boolean;
  showMacro: boolean;
  t: Dict;
}

const MAX_COUNT: Record<AgeGroupId, number> = { mini: 4, junior: 6, hero: 30 };

export function Workspace(props: Props) {
  const { program, frame, target, setTarget, showMacro, locked } = props;
  const activeIds = frame?.activeIds ?? [];
  const base = {
    activeIds,
    currentId: activeIds.length ? activeIds[activeIds.length - 1] : null,
    loops: frame?.loops ?? {},
    condResult: frame?.condResult,
    frameIndex: props.frameIndex,
    pulseMs: props.pulseMs,
    target,
    setTarget,
    remove: props.remove,
    update: props.update,
    locked,
    group: props.group,
    t: props.t,
  };
  const selectable = showMacro || program.main.some(isContainer);

  return (
    <div className="flex flex-col gap-3">
      <RootSection
        title={props.t.ui.myProgram}
        emoji="🧩"
        isTarget={target.root === 'main' && target.parentId === null}
        onSelect={() => setTarget({ root: 'main', parentId: null })}
        blocks={program.main}
        ctx={{ ...base, root: 'main' }}
        selectable={selectable}
      />
      {showMacro && (
        <RootSection
          title={props.t.ui.macro}
          emoji="🪄"
          macro
          isTarget={target.root === 'macro' && target.parentId === null}
          onSelect={() => setTarget({ root: 'macro', parentId: null })}
          blocks={program.macro}
          ctx={{ ...base, root: 'macro' }}
          selectable
        />
      )}
    </div>
  );
}

function RootSection(p: {
  title: string;
  emoji: string;
  macro?: boolean;
  isTarget: boolean;
  onSelect: () => void;
  blocks: Block[];
  ctx: Ctx;
  selectable: boolean;
}) {
  const highlighted = p.isTarget && p.selectable;
  return (
    <section
      className={`rounded-3xl p-2 transition ${p.macro ? 'bg-fuchsia-50/95' : 'glass'} ${highlighted ? 'ring-4 ring-yellow-300' : ''}`}
      style={p.macro ? { boxShadow: '0 8px 24px -10px rgba(162,28,175,.6), inset 0 2px 0 #fff' } : undefined}
    >
      <button
        type="button"
        disabled={p.ctx.locked}
        onClick={p.onSelect}
        className="mb-2 flex w-full items-center gap-2 rounded-xl px-2 py-1 text-left text-base font-bold text-slate-700"
      >
        <span className="text-lg">{p.emoji}</span>
        <span>{p.title}</span>
        {highlighted && (
          <span className="ms-auto animate-pop rounded-full bg-yellow-300 px-2 text-xs font-bold text-yellow-900">{p.ctx.t.ui.newBlocksHere}</span>
        )}
      </button>
      <BlockList
        blocks={p.blocks}
        ctx={p.ctx}
        emptyHint={p.macro ? p.ctx.t.ui.emptyMacro : p.ctx.t.ui.emptyMain}
      />
    </section>
  );
}

function BlockList({ blocks, ctx, emptyHint }: { blocks: Block[]; ctx: Ctx; emptyHint: string }) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-2xl border-[3px] border-dashed border-slate-300 px-3 py-3 text-center text-sm font-semibold text-slate-400">
        {emptyHint}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b) => (
        <BlockItem key={b.id} block={b} ctx={ctx} />
      ))}
    </div>
  );
}

/** Goldener Puls-Ring, der bei jedem Schritt neu startet */
function GoldPulse({ ctx }: { ctx: Ctx }) {
  return (
    <span
      key={ctx.frameIndex}
      className="pointer-events-none absolute inset-0 z-10 animate-gold-pulse rounded-[inherit]"
      style={{ ['--pulse' as string]: `${ctx.pulseMs}ms` }}
    />
  );
}

function BlockItem({ block, ctx }: { block: Block; ctx: Ctx }) {
  const meta = BLOCK_META[kindOf(block)];
  const { Icon } = meta;
  const active = ctx.activeIds.includes(block.id);
  const current = ctx.currentId === block.id;
  const ref = useRef<HTMLDivElement>(null);
  const cvar = { '--c': meta.color } as CSSProperties;

  useEffect(() => {
    if (current) scrollWithin(ref.current);
  }, [current, ctx.frameIndex]);

  const removeBtn = (
    <button
      type="button"
      aria-label={ctx.t.ui.removeBlock}
      disabled={ctx.locked}
      onClick={(e) => {
        e.stopPropagation();
        ctx.remove(block.id);
      }}
      className="ms-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/20 text-white active:scale-90 disabled:opacity-40"
    >
      <X className="h-5 w-5" strokeWidth={3} />
    </button>
  );

  if (isContainer(block)) {
    const isTarget = ctx.target.root === ctx.root && ctx.target.parentId === block.id;
    const loopNow = ctx.loops[block.id];
    const maxCount = MAX_COUNT[ctx.group];
    const selectThis = () => !ctx.locked && ctx.setTarget({ root: ctx.root, parentId: block.id });

    return (
      <div
        ref={ref}
        className={`relative rounded-[1.4rem] transition-all duration-200 ${current ? 'gold-glow' : active ? 'ring-2 ring-yellow-200' : ''}`}
        style={{ background: meta.soft, boxShadow: `0 0 0 3px ${meta.color}, 0 6px 0 rgba(0,0,0,.12)` }}
      >
        {current && <GoldPulse ctx={ctx} />}
        <div
          role="button"
          tabIndex={0}
          onClick={selectThis}
          className="squish relative flex min-h-[52px] items-center gap-2 rounded-t-[1.3rem] px-2 py-1.5"
          style={cvar}
        >
          <Icon className="h-6 w-6 shrink-0" strokeWidth={3} />
          <span className="min-w-0 truncate text-lg font-bold">{ctx.t.blocks[kindOf(block)].label}</span>

          {block.type === 'repeat' &&
            (ctx.group === 'hero' ? (
              <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <RoundBtn
                  disabled={ctx.locked || block.count <= 2}
                  onClick={() => ctx.update(block.id, (b) => (b.type === 'repeat' ? { ...b, count: b.count - 1 } : b))}
                  label={ctx.t.ui.less}
                >
                  <Minus className="h-4 w-4" strokeWidth={3} />
                </RoundBtn>
                <span className="min-w-[2.2ch] rounded-lg bg-white px-1.5 text-center text-lg font-bold text-orange-600 [text-shadow:none]">
                  {block.count}×
                </span>
                <RoundBtn
                  disabled={ctx.locked || block.count >= maxCount}
                  onClick={() => ctx.update(block.id, (b) => (b.type === 'repeat' ? { ...b, count: b.count + 1 } : b))}
                  label={ctx.t.ui.more}
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </RoundBtn>
              </div>
            ) : (
              <button
                type="button"
                aria-label={ctx.t.ui.howOften}
                disabled={ctx.locked}
                onClick={(e) => {
                  e.stopPropagation();
                  ctx.update(block.id, (b) => (b.type === 'repeat' ? { ...b, count: b.count >= maxCount ? 2 : b.count + 1 } : b));
                }}
                className="flex h-10 min-w-[54px] shrink-0 items-center justify-center rounded-xl bg-white px-2 text-xl font-bold text-orange-600 shadow active:scale-90 [text-shadow:none]"
              >
                {block.count}×
              </button>
            ))}

          {block.type === 'if' && (
            <button
              type="button"
              disabled={ctx.locked}
              onClick={(e) => {
                e.stopPropagation();
                ctx.update(block.id, (b) =>
                  b.type === 'if' ? { ...b, cond: COND_ORDER[(COND_ORDER.indexOf(b.cond) + 1) % COND_ORDER.length] } : b,
                );
              }}
              className="min-w-0 shrink truncate rounded-xl bg-white px-2 py-1 text-sm font-bold text-cyan-700 shadow active:scale-95 [text-shadow:none]"
            >
              {COND_EMOJI[block.cond]} {ctx.t.conds[block.cond]} ⇄
            </button>
          )}

          <span className="ms-auto flex shrink-0 items-center gap-1">
            {loopNow !== undefined && block.type === 'repeat' && (
              <span className="absolute -top-3 end-12 z-20 animate-pop whitespace-nowrap rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow [text-shadow:none]">
                {ctx.t.ui.round(loopNow, block.count)}
              </span>
            )}
            {current && block.type === 'if' && ctx.condResult !== undefined && (
              <span
                className={`animate-pop rounded-full px-2 text-xs font-bold [text-shadow:none] ${
                  ctx.condResult ? 'bg-green-300 text-green-900' : 'bg-red-200 text-red-800'
                }`}
              >
                {ctx.condResult ? ctx.t.ui.yes : ctx.t.ui.no}
              </span>
            )}
            {removeBtn}
          </span>
        </div>
        <div onClick={selectThis} className={`ms-3 border-s-[5px] py-2 ps-2 pe-2 ${isTarget ? 'bg-yellow-100/90' : ''}`} style={{ borderColor: meta.color }}>
          <BlockList blocks={block.body} ctx={ctx} emptyHint={isTarget ? ctx.t.ui.bodyTarget : ctx.t.ui.bodyTap} />
          {isTarget && block.body.length > 0 && (
            <div className="mt-1.5 rounded-xl border-[3px] border-dashed border-yellow-400 py-0.5 text-center text-xs font-bold text-yellow-700">
              {ctx.t.ui.bodyMore}
            </div>
          )}
        </div>
        <div className="squish h-3 rounded-b-[1.3rem]" style={cvar} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`squish relative flex min-h-[54px] items-center gap-2 rounded-[1.2rem] px-3 py-1.5 transition-all duration-200 ${
        current ? 'gold-glow scale-[1.03]' : active ? 'ring-2 ring-yellow-200' : ''
      }`}
      style={cvar}
    >
      {current && <GoldPulse ctx={ctx} />}
      <Icon className="h-7 w-7 shrink-0" strokeWidth={3} />
      <span className="text-lg font-bold">{block.type === 'call' ? `🪄 ${ctx.t.blocks.call.label}` : ctx.t.blocks[kindOf(block)].label}</span>
      <span className="ms-auto flex items-center">{removeBtn}</span>
    </div>
  );
}

function RoundBtn(p: { onClick: () => void; disabled?: boolean; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={p.label}
      disabled={p.disabled}
      onClick={p.onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/35 active:scale-90 disabled:opacity-40"
    >
      {p.children}
    </button>
  );
}
