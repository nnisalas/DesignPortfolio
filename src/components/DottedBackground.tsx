export default function DottedBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        // Stops at HakoBot's edge so the dots don't run under the panel.
        right: "var(--hb-inset)",
        transition: "right var(--hb-speed) var(--hb-ease)",
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(circle, rgba(120,116,102,.34) 1.4px, transparent 1.6px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "center",
        animation: "gridPulse 5.5s ease-in-out infinite",
      }}
    />
  );
}
