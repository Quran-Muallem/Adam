import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' sorgt für relative Pfade – nötig für Capacitor (iOS/Android) und GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
});
