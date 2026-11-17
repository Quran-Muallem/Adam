// ─────────────────────────────────────────────────────────────
// Workspace: zeigt das Programm. Der gerade ausgeführte Block
// leuchtet auf (visuelles Debugging).
// ─────────────────────────────────────────────────────────────
import { Minus, Plus, WandSparkles, X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import type { AgeGroupConfig } from '../data/ageGroups';
import { isContainer } from '../engine/program';
import type { Block, Frame, InsertTarget, Program } from '../types';
import { BLOCK_META, COND_LABEL, kindOf } from './blockMeta';

interface Ctx {
  activeIds: string[];
  currentId: string | null;
  loops: Record<string, number>;
  condResult?: boolean;
  target: InsertTarget;
  setTarget: (t: InsertTarget) => void;
  remove: (id: string) => void;
  update: (id: string, patch: (b: Block) => Block) => void;
  locked: boolean;
  allowTimes: boolean;
  root: 'main' | 'macro';
}

interface Props {
  program: Program;
  group: AgeGroupConfig;
  frame: Frame | null;
  target: InsertTarget;
  setTarget: (t: InsertTarget) => void;
  remove: (id: string) => void;
  update: (id: string, patch: (b: Block) => Block) => void;
  locked: boolean;
  showMacro: boolean;
}

export function Workspace(props: Props) {
  const { program, frame, target, setTarget, showMacro, group, locked } = props;
  const activeIds = frame?.activeIds ?? [];
  const base = {
    activeIds,
    currentId: activeIds.length ? activeIds[activeIds.length - 1] : null,
    loops: frame?.loops ?? {},
    condResult: frame?.condResult,
    target,
    setTarget,
    remove: props.remove,
    update: props.update,
    locked,
    allowTimes: group.allowTimes,
  };

  return (
    <div className="flex flex-col gap-3">
      <RootSection
        title="Hauptprogramm"
        emoji="🧩"
        isTarget={target.root === 'main' && target.parentId === null}
        onSelect={() => setTarget({ root: 'main', parentId: null })}
        locked={locked}
        blocks={program.main}
        ctx={{ ...base, root: 'main' }}
        selectable={showMacro || program.main.some(isContainer)}
      />
      {showMacro && (
        <RootSection
          title="Zauber-Makro"
          emoji="✨"
          macro
          isTarget={target.root === 'macro' && target.parentId === null}
          onSelect={() => setTarget({ root: 'macro', parentId: null })}
          locked={locked}
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
  locked: boolean;
  blocks: Block[];
  ctx: Ctx;
  selectable: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border-2 p-2 transition ${
        p.macro ? 'border-fuchsia-300 bg-fuchsia-50/90' : 'border-white/70 bg-white/80'
      } ${p.isTarget && p.selectable ? 'ring-4 ring-yellow-300' : ''}`}
    >
      <button
        type="button"
        disabled={p.locked}
        onClick={p.onSelect}
        className="mb-2 flex w-full items-center gap-2 rounded-xl px-2 py-1 text-left text-sm font-extrabold text-slate-700"
      >
        <span>{p.emoji}</span>
        <span>{p.title}</span>
        {p.macro && <WandSparkles className="h-4 w-4 text-fuchsia-500" />}
        {p.isTarget && p.selectable && (
          <span className="ml-auto rounded-full bg-yellow-300 px-2 text-xs text-yellow-900">neue Blöcke hier</span>
        )}
      </button>
      <BlockList blocks={p.blocks} ctx={p.ctx} emptyHint={p.macro ? 'Lege hier Blöcke für deinen Zauber ab' : 'Tippe unten auf Blöcke!'} />
    </section>
  );
}

function BlockList({ blocks, ctx, emptyHint }: { blocks: Block[]; ctx: Ctx; emptyHint: string }) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 px-3 py-3 text-center text-sm font-semibold text-slate-400">
        {emptyHint}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((b) => (
        <BlockItem key={b.id} block={b} ctx={ctx} />
      ))}
    </div>
  );
}

function BlockItem({ block, ctx }: { block: Block; ctx: Ctx }) {
  const meta = BLOCK_META[kindOf(block)];
  const { Icon } = meta;
  const active = ctx.activeIds.includes(block.id);
  const current = ctx.currentId === block.id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (current) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current]);

  const glow = current
    ? 'ring-4 ring-yellow-300 scale-[1.03] shadow-[0_0_18px_rgba(253,224,71,0.9)] brightness-110'
    : active
      ? 'ring-2 ring-yellow-200'
      : '';

  const removeBtn = (
    <button
      type="button"
      aria-label="Block entfernen"
      disabled={ctx.locked}
      onClick={(e) => {
        e.stopPropagation();
        ctx.remove(block.id);
      }}
      className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-white active:scale-90 disabled:opacity-40"
    >
      <X className="h-4 w-4" />
    </button>
  );

  if (isContainer(block)) {
    const isTarget = ctx.target.root === ctx.root && ctx.target.parentId === block.id;
    const loopNow = ctx.loops[block.id];
    return (
      <div ref={ref} className={`rounded-2xl border-2 ${meta.border} ${meta.soft} transition-all duration-200 ${glow}`}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => !ctx.locked && ctx.setTarget({ root: ctx.root, parentId: block.id })}
          className={`flex min-h-[48px] items-center gap-2 rounded-t-xl ${meta.color} px-2 py-1.5 text-white`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className="font-extrabold">{meta.label}</span>

          {block.type === 'repeat' && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <RoundBtn
                disabled={ctx.locked || block.count <= 1}
                onClick={() => ctx.update(block.id, (b) => (b.type === 'repeat' ? { ...b, count: b.count - 1 } : b))}
                label="weniger"
              >
                <Minus className="h-4 w-4" />
              </RoundBtn>
              <span className="min-w-[2ch] rounded-lg bg-white px-1.5 text-center text-lg font-black text-orange-600">
                {block.count}
              </span>
              <RoundBtn
                disabled={ctx.locked || block.count >= 20}
                onClick={() => ctx.update(block.id, (b) => (b.type === 'repeat' ? { ...b, count: b.count + 1 } : b))}
                label="mehr"
              >
                <Plus className="h-4 w-4" />
              </RoundBtn>
              <span className="font-bold">mal</span>
            </div>
          )}

          {block.type === 'if' && (
            <button
              type="button"
              disabled={ctx.locked}
              onClick={(e) => {
                e.stopPropagation();
                ctx.update(block.id, (b) =>
                  b.type === 'if' ? { ...b, cond: b.cond === 'pathBlocked' ? 'pathClear' : 'pathBlocked' } : b,
                );
              }}
              className="rounded-lg bg-white px-2 py-0.5 text-sm font-extrabold text-cyan-700 active:scale-95"
            >
              {block.cond === 'pathBlocked' ? '🚧 ' : '🟢 '}
              {COND_LABEL[block.cond]} ⇄
            </button>
          )}

          <span className="ml-auto flex items-center gap-1">
            {loopNow !== undefined && block.type === 'repeat' && (
              <span className="rounded-full bg-yellow-300 px-2 text-xs font-black text-yellow-900">
                Runde {loopNow}/{block.count}
              </span>
            )}
            {current && block.type === 'if' && ctx.condResult !== undefined && (
              <span className={`rounded-full px-2 text-xs font-black ${ctx.condResult ? 'bg-green-300 text-green-900' : 'bg-red-200 text-red-800'}`}>
                {ctx.condResult ? 'Ja!' : 'Nein'}
              </span>
            )}
            {removeBtn}
          </span>
        </div>
        <div
          onClick={() => !ctx.locked && ctx.setTarget({ root: ctx.root, parentId: block.id })}
          className={`ml-3 border-l-4 ${meta.border} py-1.5 pl-2 pr-1.5 ${isTarget ? 'bg-yellow-100/80' : ''}`}
        >
          <BlockList blocks={block.body} ctx={ctx} emptyHint={isTarget ? 'Neue Blöcke landen hier ⬇' : 'Tippe hier, dann auf Blöcke'} />
          {isTarget && block.body.length > 0 && (
            <div className="mt-1 rounded-lg border-2 border-dashed border-yellow-400 py-0.5 text-center text-xs font-bold text-yellow-700">
              + neue Blöcke landen hier
            </div>
          )}
        </div>
        <div className={`h-3 rounded-b-xl ${meta.color}`} />
      </div>
    );
  }

  const hasTimes = ctx.allowTimes && (block.type === 'move' || block.type === 'jump');
  const times = block.type === 'move' || block.type === 'jump' ? block.times : 1;
  const loopNow = ctx.loops[block.id];

  return (
    <div
      ref={ref}
      className={`flex min-h-[52px] items-center gap-2 rounded-2xl ${meta.color} px-3 py-1.5 text-white shadow-md transition-all duration-200 ${glow}`}
    >
      <Icon className="h-6 w-6 shrink-0" strokeWidth={3} />
      <span className="text-lg font-extrabold">{block.type === 'call' ? '✨ Zauber-Makro' : meta.label}</span>
      <span className="ml-auto flex items-center gap-1">
        {hasTimes && (
          <button
            type="button"
            disabled={ctx.locked}
            aria-label="Wie oft?"
            onClick={() =>
              ctx.update(block.id, (b) =>
                b.type === 'move' || b.type === 'jump' ? { ...b, times: (b.times % 5) + 1 } : b,
              )
            }
            className="flex h-10 min-w-[52px] items-center justify-center rounded-xl bg-white px-2 text-xl font-black text-slate-800 shadow active:scale-90"
          >
            {loopNow !== undefined ? `${loopNow}/${times}` : `${times}×`}
          </button>
        )}
        {removeBtn}
      </span>
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
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 active:scale-90 disabled:opacity-40"
    >
      {p.children}
    </button>
  );
}
