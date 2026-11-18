// Erfolge: Titel, Abzeichen (eigene SVG-Grafiken), Festtags-Abzeichen, Sticker-Album
import { Lock } from 'lucide-react';
import type { CSSProperties } from 'react';
import { BADGES, bestTitle, STICKERS, type BadgeId } from '../data/rewards';
import { THEMES, type FestId } from '../data/seasons';
import type { ProgressApi } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { Sparky } from './Sparky';
import { Sprite, type SpriteName } from './sprites';
import { Ribbon, ScreenHeader, ScreenShell, StatPill } from './ui';

interface Props {
  sound: SoundApi;
  prog: ProgressApi;
  onBack: () => void;
}

export const BADGE_ART: Record<BadgeId, { sprite: SpriteName; color: string }> = {
  firstSteps: { sprite: 'footprints', color: '#22a8f0' },
  loopMaster: { sprite: 'loop', color: '#7c4dff' },
  jumpPro: { sprite: 'rabbit', color: '#14b8a6' },
  worldTraveler: { sprite: 'compass', color: '#2f7cf6' },
  conditionPro: { sprite: 'split', color: '#7c4dff' },
  macroMage: { sprite: 'wand', color: '#c026d3' },
  starCollector: { sprite: 'star', color: '#2f7cf6' },
  loyal: { sprite: 'flame', color: '#f0532f' },
  perfectionist: { sprite: 'gem', color: '#7c4dff' },
  champ25: { sprite: 'medalBronze', color: '#22a8f0' },
  champ50: { sprite: 'medalSilver', color: '#2f7cf6' },
  champ100: { sprite: 'medalGold', color: '#7c4dff' },
};

export function Trophies({ sound, prog, onBack }: Props) {
  const { t } = useI18n();
  const title = bestTitle(prog.badges);
  const owned = prog.progress.stickers;

  return (
    <ScreenShell
      header={
        <ScreenHeader
          title={t.ui2.achievements}
          backLabel={t.ui.back}
          onBack={() => {
            sound.play('click');
            onBack();
          }}
          right={<StatPill icon="trophy" value={`${prog.badges.size}/${BADGES.length}`} />}
        />
      }
    >
      <div className="mx-auto max-w-lg">
        <Ribbon color="gold" className="mb-5 mt-1">
          {t.ui2.yourAchievements}
        </Ribbon>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const has = prog.badges.has(b.id);
            const art = BADGE_ART[b.id];
            return (
              <div
                key={b.id}
                className={`ui-badge-card relative flex flex-col items-center px-1 pb-2 pt-2 text-center ${has ? '' : 'grayscale-[.85] opacity-80'}`}
                style={{ '--c': art.color } as CSSProperties}
              >
                <span className={`h-14 w-14 ${has ? 'animate-float' : ''}`}>
                  <Sprite name={art.sprite} />
                </span>
                <span className="font-game outline-text mt-1 text-[13px] leading-tight">{t.rewards.badges[b.id].name}</span>
                <span className="mt-0.5 text-[10.5px] font-bold leading-tight text-white/90">{t.rewards.badges[b.id].desc}</span>
                {!has && (
                  <span className="absolute end-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 shadow-[0_0_0_2px_#fff]">
                    <Lock className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Festtags-Abzeichen (Ramadan, Zuckerfest, Opferfest, Weihnachten …) */}
        {(prog.progress.fests ?? []).length > 0 && (
          <>
            <Ribbon color="green" className="mb-4">
              {t.season.festBadges}
            </Ribbon>
            <div className="mb-6 grid grid-cols-3 gap-3">
              {(prog.progress.fests ?? []).map((f) => {
                const [id, year] = f.split('-') as [FestId, string];
                const th = THEMES[id];
                if (!th) return null;
                return (
                  <div key={f} className="ui-badge-card flex flex-col items-center gap-1 p-2 text-center" style={{ '--c': '#f59e0b' } as CSSProperties}>
                    <span className="h-12 w-12 animate-float">
                      <Sprite name={th.decor[0]} />
                    </span>
                    <span className="font-game outline-text text-[13px] leading-tight">{t.season.names[id]}</span>
                    <span className="text-[11px] font-bold text-white/90">{year}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <Ribbon color="purple" className="mb-4">
          {t.ui2.stickers} · {owned.length}/{STICKERS.length}
        </Ribbon>
        <div className="ui-panel mb-6 grid grid-cols-5 gap-2 p-3" style={{ background: 'linear-gradient(180deg,#c7b5ff,#8b5cf6)' }}>
          {STICKERS.map((s) => (
            <div
              key={s}
              className={`flex aspect-square items-center justify-center rounded-2xl text-[1.7rem] ${
                owned.includes(s) ? 'border-[3px] border-slate-900/80 bg-gradient-to-b from-[#fff8d6] to-[#ffd54a] shadow-[0_4px_0_rgba(0,0,0,.4)]' : 'border-[3px] border-slate-900/40 bg-white/40 shadow-[inset_0_2px_3px_rgba(0,0,0,.15)]'
              }`}
            >
              {owned.includes(s) ? s : <Lock className="h-4 w-4 text-[#4c1d95]/70" strokeWidth={3} />}
            </div>
          ))}
        </div>

        {/* Aktueller Titel – Lorbeer-Banner wie in der Vorlage */}
        <div className="relative mx-auto flex max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute -start-3 -top-2 h-[72px] w-[72px] opacity-90">
              <Sprite name="laurel" />
            </span>
            <Ribbon color="red" className="!w-full">
              <span className="block px-6 text-[1.15rem]">{title ? t.rewards.badges[title.id].name : t.rewards.noTitle}</span>
            </Ribbon>
          </div>
          <div className="h-24 w-24 shrink-0">
            <Sparky mood="happy" />
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
