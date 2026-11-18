// Entdecker-Karte: Konzept + was echte Programmierer damit bauen
import type { CardDef } from '../data/cards';
import type { Dict } from '../i18n';

interface Props {
  card: CardDef;
  t: Dict;
  isNew?: boolean;
  compact?: boolean;
}

export function ExplorerCard({ card, t, isNew, compact }: Props) {
  const c = t.cards.items[card.id];
  return (
    <div
      className="relative rounded-[1.6rem] p-[3px] text-start"
      style={{ background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})`, boxShadow: '0 10px 20px -8px rgba(0,0,0,.4)' }}
    >
      {isNew && (
        <span className="absolute -top-3 end-3 z-10 animate-pop rounded-full bg-rose-500 px-3 py-0.5 text-xs font-bold text-white shadow-lg">
          ✨ {t.cards.newCard}
        </span>
      )}
      <div className="rounded-[1.45rem] bg-white/95 p-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${card.colors[0]})`, boxShadow: `inset 0 -3px 0 ${card.colors[1]}55` }}
          >
            {card.emoji}
          </div>
          <div className="min-w-0">
            {!compact && <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{t.cards.concept}</div>}
            <div className="text-lg font-bold leading-tight" style={{ color: card.colors[1] }}>
              {c.name}
            </div>
            <div className="text-sm font-semibold leading-snug text-slate-600">{c.what}</div>
          </div>
        </div>
        <div className="mt-2 rounded-2xl bg-slate-50 p-2">
          <div className="mb-1 text-xs font-bold text-slate-500">🚀 {t.cards.realWorld}</div>
          {c.real.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm font-semibold leading-snug text-slate-700">
              <span className="text-lg leading-none">{card.realEmoji[i]}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
