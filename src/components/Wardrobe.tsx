// Kostüm-Schrank: Kostüme & Farben – freigeschaltet durch gesammelte Sterne
import { ChevronLeft, Lock, Star } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { COSTUMES, SKINS, type CostumeId, type SkinId } from '../data/costumes';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

interface Props {
  sound: SoundApi;
  costume: CostumeId;
  skin: SkinId;
  totalStars: number;
  onWear: (id: CostumeId) => void;
  onSkin: (id: SkinId) => void;
  onBack: () => void;
}

export function Wardrobe({ sound, costume, skin, totalStars, onWear, onSkin, onBack }: Props) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'costumes' | 'colors'>('costumes');

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
        <h2 className="flex-1 text-xl font-bold leading-tight text-white drop-shadow sm:text-2xl">{t.wardrobe.title}</h2>
        <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 text-lg font-bold text-slate-700">
          <Star className="h-5 w-5 fill-yellow-300 text-amber-500" /> {totalStars}
        </div>
      </header>

      <div className="thin-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto h-40 w-40">
            <Sparky mood="happy" costume={costume} skin={skin} />
          </div>
          <p className="mb-3 text-center font-bold text-white/90">{t.wardrobe.intro}</p>

          {/* Reiter */}
          <div className="mb-4 flex rounded-full bg-black/25 p-1">
            {(['costumes', 'colors'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  sound.play('click');
                  setTab(k);
                }}
                className={`flex h-11 flex-1 items-center justify-center rounded-full font-bold transition ${tab === k ? 'bg-white text-slate-800 shadow' : 'text-white'}`}
              >
                {k === 'costumes' ? `🎩 ${t.rewards.costumesTab}` : `🎨 ${t.rewards.colors}`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(tab === 'costumes' ? COSTUMES : SKINS).map((item) => {
              const open = totalStars >= item.stars;
              const worn = tab === 'costumes' ? item.id === costume : item.id === skin;
              const name = tab === 'costumes' ? t.costumes[item.id as CostumeId] : t.skins[item.id as SkinId];
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!open}
                  onClick={() => {
                    sound.play('unlock');
                    if (tab === 'costumes') onWear(item.id as CostumeId);
                    else onSkin(item.id as SkinId);
                  }}
                  className={`squish flex flex-col items-center gap-1 rounded-[1.6rem] p-3 ${worn ? 'ring-4 ring-yellow-300' : ''}`}
                  style={{ '--c': open ? (worn ? '#f59e0b' : '#8b5cf6') : '#64748b' } as CSSProperties}
                >
                  <div className={`h-20 w-20 ${open ? '' : 'opacity-60 grayscale'}`}>
                    {tab === 'costumes' ? (
                      <Sparky mood="idle" costume={item.id as CostumeId} skin={skin} />
                    ) : (
                      <Sparky mood="idle" costume={costume} skin={item.id as SkinId} />
                    )}
                  </div>
                  <span className="text-base font-bold leading-tight">{name}</span>
                  {open ? (
                    <span className="text-xs font-bold">{worn ? t.wardrobe.worn : t.wardrobe.wear}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Lock className="h-4 w-4" /> {item.stars} <Star className="h-4 w-4 fill-yellow-300 text-amber-400" />
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
