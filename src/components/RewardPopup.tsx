// Belohnungs-Popup (Truhe, Glücksrad, Meilenstein): Sticker und/oder Bonus-Sterne
import type { CSSProperties } from 'react';
import { useI18n } from '../i18n';
import type { Reward } from '../hooks/useProgress';
import { Confetti } from './Confetti';

interface Props {
  title: string;
  icon: string;
  reward: Reward;
  extra?: string;
  onClose: () => void;
}

export function RewardPopup({ title, icon, reward, extra, onClose }: Props) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-indigo-950/60 p-6 backdrop-blur-sm" onClick={onClose}>
      <Confetti count={90} />
      <div className="glass w-full max-w-xs animate-bounce-in rounded-[2rem] p-5 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="animate-wiggle text-6xl">{icon}</div>
        <h3 className="mt-1 text-xl font-bold text-slate-800">{title}</h3>
        <div className="my-3 flex flex-col items-center gap-2">
          {reward.sticker && (
            <div className="flex flex-col items-center">
              <span className="flex h-24 w-24 animate-pop items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-200 to-pink-200 text-6xl shadow-lg">
                {reward.sticker}
              </span>
              <span className="mt-1 text-sm font-bold text-fuchsia-600">{t.map.newSticker}</span>
            </div>
          )}
          {reward.stars > 0 && <span className="animate-pop text-2xl font-bold text-amber-500">⭐ {t.map.bonusStars(reward.stars)}</span>}
          {extra && <span className="text-sm font-bold text-orange-500">{extra}</span>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="squish flex h-14 w-full items-center justify-center rounded-[1.4rem] text-xl font-bold"
          style={{ '--c': '#22c55e' } as CSSProperties}
        >
          👍
        </button>
      </div>
    </div>
  );
}
