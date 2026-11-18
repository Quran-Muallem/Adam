# 🐉 Sparkys Code-Abenteuer

Eine extrem bunte, verspielte Lern-App im Animationsfilm-Stil, die Kindern von **4 bis 12 Jahren** Programmieren beibringt. Begleiter ist **Sparky**, ein kleiner runder Weltraum-Drache mit großen Kulleraugen, der hüpft, staunt, wackelt und bei Hindernissen ein lustiges „Boing“-Gesicht macht.

**Tech:** React 18 · TypeScript · Tailwind CSS · Lucide-Icons · Vite · Web Audio API (keine Sound-Dateien) · Capacitor (Android)

## 3 Welten · 60 Level

| Welt | Alter | Level 1–20 |
|---|---|---|
| 🌳 **Zauberwald der Glühwürmchen** – Mini-Entdecker | 4–5 | Ohne Lesen: Steuerkreuz mit großen Buttons (≥ 68 px). 1–5 gerade Wege, 6–12 Kurven & Zauberbeeren 🫐, 13–20 Mini-Labyrinthe mit schlafenden Bären 🐻 und Pfützen. |
| 🏴‍☠️ **Kristall-Lagune der Piraten** – Junior-Coder | 6–8 | Sparky-Sprechblasen. 1–6 Wiederholen-Container (2×–6×), 7–13 Springen über Fässer & Kristalle 💎, 14–20 Schlüssel 🗝️ + magische Tore 🚪 + Kombinationen. |
| 🚀 **Sternen-Akademie der Roboter** – Code-Helden | 9–12 | 1–6 verschachtelte Schleifen & Effizienz, 7–13 Bedingungen („Wenn Weg frei / versperrt / Hindernis voraus“), 14–20 Zauber-Makro F1 & Teleporter-Rätsel 🌀. |

## Spielgefühl

- 🗺️ Illustrierte Abenteuerkarte + scrollbare Welt-Karten mit geschwungenem Pfad und Level-Inseln
- ⭐ 1–3 Sterne pro Level (Bonus-Items einsammeln **oder** mit wenigen Blöcken lösen), gespeichert im `localStorage`
- 🔦 Visuelles Debugging: Der laufende Block leuchtet golden und pulsiert im Takt der Schritte
- 🎉 Konfetti-Explosion, Fanfare, hüpfender Sparky
- 👗 Kostüm-Schrank: Partyhut, Zauberhut, Piratenklappe, Blumenkranz, Astronautenhelm, Krone, Umhang – freigeschaltet durch Sterne
- 🐢/⚡ Normal- und Turbo-Modus · 🔇 Mute
- 🎵 Marimba-/Harfen-Klänge, „Boing“ und Sieges-Fanfare – alles live synthetisiert
- 📱 Mobile-First & Tablet-Layout, kein Zoomen/ungewolltes Scrollen
- 🌍 6 Sprachen: العربية (von rechts nach links), English, Deutsch, Français, Español, Italiano – Auswahl über die Flagge auf der Startseite, beim ersten Start gilt die Gerätesprache

## Starten

```bash
npm install
npm run dev       # Entwicklungsserver
npm test          # prüft alle 60 Level (Referenzlösungen + Breitensuche)
npm run build     # Produktions-Build nach dist/
```

## Projektstruktur

```
src/
├── types.ts                 # Level-Schema, Block-Typen, Weltzustand
├── data/
│   ├── levels.ts            # ⭐ alle 60 Level im Grid-String-Format
│   ├── worlds.ts            # die 3 Themenwelten (Farben, Emojis, Partikel)
│   ├── costumes.ts          # freischaltbare Kostüme
│   └── messages.ts          # Sparkys Sprüche & Fehlermeldungen
├── i18n/                    # 🌍 Sprachpakete (ar, en, de, fr, es, it) + LanguageProvider
├── engine/                  # Interpreter (Frames vorab berechnet), Karte, Bewertung
├── hooks/
│   ├── useSoundEffects.ts   # Web-Audio-Synthesizer + Mute
│   ├── useProgramRunner.ts  # spielt Frames ab (useRef-Timer, ohne Race-Conditions)
│   └── useProgress.ts       # Sterne & Kostüm im localStorage
└── components/              # Sparky (SVG), Board, Workspace, Karten, Kostüm-Schrank …
tests/levels.test.ts         # geprüfte Lösung für jedes Level
```

## Neues Level hinzufügen

In `src/data/levels.ts` eine Zeile ergänzen:

```ts
L('junior', 21, 'Sternenregen', ['S.*..', '.#o#.', '..*.G'], 'right', J_JUMP, 10, 6, 'Sparkys Tipp …'),
```

**Legende:** `S` Start · `G` Ziel · `.` frei · `#` hohes Hindernis (nicht überspringbar) · `o` niedriges Hindernis (überspringbar) · `B` schlafender Bär · `P` Pfütze · `*` Bonus · `K` Schlüssel · `D` Tor · `1`/`2`/`3` Teleporter-Paare.
Danach in `tests/levels.test.ts` eine Lösung eintragen, in jedem Sprachpaket unter `src/i18n/` Titel und Tipp ergänzen und `npm test` laufen lassen (der Test meldet fehlende Übersetzungen).

## Als iOS-/Android-App (Capacitor)

Capacitor ist eingerichtet (`capacitor.config.ts`). Lokal:

```bash
npm run build
npx cap add android      # bzw. ios (braucht einen Mac mit Xcode)
npx cap sync
npx cap open android
```

## Automatische Builds (GitHub Actions)

Bei jedem Push auf `main` laufen zwei Workflows:

- **Web (GitHub Pages)** – baut die App und legt sie im Branch `gh-pages` ab. Spielbar unter **https://quran-muallem.github.io/Adam/** (einmalig unter *Settings → Pages* die Quelle „Deploy from a branch → gh-pages / root“ wählen, falls die Seite nicht von selbst erscheint).
- **Android APK** – baut mit Capacitor eine installierbare APK und veröffentlicht sie unter **Releases** (`sparky-code.apk`).

`android-signing/debug.keystore` ist ein reiner Test-Schlüssel (Passwort `android`), damit jede neue APK über die alte installiert werden kann. Für eine Veröffentlichung im Play Store einen eigenen, geheimen Schlüssel verwenden.
