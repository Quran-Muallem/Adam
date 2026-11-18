import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SeasonProvider } from './hooks/useSeasonalTheme';
import { LanguageProvider, useI18n } from './i18n';
import './index.css';

// Verhindert Pinch-Zoom auf iOS-Safari (ignoriert user-scalable=no)
document.addEventListener('gesturestart', (e) => e.preventDefault());

/** Saison-Engine braucht die Sprache (Region „automatisch“) */
function Root() {
  const { lang } = useI18n();
  return (
    <SeasonProvider lang={lang}>
      <App />
    </SeasonProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </StrictMode>,
);
