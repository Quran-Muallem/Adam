// Level-Übersicht einer Altersstufe
import { ChevronLeft, Lock, Star } from 'lucide-react';
import { AGE_GROUPS } from '../data/ageGroups';
import { levelsFor } from '../data/levels';
import type { SoundApi } from '../hooks/useSoundEffects';
import type { AgeGroupId } from '../types';

interface Props {
  group: AgeGroupId;
  sound: SoundApi;
  stars: Record<string, number>;
  isUnlocked: (g: AgeGroupId, i: number) => boolean;
  onBack: () => void;
  onOpen: (levelId: string) => void;
}

export function LevelSelect({ group, sound, stars, isUnlocked, onBack, onOpen }: Props) {
  const g = AGE_GROUPS[group];
  const levels = levelsFor(group);
  const total = levels.reduce((n, l) => n + (stars[l.id] ?? 0), 0);
  const light = group === 'hero';

  return (
    <div className={`safe-area flex h-[100dvh] flex-col overflow-y-auto bg-gradient-to-br ${g.theme.page}`}>
      <header className="flex items-center gap-3 p-3">
        <button
          type="button"
          aria-label="Zurück"
          onClick={() => {
            sound.play('click');
            onBack();
          }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-md active:scale-95"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className={`flex-1 ${light ? 'text-white' : 'text-slate-800'}`}>
          <h2 className="text-2xl font-black leading-none">
            {g.emoji} {g.name}
          </h2>
          <p className="text-sm font-bold opacity-80">{g.ages}</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-white/90 px-3 py-2 text-lg font-black text-slate-700 shadow">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" /> {total}/{levels.length * 3}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 p-4 sm:grid-cols-3">
        {levels.map((l, i) => {
          const open = isUnlocked(group, i);
          const s = stars[l.id] ?? 0;
          return (
            <button
              key={l.id}
              type="button"
              disabled={!open}
              aria-label={open ? `Level ${i + 1}` : `Level ${i + 1} gesperrt`}
              onClick={() => {
                sound.play('unlock');
                onOpen(l.id);
              }}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-[2rem] p-3 shadow-[0_8px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-none ${
                open ? 'bg-white' : 'bg-white/40'
              }`}
            >
              {open ? (
                <>
                  <span className="text-5xl font-black text-slate-700">{i + 1}</span>
                  {g.showText && (
                    <span className="line-clamp-2 text-center text-sm font-bold leading-tight text-slate-500">{l.title}</span>
                  )}
                  <span className="flex">
                    {[1, 2, 3].map((k) => (
                      <Star
                        key={k}
                        className={`h-7 w-7 ${k <= s ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-100 text-slate-300'}`}
                      />
                    ))}
                  </span>
                </>
              ) : (
                <Lock className="h-12 w-12 text-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
