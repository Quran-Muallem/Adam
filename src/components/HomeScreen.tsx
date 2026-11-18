// Startbildschirm: illustrierte Abenteuerkarte mit den fünf Themenwelten + Menü + S-Bahn-Express
import { BookOpen, Check, Globe, RotateCcw, Settings, Shirt, Star } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { bestTitle } from '../data/rewards';
import { expressId } from '../data/levels';
import { WORLD_ORDER } from '../data/worlds';
import { SeasonBanner, SeasonLayer } from './SeasonLayer';
import { THEMES } from '../data/seasons';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import { Sprite, WORLD_SPRITES, type SpriteName } from './sprites';
import { useStoredState } from '../hooks/useStoredState';
import type { ProgressApi } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { DICTS, LANGS, useI18n, type Lang } from '../i18n';
import type { AgeGroupId } from '../types';
import { DailyWheel } from './DailyWheel';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

const DICT_NAMES = Object.fromEntries(Object.entries(DICTS).map(([k, d]) => [k, d.langName])) as Record<Lang, string>;

interface Props {
  sound: SoundApi;
  prog: ProgressApi;
  onPick: (g: AgeGroupId) => void;
  /** S-Bahn-Express: Tages-Rätsel sofort starten */
  onExpress: (levelId: string) => void;
  onWardrobe: () => void;
  onAlbum: () => void;
  onTrophies: () => void;
  onSettings: () => void;
}

/** Sammelkarten der fünf Welten: Farbverlauf, Emblem, Deko */
const CARD: Record<AgeGroupId, { bg: string; ring: string; deco: SpriteName[] }> = {
  mini: { bg: 'linear-gradient(135deg,#bef264 0%,#22c55e 45%,#15803d 100%)', ring: '#14532d', deco: ['tree', 'mushroom', 'berry'] },
  junior: { bg: 'linear-gradient(135deg,#67e8f9 0%,#0ea5e9 45%,#1e40af 100%)', ring: '#0c4a6e', deco: ['palm', 'gem', 'treasure'] },
  hero: { bg: 'linear-gradient(135deg,#c4b5fd 0%,#7c3aed 45%,#312e81 100%)', ring: '#2e1065', deco: ['planet', 'star', 'meteor'] },
  teen: { bg: 'linear-gradient(135deg,#f0abfc 0%,#a21caf 40%,#0f172a 100%)', ring: '#3b0764', deco: ['tower', 'battery', 'disk'] },
  adult: { bg: 'linear-gradient(135deg,#5eead4 0%,#0f766e 40%,#020617 100%)', ring: '#042f2e', deco: ['crystal', 'qcore', 'spark'] },
};

export function HomeScreen({ sound, prog, onPick, onExpress, onWardrobe, onAlbum, onTrophies, onSettings }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.id === lang)!;
  const title = bestTitle(prog.badges);
  const [expressGroup, setExpressGroup] = useStoredState<AgeGroupId>('sparky:expressGroup', 'hero');
  const todayId = expressId(WORLD_ORDER.includes(expressGroup) ? expressGroup : 'hero');
  const todayStars = prog.progress.express[todayId] ?? 0;
  // Festtags-Abzeichen: einmal pro Fest und Jahr (nur echtes Kalender-Fest, keine Vorschau)
  const season = useSeasonalTheme();
  const { addFest } = prog;
  useEffect(() => {
    if (!season.preview && THEMES[season.live].fest) addFest(`${season.live}-${new Date().getFullYear()}`);
  }, [season.preview, season.live, addFest]);

  return (
    <div className="safe-area relative h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-300 via-sky-400 to-blue-600">
      <Particles kind="stars" count={18} />
      {/* Wolken (eigene Grafik) */}
      {[
        { top: '6%', left: '-10%', w: '34%' },
        { top: '9%', left: '76%', w: '30%' },
        { top: '46%', left: '-14%', w: '28%' },
      ].map((c, i) => (
        <div key={i} className="pointer-events-none absolute animate-float opacity-90" style={{ top: c.top, left: c.left, width: c.w, animationDelay: `${i * 0.9}s` }}>
          <Sprite name="cloud" className="h-auto w-full" />
        </div>
      ))}
      <SeasonLayer />

      <div className="thin-scroll relative h-full overflow-y-auto">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-10">
          {/* Kopfzeile: Sprache · Sterne · Einstellungen */}
          <div className="relative z-10 flex w-full items-center justify-between py-3">
            <RoundBtn
              label={t.home.language}
              onClick={() => {
                sound.play('click');
                setLangOpen(true);
              }}
              color="#ffffff"
              dark
            >
              <span className="text-2xl leading-none">{current.flag}</span>
            </RoundBtn>
            <div className="relative flex h-16 w-16 items-center justify-center" aria-label={`${prog.totalStars} ⭐`}>
              <Sprite name="star" className="absolute inset-0 h-full w-full animate-breathe" />
              <span className="relative mt-1 text-lg font-black text-amber-900">{prog.totalStars}</span>
            </div>
            <RoundBtn label={t.settings.title} onClick={onSettings} color="#ffffff" dark>
              <Settings className="h-6 w-6" />
            </RoundBtn>
          </div>

          {/* Sparky in eigenem Container – mit Abstand, damit Mütze/Hörner nie in die Kopfzeile ragen */}
          <div className="relative z-10 mt-4 flex h-36 w-36 items-end justify-center sm:h-44 sm:w-44">
            <div className="absolute bottom-1 h-6 w-28 rounded-[50%] bg-blue-900/25 blur-[2px]" />
            <div className="h-full w-full animate-float">
              <Sparky mood="happy" />
            </div>
          </div>
          <h1 className="game-title relative z-10 mt-2 text-center text-[2.6rem] uppercase leading-[0.95] sm:text-6xl">
            {t.titleTop}
            <br />
            <span className="text-[1.9rem] sm:text-5xl">{t.titleBottom}</span>
          </h1>
          {title && (
            <button
              type="button"
              onClick={onTrophies}
              className="card3d relative z-10 mt-3 animate-pop rounded-full bg-slate-900 px-4 py-1 text-sm font-extrabold tracking-wide text-white"
            >
              {title.emoji} {t.rewards.badges[title.id].name}
            </button>
          )}

          <div className="mt-4 w-full">
            <SeasonBanner />
          </div>

          {/* Menü: 3D-Kacheln mit kurzen Labels */}
          <div className="relative z-10 mt-4 grid w-full grid-cols-4 gap-3">
            <MenuBtn color="#c026d3" label={t.home2.costumes} onClick={() => { sound.play('click'); onWardrobe(); }}>
              <Shirt className="h-9 w-9 drop-shadow-[0_2px_0_#1d1530]" strokeWidth={2.5} />
            </MenuBtn>
            <MenuBtn color="#0ea5e9" label={t.home2.knowledge} onClick={() => { sound.play('click'); onAlbum(); }}>
              <BookOpen className="h-9 w-9 drop-shadow-[0_2px_0_#1d1530]" strokeWidth={2.5} />
            </MenuBtn>
            <MenuBtn color="#f59e0b" label={t.home2.trophies} sprite="trophy" onClick={() => { sound.play('click'); onTrophies(); }} />
            <MenuBtn
              color="#ef4444"
              label={t.home2.gift}
              sprite="gift"
              pulse={prog.canSpin}
              badge={prog.canSpin ? '!' : prog.progress.streak > 1 ? `🔥${prog.progress.streak}` : undefined}
              onClick={() => {
                sound.play('click');
                setWheelOpen(true);
              }}
            />
          </div>

          {/* 🚆 S-Bahn-Express: ein Tages-Rätsel, in 3 Minuten lösbar */}
          <div className="relative z-10 mt-6 w-full">
            <button
              type="button"
              onClick={() => {
                sound.play('unlock');
                onExpress(todayId);
              }}
              className="squish flex min-h-[70px] w-full items-center gap-3 rounded-full py-2 pe-5 ps-3 text-start"
              style={{ '--c': '#f97316' } as CSSProperties}
            >
              <span className="h-14 w-14 shrink-0 -rotate-6">
                <Sprite name="train" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black uppercase leading-tight text-yellow-200">{t.pro.expressButton.replace(/^🚆\s*/, '')}</span>
                <span className="block text-xs font-bold leading-tight">
                  {todayStars > 0 ? `${'⭐'.repeat(todayStars)} ${t.pro.expressDone}` : t.pro.expressSub}
                </span>
              </span>
              {todayStars > 0 && <Check className="h-7 w-7 shrink-0" strokeWidth={3.5} />}
            </button>
            <div className="mt-3 flex items-center gap-2" role="radiogroup" aria-label={t.pro.expressLevel}>
              {WORLD_ORDER.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={expressGroup === g}
                  aria-label={t.worlds[g].name}
                  onClick={() => {
                    sound.play('click');
                    setExpressGroup(g);
                  }}
                  className={`card3d flex h-12 flex-1 items-center justify-center rounded-2xl p-1.5 transition active:translate-y-1 ${
                    expressGroup === g ? 'bg-yellow-300' : 'bg-white/70'
                  }`}
                >
                  <Sprite name={WORLD_SPRITES[g].emblem} />
                </button>
              ))}
            </div>
            <div className="outline-text mt-1.5 text-center text-xs font-bold">
              {t.home2.level}: {t.worlds[expressGroup]?.name} · {t.worlds[expressGroup]?.ages}
            </div>
          </div>

          <p className="outline-text relative z-10 mt-6 text-center text-2xl font-black">{t.home.whereTo}</p>

          {/* Welten als breite 3D-Sammelkarten */}
          <div className="relative z-10 mt-3 flex w-full flex-col gap-5">
            {WORLD_ORDER.map((id, i) => {
              const wt = t.worlds[id];
              const card = CARD[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    sound.play('unlock');
                    onPick(id);
                  }}
                  className="card3d relative flex min-h-[124px] w-full animate-bounce-in items-center gap-3 overflow-hidden rounded-[1.7rem] p-3 text-start transition active:translate-y-1"
                  style={{ background: card.bg, animationDelay: `${i * 0.1}s` }}
                >
                  {/* Hintergrund-Illustration */}
                  {card.deco.map((d, k) => (
                    <span
                      key={d}
                      className="pointer-events-none absolute opacity-25"
                      style={{ width: 70 - k * 14, right: `${18 + k * 17}%`, top: k % 2 ? '52%' : '-6%', transform: `rotate(${k * 14 - 10}deg)` }}
                    >
                      <Sprite name={d} className="h-auto w-full" />
                    </span>
                  ))}
                  <span className="absolute inset-x-6 top-1.5 h-5 rounded-full bg-white/25" />
                  {/* Emblem */}
                  <span className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[1.4rem] border-[3px] border-[#1d1530] bg-white/25 p-2 shadow-[inset_0_3px_0_rgba(255,255,255,.5)]">
                    <Sprite name={WORLD_SPRITES[id].emblem} className="h-full w-full animate-float" />
                  </span>
                  {/* Titel */}
                  <span className="relative min-w-0 flex-1">
                    <span className="outline-text block text-[1.08rem] font-black uppercase leading-[1.08] hyphens-auto break-words">{wt.world}</span>
                    <span className="outline-text mt-0.5 block text-[13px] font-bold leading-tight">{wt.ages}</span>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#1d1530]/80 px-2 py-0.5 text-xs font-bold text-white">
                      <Star className="h-3.5 w-3.5 fill-yellow-300 text-amber-400" /> {prog.starsIn(id)} · Lv {prog.frontier(id)}
                    </span>
                  </span>
                  {/* SPIELEN */}
                  <span className="squish relative flex h-11 shrink-0 items-center rounded-2xl px-2.5 text-sm font-black" style={{ '--c': '#22c55e' } as CSSProperties}>
                    {t.home2.play}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirmReset) {
                prog.reset();
                setConfirmReset(false);
                sound.play('remove');
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 3000);
              }
            }}
            className="relative z-10 mt-8 flex items-center gap-2 text-sm font-bold text-white/85"
          >
            <RotateCcw className="h-4 w-4" />
            {confirmReset ? t.home.resetConfirm : t.home.reset}
          </button>
        </div>
      </div>

      {/* Sprachauswahl */}
      {langOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-indigo-950/55 p-4 backdrop-blur-sm sm:items-center" onClick={() => setLangOpen(false)}>
          <div className="glass w-full max-w-sm animate-bounce-in rounded-[2rem] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xl font-bold text-slate-700">
              <Globe className="h-6 w-6" /> {t.home.language}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    sound.play('unlock');
                    setLang(l.id);
                    setLangOpen(false);
                  }}
                  className={`squish flex h-16 items-center justify-center gap-2 rounded-[1.4rem] px-3 text-lg font-bold ${l.id === lang ? 'ring-4 ring-yellow-300' : ''}`}
                  style={{ '--c': l.id === lang ? '#f59e0b' : '#8b5cf6' } as CSSProperties}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span>{DICT_NAMES[l.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {wheelOpen && <DailyWheel sound={sound} prog={prog} onClose={() => setWheelOpen(false)} />}
    </div>
  );
}

function MenuBtn(p: { color: string; label: string; onClick: () => void; pulse?: boolean; badge?: string; sprite?: SpriteName; children?: ReactNode }) {
  return (
    <button type="button" aria-label={p.label} onClick={p.onClick} className="flex flex-col items-center gap-1.5">
      <span
        className={`squish relative flex aspect-square w-full items-center justify-center rounded-[1.3rem] p-2.5 ${p.pulse ? 'animate-breathe' : ''}`}
        style={{ '--c': p.color } as CSSProperties}
      >
        {p.sprite ? <Sprite name={p.sprite} className="h-full w-full" /> : p.children}
        {p.badge && (
          <span className="card3d absolute -right-2 -top-2 flex min-w-[26px] animate-pop items-center justify-center rounded-full bg-yellow-300 px-1.5 py-0.5 text-xs font-black text-rose-700 [text-shadow:none]">
            {p.badge}
          </span>
        )}
      </span>
      <span className="outline-text text-center text-[13px] font-black leading-tight">{p.label}</span>
    </button>
  );
}
