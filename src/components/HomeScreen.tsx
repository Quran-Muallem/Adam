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

/** Illustrierte Szenen auf den Welten-Karten */
const SCENE: Record<AgeGroupId, { s: SpriteName; x: string; y: string; w: string; r?: number }[]> = {
  mini: [
    { s: 'mushroom', x: '8%', y: '22%', w: '34%' },
    { s: 'tree', x: '52%', y: '6%', w: '42%' },
    { s: 'berry', x: '40%', y: '38%', w: '18%' },
    { s: 'strawberry', x: '74%', y: '40%', w: '16%' },
  ],
  junior: [
    { s: 'ship', x: '10%', y: '14%', w: '38%' },
    { s: 'palm', x: '58%', y: '4%', w: '38%' },
    { s: 'gem', x: '44%', y: '34%', w: '16%' },
    { s: 'treasure', x: '74%', y: '40%', w: '20%' },
  ],
  hero: [
    { s: 'rocket', x: '10%', y: '8%', w: '30%', r: 20 },
    { s: 'planet', x: '56%', y: '6%', w: '36%' },
    { s: 'star', x: '40%', y: '36%', w: '16%' },
    { s: 'meteor', x: '70%', y: '38%', w: '20%' },
  ],
  teen: [
    { s: 'skyline', x: '4%', y: '6%', w: '52%' },
    { s: 'robot', x: '60%', y: '10%', w: '28%' },
    { s: 'battery', x: '50%', y: '38%', w: '14%' },
    { s: 'disk', x: '74%', y: '42%', w: '16%' },
  ],
  adult: [
    { s: 'atom', x: '8%', y: '8%', w: '40%' },
    { s: 'crystal', x: '58%', y: '8%', w: '32%' },
    { s: 'qcore', x: '44%', y: '38%', w: '16%' },
    { s: 'spark', x: '76%', y: '42%', w: '14%' },
  ],
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
    <div
      className="safe-area relative h-[100dvh] overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#1fa2ef 0%,#45bdf6 30%,#8fdcfb 62%,#ffe7a3 88%,#ffd36e 100%)' }}
    >
      {/* Sonnenlicht von unten */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'radial-gradient(ellipse at 70% 100%, rgba(255,240,180,.85), transparent 65%)' }} />
      <Particles kind="stars" count={22} />
      {/* Wolken & schwebende Inseln */}
      {[
        { top: '7%', left: '-12%', w: '36%', s: 'cloud' },
        { top: '10%', left: '74%', w: '34%', s: 'cloud' },
        { top: '24%', left: '-6%', w: '24%', s: 'island' },
        { top: '27%', left: '80%', w: '22%', s: 'island' },
        { top: '50%', left: '-16%', w: '30%', s: 'cloud' },
      ].map((c, i) => (
        <div key={i} className="pointer-events-none absolute animate-float" style={{ top: c.top, left: c.left, width: c.w, animationDelay: `${i * 0.9}s` }}>
          <Sprite name={c.s as SpriteName} className="h-auto w-full drop-shadow-[0_8px_8px_rgba(0,40,90,.25)]" />
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
              <span className={`relative mt-1 font-black text-amber-900 ${prog.totalStars > 99 ? 'text-sm' : 'text-lg'}`}>{prog.totalStars}</span>
            </div>
            <RoundBtn label={t.settings.title} onClick={onSettings} color="#ffffff" dark>
              <Settings className="h-6 w-6" />
            </RoundBtn>
          </div>

          {/* Sparky in eigenem Container – mit Abstand, damit Mütze/Hörner nie in die Kopfzeile ragen */}
          <div className="relative z-10 mt-4 flex h-52 w-52 items-end justify-center sm:h-64 sm:w-64">
            <div className="absolute inset-[12%] rounded-full bg-white/50 blur-2xl" />
            <div className="relative h-full w-full animate-float">
              <Sparky large />
            </div>
          </div>
          <h1 className="game-title font-game relative z-10 mt-1 text-center text-[2.9rem] uppercase leading-[0.95] sm:text-6xl">
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

          {/* Welten als illustrierte 3D-Sammelkarten (wischen) */}
          <div className="thin-scroll relative z-10 -mx-4 mt-3 flex w-[calc(100%+2rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-1">
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
                  className="card3d relative h-[250px] w-[82%] shrink-0 snap-center overflow-hidden rounded-[1.8rem] text-start transition active:translate-y-1"
                  style={{ background: card.bg, animationDelay: `${i * 0.1}s` }}
                >
                  {/* Szene */}
                  <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  {SCENE[id].map((d, k) => (
                    <span key={k} className={`pointer-events-none absolute ${k === 0 ? 'animate-float' : ''}`} style={{ left: d.x, top: d.y, width: d.w, transform: `rotate(${d.r ?? 0}deg)` }}>
                      <Sprite name={d.s} className="h-auto w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.35)]" />
                    </span>
                  ))}
                  <span className="absolute inset-x-5 top-2 h-6 rounded-full bg-white/25" />
                  {/* Titel + Spielen */}
                  <span className="absolute inset-x-3 bottom-3 flex items-end gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="font-game outline-text block text-[1.45rem] uppercase leading-[1.02] hyphens-auto break-words">{wt.world}</span>
                      <span className="outline-text block text-sm font-bold">({wt.ages})</span>
                    </span>
                    <span className="squish font-game flex h-12 shrink-0 items-center rounded-2xl px-3 text-lg uppercase" style={{ '--c': '#22c55e' } as CSSProperties}>
                      {t.home2.play}
                    </span>
                  </span>
                  <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full border-2 border-[#1d1530] bg-white/90 px-2 py-0.5 text-xs font-black text-slate-800">
                    <Star className="h-3.5 w-3.5 fill-yellow-300 text-amber-500" /> {prog.starsIn(id)} · Lv {prog.frontier(id)}
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
