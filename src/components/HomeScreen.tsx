// ─────────────────────────────────────────────────────────────
// Startbildschirm – exakte Umsetzung der Master-Vorlage (1438 × 2445 px).
// Alle Grafiken stammen aus der Vorlage selbst (public/home/*.webp).
// Positionen sind in Vorlagen-Pixeln angegeben und werden proportional
// zur Bildschirmbreite skaliert (Container-Query-Einheiten), damit das
// Layout auf jedem Android-Gerät dieselben Proportionen behält.
// Deutsch nutzt die Original-Schriftzüge; andere Sprachen bekommen
// textfreie Varianten der Grafiken + nachgebauten Schriftzug.
// ─────────────────────────────────────────────────────────────
import { Check, Globe, RotateCcw } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { expressId } from '../data/levels';
import { THEMES } from '../data/seasons';
import { WORLD_ORDER } from '../data/worlds';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import type { ProgressApi } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useStoredState } from '../hooks/useStoredState';
import { DICTS, LANGS, useI18n, type Lang } from '../i18n';
import type { AgeGroupId } from '../types';
import { DailyWheel } from './DailyWheel';
import { SeasonBanner, SeasonLayer } from './SeasonLayer';
import { Sprite, type SpriteName } from './sprites';

const DICT_NAMES = Object.fromEntries(Object.entries(DICTS).map(([k, d]) => [k, d.langName])) as Record<Lang, string>;

/** Maße der Vorlage */
const DW = 1438;
const DH = 2445;
const BOTTOM = '#154ca9';
type Box = [number, number, number, number];
/** Position jedes Elements in Vorlagen-Pixeln: [x0, y0, x1, y1] */
const B: Record<string, Box> = {
  bg: [0, 0, 1438, 2445],
  sparky: [480, 270, 1040, 880],
  flag: [30, 90, 235, 295],
  settings: [1205, 85, 1405, 305],
  title: [220, 850, 1220, 1135],
  tile1: [115, 1140, 410, 1412],
  tile2: [435, 1140, 725, 1412],
  tile3: [750, 1140, 1040, 1412],
  badge: [1277, 1136, 1365, 1224],
  label1: [110, 1392, 420, 1478],
  label2: [440, 1392, 730, 1478],
  label3: [745, 1392, 1050, 1478],
  label4: [1060, 1392, 1385, 1478],
  banner: [30, 1495, 1410, 1722],
  question: [270, 1708, 1170, 1810],
  card1: [50, 1822, 1110, 2445],
  star: [600, 60, 840, 290],
  tile4: [1065, 1130, 1375, 1412],
  banner_blank: [30, 1495, 1410, 1722],
  card1_blank: [50, 1822, 1110, 2445],
  play_blank: [680, 2250, 1072, 2428],
};
const IMG = (n: string) => `./home/${n}.webp`;
/** Vorlagen-Pixel → CSS (relativ zur Container-Breite) */
const u = (px: number) => `calc(${px} * 100cqw / ${DW})`;
const at = (b: Box): CSSProperties => ({
  position: 'absolute',
  left: `${(b[0] / DW) * 100}%`,
  top: `${(b[1] / DH) * 100}%`,
  width: `${((b[2] - b[0]) / DW) * 100}%`,
  height: `${((b[3] - b[1]) / DH) * 100}%`,
});

/** Comic-Schrift wie in der Vorlage: weiß mit dunkler Kontur */
const OUTLINE: CSSProperties = {
  fontFamily: 'Fredoka, "Baloo Bhaijaan 2", ui-rounded, sans-serif',
  fontWeight: 700,
  color: '#fff',
  WebkitTextStroke: `${u(9)} #1b1433`,
  paintOrder: 'stroke fill',
  textShadow: `0 ${u(6)} 0 rgba(20,14,50,.55)`,
};

/** Karten-Reihenfolge wie in der Vorlage: Zauberwald, Neon-Metropole, danach die übrigen Welten */
const CARD_ORDER: AgeGroupId[] = ['mini', 'teen', 'junior', 'hero', 'adult'];
/** Platzhalter-Szenen für Welten, deren Karten-Illustration in der Vorlage fehlt */
const PLACEHOLDER: Record<AgeGroupId, { bg: string; ring: string; scene: SpriteName[] }> = {
  mini: { bg: '', ring: '#7bd04a', scene: [] },
  teen: { bg: 'linear-gradient(160deg,#4c1d95 0%,#7e22ce 40%,#1e1b4b 100%)', ring: '#a855f7', scene: ['skyline', 'tower', 'robot'] },
  junior: { bg: 'linear-gradient(160deg,#38bdf8 0%,#0284c7 50%,#0c4a6e 100%)', ring: '#38bdf8', scene: ['ship', 'palm', 'treasure'] },
  hero: { bg: 'linear-gradient(160deg,#7c3aed 0%,#3b1d8f 50%,#160b40 100%)', ring: '#818cf8', scene: ['rocket', 'planet', 'meteor'] },
  adult: { bg: 'linear-gradient(160deg,#0f766e 0%,#0b2f3a 55%,#020617 100%)', ring: '#2dd4bf', scene: ['atom', 'crystal', 'qcore'] },
};

interface Props {
  sound: SoundApi;
  prog: ProgressApi;
  onPick: (g: AgeGroupId) => void;
  /** S-Bahn-Express: Tages-Rätsel sofort starten */
  onExpress: (levelId: string) => void;
  onWardrobe: () => void;
  onAlbum: () => void;
  onTrophies: () => void;
  onSettings: () => void;
}

export function HomeScreen({ sound, prog, onPick, onExpress, onWardrobe, onAlbum, onTrophies, onSettings }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const de = lang === 'de';
  // Express-Rätsel in der zuletzt gewählten Welt
  const [expressGroup, setExpressGroup] = useStoredState<AgeGroupId>('sparky:expressGroup', 'hero');
  const todayId = expressId(WORLD_ORDER.includes(expressGroup) ? expressGroup : 'hero');
  const todayStars = prog.progress.express[todayId] ?? 0;
  // Festtags-Abzeichen: einmal pro Fest und Jahr (nur echtes Kalender-Fest)
  const season = useSeasonalTheme();
  const { addFest } = prog;
  useEffect(() => {
    if (!season.preview && THEMES[season.live].fest) addFest(`${season.live}-${new Date().getFullYear()}`);
  }, [season.preview, season.live, addFest]);

  const click = (fn: () => void) => () => {
    sound.play('click');
    fn();
  };
  const labels = [t.home2.costumes, t.home2.knowledge, t.home2.trophies, t.home2.gift];
  const tileActions = [onWardrobe, onAlbum, onTrophies, () => setWheelOpen(true)];

  return (
    <div className="safe-area relative h-[100dvh] overflow-hidden" style={{ background: BOTTOM }}>
      <div className="thin-scroll h-full overflow-y-auto overflow-x-hidden">
        {/* ═══ Leinwand im Format der Vorlage ═══ */}
        <div
          className="relative mx-auto w-full max-w-[520px] select-none [container-type:inline-size]"
          style={{ aspectRatio: `${DW} / ${DH}`, backgroundImage: `url(${IMG('bg')})`, backgroundSize: '100% 100%' }}
        >
          {season.theme.fest && <SeasonLayer />}

          {/* Sprache */}
          <button type="button" aria-label={t.home.language} onClick={click(() => setLangOpen(true))} style={at(B.flag)} className="press">
            {de ? (
              <img src={IMG('flag')} alt="" className="h-full w-full" draggable={false} />
            ) : (
              <span className="flex h-full w-full items-center justify-center p-[12%]">
                <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-white/90 shadow-[0_6px_10px_rgba(0,0,0,.35)]" style={{ fontSize: u(120) }}>
                  {LANGS.find((l) => l.id === lang)?.flag}
                </span>
              </span>
            )}
          </button>

          {/* Sterne */}
          <div style={at(B.star)} aria-label={`${prog.totalStars} ⭐`}>
            <img src={IMG('star')} alt="" className="h-full w-full" draggable={false} />
            <span
              className="absolute inset-x-0 text-center leading-none"
              style={{ top: '38%', fontFamily: 'Fredoka, ui-rounded, sans-serif', fontWeight: 700, color: '#4a3410', fontSize: u(prog.totalStars > 99 ? 58 : 82) }}
            >
              {prog.totalStars}
            </span>
          </div>

          {/* Einstellungen */}
          <button type="button" aria-label={t.settings.title} onClick={onSettings} style={at(B.settings)} className="press">
            <img src={IMG('settings')} alt="" className="h-full w-full" draggable={false} />
          </button>

          {/* Sparky */}
          <img src={IMG('sparky')} alt="Sparky" style={at(B.sparky)} draggable={false} />

          {/* Titel */}
          {de ? (
            <img src={IMG('title')} alt={`${t.titleTop} ${t.titleBottom}`} style={at(B.title)} draggable={false} />
          ) : (
            <h1 style={at(B.title)} className="game-title flex flex-col items-center justify-center text-center uppercase leading-[0.95]">
              <span style={{ fontSize: u(165), fontFamily: 'Fredoka, ui-rounded, sans-serif', fontWeight: 700 }}>{t.titleTop}</span>
              <span style={{ fontSize: u(104), fontFamily: 'Fredoka, ui-rounded, sans-serif', fontWeight: 700 }}>{t.titleBottom}</span>
            </h1>
          )}

          {/* Menü-Kacheln */}
          {[1, 2, 3, 4].map((i) => (
            <button key={i} type="button" aria-label={labels[i - 1]} onClick={click(tileActions[i - 1])} style={at(B[`tile${i}`])} className="press">
              <img src={IMG(`tile${i}`)} alt="" className="h-full w-full" draggable={false} />
            </button>
          ))}
          {prog.canSpin && <img src={IMG('badge')} alt="!" style={at(B.badge)} className="pointer-events-none" draggable={false} />}
          {[1, 2, 3, 4].map((i) =>
            de ? (
              <img key={i} src={IMG(`label${i}`)} alt="" style={at(B[`label${i}`])} className="pointer-events-none" draggable={false} />
            ) : (
              <span key={i} style={{ ...at(B[`label${i}`]), ...OUTLINE, fontSize: u(60) }} className="pointer-events-none flex items-center justify-center whitespace-nowrap leading-none">
                {labels[i - 1]}
              </span>
            ),
          )}

          {/* S-Bahn-Express */}
          <button
            type="button"
            aria-label={t.pro.expressButton}
            onClick={() => {
              sound.play('unlock');
              onExpress(todayId);
            }}
            style={at(B.banner)}
            className="press"
          >
            <img src={IMG(de ? 'banner' : 'banner_blank')} alt="" className="h-full w-full" draggable={false} />
            {!de && (
              <span className="absolute flex items-center whitespace-nowrap leading-none" style={{ left: '20%', right: '7%', top: '28%', bottom: '28%', ...OUTLINE, color: '#ffd84d', fontSize: u(62) }}>
                <span className="truncate">{t.pro.expressButton.replace(/^🚆\s*/, '')}</span>
              </span>
            )}
            {todayStars > 0 && (
              <span className="absolute right-[3%] top-[18%] flex aspect-square h-[42%] items-center justify-center rounded-full border-2 border-[#1b1433] bg-emerald-400 text-white">
                <Check className="h-[70%] w-[70%]" strokeWidth={4} />
              </span>
            )}
          </button>

          {/* Frage */}
          {de ? (
            <img src={IMG('question')} alt={t.home.whereTo} style={at(B.question)} className="pointer-events-none" draggable={false} />
          ) : (
            <p style={{ ...at(B.question), ...OUTLINE, fontSize: u(80), WebkitTextStroke: `${u(6)} #1b4f9c` }} className="flex items-center justify-center whitespace-nowrap leading-none">
              {t.home.whereTo}
            </p>
          )}

          {/* Welten-Karten (seitlich wischen) */}
          <div
            className="thin-scroll absolute flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
            style={{
              left: 0,
              right: 0,
              top: `${(B.card1[1] / DH) * 100}%`,
              height: `${((B.card1[3] - B.card1[1]) / DH) * 100}%`,
              paddingLeft: u(B.card1[0]),
              gap: u(18),
              scrollPaddingLeft: u(B.card1[0]),
            }}
          >
            {CARD_ORDER.map((id) => (
              <WorldCard
                key={id}
                id={id}
                de={de}
                name={t.worlds[id].world}
                ages={t.worlds[id].ages}
                play={t.home2.play}
                onClick={() => {
                  sound.play('unlock');
                  setExpressGroup(id);
                  onPick(id);
                }}
              />
            ))}
            <span className="shrink-0" style={{ width: u(32) }} />
          </div>
        </div>

        {/* Unterhalb der Vorlage: Fest-Banner (nur an Festtagen) & Fortschritt zurücksetzen */}
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-3 px-4 pb-8 pt-4">
          {season.theme.fest && <SeasonBanner />}
          <button
            type="button"
            onClick={() => {
              if (confirmReset) {
                prog.reset();
                setConfirmReset(false);
                sound.play('remove');
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 3000);
              }
            }}
            className="flex items-center gap-2 text-sm font-bold text-white/80"
          >
            <RotateCcw className="h-4 w-4" />
            {confirmReset ? t.home.resetConfirm : t.home.reset}
          </button>
        </div>
      </div>

      {/* Sprachauswahl */}
      {langOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-indigo-950/55 p-4 backdrop-blur-sm sm:items-center" onClick={() => setLangOpen(false)}>
          <div className="glass w-full max-w-sm animate-bounce-in rounded-[2rem] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-center gap-2 text-xl font-bold text-slate-700">
              <Globe className="h-6 w-6" /> {t.home.language}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    sound.play('unlock');
                    setLang(l.id);
                    setLangOpen(false);
                  }}
                  className={`squish flex h-16 items-center justify-center gap-2 rounded-[1.4rem] px-3 text-lg font-bold ${l.id === lang ? 'ring-4 ring-yellow-300' : ''}`}
                  style={{ '--c': l.id === lang ? '#f59e0b' : '#8b5cf6' } as CSSProperties}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span>{DICT_NAMES[l.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {wheelOpen && <DailyWheel sound={sound} prog={prog} onClose={() => setWheelOpen(false)} />}
    </div>
  );
}


/** Welten-Karte: Zauberwald mit Original-Illustration, übrige Welten als Platzhalter (Illustration fehlt in der Vorlage) */
function WorldCard(p: { id: AgeGroupId; de: boolean; name: string; ages: string; play: string; onClick: () => void }) {
  const w = B.card1[2] - B.card1[0];
  const original = p.id === 'mini';
  const ph = PLACEHOLDER[p.id];
  const text: ReactNode = (
    <>
      <span className="absolute flex flex-col justify-end text-start leading-[1.05]" style={{ left: u(55), bottom: u(38), right: u(420) }}>
        <span className="line-clamp-2 uppercase" style={{ ...OUTLINE, fontSize: u(p.name.length > 12 ? 74 : 98) }}>
          {p.name}
        </span>
        <span style={{ ...OUTLINE, fontSize: u(60) }}>({p.ages})</span>
      </span>
      <span
        className="absolute flex items-center justify-center"
        style={{ left: u(B.play_blank[0] - B.card1[0]), top: u(B.play_blank[1] - B.card1[1]), width: u(B.play_blank[2] - B.play_blank[0]), height: u(B.play_blank[3] - B.play_blank[1]) }}
      >
        <img src={IMG('play_blank')} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
        <span className="relative uppercase" style={{ ...OUTLINE, fontSize: u(68), WebkitTextStroke: `${u(7)} #145a1c` }}>
          {p.play}
        </span>
      </span>
    </>
  );
  return (
    <button type="button" onClick={p.onClick} aria-label={p.name} className="press relative h-full shrink-0 snap-start" style={{ width: u(w) }}>
      {original ? (
        <>
          <img src={IMG(p.de ? 'card1' : 'card1_blank')} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
          {!p.de && text}
        </>
      ) : (
        <>
          {/* Platzhalter: gleiche Kartenform – die Illustration dieser Welt fehlt in der Vorlage */}
          <span
            className="absolute overflow-hidden"
            style={{ inset: u(14), borderRadius: u(62), border: `${u(9)} solid ${ph.ring}`, background: ph.bg, boxShadow: `0 ${u(10)} ${u(18)} rgba(0,0,0,.35)` }}
          >
            {ph.scene.map((s, k) => (
              <span key={s} className="absolute" style={{ left: `${8 + k * 30}%`, top: `${8 + (k % 2) * 10}%`, width: `${30 - k * 3}%` }}>
                <Sprite name={s} className="h-auto w-full" />
              </span>
            ))}
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          </span>
          {text}
        </>
      )}
    </button>
  );
}
