// Startbildschirm: illustrierte Abenteuerkarte mit den drei Themenwelten
import { RotateCcw, Shirt, Star, Volume2, VolumeX } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { CostumeId } from '../data/costumes';
import { levelsFor } from '../data/levels';
import { WORLD_ORDER, WORLDS } from '../data/worlds';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { AgeGroupId } from '../types';
import { RoundBtn } from './GameScreen';
import { Particles } from './Particles';
import { Sparky } from './Sparky';

interface Props {
  sound: SoundApi;
  costume: CostumeId;
  totalStars: number;
  starsIn: (g: AgeGroupId) => number;
  onPick: (g: AgeGroupId) => void;
  onWardrobe: () => void;
  onResetProgress: () => void;
}

/** Illustrationen der Inseln */
const ISLAND: Record<AgeGroupId, { bg: string; scene: string[]; side: 'left' | 'right'; color: string }> = {
  mini: {
    bg: 'radial-gradient(circle at 35% 30%, #bef264 0%, #65a30d 55%, #365314 100%)',
    scene: ['🌳', '🍄', '🌲', '🍓', '🌸', '✨'],
    side: 'left',
    color: '#f97316',
  },
  junior: {
    bg: 'radial-gradient(circle at 35% 30%, #a5f3fc 0%, #06b6d4 50%, #0e7490 100%)',
    scene: ['🏝️', '🏴‍☠️', '💎', '🐚', '🦀', '⛵'],
    side: 'right',
    color: '#0ea5e9',
  },
  hero: {
    bg: 'radial-gradient(circle at 35% 30%, #c4b5fd 0%, #7c3aed 50%, #312e81 100%)',
    scene: ['🏰', '🪐', '🤖', '🚀', '⭐', '🛰️'],
    side: 'left',
    color: '#d946ef',
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

export function HomeScreen({ sound, costume, totalStars, starsIn, onPick, onWardrobe, onResetProgress }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="safe-area relative h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-400 via-indigo-400 to-fuchsia-400">
      <Particles kind="stars" count={30} />
      {/* Wolken */}
      {['8%', '58%', '30%'].map((t, i) => (
        <div
          key={t}
          className="pointer-events-none absolute animate-float text-6xl opacity-80"
          style={{ top: t, left: i % 2 ? '70%' : '-4%', animationDelay: `${i * 0.8}s` }}
        >
          ☁️
        </div>
      ))}

      <div className="thin-scroll relative h-full overflow-y-auto">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-10">
          {/* Kopfzeile */}
          <div className="flex w-full items-center justify-between py-3">
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onWardrobe();
              }}
              className="squish flex h-12 items-center gap-2 rounded-[1.2rem] px-3 font-bold"
              style={{ '--c': '#d946ef' } as CSSProperties}
            >
              <Shirt className="h-6 w-6" /> Kostüme
            </button>
            <div className="glass flex items-center gap-1 rounded-full px-3 py-1.5 text-lg font-bold text-slate-700">
              <Star className="h-5 w-5 fill-yellow-300 text-amber-500" /> {totalStars}
            </div>
            <RoundBtn label={sound.muted ? 'Ton an' : 'Ton aus'} onClick={sound.toggleMute} color="#ffffff" dark>
              {sound.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </RoundBtn>
          </div>

          {/* Titel mit Sparky */}
          <div className="mt-1 h-28 w-28 sm:h-36 sm:w-36">
            <Sparky mood="happy" costume={costume} />
          </div>
          <h1
            className="mt-1 text-center text-4xl font-bold leading-none text-white sm:text-5xl"
            style={{ textShadow: '0 4px 0 #7c3aed, 0 8px 18px rgba(76,29,149,.55)' }}
          >
            Sparkys
            <br />
            Code-Abenteuer
          </h1>
          <p className="mt-2 text-center text-lg font-bold text-white drop-shadow">Wohin fliegen wir heute?</p>

          {/* Abenteuer-Pfad mit drei Inseln */}
          <div className="relative mt-4 w-full">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden>
              <path
                d="M30 40 C 90 70, 90 100, 70 140 S 10 200, 30 250"
                fill="none"
                stroke="#fff"
                strokeWidth="5"
                strokeDasharray="2 10"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
            </svg>

            {WORLD_ORDER.map((id, i) => {
              const w = WORLDS[id];
              const isl = ISLAND[id];
              const max = levelsFor(id).length * 3;
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
                    className="relative h-36 w-36 shrink-0 rounded-[46%_54%_50%_50%] transition active:scale-95 sm:h-44 sm:w-44"
                    style={{
                      background: isl.bg,
                      boxShadow: '0 10px 0 rgba(0,0,0,.18), 0 20px 30px -10px rgba(0,0,0,.45), inset 0 6px 0 rgba(255,255,255,.35)',
                    }}
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
                  <div className="glass flex-1 rounded-[1.6rem] px-4 py-3">
                    <div className="text-xs font-bold uppercase tracking-wide" style={{ color: isl.color }}>
                      {w.world}
                    </div>
                    <div className="text-2xl font-bold leading-tight text-slate-800">{w.name}</div>
                    <div className="text-sm font-semibold text-slate-500">
                      {w.ages} · {w.tagline}
                    </div>
                    <div className={`mt-1 flex items-center gap-1 text-sm font-bold text-slate-700 ${isl.side === 'right' ? 'justify-end' : ''}`}>
                      <Star className="h-4 w-4 fill-yellow-300 text-amber-500" /> {starsIn(id)} / {max}
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
                onResetProgress();
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
            {confirmReset ? 'Nochmal tippen zum Löschen' : 'Fortschritt zurücksetzen'}
          </button>
        </div>
      </div>
    </div>
  );
}
