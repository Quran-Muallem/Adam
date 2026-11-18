// Trophäen-Raum: Abzeichen & Titel + Sticker-Album
import { ChevronLeft, Lock } from 'lucide-react';
import { BADGES, bestTitle, STICKERS } from '../data/rewards';
import type { ProgressApi } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

interface Props {
  sound: SoundApi;
  prog: ProgressApi;
  onBack: () => void;
}

export function Trophies({ sound, prog, onBack }: Props) {
  const { t } = useI18n();
  const title = bestTitle(prog.badges);
  const owned = prog.progress.stickers;

  return (
    <div className="safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500">
      <Particles kind="stars" count={24} />
      <header className="relative z-10 flex items-center gap-3 p-3">
        <RoundBtn
          label={t.ui.back}
          onClick={() => {
            sound.play('click');
            onBack();
          }}
          color="#ffffff"
          dark
        >
          <ChevronLeft className="h-8 w-8 rtl:rotate-180" strokeWidth={3} />
        </RoundBtn>
        <h2 className="flex-1 text-2xl font-bold text-white drop-shadow">🏆 {t.rewards.trophies}</h2>
      </header>

      <div className="thin-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        <div className="mx-auto max-w-2xl">
          {/* Aktueller Titel */}
          <div className="glass mb-5 flex items-center gap-3 rounded-[1.8rem] p-3">
            <div className="h-20 w-20 shrink-0">
              <Sparky mood="happy" />
            </div>
            <div>
              <div className="text-3xl">{title?.emoji ?? '🌱'}</div>
              <div className="text-xl font-bold leading-tight text-slate-800">{title ? t.rewards.badges[title.id].name : t.rewards.noTitle}</div>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-bold text-white drop-shadow">🏅 {t.rewards.badgesTitle}</h3>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map((b) => {
              const has = prog.badges.has(b.id);
              return (
                <div
                  key={b.id}
                  className={`flex flex-col items-center gap-1 rounded-[1.4rem] p-3 text-center ${has ? 'glass' : 'border-2 border-dashed border-white/60 bg-white/15'}`}
                >
                  <span className={`text-4xl ${has ? 'animate-float' : 'opacity-50 grayscale'}`}>{b.emoji}</span>
                  <span className={`text-sm font-bold leading-tight ${has ? 'text-slate-800' : 'text-white'}`}>{t.rewards.badges[b.id].name}</span>
                  <span className={`text-xs font-semibold leading-tight ${has ? 'text-slate-500' : 'text-white/85'}`}>
                    {!has && <Lock className="me-1 inline h-3 w-3" />}
                    {t.rewards.badges[b.id].desc}
                  </span>
                </div>
              );
            })}
          </div>

          <h3 className="mb-2 text-lg font-bold text-white drop-shadow">
            🌟 {t.rewards.stickersTitle} · {owned.length}/{STICKERS.length}
          </h3>
          <div className="glass grid grid-cols-5 gap-2 rounded-[1.8rem] p-3 sm:grid-cols-6">
            {STICKERS.map((s) => (
              <div key={s} className={`flex aspect-square items-center justify-center rounded-2xl text-3xl ${owned.includes(s) ? 'bg-gradient-to-br from-yellow-100 to-pink-100 shadow' : 'bg-slate-200/70'}`}>
                {owned.includes(s) ? s : <span className="text-xl text-slate-400">?</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
