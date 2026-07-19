"use client";

import { useEffect, useState } from "react";
import { DOZE_VIDEO_FILE } from "@/lib/wallItems";

export default function DozeVideoFrame() {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(`/assets/wall/${DOZE_VIDEO_FILE}`);
  }, []);

  const frameStyle: React.CSSProperties = {
    position: "absolute",
    left: 1240,
    top: 1429,
    width: 245,
    height: 245,
    transform: "rotate(2deg)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 26px rgba(44,54,74,.16)",
  };

  if (src && !failed) {
    return (
      <div style={frameStyle}>
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...frameStyle,
        background: "#eceef1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#8a919b",
        textAlign: "center",
        padding: 12,
      }}
    >
      DOZE process video
    </div>
  );
}
