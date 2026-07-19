"use client";

import { useEffect, useState } from "react";
import type { WallItem } from "@/lib/wallItems";

export default function WallPlaceholder({ item }: { item: WallItem }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // defer setting the real src until after mount so the onError handler
  // is guaranteed to be attached before the request can resolve
  useEffect(() => {
    setSrc(`/assets/wall/${item.file}`);
  }, [item.file]);

  const style: React.CSSProperties = {
    position: "absolute",
    left: item.left,
    top: item.top,
    width: item.width,
    height: item.height,
    transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
  };

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={item.label}
        draggable={false}
        onError={() => setFailed(true)}
        style={{ ...style, height: item.height ?? "auto", display: "block", filter: "drop-shadow(0 12px 26px rgba(44,54,74,.16))", userSelect: "none" }}
      />
    );
  }

  return (
    <div
      style={{
        ...style,
        height: item.height ?? item.width * 0.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 12,
        borderRadius: 12,
        border: "1.5px dashed #c7cdd4",
        background: "#f5f6f8",
        boxShadow: "0 12px 26px rgba(44,54,74,.10)",
        fontSize: 12,
        fontWeight: 500,
        color: "#8a919b",
        userSelect: "none",
      }}
    >
      {item.label}
    </div>
  );
}
