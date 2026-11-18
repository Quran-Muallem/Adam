// Code-Wissen: alle freigeschalteten Entdecker-Karten, nach Welten sortiert
import { Lock } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CARDS, unlockedCards } from '../data/cards';
import { WORLD_ORDER } from '../data/worlds';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { CARD_ART, ExplorerCard } from './ExplorerCard';
import { Sprite, WORLD_SPRITES } from './sprites';
import { ScreenHeader, ScreenShell, StatPill } from './ui';

interface Props {
  sound: SoundApi;
  stars: Record<string, number>;
  onBack: () => void;
}

export function Album({ sound, stars, onBack }: Props) {
  const { t } = useI18n();
  const unlocked = unlockedCards(stars);

  return (
    <ScreenShell
      header={
        <ScreenHeader
          title={t.ui2.knowledge}
          backLabel={t.ui.back}
          onBack={() => {
            sound.play('click');
            onBack();
          }}
          right={<StatPill icon="gem" value={`${unlocked.size}/${CARDS.length}`} />}
        />
      }
    >
      <div className="mx-auto max-w-2xl">
        <div className="ui-panel mb-5 flex items-center gap-2 px-3 py-2">
          <span className="h-10 w-10 shrink-0">
            <Sprite name="book" />
          </span>
          <p className="ui-ink text-sm font-extrabold leading-snug">{t.cards.albumIntro}</p>
        </div>
        {WORLD_ORDER.map((g) => (
          <section key={g} className="mb-6">
            <div className="mb-3 flex justify-center">
            <h3 className="ui-title-pill font-game outline-text !min-h-[38px] gap-2 px-4 text-[17px]">
              <span className="h-7 w-7">
                <Sprite name={WORLD_SPRITES[g].emblem} />
              </span>
              {t.worlds[g].world}
            </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {CARDS.filter((c) => c.group === g).map((c) =>
                unlocked.has(c.id) ? (
                  <ExplorerCard key={c.id} card={c} t={t} compact />
                ) : (
                  <div key={c.id} className="ui-badge-card flex min-h-[88px] items-center gap-3 p-3" style={{ '--c': '#7b8db5' } as CSSProperties}>
                    <span className="ui-icon-badge relative h-14 w-14 shrink-0 p-1.5 grayscale" style={{ '--c': '#cbd5e1' } as CSSProperties}>
                      <span className="block h-full w-full opacity-40">
                        <Sprite name={CARD_ART[c.id] ?? 'star'} />
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-7 w-7 text-[#1b2a55]" strokeWidth={3} />
                      </span>
                    </span>
                    <span className="font-game ui-head-text text-[1.2rem] text-white">{t.cards.locked}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </ScreenShell>
  );
}
