"use client";

// Design Wall's Snapshoot project card: hovering darkens the receipt
// (via a CSS mask shaped to the receipt art itself, see .ss-dark in
// globals.css) and reveals a "Try the Prototype!" link out to the
// live app, swapping from a white to a blue button on hover of the
// link itself.
export default function SnapshootReceipt() {
  return (
    <div
      className="ss-receipt"
      style={{ position: "absolute", left: 1032, top: 1133, width: 248, transform: "rotate(3deg)" }}
    >
      <img
        src="/assets/wall/snapshoot-receipt.webp"
        alt="Snapshoot vibe-coded project receipt"
        draggable={false}
        style={{ display: "block", width: "100%", height: "auto", filter: "drop-shadow(0 12px 26px rgba(44,54,74,.16))", userSelect: "none" }}
      />
      <div className="ss-dark" aria-hidden="true" />
      <a
        className="ss-cta"
        href="https://snapshoot-one.vercel.app/"
        target="_blank"
        rel="noopener"
        aria-label="Try the Snapshoot prototype"
      >
        <img className="ss-cta-white" src="/assets/wall/snapshoot-cta-white.webp" alt="Try the prototype" draggable={false} />
        <img className="ss-cta-blue" src="/assets/wall/snapshoot-cta-blue.webp" alt="" aria-hidden="true" draggable={false} />
      </a>
    </div>
  );
}
