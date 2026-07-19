export default function DottedBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
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
