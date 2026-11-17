// ─────────────────────────────────────────────────────────────
// App: einfacher Screen-Router (Start → Level-Auswahl → Spiel)
// ─────────────────────────────────────────────────────────────
import { useCallback, useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { LevelSelect } from './components/LevelSelect';
import { getLevel } from './data/levels';
import type { Speed } from './hooks/useProgramRunner';
import { useProgress } from './hooks/useProgress';
import { useSoundEffects } from './hooks/useSoundEffects';
import type { AgeGroupId } from './types';

type Screen = { name: 'home' } | { name: 'levels'; group: AgeGroupId } | { name: 'game'; levelId: string };

const SPEED_KEY = 'robo-code:speed';

export default function App() {
  const sound = useSoundEffects();
  const { progress, saveStars, isUnlocked, totalStars, reset } = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [speed, setSpeed] = useState<Speed>(() => {
    try {
      return localStorage.getItem(SPEED_KEY) === 'turbo' ? 'turbo' : 'normal';
    } catch {
      return 'normal';
    }
  });

  const toggleSpeed = useCallback(() => {
    sound.play('click');
    setSpeed((s) => {
      const next: Speed = s === 'normal' ? 'turbo' : 'normal';
      try {
        localStorage.setItem(SPEED_KEY, next);
      } catch {
        /* ignorieren */
      }
      return next;
    });
  }, [sound]);

  if (screen.name === 'home') {
    return (
      <HomeScreen
        sound={sound}
        totalStars={totalStars}
        onPick={(group) => setScreen({ name: 'levels', group })}
        onResetProgress={reset}
      />
    );
  }

  if (screen.name === 'levels') {
    return (
      <LevelSelect
        group={screen.group}
        sound={sound}
        stars={progress.stars}
        isUnlocked={isUnlocked}
        onBack={() => setScreen({ name: 'home' })}
        onOpen={(levelId) => setScreen({ name: 'game', levelId })}
      />
    );
  }

  const level = getLevel(screen.levelId);
  if (!level) return null;
  return (
    <GameScreen
      key={level.id}
      level={level}
      sound={sound}
      speed={speed}
      onToggleSpeed={toggleSpeed}
      bestStars={progress.stars[level.id] ?? 0}
      onSaveStars={saveStars}
      onBack={() => setScreen({ name: 'levels', group: level.group })}
      onOpenLevel={(levelId) => setScreen({ name: 'game', levelId })}
    />
  );
}
