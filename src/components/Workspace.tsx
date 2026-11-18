// ─────────────────────────────────────────────────────────────
// Workspace: zeigt das Programm als Glossy-Blöcke.
// Schleifen & Bedingungen sind offene "C-Klammern" mit zwei klaren
// Einfüge-Zonen: [+ hier hinein] und [+ danach weitergehen].
// Der gerade ausgeführte Block leuchtet golden (visuelles Debugging).
// ─────────────────────────────────────────────────────────────
import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { isContainer } from '../engine/program';
import type { Dict } from '../i18n';
import { scrollWithin } from '../scrollWithin';
import type { AgeGroupId, Block, Frame, InsertTarget, Program } from '../types';
import { BLOCK_META, COND_EMOJI, COND_ORDER, kindOf } from './blockMeta';

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
const sameTarget = (a: InsertTarget, b: InsertTarget) => a.root === b.root && a.parentId === b.parentId && !a.afterId && !b.afterId;

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

  return (
    <div className="flex flex-col gap-3">
      <RootSection title={props.t.ui.myProgram} emoji="🧩" blocks={program.main} ctx={{ ...base, root: 'main' }} hideTitle={!showMacro} />
      {showMacro && <RootSection title={props.t.ui.macro} emoji="🪄" macro blocks={program.macro} ctx={{ ...base, root: 'macro' }} />}
    </div>
  );
}

function RootSection(p: { title: string; emoji: string; macro?: boolean; blocks: Block[]; ctx: Ctx; hideTitle?: boolean }) {
  const own: InsertTarget = { root: p.ctx.root, parentId: null };
  const active = sameTarget(p.ctx.target, own);
  return (
    <section
      className={`rounded-3xl p-2 transition ${p.macro ? 'bg-fuchsia-50/95' : 'glass'} ${active ? 'ring-4 ring-yellow-300' : ''}`}
      style={p.macro ? { boxShadow: '0 8px 24px -10px rgba(162,28,175,.6), inset 0 2px 0 #fff' } : undefined}
    >
      {!p.hideTitle && (
        <button
          type="button"
          disabled={p.ctx.locked}
          onClick={() => p.ctx.setTarget(own)}
          className="mb-2 flex w-full items-center gap-2 rounded-xl px-2 py-1 text-start text-base font-bold text-slate-700"
        >
          <span className="text-lg">{p.emoji}</span>
          <span>{p.title}</span>
        </button>
      )}
      {p.blocks.length === 0 ? (
        <DropZone active={active} label={p.macro ? p.ctx.t.ui.emptyMacro : p.ctx.t.ui.emptyMain} onClick={() => p.ctx.setTarget(own)} locked={p.ctx.locked} />
      ) : (
        <BlockList blocks={p.blocks} ctx={p.ctx} list={own} />
      )}
    </section>
  );
}

function BlockList({ blocks, ctx, list }: { blocks: Block[]; ctx: Ctx; list: InsertTarget }) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) => (
        <BlockItem key={b.id} block={b} ctx={ctx} list={list} isLast={i === blocks.length - 1} />
      ))}
    </div>
  );
}

/** Gestrichelte, pulsierende Einfüge-Zone */
function DropZone(p: { active: boolean; label: string; onClick: () => void; locked: boolean; small?: boolean; color?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (p.active) scrollWithin(ref.current);
  }, [p.active]);
  return (
    <button
      ref={ref}
      type="button"
      disabled={p.locked}
      onClick={(e) => {
        e.stopPropagation();
        p.onClick();
      }}
      className={`w-full rounded-2xl border-[3px] border-dashed px-3 text-center font-bold transition ${p.small ? 'py-1 text-xs' : 'py-2.5 text-sm'} ${
        p.active ? 'animate-pulse border-yellow-400 bg-yellow-100 text-yellow-800 shadow-[0_0_14px_rgba(250,204,21,.7)]' : 'border-slate-300 bg-white/40 text-slate-500'
      }`}
      style={!p.active && p.color ? { borderColor: `${p.color}88`, color: p.color } : undefined}
    >
      {p.label}
    </button>
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

function BlockItem({ block, ctx, list, isLast }: { block: Block; ctx: Ctx; list: InsertTarget; isLast: boolean }) {
  const meta = BLOCK_META[kindOf(block)];
  const { Icon } = meta;
  const active = ctx.activeIds.includes(block.id);
  const current = ctx.currentId === block.id;
  const ref = useRef<HTMLDivElement>(null);
  const cvar = { '--c': meta.color } as CSSProperties;
  const label = ctx.t.blocks[kindOf(block)].label;

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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/20 text-white active:scale-90 disabled:opacity-40"
    >
      <X className="h-5 w-5" strokeWidth={3} />
    </button>
  );

  if (!isContainer(block)) {
    return (
      <div
        ref={ref}
        className={`squish relative flex min-h-[50px] items-center gap-2 rounded-[1.2rem] px-3 py-1.5 transition-all duration-200 ${
          current ? 'gold-glow scale-[1.03]' : active ? 'ring-2 ring-yellow-200' : ''
        }`}
        style={cvar}
      >
        {current && <GoldPulse ctx={ctx} />}
        <Icon className="h-7 w-7 shrink-0" strokeWidth={3} />
        <span className="min-w-0 flex-1 truncate text-lg font-bold">{block.type === 'call' ? `🪄 ${label}` : label}</span>
        {removeBtn}
      </div>
    );
  }

  // ── C-Klammer für Schleife / Bedingung ──
  const inner: InsertTarget = { root: ctx.root, parentId: block.id };
  const focused = sameTarget(ctx.target, inner);
  const afterActive = ctx.target.afterId === block.id || (isLast && sameTarget(ctx.target, list));
  const loopNow = ctx.loops[block.id];
  const maxCount = MAX_COUNT[ctx.group];

  return (
    <div className="flex flex-col gap-1.5">
      <div
        ref={ref}
        className={`relative rounded-[1.4rem] transition-all duration-200 ${current ? 'gold-glow' : ''} ${
          focused ? 'shadow-[0_0_0_4px_#fde047,0_0_26px_rgba(253,224,71,.85)]' : ''
        }`}
      >
        {current && <GoldPulse ctx={ctx} />}

        {/* Oberer Arm der Klammer */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => !ctx.locked && ctx.setTarget(inner)}
          className="squish relative flex min-h-[50px] items-center gap-2 rounded-t-[1.3rem] rounded-br-[1.3rem] px-2 py-1.5"
          style={cvar}
        >
          <Icon className="h-6 w-6 shrink-0" strokeWidth={3} />
          <span className="min-w-0 truncate text-lg font-bold">{label}</span>

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
                <span className="min-w-[2.2ch] rounded-lg bg-white px-1.5 text-center text-lg font-bold text-orange-600 [text-shadow:none]">{block.count}×</span>
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
                ctx.update(block.id, (b) => (b.type === 'if' ? { ...b, cond: COND_ORDER[(COND_ORDER.indexOf(b.cond) + 1) % COND_ORDER.length] } : b));
              }}
              className="min-w-0 shrink truncate rounded-xl bg-white px-2 py-1 text-sm font-bold text-cyan-700 shadow active:scale-95 [text-shadow:none]"
            >
              {COND_EMOJI[block.cond]} {ctx.t.conds[block.cond]} ⇄
            </button>
          )}

          <span className="ms-auto flex shrink-0 items-center gap-1">
            {current && block.type === 'if' && ctx.condResult !== undefined && (
              <span className={`animate-pop rounded-full px-2 text-xs font-bold [text-shadow:none] ${ctx.condResult ? 'bg-green-300 text-green-900' : 'bg-red-200 text-red-800'}`}>
                {ctx.condResult ? ctx.t.ui.yes : ctx.t.ui.no}
              </span>
            )}
            {removeBtn}
          </span>

          {loopNow !== undefined && block.type === 'repeat' && (
            <span className="absolute -top-3 end-12 z-20 animate-pop whitespace-nowrap rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow [text-shadow:none]">
              {ctx.t.ui.round(loopNow, block.count)}
            </span>
          )}
        </div>

        {/* Rücken der Klammer + offener Innenraum */}
        <div className="flex">
          <div className="squish w-4 shrink-0 rounded-none" style={cvar} />
          <div
            onClick={() => !ctx.locked && ctx.setTarget(inner)}
            className="flex min-w-0 flex-1 flex-col gap-2 py-2 pe-1 ps-2"
            style={{ background: `${meta.soft}cc` }}
          >
            {block.body.length > 0 && <BlockList blocks={block.body} ctx={ctx} list={inner} />}
            <DropZone
              active={focused}
              locked={ctx.locked}
              color={meta.color}
              label={block.type === 'if' ? ctx.t.loop.insideIf : ctx.t.loop.inside}
              onClick={() => ctx.setTarget(inner)}
            />
          </div>
        </div>

        {/* Unterer Arm der Klammer (offen nach rechts) */}
        <div className="squish h-4 w-2/3 rounded-b-[1.3rem] rounded-tr-[1.3rem]" style={cvar} />
      </div>

      {/* Danach weitergehen */}
      <DropZone small active={afterActive} locked={ctx.locked} label={`⤵ ${ctx.t.loop.after}`} onClick={() => ctx.setTarget({ ...list, afterId: block.id })} />
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
