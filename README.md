# 🐉 Sparkys Code-Abenteuer

Eine extrem bunte, verspielte Lern-App im Animationsfilm-Stil, die der **ganzen Familie** Programmieren beibringt – von **4 Jahren bis zu Erwachsenen**, optimiert für die kurze S-Bahn-Fahrt. Begleiter ist **Sparky**, ein kleiner runder Weltraum-Drache mit großen Kulleraugen, der hüpft, staunt, wackelt und bei Hindernissen ein lustiges „Boing“-Gesicht macht.

**Tech:** React 18 · TypeScript · Tailwind CSS · Lucide-Icons · Vite · Web Audio API (keine Sound-Dateien) · Capacitor (Android)

## 5 Welten · 80 handgefertigte Level + ∞

| Welt | Alter | Level 1–20 |
|---|---|---|
| 🌳 **Zauberwald der Glühwürmchen** – Mini-Entdecker | 4–5 | Ohne Lesen: Steuerkreuz mit großen Buttons (≥ 68 px). 1–5 gerade Wege, 6–12 Kurven & Zauberbeeren 🫐, 13–20 Mini-Labyrinthe mit schlafenden Bären 🐻 und Pfützen. |
| 🏴‍☠️ **Kristall-Lagune der Piraten** – Junior-Coder | 6–8 | Sparky-Sprechblasen. 1–6 Wiederholen-Container (2×–6×), 7–13 Springen über Fässer & Kristalle 💎, 14–20 Schlüssel 🗝️ + magische Tore 🚪 + Kombinationen. |
| 🚀 **Sternen-Akademie der Roboter** – Code-Helden | 9–12 | 1–6 verschachtelte Schleifen & Effizienz, 7–13 Bedingungen („Wenn Weg frei / versperrt / Hindernis voraus“), 14–20 Zauber-Makro F1 & Teleporter-Rätsel 🌀. |
| 🌆 **Neon-Metropole** – Cyber-Pioniere | 13–17 | Cyberpunk-Look + Synthwave. 10 Level: Solange-Schleifen (`while`), Variablen/Zähler (`n = 6`, `n − 1`), Logik-Gatter **NICHT / UND / ODER**, Laser-Schranken 🟥 & Schalter ⏻ (State Machine), verschachtelte Schleifen. |
| ⚛️ **Quantum-Lab** – Code-Architekten | 18+ | Dark-Glassmorphism + Lo-Fi. 10 Level: **Rekursion** (F1 ruft sich selbst, Stack Overflow ohne Basisfall), **Zwei-Bot-Synchronisation** (ein Programm, zwei Bots), Speicher-Register, knappe Block-Limits. |

## S-Bahn-Modus 🚆

- **🚆 S-Bahn-Express (3-Min-Rätsel):** Startbildschirm → ein Tages-Rätsel pro Altersstufe (jeden Tag neu, auf allen Geräten gleich), zählt als Bonus-Sterne.
- **Einhändig:** Palette, Los, Reset und **Rückgängig** sitzen unten in der Daumen-Zone; viele Befehle → zweireihige Palette.
- **Auto-Pause & Offline:** Jeder Block wird sofort gespeichert (`sparky:draft:<level>`), der letzte Bildschirm ebenfalls – beim nächsten Öffnen geht es exakt dort weiter.
- **Stumm-Visualisierung:** Jeder Sound hat ein sichtbares Echo (Screen-Shake, Partikel-Blitze, Laser-Flash) plus `navigator.vibrate` (abschaltbar in den Einstellungen).

## Profi-Code-Brücke (ab 13)

Code-Ansicht in **Python, TypeScript und JavaScript** (inkl. `while`, `not/and/or`, `global n`, rekursives `f1()`), Live-Analyse („Rekursion · 4 Blöcke → 12 Aktionen · Code-Größe O(1)“) und 8 Profi-Karten mit echtem Code aus der Praxis – u. a. Game-Loop, State Machine, `Promise.all`, Fibonacci mit Registern, Big-O und rekursives SQL (`WITH RECURSIVE`). Erfolgs- und Fehlermeldungen im sachlich-witzigen Ton (z. B. „Stack Overflow: Deine Rekursion hat keinen Basisfall.“). Neue Avatare: Cyber-Drohne 🛸, Hologramm-Fuchs 🦊, Quantum-KI ⚛️ + Farben Neon & Hologramm.

## Endlos-Level, Belohnungen & Musik (Candy-Crush-Prinzip) 🍬

- **∞ Level pro Welt:** Level 1–20 sind handgefertigt, ab Level 21 baut ein **prozeduraler Generator** (`src/engine/generator.ts`) aus Welt + Levelnummer als Seed immer neue Labyrinthe mit Hindernissen, Bonus-Items, Schlüsseln & Toren. Jedes Level wird beim Erzeugen mit dem echten Interpreter durchgespielt – nur garantiert lösbare Level kommen ins Spiel; `parBlocks` = kürzestes gefundenes Programm (bei den Code-Helden auch Wand-Folge-Programme mit Bedingungen).
- **Endlose Karte** (Level 1 unten, nach oben unendlich scrollen) mit **Meilenstein-Inseln** alle 10 Level (Schatz: +5 ⭐ und Sticker).
- **Schatztruhen-Balken:** alle 15 Sterne springt eine Truhe auf (Konfetti + Sticker).
- **Kostüme & Farben:** u. a. Ninja-Sparky, Cyber-Rüstung, Königskrone, Superhelden-Umhang, Regenbogen-Drache.
- **Abzeichen & Titel** (z. B. „Schleifen-Meister“, „Code-Champion Level 50“) und **Sticker-Album** im Trophäen-Raum.
- **Tägliche Überraschung:** Glücksrad einmal pro Tag (Bonus-Sterne oder Zufalls-Sticker), Serien-Bonus ab 3 Tagen.
- **Arcade-Musik:** fröhlicher Loop pro Welt (Marimba, Harfe, Chiptune), live mit der Web Audio API erzeugt; startet sanft beim ersten Antippen.
- **Einstellungen (⚙️):** Musik, Sound-Effekte und Spielgeschwindigkeit getrennt schaltbar, gespeichert.
- **Schleifen als C-Klammer:** pulsierende Zone „+ Hier Befehl für Schleife einfügen“, Zone „+ Danach weitergehen“ und eine Fokus-Leiste („Nächster Block kommt IN …“ + „Aus Schleife raus“).

## Erklär-Kino & Kumpel-Modus 🎬

Jede Welt hat einen eigenen **20-Sekunden-Erklärfilm** – komplett als React-/CSS-Animation mit Sounds, Sparky als Moderator und einem leuchtenden Zeigefinger (keine Videodatei):

- **Mini-Entdecker:** rein visuell – Pfeile antippen, grünen Play-Knopf drücken, Sparky frisst die Erdbeere.
- **Junior-Coder:** lange Wege mit „3× Wiederholen“ abkürzen und über Fässer springen.
- **Code-Helden:** Bedingung „Wenn Weg frei“, Zauber-Makro F1 und der Echter-Code-Umschalter.

Beim ersten Öffnen einer Welt startet der Film automatisch (mit „Überspringen“). Danach ist er jederzeit über **„🎬 Wie geht's? (Freund zeigen)“** erreichbar – auf der Welt-Karte und im Spiel. Drehbücher: `src/data/movies.ts`.

## Code-Brücke 👀

- **Echter-Code-Röntgenblick** (Junior & Helden): Schalter „👀 Echter Code (Python / JS)“ übersetzt die Blöcke live in echtes **JavaScript** oder **Python** – mit Syntax-Highlighting; die gerade ausgeführte Zeile leuchtet. Generator: `src/engine/codegen.ts`.
- **Entdecker-Karten:** Nach jedem geschafften Level zeigt eine Karte das genutzte Konzept (Reihenfolge, Schleifen, Variablen, Bedingungen, Funktionen …) und was echte Programmierer damit bauen (Mars-Rover, Minecraft/Roblox-Geheimtüren, Spielfiguren …). 12 Karten, gesammelt im **Sammelalbum für Code-Wissen** 📚. Daten: `src/data/cards.ts`.

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

## Logo & App-Symbol

Das Logo zeigt Sparky mit Code-Schild `</>`. Quellen liegen als SVG in `assets/src/`, die fertigen PNGs in `assets/` (App-Symbol, Adaptive Icon, Startbildschirm) und `public/` (Favicon, Web-App-Symbole). Der Android-Build erzeugt daraus mit `@capacitor/assets` automatisch alle Größen.

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
