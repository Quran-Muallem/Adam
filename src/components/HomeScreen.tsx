// Startbildschirm: illustrierte Abenteuerkarte mit den fünf Themenwelten + Menü + S-Bahn-Express
import { BookOpen, Check, Gift, Globe, RotateCcw, Settings, Shirt, Star, Trophy } from 'lucide-react';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { bestTitle } from '../data/rewards';
import { expressId } from '../data/levels';
import { WORLD_ORDER, WORLDS } from '../data/worlds';
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

/** Illustrationen der Inseln */
const ISLAND: Record<AgeGroupId, { bg: string; scene: string[]; side: 'left' | 'right'; color: string }> = {
  mini: {
    bg: 'radial-gradient(circle at 35% 30%, #bef264 0%, #65a30d 55%, #365314 100%)',
    scene: ['🌳', '🍄', '🌲', '🍓', '🌸', '✨'],
    side: 'left',
    color: '#ea580c',
  },
  junior: {
    bg: 'radial-gradient(circle at 35% 30%, #a5f3fc 0%, #06b6d4 50%, #0e7490 100%)',
    scene: ['🏝️', '🏴‍☠️', '💎', '🐚', '🦀', '⛵'],
    side: 'right',
    color: '#0284c7',
  },
  hero: {
    bg: 'radial-gradient(circle at 35% 30%, #c4b5fd 0%, #7c3aed 50%, #312e81 100%)',
    scene: ['🏰', '🪐', '🤖', '🚀', '⭐', '🛰️'],
    side: 'left',
    color: '#c026d3',
  },
  teen: {
    bg: 'radial-gradient(circle at 35% 30%, #f0abfc 0%, #7e22ce 45%, #0c0a2a 100%)',
    scene: ['🌆', '🛸', '📡', '⚡', '🕹️', '💾'],
    side: 'right',
    color: '#a21caf',
  },
  adult: {
    bg: 'radial-gradient(circle at 35% 30%, #99f6e4 0%, #0f766e 45%, #020617 100%)',
    scene: ['⚛️', '🧬', '🔬', '🧠', '♾️', '💠'],
    side: 'left',
    color: '#0f766e',
  },
};

const SCENE_POS = [
  { l: '50%', t: '42%', s: 2.6 },
  { l: '22%', t: '30%', s: 1.3 },
  { l: '78%', t: '28%', s: 1.3 },
  { l: '28%', t: '70%', s: 1.2 },
  { l: '72%', t: '70%', s: 1.2 },
  { l: '50%', t: '12%', s: 1 },
];

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

  return (
    <div className="safe-area relative h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-400 via-indigo-400 to-fuchsia-400">
      <Particles kind="stars" count={30} />
      {['8%', '58%', '30%'].map((top, i) => (
        <div key={top} className="pointer-events-none absolute animate-float text-6xl opacity-80" style={{ top, left: i % 2 ? '70%' : '-4%', animationDelay: `${i * 0.8}s` }}>
          ☁️
        </div>
      ))}

      <div className="thin-scroll relative h-full overflow-y-auto">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-10">
          {/* Kopfzeile */}
          <div className="flex w-full items-center justify-between py-3">
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
            <div className="glass flex items-center gap-1 rounded-full px-4 py-1.5 text-lg font-bold text-slate-700">
              <Star className="h-5 w-5 fill-yellow-300 text-amber-500" /> {prog.totalStars}
            </div>
            <RoundBtn label={t.settings.title} onClick={onSettings} color="#ffffff" dark>
              <Settings className="h-6 w-6" />
            </RoundBtn>
          </div>

          {/* Titel mit Sparky */}
          <div className="mt-6 h-28 w-28 sm:h-36 sm:w-36">
            <Sparky mood="happy" />
          </div>
          <h1 className="mt-1 text-center text-4xl font-bold leading-none text-white sm:text-5xl" style={{ textShadow: '0 4px 0 #7c3aed, 0 8px 18px rgba(76,29,149,.55)' }}>
            {t.titleTop}
            <br />
            {t.titleBottom}
          </h1>
          {title && (
            <button
              type="button"
              onClick={onTrophies}
              className="mt-2 animate-pop rounded-full border border-white/30 bg-slate-900/75 px-4 py-1 text-sm font-extrabold tracking-wide text-white shadow-lg backdrop-blur-sm"
            >
              {title.emoji} {t.rewards.badges[title.id].name}
            </button>
          )}

          {/* Menü */}
          <div className="mt-4 grid w-full grid-cols-4 gap-2">
            <MenuBtn color="#d946ef" label={t.home.costumes} onClick={() => { sound.play('click'); onWardrobe(); }}>
              <Shirt className="h-7 w-7" />
            </MenuBtn>
            <MenuBtn color="#0ea5e9" label={t.cards.album} onClick={() => { sound.play('click'); onAlbum(); }}>
              <BookOpen className="h-7 w-7" />
            </MenuBtn>
            <MenuBtn color="#f59e0b" label={t.rewards.trophies} onClick={() => { sound.play('click'); onTrophies(); }}>
              <Trophy className="h-7 w-7" />
            </MenuBtn>
            <MenuBtn
              color="#f43f5e"
              label={t.daily.button}
              pulse={prog.canSpin}
              badge={prog.canSpin ? '!' : prog.progress.streak > 1 ? `🔥${prog.progress.streak}` : undefined}
              onClick={() => {
                sound.play('click');
                setWheelOpen(true);
              }}
            >
              <Gift className="h-7 w-7" />
            </MenuBtn>
          </div>

          {/* 🚆 S-Bahn-Express: ein Tages-Rätsel, in 3 Minuten lösbar */}
          <div className="mt-4 w-full rounded-[1.8rem] bg-slate-900/80 p-2 shadow-xl ring-1 ring-white/20 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                sound.play('unlock');
                onExpress(todayId);
              }}
              className="squish flex min-h-[64px] w-full items-center gap-3 rounded-[1.4rem] px-4 text-start"
              style={{ '--c': '#e11d48' } as CSSProperties}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-tight">{t.pro.expressButton}</span>
                <span className="block text-xs font-semibold leading-tight opacity-90">
                  {todayStars > 0 ? `${'⭐'.repeat(todayStars)} ${t.pro.expressDone}` : t.pro.expressSub}
                </span>
              </span>
              {todayStars > 0 && <Check className="h-7 w-7 shrink-0" strokeWidth={3.5} />}
            </button>
            <div className="mt-2 flex items-center gap-1.5" role="radiogroup" aria-label={t.pro.expressLevel}>
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
                  className={`flex h-10 flex-1 items-center justify-center rounded-full text-xl transition ${
                    expressGroup === g ? 'bg-white shadow-lg ring-2 ring-yellow-300' : 'bg-white/10'
                  }`}
                >
                  {WORLDS[g].emoji}
                </button>
              ))}
            </div>
            <div className="mt-1 text-center text-[11px] font-bold text-white/70">
              {t.worlds[expressGroup]?.name} · {t.worlds[expressGroup]?.ages}
            </div>
          </div>

          <p className="mt-5 text-center text-lg font-bold text-white drop-shadow">{t.home.whereTo}</p>

          {/* Abenteuer-Pfad mit drei Inseln */}
          <div className="relative mt-3 w-full">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 500" preserveAspectRatio="none" aria-hidden>
              <path d="M30 40 C 90 70, 90 100, 70 140 S 10 200, 30 250 S 90 300, 70 340 S 10 400, 30 450" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.85" />
            </svg>
            {WORLD_ORDER.map((id, i) => {
              const wt = t.worlds[id];
              const isl = ISLAND[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    sound.play('unlock');
                    onPick(id);
                  }}
                  className={`relative mb-4 flex w-full animate-bounce-in items-center gap-3 ${isl.side === 'right' ? 'flex-row-reverse text-right' : ''}`}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <div
                    className="relative h-32 w-32 shrink-0 rounded-[46%_54%_50%_50%] transition active:scale-95 sm:h-44 sm:w-44"
                    style={{ background: isl.bg, boxShadow: '0 10px 0 rgba(0,0,0,.18), 0 20px 30px -10px rgba(0,0,0,.45), inset 0 6px 0 rgba(255,255,255,.35)' }}
                  >
                    <span className="absolute left-[18%] top-[8%] h-[18%] w-[40%] rounded-full bg-white/40 blur-[2px]" />
                    {isl.scene.map((e, k) => (
                      <span
                        key={k}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 ${k === 0 ? 'animate-float' : k === 5 ? 'animate-twinkle' : ''}`}
                        style={{ left: SCENE_POS[k].l, top: SCENE_POS[k].t, fontSize: `${SCENE_POS[k].s}rem` }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="glass min-w-0 flex-1 rounded-[1.6rem] px-4 py-3">
                    <div className="text-xs font-bold uppercase leading-tight tracking-wide" style={{ color: isl.color }}>
                      {wt.world}
                    </div>
                    <div className="text-xl font-bold leading-tight text-slate-800 sm:text-2xl">{wt.name}</div>
                    <div className="text-sm font-semibold leading-snug text-slate-500">
                      {wt.ages} · {wt.tagline}
                    </div>
                    <div className={`mt-1 flex items-center gap-1 text-sm font-bold text-slate-700 ${isl.side === 'right' ? 'justify-end' : ''}`}>
                      <Star className="h-4 w-4 fill-yellow-300 text-amber-500" /> {prog.starsIn(id)} · Lv {prog.frontier(id)}
                    </div>
                  </div>
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
            className="mt-6 flex items-center gap-2 text-sm font-bold text-white/80"
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

function MenuBtn(p: { color: string; label: string; onClick: () => void; pulse?: boolean; badge?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={p.label}
      onClick={p.onClick}
      className={`squish relative flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-[1.4rem] px-1 py-2 ${p.pulse ? 'animate-breathe' : ''}`}
      style={{ '--c': p.color } as CSSProperties}
    >
      {p.children}
      <span className="text-center text-[11px] font-bold leading-tight">{p.label}</span>
      {p.badge && (
        <span className="absolute -right-1 -top-2 min-w-[24px] animate-pop rounded-full bg-yellow-300 px-1.5 py-0.5 text-xs font-extrabold text-rose-700 shadow [text-shadow:none]">
          {p.badge}
        </span>
      )}
    </button>
  );
}
