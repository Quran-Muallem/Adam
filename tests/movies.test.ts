// Erklär-Kino: jedes Drehbuch passt in 20 Sekunden und endet mit 3 Sternen
import { describe, expect, it } from 'vitest';
import { MOVIE_SECONDS, MOVIES, sceneAt } from '../src/data/movies';

describe('Erklär-Kino', () => {
  for (const [group, movie] of Object.entries(MOVIES)) {
    it(`${group}: Drehbuch läuft 0–20 s und endet mit Sieg`, () => {
      for (const s of movie.steps) {
        expect(s.t).toBeGreaterThanOrEqual(0);
        expect(s.t).toBeLessThanOrEqual(MOVIE_SECONDS);
      }
      const end = sceneAt(movie, MOVIE_SECONDS);
      expect(end.stars).toBe(3);
      expect(end.sparky.mood).toBe('happy');
      // Sparky steht am Ende auf dem Ziel
      expect(movie.grid[end.sparky.y][end.sparky.x]).toBe('G');
    });
  }
});
