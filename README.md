# 🤖 Robo Code-Abenteuer

Eine spielerische, interaktive Lern-Web-App, die Kindern von **4 bis 12 Jahren** Programmierkonzepte beibringt – mit Monster, Roboter, Sternen, Konfetti und ganz ohne Werbung.

**Tech:** React 18 · TypeScript · Tailwind CSS · Lucide-Icons · Vite · Web Audio API (keine Sound-Dateien)

## Altersstufen

| Stufe | Alter | Mechanik |
|---|---|---|
| 👾 **Mini-Entdecker** | 4–5 | Rein visuell, keine Lesekenntnisse nötig. Steuerkreuz mit großen Buttons (≥ 64 px), max. 4 Schritte, das hungrige Monster läuft zum Apfel. |
| 🤖 **Junior-Coder** | 6–8 | Bewegungsblöcke mit Wiederholungszahl (`2×`, `3×` …), **Springen** über Steine, Bonus-Sterne, Schlüssel ➜ Truhe. |
| 🚀 **Code-Helden** | 9–12 | Relative Steuerung (Vorwärts / Drehen), **Schleifen**, **Bedingungen** („Wenn Weg blockiert“), **Zauber-Makro** (Funktion), Block-Limit für 3 Sterne. |

## Features

- ⭐ 1–3 Sterne pro Level, Konfetti bei Erfolg, Fortschritt im `localStorage`
- 🔦 **Visuelles Debugging:** Der gerade ausgeführte Block leuchtet live auf (inkl. Schleifen-Runde und Ja/Nein-Anzeige bei Bedingungen)
- 🐢/⚡ Geschwindigkeit **Normal / Turbo** (auch mitten im Lauf umschaltbar)
- 🔇 Mute-Button, Einstellung wird gespeichert
- 😄 Witzige, ermutigende Fehlermeldungen („Ups, gegen den Stein geknuddelt!“)
- 📱 Mobile-First / Tablet-Layout, kein versehentliches Zoomen oder Scrollen

## Starten

```bash
npm install
npm run dev       # Entwicklungsserver
npm test          # prüft, dass jedes Level lösbar ist
npm run build     # Produktions-Build nach dist/
```

## Projektstruktur

```
src/
├── types.ts                 # Level-Schema, Block-Typen, Weltzustand
├── data/
│   ├── levels.ts            # ⭐ Alle Level (JSON-kompatibel) – hier neue Level anlegen
│   ├── ageGroups.ts         # Design & Mechanik je Altersstufe
│   └── messages.ts          # Lob & witzige Fehlermeldungen
├── engine/
│   ├── world.ts             # Karte parsen, Richtungen, Kollision
│   ├── interpreter.ts       # Führt Programme aus ➜ Animations-Frames
│   ├── program.ts           # Programm-Baum bearbeiten (immutable)
│   └── rating.ts            # Sterne-Bewertung
├── hooks/
│   ├── useSoundEffects.ts   # Web-Audio-Sounds + Mute
│   ├── useProgramRunner.ts  # Spielt Frames ab (useRef-Timer, ohne Race-Conditions)
│   └── useProgress.ts       # Fortschritt im localStorage
└── components/              # UI (Start, Level-Auswahl, Spiel, Board, Workspace …)
tests/levels.test.ts         # Referenzlösung pro Level
```

**Architektur-Idee:** Der Interpreter berechnet die komplette Ausführung *vorab* als Liste von Frames. Die UI spielt diese Frames nur noch ab. Ein Lauf-Token im `useProgramRunner` sorgt dafür, dass gestoppte oder neu gestartete Läufe sich nie in die Quere kommen.

## Neues Level hinzufügen

In `src/data/levels.ts` ein Objekt ergänzen:

```ts
{
  id: 'junior-5',
  group: 'junior',            // 'mini' | 'junior' | 'hero'
  title: 'Sternenregen',
  hint: 'Sammle alle Sterne!',
  map: [
    'S.*..',
    '.#.#.',
    '..*.G',
  ],
  startDir: 'right',
  palette: ['up', 'down', 'left', 'right', 'jump'],
  maxBlocks: 8,
  par: 4,
}
```

Karten-Legende: `S` Start · `G` Ziel · `.` frei · `#` Stein · `*` Bonus-Stern · `K` Schlüssel · `C` Truhe (Ziel, braucht Schlüssel).
Danach in `tests/levels.test.ts` eine Referenzlösung eintragen und `npm test` laufen lassen.

## Als iOS-/Android-App (Capacitor)

`vite.config.ts` nutzt bereits `base: './'`, damit die App in Capacitor funktioniert.

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Robo Code" com.example.robocode --web-dir dist
npm run build
npx cap add android      # bzw. ios (braucht einen Mac mit Xcode)
npx cap sync
npx cap open android
```

Hinweis: Die Schriftart „Baloo 2“ wird von Google Fonts geladen. Offline fällt die App automatisch auf eine runde Systemschrift zurück; für eine reine Offline-App die Schrift lokal unter `public/` ablegen.

## Automatische Builds (GitHub Actions)

Bei jedem Push auf `main` laufen zwei Workflows:

- **Web (GitHub Pages)** – baut die App und legt sie im Branch `gh-pages` ab. Spielbar unter **https://quran-muallem.github.io/Adam/** (einmalig unter *Settings → Pages* die Quelle „Deploy from a branch → gh-pages / root“ wählen, falls die Seite nicht von selbst erscheint).
- **Android APK** – baut mit Capacitor eine installierbare APK und veröffentlicht sie unter **Releases** (`robo-code.apk`).

`android-signing/debug.keystore` ist ein reiner Test-Schlüssel (Passwort `android`), damit jede neue APK über die alte installiert werden kann. Für eine Veröffentlichung im Play Store einen eigenen, geheimen Schlüssel verwenden.
