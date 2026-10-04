import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LogoReveal } from './LogoReveal';
import { DynamicInfo } from './DynamicInfo';
import './styles.css';

function App() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = image.onerror = () => { if (active) setAssetsReady(true); };
    image.src = '/fxrken-logo-3d.png?v=7';
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (assetsReady && matchMedia('(prefers-reduced-motion: reduce)').matches) setIntroDone(true);
  }, [assetsReady]);

  return (
    <main className="fx-shell">
      <section className="fx-intro" aria-label="FXRKENART logo intro">
        {assetsReady && (
          <div className="fx-mark" onAnimationEnd={event => {
            if (event.animationName === 'fx-quorum-logo-in') setIntroDone(true);
          }}>
            <LogoReveal />
          </div>
        )}
      </section>
      {introDone && <DynamicInfo />}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
