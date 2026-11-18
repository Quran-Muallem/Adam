// Sammelalbum für Code-Wissen: alle freigeschalteten Entdecker-Karten
import { ChevronLeft } from 'lucide-react';
import { CARDS, unlockedCards } from '../data/cards';
import { WORLD_ORDER, WORLDS } from '../data/worlds';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { ExplorerCard } from './ExplorerCard';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';

interface Props {
  sound: SoundApi;
  stars: Record<string, number>;
  onBack: () => void;
}

export function Album({ sound, stars, onBack }: Props) {
  const { t } = useI18n();
  const unlocked = unlockedCards(stars);

  return (
    <div className="safe-area relative flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600">
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
        <h2 className="flex-1 text-xl font-bold leading-tight text-white drop-shadow">📚 {t.cards.albumTitle}</h2>
        <div className="glass rounded-full px-3 py-1.5 text-lg font-bold text-slate-700">
          {unlocked.size}/{CARDS.length}
        </div>
      </header>

      <div className="thin-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-center font-bold text-white/90">{t.cards.albumIntro}</p>
          {WORLD_ORDER.map((g) => (
            <section key={g} className="mb-5">
              <h3 className="mb-2 font-bold text-white drop-shadow">
                {WORLDS[g].emoji} {t.worlds[g].world}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {CARDS.filter((c) => c.group === g).map((c) =>
                  unlocked.has(c.id) ? (
                    <ExplorerCard key={c.id} card={c} t={t} compact />
                  ) : (
                    <div
                      key={c.id}
                      className="flex min-h-[120px] flex-col items-center justify-center gap-1 rounded-[1.6rem] border-4 border-dashed border-white/50 bg-white/15 p-4 text-center"
                    >
                      <span className="text-4xl opacity-60 grayscale">{c.emoji}</span>
                      <span className="text-3xl font-bold text-white/80">?</span>
                      <span className="text-sm font-bold text-white/80">{t.cards.locked}</span>
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
