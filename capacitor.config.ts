import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quranmuallem.robocode',
  appName: 'Robo Code',
  webDir: 'dist',
  android: {
    // Kindgerecht: keine Debug-Overlays, Hintergrund passend zur App
    backgroundColor: '#1e1b4b',
  },
};

export default config;
