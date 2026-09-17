"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 3900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className={`site-shell ${entered ? "is-entered" : ""}`}>
      <section className="appearance" aria-label="FXRKENART appearance intro">
        <div className="appearance__grain" aria-hidden="true" />
        <div className="logo-reveal" aria-label="FXRKENART">
          <span className="logo-reveal__aura" aria-hidden="true" />
          <span className="logo-reveal__edge" aria-hidden="true" />
          <img src="/fxrken-logo.png" alt="fxrken" />
        </div>
      </section>

      <section className="home-stage" aria-label="FXRKENART home">
        <video className="home-stage__video" src="/profile.mp4" autoPlay loop muted playsInline preload="auto" aria-label="FXRKENART intro motion" />
        <div className="home-stage__vignette" aria-hidden="true" />
      </section>
    </main>
  );
}
