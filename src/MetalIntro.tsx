export function MetalIntro() {
  return (
    <section className="fx-metal-stage" aria-hidden="true">
      <div className="fx-metal-atmosphere" />

      <div className="fx-metal-emblem">
        <div className="fx-metal-emblem__reflection" />
        <img
          className="fx-metal-emblem__base"
          src="/fxrken-logo-3d.png?v=4"
          alt=""
        />
        <span className="fx-metal-emblem__surface" />
        <img
          className="fx-metal-emblem__sweep fx-metal-emblem__sweep--primary"
          src="/fxrken-logo-3d.png?v=4"
          alt=""
        />
        <img
          className="fx-metal-emblem__sweep fx-metal-emblem__sweep--secondary"
          src="/fxrken-logo-3d.png?v=4"
          alt=""
        />
        <span className="fx-metal-emblem__glint" />
      </div>

      <div className="fx-metal-lens fx-metal-lens--sharp" />
      <div className="fx-metal-lens fx-metal-lens--soft" />
    </section>
  );
}
