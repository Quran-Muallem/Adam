// ─────────────────────────────────────────────────────────────
// App: einfacher Screen-Router
// Abenteuerkarte → Welt-Karte (20 Level) → Spiel   (+ Kostüm-Schrank)
// ─────────────────────────────────────────────────────────────
import { useCallback, useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { LevelMap } from './components/LevelMap';
import { Wardrobe } from './components/Wardrobe';
import { getLevel } from './data/levels';
import type { Speed } from './hooks/useProgramRunner';
import { useProgress } from './hooks/useProgress';
import { useSoundEffects } from './hooks/useSoundEffects';
import type { AgeGroupId } from './types';

type Screen =
  | { name: 'home' }
  | { name: 'wardrobe' }
  | { name: 'map'; group: AgeGroupId }
  | { name: 'game'; levelId: string };

const SPEED_KEY = 'sparky:speed';

export default function App() {
  const sound = useSoundEffects();
  const prog = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [speed, setSpeed] = useState<Speed>(() => {
    try {
      return localStorage.getItem(SPEED_KEY) === 'turbo' ? 'turbo' : 'normal';
    } catch {
      return 'normal';
    }
  });

  const { play } = sound;
  const toggleSpeed = useCallback(() => {
    play('click');
    setSpeed((s) => {
      const next: Speed = s === 'normal' ? 'turbo' : 'normal';
      try {
        localStorage.setItem(SPEED_KEY, next);
      } catch {
        /* ignorieren */
      }
      return next;
    });
  }, [play]);

  switch (screen.name) {
    case 'home':
      return (
        <HomeScreen
          sound={sound}
          costume={prog.costume}
          totalStars={prog.totalStars}
          starsIn={prog.starsIn}
          onPick={(group) => setScreen({ name: 'map', group })}
          onWardrobe={() => setScreen({ name: 'wardrobe' })}
          onResetProgress={prog.reset}
        />
      );
    case 'wardrobe':
      return (
        <Wardrobe
          sound={sound}
          costume={prog.costume}
          totalStars={prog.totalStars}
          onWear={prog.setCostume}
          onBack={() => setScreen({ name: 'home' })}
        />
      );
    case 'map':
      return (
        <LevelMap
          group={screen.group}
          sound={sound}
          stars={prog.progress.stars}
          costume={prog.costume}
          isUnlocked={prog.isUnlocked}
          onBack={() => setScreen({ name: 'home' })}
          onOpen={(levelId) => setScreen({ name: 'game', levelId })}
        />
      );
    case 'game': {
      const level = getLevel(screen.levelId);
      if (!level) return null;
      return (
        <GameScreen
          key={level.id}
          level={level}
          sound={sound}
          speed={speed}
          onToggleSpeed={toggleSpeed}
          bestStars={prog.progress.stars[level.id] ?? 0}
          totalStars={prog.totalStars}
          costume={prog.costume}
          onSaveStars={prog.saveStars}
          onWear={prog.setCostume}
          onBack={() => setScreen({ name: 'map', group: level.group })}
          onOpenLevel={(levelId) => setScreen({ name: 'game', levelId })}
        />
      );
    }
  }
}
