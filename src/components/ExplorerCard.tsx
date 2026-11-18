// Entdecker-Karte: Konzept + was echte Programmierer damit bauen
import type { CardDef } from '../data/cards';
import type { Dict } from '../i18n';
import { Rocket } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Sprite, type SpriteName } from './sprites';

/** Eigene Grafik je Konzept (statt Emoji) */
export const CARD_ART: Record<string, SpriteName> = {
  sequence: 'footprints', collect: 'berry', avoid: 'bear', loop: 'loop', jump: 'rabbit', keygate: 'key',
  nested: 'crate', efficiency: 'battery', condition: 'split', sensor: 'robot', function: 'wand', teleport: 'planet',
  whileLoop: 'loop', variables: 'disk', logic: 'gate', stateMachine: 'barrier', recursion: 'crystal', parallel: 'robot',
  registers: 'qcore', bigO: 'rocket',
};

interface Props {
  card: CardDef;
  t: Dict;
  isNew?: boolean;
  compact?: boolean;
}

export function ExplorerCard({ card, t, isNew, compact }: Props) {
  const c = t.cards.items[card.id];
  return (
    <div className="ui-panel relative text-start">
      {isNew && (
        <span className="font-game absolute -top-4 end-3 z-10 animate-pop rounded-full border-[3px] border-slate-900/80 bg-gradient-to-b from-[#ff7a7a] to-[#e02f2f] px-3 py-0.5 text-sm text-white shadow-[0_4px_0_rgba(0,0,0,.4)]">
          {t.cards.newCard}
        </span>
      )}
      {/* Farbiger Kopf mit Grafik und Titel */}
      <div className="ui-panel-head flex items-center gap-3 px-3 py-2" style={{ '--c': card.colors[1] } as CSSProperties}>
        <div className="ui-icon-badge h-14 w-14 shrink-0 p-1.5" style={{ '--c': card.colors[0] } as CSSProperties}>
          <Sprite name={CARD_ART[card.id] ?? 'star'} />
        </div>
        <div className="min-w-0">
          {!compact && <div className="text-[11px] font-extrabold uppercase tracking-wide text-white/85">{t.cards.concept}</div>}
          <div className="font-game ui-head-text text-[1.25rem] leading-tight">{c.name}</div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[15px] font-bold leading-snug text-[#1b2a55]">{c.what}</div>
        {card.code && (
          <div dir="ltr" className="mt-2 overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(180deg,#1e1b4b,#0f172a)' }}>
            <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-teal-200">{card.code.lang}</span>
            </div>
            <pre className="thin-scroll overflow-x-auto px-2.5 py-1.5 text-[11.5px] leading-[1.5] text-slate-100" style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>
              {card.code.src}
            </pre>
          </div>
        )}
        <div className="mt-2 rounded-2xl bg-[#eef5ff] p-2 shadow-[inset_0_2px_3px_rgba(0,0,0,.06)]">
          <div className="mb-1 flex items-center gap-1 text-xs font-extrabold text-[#2a62bf]"><Rocket className="h-3.5 w-3.5" strokeWidth={3} /> {t.cards.realWorld}</div>
          {c.real.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm font-semibold leading-snug text-slate-700">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: card.colors[1], boxShadow: `0 0 0 2px ${card.colors[0]}` }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
