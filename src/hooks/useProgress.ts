// Fortschritt (Sterne pro Level) im LocalStorage speichern
import { useCallback, useState } from 'react';
import { levelsFor } from '../data/levels';
import type { AgeGroupId } from '../types';

const KEY = 'robo-code:progress:v1';

export interface Progress {
  stars: Record<string, number>;
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Progress;
      if (parsed && typeof parsed.stars === 'object') return parsed;
    }
  } catch {
    /* ignorieren */
  }
  return { stars: {} };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  const saveStars = useCallback((levelId: string, stars: number) => {
    setProgress((p) => {
      const best = Math.max(p.stars[levelId] ?? 0, stars);
      const next = { ...p, stars: { ...p.stars, [levelId]: best } };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignorieren */
      }
      return next;
    });
  }, []);

  /** Ein Level ist frei, wenn es das erste ist oder das vorherige geschafft wurde */
  const isUnlocked = useCallback(
    (group: AgeGroupId, index: number) => {
      if (index === 0) return true;
      const prev = levelsFor(group)[index - 1];
      return (progress.stars[prev.id] ?? 0) > 0;
    },
    [progress],
  );

  const totalStars = useCallback(
    (group: AgeGroupId) => levelsFor(group).reduce((n, l) => n + (progress.stars[l.id] ?? 0), 0),
    [progress],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignorieren */
    }
    setProgress({ stars: {} });
  }, []);

  return { progress, saveStars, isUnlocked, totalStars, reset };
}
