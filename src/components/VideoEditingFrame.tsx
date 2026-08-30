"use client";

// Design Wall's "Video Editing" clip: unlike DozeVideoFrame (a short,
// silent, autoplaying b-roll loop), this is an 84s talking-head clip
// with audio, so it's click-to-play with native controls and a poster
// frame instead of autoplaying muted.
export default function VideoEditingFrame() {
  return (
    <div
      style={{
        position: "absolute",
        left: 550,
        top: 1550,
        width: 200,
        height: 436,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 26px rgba(44,54,74,.16)",
      }}
    >
      <video
        src="/assets/wall/video-editing.mp4"
        poster="/assets/wall/video-editing-poster.webp"
        controls
        playsInline
        preload="metadata"
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
