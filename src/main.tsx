import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
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

  useEffect(() => {
    setIsDay(vietnamHour() >= 6 && vietnamHour() < 18);
  }, []);

  return (
    <main className={`fx-shell ${isDay ? "fx-day" : "fx-night"}`}>
      <section className="fx-intro" aria-label="FXRKENART logo intro">
        <div className="fx-mark" aria-hidden="true">
          <img className="fx-mark__aura" src="/fxrken-logo-3d.png" alt="" />
          <img className="fx-mark__solid" src="/fxrken-logo-3d.png" alt="" />
          <img className="fx-mark__outline" src="/fxrken-outline.svg" alt="" />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
