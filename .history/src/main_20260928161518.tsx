import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LogoReveal } from "./LogoReveal";
import "./styles.css";
import { DynamicInfo } from "./DynamicInfo";

function App() {
  const [assetsReady, setAssetsReady] = useState(false);

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

      <DynamicInfo
    avatar="/fxrken-logo-3d.png"
    name="FXRKENART"
    role="Digital Artist"
    status="Available"
    githubUrl="https://github.com/forkenyk"
    websiteUrl="https://fxrkenart.forkenyk-work.workers.dev/"
  />

      <section className="fx-intro" aria-label="FXRKENART logo intro">
        {assetsReady && (
          <div className="fx-mark" aria-hidden="true">
            <LogoReveal />
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
