// Kostüm-Editor: Vorschau auf der Wiese, Kacheln für Kostüme & Farben,
// freigeschaltet durch gesammelte Sterne – „Anwenden“ zieht Sparky um
import { Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { COSTUMES, SKINS, type CostumeId, type SkinId } from '../data/costumes';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { Sparky } from './Sparky';
import { Sprite } from './sprites';
import { GameButton, ScreenHeader, ScreenShell, StatPill } from './ui';

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
  const [pc, setPc] = useState<CostumeId>(costume);
  const [ps, setPs] = useState<SkinId>(skin);
  const dirty = pc !== costume || ps !== skin;
  const items = tab === 'costumes' ? COSTUMES : SKINS;

  return (
    <ScreenShell
      variant="meadow"
      header={
        <ScreenHeader
          title={t.ui2.costumeEditor}
          backLabel={t.ui.back}
          onBack={() => {
            sound.play('click');
            onBack();
          }}
          right={<StatPill value={totalStars} />}
        />
      }
      footer={
        <GameButton
          big
          className="mx-auto w-full max-w-xs"
          disabled={!dirty}
          onClick={() => {
            sound.play('unlock');
            if (pc !== costume) onWear(pc);
            if (ps !== skin) onSkin(ps);
          }}
        >
          {dirty ? t.ui2.apply : <Check className="h-8 w-8" strokeWidth={4} />}
        </GameButton>
      }
    >
      <div className="mx-auto max-w-lg">
        {/* Bühne */}
        <div className="relative mx-auto -mt-1 h-[190px] w-[210px]">
          <div className="absolute inset-x-6 bottom-1 h-8 rounded-[50%] bg-[radial-gradient(closest-side,rgba(20,60,10,.45),transparent)]" />
          <div className="absolute inset-0 animate-float">
            <Sparky mood="happy" costume={pc} skin={ps} large />
          </div>
        </div>
        <p className="ui-outline-blue font-game mb-3 text-center text-[15px] leading-snug text-white">{t.wardrobe.intro}</p>

        {/* Reiter */}
        <div className="mx-auto mb-4 flex max-w-xs rounded-full bg-[#10388a]/40 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,.3)]" role="tablist">
          {(['costumes', 'colors'] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={tab === k}
              onClick={() => {
                sound.play('click');
                setTab(k);
              }}
              className={`font-game flex h-10 flex-1 items-center justify-center rounded-full text-[17px] transition ${
                tab === k ? 'ui-tile !rounded-full text-[#1b2a55]' : 'text-white'
              }`}
            >
              {k === 'costumes' ? t.rewards.costumesTab : t.rewards.colors}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
          {items.map((item) => {
            const open = totalStars >= item.stars;
            const sel = tab === 'costumes' ? item.id === pc : item.id === ps;
            const worn = tab === 'costumes' ? item.id === costume : item.id === skin;
            const name = tab === 'costumes' ? t.costumes[item.id as CostumeId] : t.skins[item.id as SkinId];
            return (
              <button
                key={item.id}
                type="button"
                aria-label={name}
                aria-pressed={sel}
                disabled={!open}
                onClick={() => {
                  sound.play('click');
                  if (tab === 'costumes') setPc(item.id as CostumeId);
                  else setPs(item.id as SkinId);
                }}
                className={`ui-tile relative flex flex-col items-center overflow-hidden p-1 pb-1.5 ${sel ? 'ui-tile-selected' : ''}`}
              >
                <div className={`relative aspect-square w-full overflow-hidden rounded-xl ${open ? '' : 'opacity-50 grayscale'}`}>
                  <div className="absolute left-[-22%] top-[-6%] h-[150%] w-[144%]">
                    {tab === 'costumes' ? <Sparky mood="idle" costume={item.id as CostumeId} skin={ps} /> : <Sparky mood="idle" costume={pc} skin={item.id as SkinId} />}
                  </div>
                </div>
                <span className="ui-ink mt-1 line-clamp-1 w-full text-center text-[12px] font-extrabold leading-tight">{name}</span>
                {worn && (
                  <span className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#5fe27a] to-[#22a63f] shadow-[0_0_0_2px_#157a2a]">
                    <Check className="h-4 w-4 text-white" strokeWidth={4} />
                  </span>
                )}
                {!open && (
                  <span className="absolute inset-x-0 top-[28%] flex flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#94a3b8] to-[#475569] shadow-[0_0_0_2px_#1e293b,0_3px_0_#1e293b]">
                      <Lock className="h-5 w-5 text-white" strokeWidth={3} />
                    </span>
                    <span className="font-game mt-1 flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 text-[13px] text-[#1b2a55] shadow">
                      {item.stars}
                      <span className="h-4 w-4">
                        <Sprite name="star" />
                      </span>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
