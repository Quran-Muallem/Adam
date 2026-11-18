// ─────────────────────────────────────────────────────────────
// Fortschritt im LocalStorage: Sterne pro Level (unendlich viele),
// Kostüm & Farbe, Bonus-Sterne, Schatztruhen, Sticker, Tages-Serie
// ─────────────────────────────────────────────────────────────
import { useCallback, useMemo, useRef, useState } from 'react';
import { COSTUMES, SKINS, type CostumeId, type SkinId } from '../data/costumes';
import { isExpress, levelGroup, levelNumber } from '../data/levels';
import { CHEST_EVERY, dayKey, earnedBadges, isMilestone, randomNewSticker, yesterdayKey, type WheelPrize } from '../data/rewards';
import type { AgeGroupId } from '../types';

const KEY = 'sparky:progress:v2';

export interface Progress {
  stars: Record<string, number>;
  costume: CostumeId;
  skin: SkinId;
  /** Sterne aus Glücksrad & Meilensteinen */
  bonusStars: number;
  chestsOpened: number;
  stickers: string[];
  lastSpin: string | null;
  streak: number;
  bestStreak: number;
  /** Bereits belohnte Meilenstein-Level */
  milestones: string[];
  /** S-Bahn-Express: Sterne je Tages-Rätsel (zählen nicht für die Karte) */
  express: Record<string, number>;
  /** Festtags-Abzeichen, z. B. „eidAdha-2026“ */
  fests: string[];
}

const EMPTY: Progress = {
  stars: {},
  costume: 'none',
  skin: 'violet',
  bonusStars: 0,
  chestsOpened: 0,
  stickers: [],
  lastSpin: null,
  streak: 0,
  bestStreak: 0,
  milestones: [],
  express: {},
  fests: [],
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    /* ignorieren */
  }
  return EMPTY;
}

function persist(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignorieren */
  }
}

export interface Reward {
  stars: number;
  sticker: string | null;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);
  // Aktueller Stand synchron in einer Ref – so können Belohnungen sofort
  // (und genau einmal) berechnet und zurückgegeben werden.
  const ref = useRef(progress);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(ref.current);
    if (next === ref.current) return;
    ref.current = next;
    persist(next);
    setProgress(next);
  }, []);

  const levelStars = useMemo(() => Object.values(progress.stars).reduce((n, s) => n + s, 0), [progress.stars]);
  const totalStars = levelStars + progress.bonusStars;

  /** Speichert Sterne; beim ersten Schaffen eines Meilensteins gibt es einen Schatz */
  const saveStars = useCallback(
    (levelId: string, stars: number): Reward | null => {
      let reward: Reward | null = null;
      // Tages-Rätsel: eigene Wertung, Bonus-Sterne beim ersten Lösen
      if (isExpress(levelId)) {
        update((p) => {
          const prev = p.express[levelId] ?? 0;
          if (stars <= prev) return p;
          return { ...p, express: { ...p.express, [levelId]: stars }, bonusStars: p.bonusStars + (stars - prev) };
        });
        return null;
      }
      update((p) => {
        const next = { ...p, stars: { ...p.stars, [levelId]: Math.max(p.stars[levelId] ?? 0, stars) } };
        if (stars > 0 && isMilestone(levelNumber(levelId)) && !p.milestones.includes(levelId)) {
          const sticker = randomNewSticker(p.stickers);
          reward = { stars: 5, sticker };
          return {
            ...next,
            milestones: [...p.milestones, levelId],
            bonusStars: p.bonusStars + 5,
            stickers: sticker ? [...p.stickers, sticker] : p.stickers,
          };
        }
        return next;
      });
      return reward;
    },
    [update],
  );

  const setCostume = useCallback((costume: CostumeId) => update((p) => ({ ...p, costume })), [update]);
  const setSkin = useCallback((skin: SkinId) => update((p) => ({ ...p, skin })), [update]);

  /** Level n ist frei, wenn n = 1 oder Level n-1 geschafft ist */
  const isUnlocked = useCallback((group: AgeGroupId, n: number) => n <= 1 || (progress.stars[`${group}-${n - 1}`] ?? 0) > 0, [progress]);

  /** Höchstes freigeschaltetes Level einer Welt */
  const frontier = useCallback(
    (group: AgeGroupId) => {
      let best = 0;
      for (const [id, s] of Object.entries(progress.stars)) if (s > 0 && levelGroup(id) === group) best = Math.max(best, levelNumber(id));
      return best + 1;
    },
    [progress],
  );

  const starsIn = useCallback(
    (group: AgeGroupId) =>
      Object.entries(progress.stars).reduce((n, [id, s]) => (levelGroup(id) === group ? n + s : n), 0),
    [progress],
  );

  // ── Schatztruhe ──
  const chestsEarned = Math.floor(totalStars / CHEST_EVERY);
  const chestReady = chestsEarned > progress.chestsOpened;
  const chestFill = chestReady ? CHEST_EVERY : totalStars % CHEST_EVERY;
  const openChest = useCallback((): Reward | null => {
    let reward: Reward | null = null;
    update((p) => {
      const total = Object.values(p.stars).reduce((n, s) => n + s, 0) + p.bonusStars;
      if (Math.floor(total / CHEST_EVERY) <= p.chestsOpened) return p;
      const sticker = randomNewSticker(p.stickers);
      reward = { stars: sticker ? 0 : 2, sticker };
      return {
        ...p,
        chestsOpened: p.chestsOpened + 1,
        stickers: sticker ? [...p.stickers, sticker] : p.stickers,
        bonusStars: p.bonusStars + (sticker ? 0 : 2),
      };
    });
    return reward;
  }, [update]);

  // ── Tägliche Überraschung ──
  const canSpin = progress.lastSpin !== dayKey();
  const addFest = useCallback(
    (id: string) => update((p) => ((p.fests ?? []).includes(id) ? p : { ...p, fests: [...(p.fests ?? []), id] })),
    [update],
  );

  const claimSpin = useCallback(
    (prize: WheelPrize, multiplier = 1): Reward => {
      const reward: Reward = { stars: 0, sticker: null };
      update((p) => {
        if (p.lastSpin === dayKey()) return p;
        const streak = p.lastSpin === yesterdayKey() ? p.streak + 1 : 1;
        let { bonusStars, stickers } = p;
        if (prize.kind === 'stars') {
          // Zuckerfest: doppelte Sterne am Glücksrad
          reward.stars = prize.amount * multiplier;
        } else {
          reward.sticker = randomNewSticker(stickers);
          if (!reward.sticker) reward.stars = 2;
        }
        // Serien-Bonus ab 3 Tagen am Stück
        if (streak >= 3) reward.stars += 1;
        bonusStars += reward.stars;
        if (reward.sticker) stickers = [...stickers, reward.sticker];
        return { ...p, lastSpin: dayKey(), streak, bestStreak: Math.max(p.bestStreak, streak), bonusStars, stickers };
      });
      return reward;
    },
    [update],
  );

  const reset = useCallback(() => update(() => EMPTY), [update]);

  const badges = useMemo(() => earnedBadges({ stars: progress.stars, totalStars, bestStreak: progress.bestStreak }), [progress, totalStars]);

  // Kostüm/Farbe nur behalten, wenn freigeschaltet
  const costume = COSTUMES.find((c) => c.id === progress.costume && totalStars >= c.stars)?.id ?? 'none';
  const skin = SKINS.find((s) => s.id === progress.skin && totalStars >= s.stars)?.id ?? 'violet';

  return {
    progress,
    costume,
    skin,
    totalStars,
    saveStars,
    setCostume,
    setSkin,
    isUnlocked,
    frontier,
    starsIn,
    chestFill,
    chestReady,
    openChest,
    canSpin,
    claimSpin,
    /** Festtags-Abzeichen sammeln (einmal pro Fest und Jahr) */
    addFest,
    badges,
    reset,
  };
}

export type ProgressApi = ReturnType<typeof useProgress>;
