// Belohnungs-Bildschirm (Truhe, Glücksrad, Meilenstein) im Stil der Vorlage:
// Lichtstrahlen, rote Banderole, Schatztruhe, Creme-Panel „Du erhältst“, „Super!“
import { useI18n } from '../i18n';
import type { Reward } from '../hooks/useProgress';
import { Confetti } from './Confetti';
import { Sprite, type SpriteName } from './sprites';
import { GameButton, Ribbon, Rays, SkyScene, TreasureChest } from './ui';

interface Props {
  title: string;
  /** veraltet (Emoji) – es wird immer eine eigene Grafik gezeigt */
  icon?: string;
  art?: SpriteName;
  reward: Reward;
  extra?: string;
  onClose: () => void;
}

export function RewardPopup({ title, art = 'chest', reward, extra, onClose }: Props) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden px-6">
      <SkyScene />
      <Confetti count={90} />
      <div className="relative z-10 flex w-full max-w-xs animate-bounce-in flex-col items-center">
        <Ribbon color="red" className="mb-2">
          {title}
        </Ribbon>
        <div className="relative my-2 h-52 w-52">
          <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2">
            <Rays className="h-full w-full" />
          </div>
          <span className="absolute inset-0 animate-float drop-shadow-[0_10px_8px_rgba(0,0,0,.35)]">
            {art === 'chest' ? <TreasureChest className="h-full w-full" /> : <Sprite name={art} />}
          </span>
          <span className="absolute left-2 top-6 h-8 w-8 animate-pulse">
            <Sprite name="gem" />
          </span>
          <span className="absolute bottom-6 right-1 h-9 w-9 animate-pulse">
            <Sprite name="star" />
          </span>
        </div>
        <div className="ui-cream w-full px-4 py-3 text-center">
          <div className="font-game text-[1.2rem] text-[#7a3d00]">{t.ui2.youGet}</div>
          <div className="mt-1 flex items-center justify-center gap-4">
            {reward.stars > 0 && (
              <span className="flex animate-pop items-center gap-1">
                <span className="h-10 w-10">
                  <Sprite name="star" />
                </span>
                <span className="font-game text-[1.8rem] text-[#1b2a55]">+{reward.stars}</span>
              </span>
            )}
            {reward.sticker && (
              <span className="flex animate-pop items-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-[#ffe08a] text-[1.8rem] shadow-[0_0_0_2.5px_#c97a14,0_3px_0_#c97a14]">
                  {reward.sticker}
                </span>
                <span className="font-game text-[1.1rem] text-[#a21caf]">{t.map.newSticker}</span>
              </span>
            )}
          </div>
          {extra && <div className="mt-1 text-sm font-extrabold text-[#c2410c]">{extra}</div>}
        </div>
        <GameButton big className="mt-6 w-full" onClick={onClose}>
          {t.ui2.super}
        </GameButton>
      </div>
    </div>
  );
}
