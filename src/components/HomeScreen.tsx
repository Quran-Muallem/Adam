// Startbildschirm: Altersstufe wählen
import { RotateCcw, Star, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { AGE_GROUP_ORDER, AGE_GROUPS } from '../data/ageGroups';
import { levelsFor } from '../data/levels';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { AgeGroupId } from '../types';
import { Character } from './Character';

interface Props {
  sound: SoundApi;
  totalStars: (g: AgeGroupId) => number;
  onPick: (g: AgeGroupId) => void;
  onResetProgress: () => void;
}

const CARD_STYLE: Record<AgeGroupId, string> = {
  mini: 'from-amber-300 to-orange-400 text-orange-950',
  junior: 'from-sky-300 to-emerald-400 text-sky-950',
  hero: 'from-violet-500 to-fuchsia-600 text-white',
};

export function HomeScreen({ sound, totalStars, onPick, onResetProgress }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="safe-area relative flex h-[100dvh] flex-col overflow-y-auto bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500">
      {/* Sternenhimmel */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 animate-twinkle rounded-full bg-white"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%`, animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}

      <div className="relative flex items-center justify-end p-3">
        <button
          type="button"
          aria-label={sound.muted ? 'Ton an' : 'Ton aus'}
          onClick={sound.toggleMute}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-md active:scale-95"
        >
          {sound.muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-6">
        <div className="h-24 w-24 animate-float sm:h-32 sm:w-32">
          <Character kind="robot" dir="right" mood="happy" />
        </div>
        <h1 className="mt-2 text-center text-4xl font-black leading-none text-white drop-shadow-lg sm:text-5xl">
          Robo Code-Abenteuer
        </h1>
        <p className="mt-2 text-center text-lg font-bold text-white/90">Wie alt bist du?</p>

        <div className="mt-5 grid w-full gap-4 sm:grid-cols-3">
          {AGE_GROUP_ORDER.map((id) => {
            const g = AGE_GROUPS[id];
            const max = levelsFor(id).length * 3;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  sound.play('unlock');
                  onPick(id);
                }}
                className={`flex min-h-[120px] items-center gap-4 rounded-[2rem] bg-gradient-to-br ${CARD_STYLE[id]} p-4 text-left shadow-[0_8px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none sm:flex-col sm:text-center`}
              >
                <span className="text-6xl sm:text-7xl">{g.emoji}</span>
                <span className="flex flex-col">
                  <span className="text-2xl font-black leading-tight">{g.name}</span>
                  <span className="text-base font-bold opacity-80">{g.ages}</span>
                  <span className="text-sm font-semibold opacity-80">{g.tagline}</span>
                  <span className="mt-1 flex items-center gap-1 text-sm font-extrabold sm:justify-center">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-500" /> {totalStars(id)} / {max}
                  </span>
                </span>
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
          className="mt-auto flex items-center gap-2 pt-8 text-sm font-bold text-white/70"
        >
          <RotateCcw className="h-4 w-4" />
          {confirmReset ? 'Nochmal tippen zum Löschen' : 'Fortschritt zurücksetzen'}
        </button>
      </div>
    </div>
  );
}
