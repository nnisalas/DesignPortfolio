"use client";

// Design Wall's ASMR Keyboard project card: same hover-to-try treatment
// as SnapshootReceipt.tsx -- hovering darkens the receipt (via a CSS
// mask shaped to this receipt's own art, see .ak-dark in globals.css)
// and reveals a "Try the Prototype!" link out to the live app, swapping
// white -> blue on hover of the link itself. Reuses the same CTA button
// art as Snapshoot's card (same wording/style, no need to duplicate).
export default function AsmrKeyboardReceipt() {
  return (
    <div
      className="ak-receipt"
      style={{ position: "absolute", left: 2820, top: 1520, width: 230, transform: "rotate(-2deg)" }}
    >
      <img
        src="/assets/wall/asmr-keyboard-receipt.webp"
        alt="ASMR Keyboard vibe-coded project receipt"
        draggable={false}
        style={{ display: "block", width: "100%", height: "auto", filter: "drop-shadow(0 12px 26px rgba(44,54,74,.16))", userSelect: "none" }}
      />
      <div className="ak-dark" aria-hidden="true" />
      <a
        className="ak-cta"
        href="https://asmr-keyboard.vercel.app/"
        target="_blank"
        rel="noopener"
        aria-label="Try the ASMR Keyboard prototype"
      >
        <img className="ak-cta-white" src="/assets/wall/snapshoot-cta-white.webp" alt="Try the prototype" draggable={false} />
        <img className="ak-cta-blue" src="/assets/wall/snapshoot-cta-blue.webp" alt="" aria-hidden="true" draggable={false} />
      </a>
    </div>
  );
}
