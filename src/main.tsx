import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LogoReveal } from "./LogoReveal";
import "./styles.css";
import { DynamicInfo } from "./DynamicInfo";
import { MusicVisualizer } from "./MusicVisualizer";

function App() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (assetsReady && matchMedia("(prefers-reduced-motion: reduce)").matches) setIntroDone(true);
  }, [assetsReady]);

  useEffect(() => {
    let active = true;
    const sources = ["/fxrken-logo-3d.png?v=7"];

    Promise.all(
      sources.map(
        (source) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = source;
          }),
      ),
    ).then(() => {
      if (active) setAssetsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="fx-shell">
      <section className="fx-intro" aria-label="FXRKENART logo intro">
        {assetsReady && (
          <div className="fx-mark" onAnimationEnd={event => {
            if (event.animationName === "fxrken-path-reveal") setIntroDone(true);
          }}>
            {introDone && <MusicVisualizer />}
            <LogoReveal />
          </div>
        )}
      </section>
      {introDone && <DynamicInfo />}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
