"use client";

// Design Wall's "ASMR Keyboard" demo clip: like DozeVideoFrame, a short
// silent autoplaying loop (this recording has no audio track at all,
// unlike the Video Editing clip, so autoplay+muted loses nothing).
// Sized small and tilted to tuck behind the receipt's top-left corner,
// matching the cluster's reference composition.
export default function AsmrKeyboardFrame() {
  return (
    <div
      style={{
        position: "absolute",
        left: 3182,
        top: 1904,
        width: 180,
        borderRadius: 10,
        overflow: "hidden",
        transform: "rotate(-6deg)",
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
