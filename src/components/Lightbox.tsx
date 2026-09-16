"use client";

import { useEffect, useState } from "react";

type Media = { src: string; kind: "img" | "video"; label: string };

export default function Lightbox() {
  const [media, setMedia] = useState<Media | null>(null);
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const target = e.target as HTMLElement;
      if (!target.closest) return;

      // data-lb can sit on the media itself (the static figures) or on a
      // wrapper -- a video frame, a phone mockup -- so that clicking anywhere
      // in the frame enlarges, including its padding.
      const host = target.closest("[data-lb]") as HTMLElement | null;
      if (!host) return;

      // Video first: a phone mockup contains BOTH a video and the bezel <img>,
      // and the bezel is never what someone means to enlarge.
      const el =
        host instanceof HTMLVideoElement || host instanceof HTMLImageElement
          ? host
          : host.querySelector("video") ?? host.querySelector("img");
      if (!el) return;

      const src = (el as HTMLVideoElement | HTMLImageElement).src;
      if (!src) return;

      // Carry the source description across. Without this the enlarged view
      // announced a generic "Enlarged visual" and the alt text a visitor
      // needed most -- on the biggest, most detailed version of the figure --
      // was the one place it went missing.
      const label =
        (el as HTMLElement).getAttribute("alt") ||
        (el as HTMLElement).getAttribute("aria-label") ||
        "Enlarged visual";

      setMedia({ src, kind: el instanceof HTMLVideoElement ? "video" : "img", label });
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

  // Cap the enlarged media at its own intrinsic size, so a small asset is
  // never upscaled into a blurry mess.
  const fit = (w: number, h: number, node: HTMLElement) => {
    node.style.maxWidth = `min(88vw, 1240px, ${w}px)`;
    node.style.maxHeight = `min(80vh, ${h}px)`;
  };

  const shared: React.CSSProperties = {
    maxWidth: "min(88vw,1240px)",
    maxHeight: "80vh",
    width: "auto",
    height: "auto",
    borderRadius: 12,
    transform: open ? "scale(1)" : "scale(.96)",
    transition: "transform .35s ease-in-out",
  };

  return (
    <div
      onClick={close}
      role="dialog"
      aria-modal={open}
      aria-label={media ? media.label : "Enlarged visual"}
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
      {media?.kind === "img" && (
        <img
          src={media.src}
          alt={media.label}
          onClick={(e) => e.stopPropagation()}
          onLoad={(e) => fit(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight, e.currentTarget)}
          style={shared}
        />
      )}
      {media?.kind === "video" && (
        <video
          key={media.src}
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={media.label}
          onClick={(e) => e.stopPropagation()}
          onLoadedMetadata={(e) => fit(e.currentTarget.videoWidth, e.currentTarget.videoHeight, e.currentTarget)}
          style={shared}
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
