// Erfolg-/Fehler-Dialog mit hüpfendem Sparky, Sternen und Kostüm-Belohnung
import { ArrowRight, Map as MapIcon, RotateCcw, Star } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { Costume, CostumeId } from '../data/costumes';
import type { WorldConfig } from '../data/worlds';
import { Sparky } from './Sparky';

interface Props {
  kind: 'success' | 'fail';
  stars: number;
  message: string;
  world: WorldConfig;
  costume: CostumeId;
  newCostume: Costume | null;
  hasNext: boolean;
  onRetry: () => void;
  onNext: () => void;
  onMap: () => void;
  onWear: (id: CostumeId) => void;
}

export function ResultOverlay(p: Props) {
  const success = p.kind === 'success';
  const showText = p.world.showText;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-indigo-950/55 p-4 backdrop-blur-sm">
      <div className="glass relative w-full max-w-sm animate-bounce-in rounded-[2.4rem] px-6 pb-6 pt-16 text-center">
        <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2">
          <Sparky mood={success ? 'happy' : 'sad'} costume={p.costume} />
        </div>

        {success && (
          <div className="mb-2 flex justify-center gap-1">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`h-16 w-16 animate-pop drop-shadow-[0_4px_0_rgba(0,0,0,.15)] ${
                  i <= p.stars ? 'fill-yellow-300 text-amber-500' : 'fill-slate-200 text-slate-300'
                } ${i === 2 ? '-translate-y-3' : ''}`}
                style={{ animationDelay: `${0.2 + 0.18 * i}s` }}
                strokeWidth={2}
              />
            ))}
          </div>
        )}

        {showText ? (
          <p className="mb-4 text-xl font-bold text-slate-700">{p.message}</p>
        ) : (
          <p className="mb-4 text-5xl">{success ? '😋' : '🙈'}</p>
        )}

        {p.newCostume && (
          <button
            type="button"
            onClick={() => p.onWear(p.newCostume!.id)}
            className="mb-4 w-full animate-pop rounded-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 px-3 py-2 font-bold text-white shadow-lg"
          >
            🎁 {showText ? `Neues Kostüm: ${p.newCostume.emoji} ${p.newCostume.name}! Anziehen?` : `${p.newCostume.emoji} ✨`}
          </button>
        )}

        <div className="flex items-center justify-center gap-3">
          <Btn onClick={p.onMap} color="#64748b" label="Karte">
            <MapIcon className="h-8 w-8" />
          </Btn>
          <Btn onClick={p.onRetry} color={success ? '#0ea5e9' : '#f97316'} label="Nochmal" big={!success} showText={showText && !success}>
            <RotateCcw className="h-8 w-8" strokeWidth={3} />
          </Btn>
          {success && p.hasNext && (
            <Btn onClick={p.onNext} color="#22c55e" label="Weiter" big showText={showText}>
              <ArrowRight className="h-9 w-9" strokeWidth={3.5} />
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function Btn(p: { onClick: () => void; color: string; label: string; big?: boolean; showText?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      style={{ '--c': p.color } as CSSProperties}
      className={`squish flex items-center justify-center gap-2 rounded-[1.4rem] px-4 font-bold ${p.big ? 'h-20 min-w-[84px] text-xl' : 'h-16 min-w-[64px]'}`}
    >
      {p.children}
      {p.showText && <span>{p.label}</span>}
    </button>
  );
}
