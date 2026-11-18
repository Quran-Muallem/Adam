import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
// Glücksrad – tägliche Überraschung (Bonus-Sterne oder Zufalls-Sticker)
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WHEEL, WHEEL_COLORS } from '../data/rewards';
import type { ProgressApi, Reward } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { RewardPopup } from './RewardPopup';
import { Sprite } from './sprites';
import { GameButton, IconBtn, noEmoji, Ribbon, Rays, SkyScene } from './ui';

interface Props {
  sound: SoundApi;
  prog: ProgressApi;
  onClose: () => void;
}

const SEG = 360 / WHEEL.length;
const SPIN_MS = 3600;

export function DailyWheel({ sound, prog, onClose }: Props) {
  const { theme: season } = useSeasonalTheme();
  const { t } = useI18n();
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Reward | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const spin = () => {
    if (spinning || !prog.canSpin) return;
    const idx = Math.floor(Math.random() * WHEEL.length);
    // Segment idx soll oben unter dem Zeiger landen
    const target = 360 * 6 + (360 - idx * SEG - SEG / 2);
    setSpinning(true);
    setAngle(target);
    // Tick-Geräusche, die langsamer werden
    for (let k = 0; k < 18; k++) {
      const at = SPIN_MS * (1 - Math.pow(1 - k / 18, 2.2));
      timers.current.push(setTimeout(() => sound.play('tick'), at));
    }
    timers.current.push(
      setTimeout(() => {
        const reward = prog.claimSpin(WHEEL[idx], season.doubleWheel ? 2 : 1);
        sound.play('win');
        setResult(reward);
        setSpinning(false);
      }, SPIN_MS + 150),
    );
  };

  const streak = prog.progress.streak;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col overflow-hidden">
      <SkyScene />
      <header className="absolute end-3 top-3 z-20 mt-[env(safe-area-inset-top)]">
        <IconBtn label={t.ui.back} onClick={onClose}>
          <X className="h-7 w-7 text-[#1f4fa8]" strokeWidth={3.4} />
        </IconBtn>
      </header>
      <div className="thin-scroll relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-5 pb-6 pt-20">
        <Ribbon color="red">
          {t.ui2.spinTitle}
        </Ribbon>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {streak > 0 && (
            <span className="ui-stat-pill font-game flex items-center gap-1 px-3 text-[15px] text-[#c2410c]">
              <span className="h-6 w-6">
                <Sprite name="flame" />
              </span>
              {noEmoji(t.daily.streak(streak))}
            </span>
          )}
          {season.doubleWheel && <span className="ui-stat-pill font-game flex items-center px-3 text-[15px] text-emerald-700">{noEmoji(t.season.doubleWheel)}</span>}
        </div>

        <div className="relative mx-auto my-5 aspect-square w-full max-w-[300px]">
          <div className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2">
            <Rays className="h-full w-full" />
          </div>
          {/* Zeiger */}
          <svg viewBox="0 0 40 46" className="absolute left-1/2 top-[-14px] z-10 h-12 w-11 -translate-x-1/2 drop-shadow-[0_4px_2px_rgba(0,0,0,.35)]">
            <path d="M4 4 H36 L20 42 Z" fill="#ef3b3b" stroke="#7a1010" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M10 8 H26 L18 26Z" fill="#fff" opacity="0.45" />
          </svg>
          <svg
            viewBox="-100 -100 200 200"
            className="relative h-full w-full drop-shadow-[0_10px_10px_rgba(0,0,0,.35)]"
            style={{ transform: `rotate(${angle}deg)`, transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(.12,.75,.15,1)` : 'none' }}
          >
            <defs>
              <linearGradient id="wheel-rim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffe680" />
                <stop offset="0.5" stopColor="#f6a91e" />
                <stop offset="1" stopColor="#b86a07" />
              </linearGradient>
              <radialGradient id="wheel-shade" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0.6" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.22" />
              </radialGradient>
            </defs>
            <circle r="99" fill="#7a4205" />
            <circle r="96" fill="url(#wheel-rim)" />
            {WHEEL.map((prize, i) => {
              const a0 = ((i * SEG - 90) * Math.PI) / 180;
              const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180;
              const mid = (((i + 0.5) * SEG - 90) * Math.PI) / 180;
              const x = 58 * Math.cos(mid);
              const y = 58 * Math.sin(mid);
              return (
                <g key={i}>
                  <path
                    d={`M0 0 L${84 * Math.cos(a0)} ${84 * Math.sin(a0)} A84 84 0 0 1 ${84 * Math.cos(a1)} ${84 * Math.sin(a1)} Z`}
                    fill={WHEEL_COLORS[i]}
                    stroke="#fff"
                    strokeWidth="2.5"
                  />
                  <g transform={`translate(${x} ${y}) rotate(${(i + 0.5) * SEG})`}>
                    {prize.kind === 'stars' ? (
                      <>
                        <path d="M0 -15 L4.4 -5 L15 -4.6 L7 2.4 L9.6 13 L0 7.2 L-9.6 13 L-7 2.4 L-15 -4.6 L-4.4 -5Z" fill="#ffe14d" stroke="#1d1530" strokeWidth="2" strokeLinejoin="round" transform="translate(0 -6) scale(.8)" />
                        <text y="16" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" stroke="#1d1530" strokeWidth="3" paintOrder="stroke" fontFamily="Lilita One, Fredoka, sans-serif">
                          {prize.amount}
                        </text>
                      </>
                    ) : (
                      <g transform="translate(-13 -14) scale(.42)">
                        <rect x="8" y="26" width="48" height="32" rx="4" fill="#ef4444" stroke="#1d1530" strokeWidth="5" />
                        <rect x="4" y="16" width="56" height="14" rx="4" fill="#f87171" stroke="#1d1530" strokeWidth="5" />
                        <rect x="27" y="16" width="10" height="42" fill="#fde047" stroke="#1d1530" strokeWidth="4" />
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
            <circle r="84" fill="url(#wheel-shade)" />
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} cx={90 * Math.cos((i * Math.PI) / 8)} cy={90 * Math.sin((i * Math.PI) / 8)} r="3.4" fill="#fffbe6" stroke="#b86a07" strokeWidth="1" />
            ))}
            <circle r="24" fill="#fff" stroke="#b86a07" strokeWidth="5" />
          </svg>
          <img src="./sparky-sm.webp" alt="" className="pointer-events-none absolute left-1/2 top-1/2 h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 object-contain" draggable={false} />
        </div>

        {prog.canSpin ? (
          <GameButton big color="green" className={`w-full max-w-xs ${spinning ? '' : 'animate-breathe'}`} disabled={spinning} onClick={spin}>
            {t.daily.spin}
          </GameButton>
        ) : (
          <div className="ui-cream font-game px-5 py-3 text-center text-[1.1rem] text-[#7a3d00]">{t.daily.comeBack}</div>
        )}
        <p className="mt-3 text-center text-[13px] font-extrabold text-white [text-shadow:0_1px_2px_rgba(10,40,100,.8)]">
          {noEmoji(t.daily.sticker)} · 3+ = {noEmoji(t.daily.streakBonus)}
        </p>
      </div>

      {result && <RewardPopup title={t.ui2.spinTitle} reward={result} onClose={() => setResult(null)} />}
    </div>
  );
}
