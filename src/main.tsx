import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const INTRO_DURATION = 5000;
const CONTENT_DURATION = 5000;

function vietnamHour() {
  const hour = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());

  return Number(hour);
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [isDay, setIsDay] = useState(() => vietnamHour() >= 6 && vietnamHour() < 18);

  useEffect(() => {
    setIsDay(vietnamHour() >= 6 && vietnamHour() < 18);

    let introTimer = 0;
    let replayTimer = 0;
    let stopped = false;

    const play = () => {
      setShowIntro(true);
      setCycle((value) => value + 1);

      introTimer = window.setTimeout(() => {
        setShowIntro(false);
        replayTimer = window.setTimeout(() => {
          if (!stopped) play();
        }, CONTENT_DURATION);
      }, INTRO_DURATION);
    };

    play();

    return () => {
      stopped = true;
      window.clearTimeout(introTimer);
      window.clearTimeout(replayTimer);
    };
  }, []);

  return (
    <main className={`fx-shell ${isDay ? "fx-day" : "fx-night"}`}>
      <section className="fx-stage" aria-label="FXRKENART home">
        <video
          className="fx-stage__video"
          src="/profile.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </section>

      {showIntro && (
        <section className="fx-intro" key={cycle} aria-label="FXRKENART logo intro">
          <div className="fx-mark" aria-hidden="true">
            <img className="fx-mark__ghost" src="/fxrken-logo.png" alt="" />
            <img className="fx-mark__trace fx-mark__trace--a" src="/fxrken-logo.png" alt="" />
            <img className="fx-mark__trace fx-mark__trace--b" src="/fxrken-logo.png" alt="" />
            <img className="fx-mark__trace fx-mark__trace--c" src="/fxrken-logo.png" alt="" />
            <img className="fx-mark__solid" src="/fxrken-logo.png" alt="" />
          </div>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
