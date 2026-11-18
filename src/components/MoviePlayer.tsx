// ─────────────────────────────────────────────────────────────
// Erklär-Kino: spielt ein 20-Sekunden-Drehbuch als Animation ab
// (Sparky moderiert, ein leuchtender Zeigefinger tippt, Sounds laufen).
// ─────────────────────────────────────────────────────────────
import { Sprite, WORLD_SPRITES, type SpriteName } from './sprites';
import { Play, RotateCcw, X, Pointer } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { CostumeId } from '../data/costumes';
import { MOVIE_SECONDS, MOVIES, sceneAt, type Chip, type Scene } from '../data/movies';
import { WORLDS } from '../data/worlds';
import { generateCode, type TokenKind } from '../engine/codegen';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import type { AgeGroupId } from '../types';
import { BLOCK_META, COND_EMOJI } from './blockMeta';
import { Confetti } from './Confetti';
import { Particles } from './Particles';
import { GameButton } from './ui';
import { Sparky } from './Sparky';

interface Props {
  group: AgeGroupId;
  sound: SoundApi;
  costume: CostumeId;
  onClose: () => void;
}

const TICK_MS = 80;

export function MoviePlayer({ group, sound, costume, onClose }: Props) {
  const movie = MOVIES[group];
  const world = WORLDS[group];
  const { t } = useI18n();
  const [time, setTime] = useState(0);
  const [run, setRun] = useState(0); // erhöht sich bei "Nochmal ansehen"
  const lastRef = useRef(-1);
  const playRef = useRef(sound.play);
  playRef.current = sound.play;

  // Uhr – mit eigenem Lauf-Token, damit "Nochmal" sauber neu startet
  useEffect(() => {
    lastRef.current = -1;
    setTime(0);
    const start = performance.now();
    const id = setInterval(() => {
      const now = Math.min(MOVIE_SECONDS, (performance.now() - start) / 1000);
      setTime(now);
      if (now >= MOVIE_SECONDS) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [run]);

  // Sounds der Schritte abspielen, sobald ihr Zeitpunkt erreicht ist
  useEffect(() => {
    for (const s of movie.steps) if (s.sound && s.t > lastRef.current && s.t <= time) playRef.current(s.sound);
    lastRef.current = time;
  }, [time, movie]);

  const scene = sceneAt(movie, time);
  const ended = time >= MOVIE_SECONDS;
  const captions = group === 'mini' ? [] : t.movie[group];
  const bubble = scene.caption !== null ? captions[scene.caption] : scene.emoji;

  return (
    <div className={`safe-area fixed inset-0 z-[60] flex flex-col bg-gradient-to-br ${world.bg}`}>
      <Particles kind={world.particles} />

      {/* Kopf: Fortschritt + Überspringen */}
      <div className="relative z-10 flex items-center gap-3 px-3 pt-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#cfdcef] shadow-[inset_0_2px_2px_rgba(0,0,0,.25),0_0_0_2.5px_#2a3f78]">
          <div className="h-full rounded-full bg-gradient-to-b from-[#ffe680] via-[#f8c51c] to-[#e88a0c] transition-[width] duration-100" style={{ width: `${(time / MOVIE_SECONDS) * 100}%` }} />
        </div>
        <button type="button" onClick={onClose} className="ui-icon-btn font-game flex h-11 items-center gap-1 !rounded-full px-4 text-[15px] text-[#1b2a55]">
          {t.movie.skip} <X className="h-4 w-4" strokeWidth={3.5} />
        </button>
      </div>

      {/* Bühne */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-3">
        <div
          dir="ltr"
          className="relative overflow-hidden rounded-[2rem] bg-white/15 shadow-2xl backdrop-blur-sm"
          style={{ width: 'min(92vw, 420px, calc((100dvh - 110px) * 9 / 16))', aspectRatio: '9 / 16' }}
        >
          <Stage scene={scene} group={group} costume={costume} bubble={bubble} />
        </div>
      </div>

      {scene.confetti && <Confetti count={80} />}

      {/* Ende: Nochmal oder Los geht's */}
      {ended && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b1a45]/55 p-6 backdrop-blur-sm">
          <div className="ui-panel relative flex w-full max-w-xs animate-bounce-in flex-col items-center gap-4 px-5 pb-6 pt-16">
            <div className="absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2">
              <Sparky mood="happy" costume={costume} />
            </div>
            <GameButton
              color="blue"
              className="w-full"
              onClick={() => {
                sound.play('click');
                setRun((r) => r + 1);
              }}
            >
              <RotateCcw className="h-6 w-6" strokeWidth={3} /> {t.movie.replay}
            </GameButton>
            <GameButton big color="green" className="w-full" onClick={onClose}>
              <Play className="h-7 w-7 fill-white" /> {t.movie.play}
            </GameButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────── Bühne ───────────────

function Stage({ scene, group, costume, bubble }: { scene: Scene; group: AgeGroupId; costume: CostumeId; bubble: string | null }) {
  const movie = MOVIES[group];
  const world = WORLDS[group];
  const { t } = useI18n();
  const rows = movie.grid.length;
  const cols = movie.grid[0].length;
  const hasCode = !!movie.codeProgram;
  // Bühnen-Aufteilung (in % der Höhe): Code-Welten brauchen Platz fürs Code-Fenster
  const L = hasCode
    ? { board: [3, 24], mod: 29, prog: [46, 15], pal: [84, 9] }
    : { board: [3, 33], mod: 39, prog: [56, 16], pal: [80, 10] };

  return (
    <>
      {/* Spielfeld */}
      <div className="absolute left-[6%] w-[88%]" style={{ top: `${L.board[0]}%`, height: `${L.board[1]}%` }}>
        <div className="relative mx-auto h-full" style={{ aspectRatio: `${cols} / ${rows}`, maxWidth: '100%' }}>
          <div
            className="grid h-full w-full gap-[2px] overflow-hidden rounded-2xl p-[3px]"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`, background: world.frame }}
          >
            {movie.grid.flatMap((row, y) =>
              [...row].map((ch, x) => {
                const k = `${x},${y}`;
                const sp = WORLD_SPRITES[group];
                const sprite: SpriteName | null =
                  ch === '#' ? sp.wall : ch === 'o' ? sp.low : ch === 'G' ? sp.goal : ch === '*' && !scene.collected.includes(k) ? sp.bonus : null;
                const emoji = sprite ? (
                  <Sprite name={sprite} className="h-[82%] w-[82%]" />
                ) : ch === 'X' ? (
                  <span className={`h-[60%] w-[60%] rounded-full border-[3px] border-[#1d1530] ${scene.lasersOn ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                ) : ch === 'L' ? (
                  scene.lasersOn ? <span className="h-[86%] w-[22%] rounded-full bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,.8)]" /> : null
                ) : null;
                return (
                  <div
                    key={k}
                    className="tile flex items-center justify-center rounded-[22%] text-[min(8vw,34px)] leading-none"
                    style={{ background: ch === '#' ? world.wallTile : (x + y) % 2 ? world.tileB : world.tileA }}
                  >
                    {emoji}
                  </div>
                );
              }),
            )}
          </div>
          <div
            className="absolute"
            style={{
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              left: `${(scene.sparky.x / cols) * 100}%`,
              top: `${(scene.sparky.y / rows) * 100}%`,
              transition: 'left .5s cubic-bezier(.45,.05,.35,1.25), top .5s',
            }}
          >
            <div key={`${scene.sparky.x}-${scene.sparky.hop}`} className={`h-full w-full scale-110 ${scene.sparky.hop ? 'animate-hop' : ''}`} style={{ ['--hop-dur' as string]: '500ms' }}>
              <Sparky mood={scene.sparky.mood} dir={scene.sparky.dir} costume={costume} />
            </div>
          </div>
        </div>
      </div>

      {/* Sparky als Moderator mit Sprechblase */}
      <div className="absolute left-[2%] h-[15%] w-[22%]" style={{ top: `${L.mod}%` }}>
        <Sparky mood={scene.stars ? 'happy' : 'idle'} costume={costume} />
      </div>
      {bubble && (
        <div
          key={bubble}
          dir="auto"
          style={{ top: `${L.mod + 1}%` }}
          className={`glass absolute left-[25%] right-[3%] flex min-h-[11%] animate-bounce-in items-center rounded-2xl rounded-bl-md px-3 py-2 font-bold text-slate-700 ${
            group === 'mini' ? 'justify-center text-4xl' : 'text-[min(3.6vw,15px)] leading-snug'
          }`}
        >
          {bubble}
        </div>
      )}

      {/* Programm */}
      <div style={{ top: `${L.prog[0]}%`, height: `${L.prog[1]}%` }} className={`glass absolute left-[4%] right-[4%] flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl p-1.5 ${group === 'adult' ? 'pe-12' : ''}`}>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {scene.program.length === 0 ? (
            <span className="text-2xl text-slate-300">⋯</span>
          ) : (
            scene.program.map((c) => <ChipView key={c.id} chip={c} active={scene.active} group={group} />)
          )}
        </div>
        {scene.macro && (
          <div className="flex animate-bounce-in items-center gap-1 rounded-xl bg-fuchsia-100 px-1.5 py-0.5">
            <span className="flex items-center gap-0.5 text-xs font-bold text-fuchsia-700"><span className="h-4 w-4"><Sprite name="wand" /></span>F1 =</span>
            {scene.macro.map((c) => (
              <ChipView key={c.id} chip={c} active={scene.active} group={group} />
            ))}
          </div>
        )}
      </div>

      {/* Stack-Anzeige (Rekursion) */}
      {scene.stack > 0 && (
        <div className="absolute right-[5%] z-10 flex flex-col-reverse items-center gap-[2px]" style={{ top: `${L.prog[0] - 1}%`, height: `${L.prog[1]}%` }}>
          <span className="text-[min(2.4vw,10px)] font-bold text-teal-200">stack</span>
          {Array.from({ length: scene.stack }, (_, i) => (
            <span key={i} className="block h-[7%] w-8 animate-pop rounded-sm border border-teal-200/80 bg-teal-400/70" />
          ))}
        </div>
      )}

      {/* Code-Röntgenblick (Helden, Teenager, Erwachsene) */}
      {hasCode && (
        <div className="absolute left-[4%] right-[4%] top-[63%] h-[20%]">
          {scene.showCode ? (
            <MiniCode group={group} active={scene.active} comment={t.code.comment} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span
                className={`squish rounded-full px-4 py-2 text-[min(3.4vw,14px)] font-bold ${scene.highlight === 'code' ? 'ring-4 ring-yellow-300' : ''}`}
                style={{ '--c': '#334155' } as CSSProperties}
              >
                {t.code.toggle}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Palette */}
      <div className="absolute left-[4%] right-[4%] flex gap-1" style={{ top: `${L.pal[0]}%`, height: `${L.pal[1]}%` }}>
        {movie.palette.map((k) => {
          const color = k === 'play' ? '#22c55e' : BLOCK_META[k].color;
          const Icon = k === 'play' ? Play : BLOCK_META[k].Icon;
          return (
            <div
              key={k}
              className={`squish flex flex-1 items-center justify-center rounded-2xl transition ${scene.highlight === k ? 'scale-110 ring-4 ring-yellow-300' : ''}`}
              style={{ '--c': color } as CSSProperties}
            >
              <Icon className={`h-[55%] w-[55%] ${k === 'play' ? 'fill-white' : ''}`} strokeWidth={3} />
            </div>
          );
        })}
      </div>

      {/* Leuchtender Zeigefinger */}
      <div
        className="pointer-events-none absolute z-20"
        style={{
          left: `${scene.pointer.x}%`,
          top: `${scene.pointer.y}%`,
          opacity: scene.pointer.show ? 1 : 0,
          transition: 'left .55s cubic-bezier(.4,0,.2,1), top .55s cubic-bezier(.4,0,.2,1), opacity .3s',
        }}
      >
        <span key={scene.tap} className="absolute left-0 top-0 h-12 w-12 animate-tap-ring rounded-full border-4 border-yellow-300" />
        <span
          key={`f${scene.tap}`}
          className="absolute -left-3 -top-1 block animate-pop text-[46px] leading-none"
          style={{ filter: 'drop-shadow(0 0 10px rgba(253,224,71,1)) drop-shadow(0 4px 2px rgba(0,0,0,.3))' }}
        >
          <Pointer className="h-12 w-12 fill-white text-[#1b2a55]" strokeWidth={2.2} />
        </span>
      </div>

      {/* Sterne am Ende */}
      {scene.stars > 0 && (
        <div className="absolute left-0 right-0 top-[8%] z-10 flex justify-center gap-1 text-5xl">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-14 w-14 animate-pop drop-shadow-lg" style={{ animationDelay: `${i * 0.15}s` }}>
              <Sprite name="star" />
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function ChipView({ chip, active, group }: { chip: Chip; active: string | null; group: AgeGroupId }) {
  const { t } = useI18n();
  const meta = BLOCK_META[chip.kind];
  const Icon = meta.Icon;
  const isActive = active === chip.id;
  const glow = isActive ? 'gold-glow scale-110' : '';
  const size = group === 'mini' ? 'h-12 w-12' : 'h-8 px-1.5';

  if (chip.children) {
    return (
      <div className={`flex items-center gap-1 rounded-xl p-0.5 transition ${glow}`} style={{ background: meta.soft, boxShadow: `0 0 0 2px ${meta.color}` }}>
        <span className="squish flex h-8 items-center gap-1 rounded-lg px-1.5 text-xs font-bold" style={{ '--c': meta.color } as CSSProperties}>
          <Icon className="h-4 w-4" strokeWidth={3} />
          {chip.count !== undefined && <span className="rounded bg-white px-1 text-orange-600 [text-shadow:none]">{chip.count}×</span>}
          {chip.cond && (
            <span className="rounded bg-white px-1 text-cyan-700 [text-shadow:none]">
              {chip.not ? `${t.pro.not} ` : ''}
              {COND_EMOJI[chip.cond]} {t.conds[chip.cond]}
            </span>
          )}
        </span>
        {chip.children.length === 0 ? <span className="px-1 text-slate-400">…</span> : chip.children.map((c) => <ChipView key={c.id} chip={c} active={active} group={group} />)}
      </div>
    );
  }
  return (
    <span className={`squish flex animate-pop items-center justify-center rounded-xl transition ${size} ${glow}`} style={{ '--c': meta.color } as CSSProperties}>
      <Icon className={group === 'mini' ? 'h-8 w-8' : 'h-5 w-5'} strokeWidth={3} />
      {chip.kind === 'call' && <span className="ml-0.5 text-sm font-bold">F1</span>}
    </span>
  );
}

const CODE_COLORS: Record<TokenKind, string> = { kw: '#f472b6', fn: '#67e8f9', num: '#fdba74', punc: '#cbd5e1', cm: '#94a3b8', var: '#fde68a', plain: '#e2e8f0' };

function MiniCode({ group, active, comment }: { group: AgeGroupId; active: string | null; comment: string }) {
  const movie = MOVIES[group];
  const lines = useMemo(
    () => generateCode(movie.codeProgram!, movie.codeLang ?? 'js', comment).filter((l, i) => i > 0 && l.tokens.length > 0),
    [comment, movie],
  );
  return (
    <div className="h-full animate-bounce-in overflow-hidden rounded-2xl p-2" style={{ background: 'linear-gradient(180deg,#1e1b4b,#0f172a)' }}>
      <pre className="text-[min(2.6vw,11px)] leading-[1.45]" style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>
        {lines.map((l, i) => (
          <div key={i} className={`-mx-2 px-2 ${l.blockId && l.blockId === active ? 'bg-yellow-300/30' : ''}`}>
            {l.tokens.map((tok, k) => (
              <span key={k} style={{ color: CODE_COLORS[tok.kind], fontWeight: tok.kind === 'kw' ? 700 : 500 }}>
                {tok.text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
