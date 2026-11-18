// Einstellungen im Spiel-Design: Musik, Sound, Vibration, Tempo, Sprache,
// Feste & Region, Saison-Vorschau (alles gespeichert)
import { CalendarHeart, Gauge, Globe2, Music, Smartphone, Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { REGIONS, THEME_ORDER, THEMES, type Region, type ThemeId } from '../data/seasons';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import type { Speed } from '../hooks/useProgramRunner';
import type { SoundApi } from '../hooks/useSoundEffects';
import { DICTS, LANGS, useI18n, type Lang } from '../i18n';
import { Flag } from './Flags';
import { GameButton, ScreenHeader, ScreenShell, Toggle } from './ui';

interface Props {
  sound: SoundApi;
  speed: Speed;
  setSpeed: (s: Speed) => void;
  onClose: () => void;
}

export function SettingsModal({ sound, speed, setSpeed, onClose }: Props) {
  const { t, lang, setLang } = useI18n();
  const season = useSeasonalTheme();
  const close = () => {
    sound.play('click');
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[80] animate-bounce-in">
      <ScreenShell
        header={<ScreenHeader title={t.ui2.settings} backLabel={t.ui.back} onBack={close} />}
        footer={
          <GameButton color="purple" className="mx-auto w-full max-w-xs" onClick={close}>
            {t.settings.done}
          </GameButton>
        }
      >
        <div className="mx-auto flex max-w-sm flex-col gap-6 pt-2">
          <div className="ui-panel px-3 py-1">
            <Row icon={<Music className="h-6 w-6" strokeWidth={2.6} />} color="#1e88e5" label={t.ui2.music}>
              <Toggle
                label={t.ui2.music}
                on={sound.musicOn}
                onChange={(v) => {
                  sound.setMusicOn(v);
                  sound.play('click');
                }}
              />
            </Row>
            <Row icon={<Volume2 className="h-6 w-6" strokeWidth={2.6} />} color="#1e88e5" label={t.ui2.sound}>
              <Toggle
                label={t.ui2.sound}
                on={sound.sfxOn}
                onChange={(v) => {
                  sound.setSfxOn(v);
                  if (v) setTimeout(() => sound.play('click'), 0);
                }}
              />
            </Row>
            <Row icon={<Smartphone className="h-6 w-6" strokeWidth={2.6} />} color="#1e88e5" label={t.ui2.vibration}>
              <Toggle
                label={t.ui2.vibration}
                on={sound.vibeOn}
                onChange={(v) => {
                  sound.setVibeOn(v);
                  if (v) setTimeout(() => sound.play('collect'), 0);
                }}
              />
            </Row>
            <Row icon={<Gauge className="h-6 w-6" strokeWidth={2.6} />} color="#1e88e5" label={t.ui2.speed}>
              <div className="flex rounded-full bg-[#dbe7f7] p-1 shadow-[inset_0_2px_3px_rgba(0,0,0,.15)]">
                {(['normal', 'turbo'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={speed === s}
                    onClick={() => {
                      setSpeed(s);
                      sound.play('click');
                    }}
                    className={`font-game rounded-full px-3 py-1 text-[15px] transition ${
                      speed === s ? 'bg-gradient-to-b from-[#ffd84a] to-[#f59e0b] text-[#5a2d00] shadow-[0_0_0_2px_#b45309,0_2px_0_#b45309]' : 'text-[#4a5a85]'
                    }`}
                  >
                    {s === 'normal' ? t.ui.normal : t.ui.turbo}
                  </button>
                ))}
              </div>
            </Row>
            <Row icon={<Flag lang={lang} className="h-8 w-8" />} label={t.ui2.language}>
              <select
                aria-label={t.ui2.language}
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value as Lang);
                  sound.play('unlock');
                }}
                className="ui-select"
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {DICTS[l.id].langName}
                  </option>
                ))}
              </select>
            </Row>
          </div>

          <div className="ui-panel px-3 py-1">
            {/* Regions- & Kultur-Steuerung */}
            <Row icon={<Globe2 className="h-6 w-6" strokeWidth={2.6} />} color="#7c3aed" label={t.season.regionTitle} stack>
              <select aria-label={t.season.regionTitle} value={season.region} onChange={(e) => season.setRegion(e.target.value as Region)} className="ui-select w-full">
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {t.season.regions[r]}
                  </option>
                ))}
              </select>
            </Row>
            {/* Saison-Vorschau: jedes Theme sofort testen */}
            <Row icon={<CalendarHeart className="h-6 w-6" strokeWidth={2.6} />} color="#db2777" label={t.season.previewTitle} stack>
              <select
                aria-label={t.season.previewTitle}
                value={season.preview ?? ''}
                onChange={(e) => season.setPreview((e.target.value || null) as ThemeId | null)}
                className="ui-select w-full"
              >
                <option value="">{t.season.previewLive(t.season.names[season.live])}</option>
                {THEME_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {t.season.names[id]}
                    {THEMES[id].fest ? ' ★' : ''}
                  </option>
                ))}
              </select>
            </Row>
          </div>
        </div>
      </ScreenShell>
    </div>
  );
}

function Row({ icon, color, label, children, stack }: { icon: ReactNode; color?: string; label: string; children: ReactNode; stack?: boolean }) {
  return (
    <div className={`ui-row flex gap-3 py-2.5 ${stack ? 'flex-wrap items-center' : 'items-center'}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center" style={{ color }}>
        {icon}
      </span>
      <span className="ui-ink min-w-0 flex-1 text-[17px] font-extrabold leading-tight">{label}</span>
      {stack ? <div className="w-full">{children}</div> : children}
    </div>
  );
}
