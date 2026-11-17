// Erfolg- / Fehler-Dialog mit Sternen
import type { ReactNode } from 'react';
import { ArrowRight, LayoutGrid, RotateCcw, Star } from 'lucide-react';
import type { AgeGroupConfig } from '../data/ageGroups';

interface Props {
  kind: 'success' | 'fail';
  stars: number;
  message: string;
  group: AgeGroupConfig;
  hasNext: boolean;
  onRetry: () => void;
  onNext: () => void;
  onLevels: () => void;
}

export function ResultOverlay({ kind, stars, message, group, hasNext, onRetry, onNext, onLevels }: Props) {
  const showText = group.showText;
  const success = kind === 'success';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-pop rounded-[2rem] bg-white p-6 text-center shadow-2xl">
        <div className="mb-2 text-7xl">{success ? (stars === 3 ? '🏆' : '🎉') : '🙈'}</div>

        {success && (
          <div className="mb-3 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`h-14 w-14 animate-pop ${i <= stars ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-200 text-slate-300'}`}
                style={{ animationDelay: `${0.15 * i}s` }}
                strokeWidth={2}
              />
            ))}
          </div>
        )}

        {showText && <p className="mb-5 text-xl font-extrabold text-slate-700">{message}</p>}

        <div className="flex items-center justify-center gap-3">
          <OverlayBtn onClick={onLevels} color="bg-slate-400" label="Level-Übersicht" showText={false}>
            <LayoutGrid className="h-8 w-8" />
          </OverlayBtn>
          <OverlayBtn
            onClick={onRetry}
            color={success ? 'bg-sky-500' : 'bg-orange-500'}
            label="Nochmal"
            showText={showText && !success}
            big={!success}
          >
            <RotateCcw className="h-8 w-8" />
          </OverlayBtn>
          {success && hasNext && (
            <OverlayBtn onClick={onNext} color="bg-green-500" label="Weiter" showText={showText} big>
              <ArrowRight className="h-9 w-9" strokeWidth={3} />
            </OverlayBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function OverlayBtn(p: {
  onClick: () => void;
  color: string;
  label: string;
  showText: boolean;
  big?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl ${p.color} px-4 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none ${
        p.big ? 'h-20 min-w-[80px] text-xl' : 'h-16 min-w-[64px]'
      }`}
    >
      {p.children}
      {p.showText && <span>{p.label}</span>}
    </button>
  );
}
