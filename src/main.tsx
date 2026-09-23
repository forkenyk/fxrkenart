import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CURRENT_INTRO_START, METAL_INTRO_DURATION } from "./intro-config";
import "./styles.css";

function vietnamHour() {
  const hour = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());

  return Number(hour);
}

function App() {
  const [isDay, setIsDay] = useState(() => vietnamHour() >= 6 && vietnamHour() < 18);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [currentIntroStarted, setCurrentIntroStarted] = useState(reduceMotion);
  const [metalIntroDone, setMetalIntroDone] = useState(reduceMotion);

  useEffect(() => {
    setIsDay(vietnamHour() >= 6 && vietnamHour() < 18);

    if (reduceMotion) return;

    const startCurrentIntro = window.setTimeout(() => {
      setCurrentIntroStarted(true);
    }, CURRENT_INTRO_START);

    const finishMetalIntro = window.setTimeout(() => {
      setMetalIntroDone(true);
    }, METAL_INTRO_DURATION);

    return () => {
      window.clearTimeout(startCurrentIntro);
      window.clearTimeout(finishMetalIntro);
    };
  }, [reduceMotion]);

  return (
    <main className={`fx-shell ${isDay ? "fx-day" : "fx-night"}`}>
      {!metalIntroDone && <MetalIntro />}

      {currentIntroStarted && (
        <section className="fx-intro" aria-label="FXRKENART logo intro">
          <div className="fx-mark" aria-hidden="true">
            <img className="fx-mark__aura" src="/fxrken-logo-3d.png?v=2" alt="" />
            <img className="fx-mark__solid" src="/fxrken-logo-3d.png?v=2" alt="" />
            <img className="fx-mark__outline" src="/fxrken-contour-run.svg?v=1" alt="" />
          </div>
        </section>
      )}
    </main>
  );
}

function MetalIntro() {
  return (
    <section className="fx-metal-stage" aria-hidden="true">
      <svg className="fx-metal-filters" aria-hidden="true">
        <defs>
          <filter id="fx-liquid-metal" x="-35%" y="-35%" width="170%" height="170%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.024"
              numOctaves="2"
              seed="9"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="3.6s"
                values="0.009 0.024;0.016 0.012;0.008 0.028;0.009 0.024"
                repeatCount="1"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="fx-metal-mark">
        <span className="fx-metal-mark__body" />
        <span className="fx-metal-mark__liquid" />
        <span className="fx-metal-mark__sweep" />
        <span className="fx-metal-mark__edge" />
      </div>

      <div className="fx-metal-streak fx-metal-streak--one" />
      <div className="fx-metal-streak fx-metal-streak--two" />
      <div className="fx-metal-flash" />
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
