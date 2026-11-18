import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/lilita-one/latin-ext-400.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-900.css';
import './index.css';
import App from './App';

// Verhindert Pinch-Zoom auf iOS-Safari (ignoriert user-scalable=no)
document.addEventListener('gesturestart', (e) => e.preventDefault());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
