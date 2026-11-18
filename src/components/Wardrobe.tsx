// Kostüm-Schrank: Sterne sammeln, Kostüme freischalten, Sparky verkleiden
import { ChevronLeft, Lock, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import { COSTUMES, type CostumeId } from '../data/costumes';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

interface Props {
  sound: SoundApi;
  costume: CostumeId;
  totalStars: number;
  onWear: (id: CostumeId) => void;
  onBack: () => void;
}

export function Wardrobe({ sound, costume, totalStars, onWear, onBack }: Props) {
  const { t } = useI18n();
  return (
    <div className="safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600">
      <Particles kind="stars" count={26} />
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
        <h2 className="flex-1 text-2xl font-bold text-white drop-shadow">{t.wardrobe.title}</h2>
        <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 text-lg font-bold text-slate-700">
          <Star className="h-5 w-5 fill-yellow-300 text-amber-500" /> {totalStars}
        </div>
      </header>

      <div className="thin-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto h-44 w-44">
            <Sparky mood="happy" costume={costume} />
          </div>
          <p className="mb-4 text-center font-bold text-white/90">{t.wardrobe.intro}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {COSTUMES.map((c) => {
              const open = totalStars >= c.stars;
              const worn = c.id === costume;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={!open}
                  onClick={() => {
                    sound.play('unlock');
                    onWear(c.id);
                  }}
                  className={`squish flex flex-col items-center gap-1 rounded-[1.6rem] p-3 ${worn ? 'ring-4 ring-yellow-300' : ''}`}
                  style={{ '--c': open ? (worn ? '#f59e0b' : '#8b5cf6') : '#64748b' } as CSSProperties}
                >
                  <div className="h-20 w-20">{open ? <Sparky mood="idle" costume={c.id} /> : <div className="flex h-full items-center justify-center text-5xl opacity-70">{c.emoji}</div>}</div>
                  <span className="text-base font-bold leading-tight">{t.costumes[c.id]}</span>
                  {open ? (
                    <span className="text-xs font-bold">{worn ? t.wardrobe.worn : t.wardrobe.wear}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Lock className="h-4 w-4" /> {c.stars} <Star className="h-4 w-4 fill-yellow-300 text-amber-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
