// Fortschritt (Sterne pro Level) + gewähltes Kostüm im LocalStorage
import { useCallback, useMemo, useState } from 'react';
import { COSTUMES, type CostumeId } from '../data/costumes';
import { LEVELS, levelsFor } from '../data/levels';
import type { AgeGroupId } from '../types';

const KEY = 'sparky:progress:v2';

export interface Progress {
  stars: Record<string, number>;
  costume: CostumeId;
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Progress>;
      return { stars: p.stars ?? {}, costume: p.costume ?? 'none' };
    }
  } catch {
    /* ignorieren */
  }
  return { stars: {}, costume: 'none' };
}

function persist(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignorieren */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = fn(p);
      persist(next);
      return next;
    });
  }, []);

  const saveStars = useCallback(
    (levelId: string, stars: number) =>
      update((p) => ({ ...p, stars: { ...p.stars, [levelId]: Math.max(p.stars[levelId] ?? 0, stars) } })),
    [update],
  );

  const setCostume = useCallback((costume: CostumeId) => update((p) => ({ ...p, costume })), [update]);

  /** Ein Level ist frei, wenn es das erste ist oder das vorherige geschafft wurde */
  const isUnlocked = useCallback(
    (group: AgeGroupId, index: number) => {
      if (index === 0) return true;
      const prev = levelsFor(group)[index - 1];
      return (progress.stars[prev.id] ?? 0) > 0;
    },
    [progress],
  );

  const starsIn = useCallback(
    (group: AgeGroupId) => levelsFor(group).reduce((n, l) => n + (progress.stars[l.id] ?? 0), 0),
    [progress],
  );

  const totalStars = useMemo(() => LEVELS.reduce((n, l) => n + (progress.stars[l.id] ?? 0), 0), [progress]);

  const reset = useCallback(() => update(() => ({ stars: {}, costume: 'none' })), [update]);

  // Kostüm nur behalten, wenn es (noch) freigeschaltet ist
  const costume = COSTUMES.find((c) => c.id === progress.costume && totalStars >= c.stars)?.id ?? 'none';

  return { progress, costume, saveStars, setCostume, isUnlocked, starsIn, totalStars, reset };
}

export type ProgressApi = ReturnType<typeof useProgress>;
