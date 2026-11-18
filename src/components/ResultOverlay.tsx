// Erfolg-/Fehler-Dialog mit hüpfendem Sparky, Sternen und Kostüm-Belohnung
import { Home, Play, RotateCcw } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { CardDef } from '../data/cards';
import type { Costume, CostumeId } from '../data/costumes';
import { ExplorerCard } from './ExplorerCard';
import type { Reward } from '../hooks/useProgress';
import type { WorldConfig } from '../data/worlds';
import type { Dict } from '../i18n';
import { Sparky } from './Sparky';
import { Sprite } from './sprites';
import { GameButton, noEmoji, Ribbon, Rays, SkyScene } from './ui';

interface Props {
  kind: 'success' | 'fail';
  stars: number;
  message: string;
  world: WorldConfig;
  t: Dict;
  costume: CostumeId;
  newCostume: Costume | null;
  milestone?: Reward | null;
  card: CardDef;
  cardIsNew: boolean;
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
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden">
      <SkyScene />
      <div className="thin-scroll relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-5 pb-6 pt-6">
        <div className="flex w-full max-w-sm animate-bounce-in flex-col items-center">
          {success && (
            <div className="relative z-20 -mb-3 flex items-end justify-center gap-1">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`animate-pop ${i === 2 ? 'h-[4.6rem] w-[4.6rem]' : 'h-14 w-14'} ${i <= p.stars ? 'drop-shadow-[0_0_12px_rgba(255,220,80,.9)]' : 'opacity-60 grayscale'}`}
                  style={{ animationDelay: `${0.2 + 0.18 * i}s` }}
                >
                  <Sprite name="star" />
                </span>
              ))}
            </div>
          )}
          <Ribbon color={success ? 'red' : 'purple'} className="z-10">
            {success ? p.t.ui2.levelDone : p.t.ui2.almost}
          </Ribbon>

          <div className="relative my-1 h-48 w-48">
            <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2">
              <Rays className="h-full w-full" color={success ? '#fff6c2' : '#e0f2ff'} />
            </div>
            <div className="absolute inset-0">
              <Sparky mood={success ? 'happy' : 'sad'} costume={p.costume} large />
            </div>
          </div>

          <div className="ui-cream relative z-10 w-full px-4 py-3 text-center">
            {success && <div className="font-game text-[1.2rem] text-[#7a3d00]">{p.t.ui2.yourReward}</div>}
            {success && (
              <div className="mt-1 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="h-10 w-10">
                    <Sprite name="star" />
                  </span>
                  <span className="font-game text-[1.8rem] text-[#1b2a55]">+{p.stars}</span>
                </span>
                {p.milestone && p.milestone.stars > 0 && (
                  <span className="flex animate-pop items-center gap-1">
                    <span className="h-10 w-10">
                      <Sprite name="chest" />
                    </span>
                    <span className="font-game text-[1.8rem] text-[#1b2a55]">+{p.milestone.stars}</span>
                  </span>
                )}
                {p.milestone?.sticker && <span className="text-[2rem] leading-none">{p.milestone.sticker}</span>}
              </div>
            )}
            {showText ? (
              <p className={`whitespace-pre-line text-[15px] font-extrabold leading-snug text-[#5a3410] ${success ? 'mt-1' : ''}`}>{noEmoji(p.message)}</p>
            ) : (
              !success && (
                <span className="mx-auto block h-12 w-12">
                  <Sprite name="lock" />
                </span>
              )
            )}
          </div>

          {p.newCostume && (
            <button
              type="button"
              onClick={() => p.onWear(p.newCostume!.id)}
              className="squish font-game mt-5 flex w-full animate-pop items-center justify-center gap-2 rounded-[1.4rem] px-3 py-2 text-[1.05rem]"
              style={{ '--c': '#c026d3' } as CSSProperties}
            >
              <span className="h-12 w-12 shrink-0">
                <Sparky mood="happy" costume={p.newCostume.id} />
              </span>
              <span className="text-start leading-tight">{showText ? p.t.result.newCostume('', p.t.costumes[p.newCostume.id]).replace(/\s{2,}/g, ' ') : '✓'}</span>
            </button>
          )}

          {success && (
            <div className="mt-6 w-full">
              <ExplorerCard card={p.card} t={p.t} isNew={p.cardIsNew} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-center gap-3 px-5 pb-5 pt-2">
        <GameButton color="blue" label={p.t.ui2.menu} onClick={p.onMap} className="flex-1 !px-3">
          <Home className="h-7 w-7" strokeWidth={3} />
          {showText && <span>{p.t.ui2.menu}</span>}
        </GameButton>
        {(!success || !p.hasNext) && (
          <GameButton color="orange" label={p.t.result.retry} onClick={p.onRetry} className="flex-1 !px-3">
            <RotateCcw className="h-7 w-7" strokeWidth={3} />
            {showText && <span>{p.t.result.retry}</span>}
          </GameButton>
        )}
        {success && p.hasNext && (
          <>
            <button
              type="button"
              aria-label={p.t.result.retry}
              onClick={p.onRetry}
              className="ui-icon-btn flex h-14 w-14 shrink-0 items-center justify-center"
            >
              <RotateCcw className="h-7 w-7 text-[#1f4fa8]" strokeWidth={3} />
            </button>
            <GameButton color="green" label={p.t.result.next} onClick={p.onNext} className="flex-[1.3] !px-3">
              <Play className="h-7 w-7 fill-white rtl:rotate-180" strokeWidth={2.5} />
              {showText && <span>{p.t.result.next}</span>}
            </GameButton>
          </>
        )}
      </div>
    </div>
  );
}
