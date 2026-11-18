import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
// Glücksrad – tägliche Überraschung (Bonus-Sterne oder Zufalls-Sticker)
import { X } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { WHEEL, WHEEL_COLORS } from '../data/rewards';
import type { ProgressApi, Reward } from '../hooks/useProgress';
import type { SoundApi } from '../hooks/useSoundEffects';
import { useI18n } from '../i18n';
import { RewardPopup } from './RewardPopup';

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-indigo-950/60 p-4 backdrop-blur-sm">
      <div className="glass relative w-full max-w-sm animate-bounce-in rounded-[2rem] p-5 text-center">
        <button type="button" aria-label="×" onClick={onClose} className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <X className="h-5 w-5" strokeWidth={3} />
        </button>
        <h2 className="px-10 text-xl font-bold leading-tight text-slate-800 sm:text-2xl">🎁 {t.daily.button}</h2>
        {streak > 0 && <p className="mt-1 text-sm font-bold text-orange-500">{t.daily.streak(streak)}</p>}
        {season.doubleWheel && <p className="mt-1 text-sm font-bold text-emerald-600">{t.season.doubleWheel}</p>}

        <div className="relative mx-auto my-4 aspect-square w-full max-w-[290px]">
          {/* Zeiger */}
          <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-4xl drop-shadow-lg">🔻</div>
          <svg
            viewBox="-100 -100 200 200"
            className="h-full w-full drop-shadow-xl"
            style={{ transform: `rotate(${angle}deg)`, transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(.12,.75,.15,1)` : 'none' }}
          >
            {WHEEL.map((prize, i) => {
              const a0 = ((i * SEG - 90) * Math.PI) / 180;
              const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180;
              const mid = (((i + 0.5) * SEG - 90) * Math.PI) / 180;
              return (
                <g key={i}>
                  <path
                    d={`M0 0 L${95 * Math.cos(a0)} ${95 * Math.sin(a0)} A95 95 0 0 1 ${95 * Math.cos(a1)} ${95 * Math.sin(a1)} Z`}
                    fill={WHEEL_COLORS[i]}
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <text
                    x={62 * Math.cos(mid)}
                    y={62 * Math.sin(mid)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="17"
                    fontWeight="800"
                    fill="#fff"
                    transform={`rotate(${(i + 0.5) * SEG} ${62 * Math.cos(mid)} ${62 * Math.sin(mid)})`}
                  >
                    {prize.kind === 'stars' ? `${prize.amount}⭐` : '🎁'}
                  </text>
                </g>
              );
            })}
            <circle r="95" fill="none" stroke="#fde047" strokeWidth="6" />
            <circle r="18" fill="#fff" stroke="#f59e0b" strokeWidth="5" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="16">🐉</text>
          </svg>
        </div>

        {prog.canSpin ? (
          <button
            type="button"
            disabled={spinning}
            onClick={spin}
            className={`squish flex h-16 w-full items-center justify-center rounded-[1.6rem] text-2xl font-bold ${spinning ? '' : 'animate-breathe'}`}
            style={{ '--c': '#f43f5e' } as CSSProperties}
          >
            🎡 {t.daily.spin}
          </button>
        ) : (
          <p className="rounded-2xl bg-white/80 p-3 font-bold text-slate-600">⏰ {t.daily.comeBack}</p>
        )}
        <p className="mt-2 text-xs font-semibold text-slate-500">🎁 = {t.daily.sticker} · 🔥 3+ = {t.daily.streakBonus}</p>
      </div>

      {result && <RewardPopup title={t.daily.button} icon="🎉" reward={result} onClose={() => setResult(null)} />}
    </div>
  );
}
