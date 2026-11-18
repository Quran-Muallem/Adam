// ─────────────────────────────────────────────────────────────
// App: einfacher Screen-Router
// Abenteuerkarte → Welt-Karte (∞ Level) → Spiel
// (+ Kostüme, Code-Wissen, Trophäen, Einstellungen)
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Album } from './components/Album';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { LevelMap } from './components/LevelMap';
import { SettingsModal } from './components/SettingsModal';
import { SparkyLook } from './components/Sparky';
import { Trophies } from './components/Trophies';
import { Wardrobe } from './components/Wardrobe';
import { getLevel, isExpress, levelGroup } from './data/levels';
import type { Speed } from './hooks/useProgramRunner';
import { useProgress } from './hooks/useProgress';
import { useSoundEffects } from './hooks/useSoundEffects';
import { WORLD_ORDER } from './data/worlds';
import type { AgeGroupId } from './types';
import { FxLayer } from './components/FxLayer';

type Screen =
  | { name: 'home' }
  | { name: 'wardrobe' }
  | { name: 'album' }
  | { name: 'trophies' }
  | { name: 'map'; group: AgeGroupId }
  | { name: 'game'; levelId: string };

const SPEED_KEY = 'sparky:speed';
const SCREEN_KEY = 'sparky:screen';

/** Auto-Pause: beim nächsten Öffnen geht es genau dort weiter (Karte oder Level) */
function loadScreen(): Screen {
  try {
    const raw = localStorage.getItem(SCREEN_KEY);
    if (raw) {
      const s = JSON.parse(raw) as Screen;
      if (s.name === 'game' && getLevel(s.levelId)) return s;
      if (s.name === 'map' && WORLD_ORDER.includes(s.group)) return s;
    }
  } catch {
    /* ignorieren */
  }
  return { name: 'home' };
}

export default function App() {
  const sound = useSoundEffects();
  const prog = useProgress();
  const [screen, setScreen] = useState<Screen>(loadScreen);
  useEffect(() => {
    try {
      localStorage.setItem(SCREEN_KEY, JSON.stringify(screen.name === 'map' || screen.name === 'game' ? screen : { name: 'home' }));
    } catch {
      /* ignorieren */
    }
  }, [screen]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [speed, setSpeedState] = useState<Speed>(() => {
    try {
      return localStorage.getItem(SPEED_KEY) === 'turbo' ? 'turbo' : 'normal';
    } catch {
      return 'normal';
    }
  });

  const setSpeed = useCallback((s: Speed) => {
    setSpeedState(s);
    try {
      localStorage.setItem(SPEED_KEY, s);
    } catch {
      /* ignorieren */
    }
  }, []);

  // Die Musik passt sich der Welt an
  const { setTheme, play } = sound;
  const theme = screen.name === 'map' ? screen.group : screen.name === 'game' ? levelGroup(screen.levelId) : 'home';
  useEffect(() => setTheme(theme), [theme, setTheme]);

  const openSettings = useCallback(() => {
    play('click');
    setSettingsOpen(true);
  }, [play]);
  const home = () => setScreen({ name: 'home' });

  let view: ReactNode = null;
  switch (screen.name) {
    case 'home':
      view = (
        <HomeScreen
          sound={sound}
          prog={prog}
          onPick={(group) => setScreen({ name: 'map', group })}
          onExpress={(levelId) => setScreen({ name: 'game', levelId })}
          onWardrobe={() => setScreen({ name: 'wardrobe' })}
          onAlbum={() => setScreen({ name: 'album' })}
          onTrophies={() => setScreen({ name: 'trophies' })}
          onSettings={openSettings}
        />
      );
      break;
    case 'wardrobe':
      view = (
        <Wardrobe
          sound={sound}
          costume={prog.costume}
          skin={prog.skin}
          totalStars={prog.totalStars}
          onWear={prog.setCostume}
          onSkin={prog.setSkin}
          onBack={home}
        />
      );
      break;
    case 'album':
      view = <Album sound={sound} stars={prog.progress.stars} onBack={home} />;
      break;
    case 'trophies':
      view = <Trophies sound={sound} prog={prog} onBack={home} />;
      break;
    case 'map':
      view = (
        <LevelMap
          key={screen.group}
          group={screen.group}
          sound={sound}
          prog={prog}
          onBack={home}
          onOpen={(levelId) => setScreen({ name: 'game', levelId })}
          onSettings={openSettings}
        />
      );
      break;
    case 'game': {
      const level = getLevel(screen.levelId);
      if (!level) break;
      view = (
        <GameScreen
          key={level.id}
          level={level}
          sound={sound}
          speed={speed}
          prog={prog}
          onBack={() => setScreen(isExpress(level.id) ? { name: 'home' } : { name: 'map', group: level.group })}
          onOpenLevel={(levelId) => setScreen({ name: 'game', levelId })}
          onSettings={openSettings}
        />
      );
      break;
    }
  }

  return (
    <SparkyLook.Provider value={{ costume: prog.costume, skin: prog.skin }}>
      {view}
      <FxLayer />
      {settingsOpen && <SettingsModal sound={sound} speed={speed} setSpeed={setSpeed} onClose={() => setSettingsOpen(false)} />}
    </SparkyLook.Provider>
  );
}
