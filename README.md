# 🐉 Sparkys Code-Abenteuer

Bunte Lern-App im 3D-Cartoon-Stil, die der ganzen Familie Programmieren beibringt – mit Sparky, dem violetten Drachen mit Fliegerbrille und Schal.

**Tech:** React 18 · TypeScript · Tailwind CSS · lucide-react · Vite · Web Audio API · Capacitor (Android). Die ganze App steckt in `src/App.tsx`.

## Inhalt
- **5 Welten:** Zauberwald (4–5), Kristall-Lagune (6–8), Sternen-Akademie (9–12), Neon-Metropole (13–17), Quantum-Lab (18+)
- **Level 1 bis ∞:** 15 handgemachte Level pro Welt, ab Level 16 ein prozeduraler Generator (jedes Level wird per Breitensuche auf Lösbarkeit geprüft)
- **Code-Terminal:** Tabs „Blöcke“ und „Live-Code (Python)“ mit Syntax-Highlighting, Zeilennummern und Schnell-Tasten; Mini-Python mit `for`, `while`, `if/elif/else`, `and/or/not`, Variablen, `def` und Rekursion
- **Belohnungen:** Sterne, Kristalle, Glücksrad, 7-Tage-Login-Truhe, 15 Erfolge, 13 Code-Wissen-Karten, Kostüm-Editor
- **Saison-System (offline):** Ramadan, Zuckerfest, Opferfest (Hijri-Kalender), Weihnachten, Ostern, Halloween, Jahreszeiten; Region und Saison-Vorschau in den Einstellungen
- **7 Sprachen:** Deutsch, Englisch, Französisch, Arabisch (RTL), Türkisch, Spanisch, Italienisch
- Speicherung im `localStorage`, Musik & Sounds per Web Audio API

## Entwicklung
```bash
npm ci
npm run dev     # Entwicklungsserver
npm test        # Tests (Level-Lösbarkeit, Interpreter, Saison, Sprachen)
npm run build   # Produktions-Build nach dist/
```
Bei jedem Push auf `main` baut GitHub Actions die Web-Version (GitHub Pages) und eine Android-APK (Releases).
