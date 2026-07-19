"use client";

import { useEffect, useRef, useState } from "react";

export default function Lightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const close = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const target = e.target as HTMLElement;
      const img = target.closest ? (target.closest("img[data-lb]") as HTMLImageElement | null) : null;
      if (!img) return;
      setSrc(img.src);
      setOpen(true);
      document.documentElement.style.overflow = "hidden";
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      onClick={close}
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(8,12,16,.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "48px clamp(24px,5vw,64px) 32px",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: "opacity .35s ease-in-out, visibility .35s ease-in-out",
      }}
    >
      {src && (
        <img
          ref={imgRef}
          src={src}
          alt="Enlarged visual"
          onClick={(e) => e.stopPropagation()}
          onLoad={(e) => {
            const im = e.currentTarget;
            im.style.maxWidth = `min(88vw, 1240px, ${im.naturalWidth}px)`;
            im.style.maxHeight = `min(80vh, ${im.naturalHeight}px)`;
          }}
          style={{
            maxWidth: "min(88vw,1240px)",
            maxHeight: "80vh",
            width: "auto",
            height: "auto",
            borderRadius: 12,
            transform: open ? "scale(1)" : "scale(.96)",
            transition: "transform .35s ease-in-out",
          }}
        />
      )}
      <button
        onClick={close}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 17, fontWeight: 600, letterSpacing: ".02em", color: "#ffffff", padding: "6px 16px" }}
      >
        Close
      </button>
    </div>
  );
}
