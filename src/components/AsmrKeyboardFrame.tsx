"use client";

// Design Wall's "ASMR Keyboard" demo clip: like DozeVideoFrame, a short
// silent autoplaying loop (this recording has no audio track at all,
// unlike the Video Editing clip, so autoplay+muted loses nothing).
export default function AsmrKeyboardFrame() {
  return (
    <div
      style={{
        position: "absolute",
        left: 2480,
        top: 1480,
        width: 280,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 12px 26px rgba(44,54,74,.16)",
      }}
    >
      <video
        src="/assets/wall/asmr-keyboard-demo.mp4"
        poster="/assets/wall/asmr-keyboard-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}
