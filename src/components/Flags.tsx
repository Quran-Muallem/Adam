// Runde Flaggen als SVG (statt System-Emojis) + Vollbild-Sprachauswahl
import { Check } from 'lucide-react';
import { useId, useState } from 'react';
import { DICTS, LANGS, useI18n, type Lang } from '../i18n';
import type { SoundApi } from '../hooks/useSoundEffects';
import { GameButton, ScreenHeader, ScreenShell } from './ui';

export function Flag({ lang, className = 'h-9 w-9' }: { lang: Lang; className?: string }) {
  const id = useId().replace(/:/g, '');
  const clip = `${id}c`;
  let body;
  switch (lang) {
    case 'de':
      body = (
        <>
          <rect width="60" height="20" fill="#1a1a1a" />
          <rect y="20" width="60" height="20" fill="#dd1c1c" />
          <rect y="40" width="60" height="20" fill="#ffce00" />
        </>
      );
      break;
    case 'fr':
      body = (
        <>
          <rect width="20" height="60" fill="#1f4fbf" />
          <rect x="20" width="20" height="60" fill="#fff" />
          <rect x="40" width="20" height="60" fill="#e5283a" />
        </>
      );
      break;
    case 'it':
      body = (
        <>
          <rect width="20" height="60" fill="#139a43" />
          <rect x="20" width="20" height="60" fill="#fff" />
          <rect x="40" width="20" height="60" fill="#d6283a" />
        </>
      );
      break;
    case 'es':
      body = (
        <>
          <rect width="60" height="60" fill="#c8102e" />
          <rect y="15" width="60" height="30" fill="#ffc400" />
          <rect x="14" y="24" width="8" height="12" rx="2" fill="#c8102e" opacity="0.85" />
        </>
      );
      break;
    case 'en':
      body = (
        <>
          <rect width="60" height="60" fill="#1d3f99" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" strokeWidth="12" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#d6283a" strokeWidth="4" />
          <path d="M30 0 V60 M0 30 H60" stroke="#fff" strokeWidth="16" />
          <path d="M30 0 V60 M0 30 H60" stroke="#d6283a" strokeWidth="9" />
        </>
      );
      break;
    case 'ar':
      body = (
        <>
          <rect width="60" height="60" fill="#0f7a3d" />
          <path d="M14 26 q4 -6 8 0 t8 0 t8 0 t8 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M16 38 H44 L48 35" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <circle cx="30" cy="30" r="27" />
        </clipPath>
        <radialGradient id={`${id}g`} cx="0.35" cy="0.25" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="29.5" fill="#1b2a55" />
      <circle cx="30" cy="30" r="27.5" fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        {body}
        <circle cx="30" cy="30" r="27" fill={`url(#${id}g)`} />
      </g>
    </svg>
  );
}

/** Vollbild „Sprache wählen“: Liste mit runden Flaggen, Häkchen und „Speichern“ */
export function LanguageScreen({ sound, onClose }: { sound: SoundApi; onClose: () => void }) {
  const { t, lang, setLang } = useI18n();
  const [pick, setPick] = useState<Lang>(lang);
  return (
    <div className="fixed inset-0 z-[85] animate-bounce-in">
      <ScreenShell
        header={
          <ScreenHeader
            title={t.ui2.chooseLanguage}
            backLabel={t.ui.back}
            onBack={() => {
              sound.play('click');
              onClose();
            }}
          />
        }
        footer={
          <GameButton
            big
            className="mx-auto w-full max-w-xs"
            onClick={() => {
              sound.play('unlock');
              setLang(pick);
              onClose();
            }}
          >
            {DICTS[pick].ui2.save}
          </GameButton>
        }
      >
        <div className="ui-panel mx-auto mt-2 max-w-sm overflow-hidden px-2 py-1">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={pick === l.id}
              onClick={() => {
                sound.play('click');
                setPick(l.id);
              }}
              className={`ui-row flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-start transition ${pick === l.id ? 'bg-sky-100' : ''}`}
            >
              <Flag lang={l.id} className="h-10 w-10 shrink-0" />
              <span className="ui-ink flex-1 text-lg font-extrabold" dir="auto">
                {DICTS[l.id].langName}
              </span>
              {pick === l.id && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#5fe27a] to-[#22a63f] shadow-[0_0_0_2px_#157a2a]">
                  <Check className="h-5 w-5 text-white" strokeWidth={4} />
                </span>
              )}
            </button>
          ))}
        </div>
      </ScreenShell>
    </div>
  );
}
