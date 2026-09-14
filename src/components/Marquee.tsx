export default function Marquee() {
  const items = Array.from({ length: 20 });
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        overflow: "hidden",
        background: "#66bef0",
        // No top margin. This used to hold a responsive gap (+24px flat)
        // to clear the old sticky-note hero art, which could overflow its
        // own section. That art is gone and the current hero is a clean
        // 100svh section with overflow:hidden, so the gap only showed up
        // as a band of white between the pixel field's bottom edge and
        // this strip -- the field now runs straight into it.
        margin: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          alignItems: "center",
          padding: "clamp(10px,1.3vw,16px) 0",
          animation: "marqueeX 40s linear infinite",
          willChange: "transform",
        }}
      >
        {items.map((_, i) => (
          <img
            key={i}
            src="/assets/strip-selected-works.webp"
            alt=""
            style={{ height: "clamp(28px,3.4vw,44px)", width: "auto", display: "block", flex: "none", marginRight: "clamp(12px,1.7vw,28px)" }}
          />
        ))}
      </div>
    </div>
  );
}
