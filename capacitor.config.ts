import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quranmuallem.robocode',
  appName: 'Sparky Code',
  webDir: 'dist',
  android: {
    // Kindgerecht: keine Debug-Overlays, Hintergrund passend zur App
    backgroundColor: '#1e1b4b',
  },
  plugins: {
    // App beginnt unterhalb der Statusleiste (keine Überlappung mit Uhrzeit/Akku)
    SystemBars: { insetsHandling: 'native' },
  },
};

export default config;
