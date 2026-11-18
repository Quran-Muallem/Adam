// Einstellungen: Musik, Sound-Effekte und Spielgeschwindigkeit (alles gespeichert)
import { CalendarHeart, Globe2, Music, Settings, Smartphone, Volume2, Zap } from 'lucide-react';
import { REGION_EMOJI, REGIONS, THEME_ORDER, THEMES, type Region, type ThemeId } from '../data/seasons';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import type { CSSProperties, ReactNode } from 'react';
import type { Speed } from '../hooks/useProgramRunner';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';

interface Props {
  sound: SoundApi;
  speed: Speed;
  setSpeed: (s: Speed) => void;
  onClose: () => void;
}

export function SettingsModal({ sound, speed, setSpeed, onClose }: Props) {
  const { t } = useI18n();
  const season = useSeasonalTheme();
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-indigo-950/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="glass thin-scroll max-h-[92dvh] w-full max-w-sm animate-bounce-in overflow-y-auto rounded-[2rem] p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">
          <Settings className="h-7 w-7 text-slate-500" /> {t.settings.title}
        </h2>

        <div className="flex flex-col gap-3">
          <Row icon={<Music className="h-6 w-6" />} color="#ec4899" label={`🎵 ${t.settings.music}`}>
            <Toggle
              on={sound.musicOn}
              onChange={(v) => {
                sound.setMusicOn(v);
                sound.play('click');
              }}
              labels={[t.settings.on, t.settings.off]}
            />
          </Row>
          <Row icon={<Volume2 className="h-6 w-6" />} color="#0ea5e9" label={`🔊 ${t.settings.sfx}`}>
            <Toggle
              on={sound.sfxOn}
              onChange={(v) => {
                sound.setSfxOn(v);
                if (v) setTimeout(() => sound.play('click'), 0);
              }}
              labels={[t.settings.on, t.settings.off]}
            />
          </Row>
          <Row icon={<Smartphone className="h-6 w-6" />} color="#8b5cf6" label={`📳 ${t.pro.vibration}`}>
            <Toggle
              on={sound.vibeOn}
              onChange={(v) => {
                sound.setVibeOn(v);
                if (v) setTimeout(() => sound.play('collect'), 0);
              }}
              labels={[t.settings.on, t.settings.off]}
            />
          </Row>
          <Row icon={<Zap className="h-6 w-6" />} color="#f59e0b" label={`⚡ ${t.settings.speed}`}>
            <div className="flex rounded-full bg-slate-200 p-1">
              {(['normal', 'turbo'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSpeed(s);
                    sound.play('click');
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${speed === s ? 'bg-amber-400 text-amber-950 shadow' : 'text-slate-500'}`}
                >
                  {s === 'normal' ? `🐢 ${t.ui.normal}` : `⚡ ${t.ui.turbo}`}
                </button>
              ))}
            </div>
          </Row>
          {/* Regions- & Kultur-Steuerung */}
          <Row icon={<Globe2 className="h-6 w-6" />} color="#059669" label={`${REGION_EMOJI[season.region]} ${t.season.regionTitle}`}>
            <select
              value={season.region}
              onChange={(e) => season.setRegion(e.target.value as Region)}
              className="h-11 w-full rounded-xl border-2 border-slate-900/70 bg-white px-2 text-base font-bold text-slate-700 shadow-[0_3px_0_rgba(0,0,0,0.3)]"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {REGION_EMOJI[r]} {t.season.regions[r]}
                </option>
              ))}
            </select>
          </Row>
          {/* Saison-Vorschau: jedes Theme sofort testen */}
          <Row icon={<CalendarHeart className="h-6 w-6" />} color="#db2777" label={`🎨 ${t.season.previewTitle}`}>
            <select
              value={season.preview ?? ''}
              onChange={(e) => season.setPreview((e.target.value || null) as ThemeId | null)}
              className="h-11 w-full rounded-xl border-2 border-slate-900/70 bg-white px-2 text-base font-bold text-slate-700 shadow-[0_3px_0_rgba(0,0,0,0.3)]"
            >
              <option value="">📅 {t.season.previewLive(`${THEMES[season.live].emoji} ${t.season.names[season.live]}`)}</option>
              {THEME_ORDER.map((id) => (
                <option key={id} value={id}>
                  {THEMES[id].emoji} {t.season.names[id]}
                </option>
              ))}
            </select>
          </Row>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="squish mt-5 flex h-14 w-full items-center justify-center rounded-[1.4rem] text-xl font-bold"
          style={{ '--c': '#22c55e' } as CSSProperties}
        >
          {t.settings.done}
        </button>
      </div>
    </div>
  );
}

function Row({ icon, color, label, children }: { icon: ReactNode; color: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: color }}>
        {icon}
      </span>
      <span className="min-w-[8rem] flex-1 text-base font-bold leading-tight text-slate-700">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ on, onChange, labels }: { on: boolean; onChange: (v: boolean) => void; labels: [string, string] }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative flex h-10 w-[86px] shrink-0 items-center rounded-full px-1 text-xs font-bold transition ${on ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}
    >
      <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-all ${on ? 'start-[50px]' : 'start-1'}`} />
      <span className={`w-full text-center ${on ? 'pe-8' : 'ps-8'}`}>{on ? labels[0] : labels[1]}</span>
    </button>
  );
}
