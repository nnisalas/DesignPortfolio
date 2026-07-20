"use client";

import { useEffect, useRef, useState } from "react";
import { useParallax } from "@/lib/useParallax";

function DraggableSticker({
  src,
  alt,
  left,
  top,
  width,
  zIndex,
  rotate,
  hoverTransform,
  filter,
  plx,
}: {
  src: string;
  alt: string;
  left: number;
  top: number;
  width: string;
  zIndex: number;
  rotate: number;
  hoverTransform: string;
  filter: string;
  plx: [number, number];
}) {
  const plxRef = useParallax<HTMLImageElement>(plx[0], plx[1]);
  const imgRef = useRef<HTMLImageElement>(null);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ left, top });
  const offset = useRef({ x: 0, y: 0 });
  const base = `translate(-50%,-50%) rotate(${rotate}deg)`;

  const setRefs = (el: HTMLImageElement | null) => {
    imgRef.current = el;
    (plxRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    setDragging(true);
    const el = imgRef.current;
    if (!el) return;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
    const r = el.getBoundingClientRect();
    offset.current = { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) };
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragging) return;
    const el = imgRef.current;
    const stage = el?.offsetParent as HTMLElement | null;
    if (!stage) return;
    const s = stage.getBoundingClientRect();
    const x = e.clientX - offset.current.x - s.left;
    const y = e.clientY - offset.current.y - s.top;
    setPos({ left: (x / s.width) * 100, top: (y / s.height) * 100 });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      imgRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <img
      ref={setRefs}
      src={src}
      alt={alt}
      draggable={false}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragStart={(e) => e.preventDefault()}
      style={{
        position: "absolute",
        left: pos.left + "%",
        top: pos.top + "%",
        width,
        height: "auto",
        zIndex: dragging ? 30 : zIndex,
        transform: dragging ? `${base} scale(1.08)` : hover ? hoverTransform : base,
        transition: dragging ? "none" : "transform .3s cubic-bezier(.34,1.4,.64,1)",
        filter,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    />
  );
}

function HoverImg({
  src,
  alt,
  left,
  top,
  width,
  zIndex,
  rotate,
  hoverTransform,
  filter,
  plx,
  ariaHidden,
}: {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  zIndex: number;
  rotate: number;
  hoverTransform: string;
  filter?: string;
  plx?: [number, number];
  ariaHidden?: boolean;
}) {
  const plxRef = useParallax<HTMLImageElement>(plx ? plx[0] : 0, plx ? plx[1] : 0);
  const [hover, setHover] = useState(false);
  const base = `translate(-50%,-50%) rotate(${rotate}deg)`;
  return (
    <img
      ref={plxRef}
      src={src}
      alt={alt}
      aria-hidden={ariaHidden}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      draggable={false}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: "auto",
        zIndex,
        transform: hover ? hoverTransform : base,
        transition: "transform .3s cubic-bezier(.34,1.4,.64,1)",
        filter,
        userSelect: "none",
      }}
    />
  );
}

export default function HeroVisuals() {
  const cutRef = useParallax<HTMLImageElement>(-0.015, -0.04);
  const stickyRef = useParallax<HTMLImageElement>(-0.1, -0.14);
  const monRef = useRef<HTMLDivElement>(null);
  const pixelLayerRef = useRef<HTMLDivElement>(null);
  const pxLast = useRef<{ x: number; y: number } | null>(null);
  const pxIndex = useRef(-1);

  useEffect(() => {
    const mon = monRef.current;
    if (!mon) return;
    const onMove = (e: MouseEvent) => trackPixel(e.clientX, e.clientY);
    mon.addEventListener("mousemove", onMove);
    return () => mon.removeEventListener("mousemove", onMove);
  }, []);

  function trackPixel(cx: number, cy: number) {
    const layer = pixelLayerRef.current;
    if (!layer) return;
    const r = layer.getBoundingClientRect();
    const x = cx - r.left;
    const y = cy - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    if (pxLast.current) {
      const dx = x - pxLast.current.x;
      const dy = y - pxLast.current.y;
      if (dx * dx + dy * dy < 55) return;
    }
    pxLast.current = { x, y };
    spawnPixel(x, y);
  }

  function spawnPixel(x: number, y: number) {
    const layer = pixelLayerRef.current;
    if (!layer) return;
    const grid = 9;
    const gx = Math.round(x / grid) * grid;
    const gy = Math.round(y / grid) * grid;
    const cols = ["#68CD83", "#3F9FE5", "#FB9676", "#FAF6AD"];
    pxIndex.current = (pxIndex.current + 1) % cols.length;
    const s = document.createElement("span");
    s.style.cssText = `position:absolute;left:${gx}px;top:${gy}px;width:${grid}px;height:${grid}px;background:${cols[pxIndex.current]};opacity:1;transform:translate(-50%,-50%);pointer-events:none;animation:pixelFade .85s ease-out forwards;`;
    layer.appendChild(s);
    setTimeout(() => s.remove(), 870);
  }

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        overflowX: "clip",
        padding: "clamp(84px,11vh,120px) clamp(16px,3vw,40px) clamp(28px,4vh,48px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(1200px,96vw,calc((100vh - 130px) * 1.08))",
          aspectRatio: "1.08",
          containerType: "inline-size",
        } as React.CSSProperties}
      >
        <img
          ref={cutRef}
          src="/assets/cutting-board.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            left: "32%",
            top: "0%",
            width: "102cqw",
            height: "auto",
            zIndex: 1,
            transform: "rotate(-8deg)",
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 18px 34px rgba(44,54,74,.16))",
          }}
        />

        <DraggableSticker
          src="/assets/icon-figma.png" alt="Figma" left={61} top={89} width="10.5cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[-0.06, -0.12]}
        />
        <DraggableSticker
          src="/assets/icon-spotify.png" alt="Spotify" left={70} top={80} width="11cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(-3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[0.025, -0.18]}
        />
        <DraggableSticker
          src="/assets/icon-claude.png" alt="Claude" left={78} top={90} width="10.5cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(-3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[0.07, -0.09]}
        />

        <DraggableSticker
          src="/assets/croissant.png" alt="Croissant" left={89} top={77} width="12.5cqw" zIndex={4} rotate={5}
          hoverTransform="translate(-50%,-50%) rotate(9deg) scale(1.08)" filter="drop-shadow(0 5px 11px rgba(44,54,74,.16))" plx={[0.1, -0.16]}
        />
        <DraggableSticker
          src="/assets/coffee-cup.png" alt="Coffee cup" left={96} top={85} width="10.5cqw" zIndex={4} rotate={-4}
          hoverTransform="translate(-50%,-50%) rotate(-8deg) scale(1.08)" filter="drop-shadow(0 5px 11px rgba(44,54,74,.16))" plx={[0.14, -0.07]}
        />

        <div ref={monRef} style={{ position: "absolute", left: "7%", top: "14%", width: "86cqw", zIndex: 3, containerType: "inline-size" } as React.CSSProperties}>
          <img
            src="/assets/ipad.png"
            alt="Tablet illustration"
            draggable={false}
            style={{ display: "block", width: "100%", height: "auto", pointerEvents: "none", userSelect: "none", filter: "drop-shadow(0 24px 40px rgba(44,54,74,.20))" }}
          />
          <div
            ref={pixelLayerRef}
            aria-hidden="true"
            style={{ position: "absolute", left: "5.74%", top: "8.94%", width: "87.53%", height: "80.03%", overflow: "hidden", pointerEvents: "none", borderRadius: "1.4cqw" }}
          />
          <div style={{ position: "absolute", left: "5.74%", top: "8.94%", width: "87.53%", height: "80.03%", boxSizing: "border-box", display: "flex", flexDirection: "column", padding: "5% 5.5% 3.5%" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "3.55cqw", lineHeight: 1.5, fontWeight: 400, color: "#1f2227", textAlign: "left" }}>
                Product Designer specializing in{" "}
                <span style={{ fontWeight: 700, color: "#79bd3f" }}>friction mapping and activation flows</span>, with a love for{" "}
                <span style={{ fontWeight: 700, color: "#79bd3f" }}>systems thinking and research-driven design</span>
              </p>
            </div>
            <p style={{ margin: 0, fontFamily: "var(--font-ibm-plex-sans)", fontSize: "2.1cqw", lineHeight: 1.4, fontWeight: 600, letterSpacing: ".02em", color: "#2c3036", textAlign: "center" }}>
              Hover over the visuals! Or scroll to view my works!
            </p>
          </div>

          <HoverImg
            src="/assets/me-note.png" alt="Illustrated portrait" left="90%" top="3%" width="26cqw" zIndex={5} rotate={4}
            hoverTransform="translate(-50%,-50%) rotate(1deg) scale(1.04)" plx={[0.08, -0.2]}
          />
          <HoverImg
            src="/assets/apple-pen.png" alt="" ariaHidden left="79%" top="99%" width="56cqw" zIndex={5} rotate={0}
            hoverTransform="translate(-50%,-50%) rotate(-3deg) scale(1.03)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.14))" plx={[0.12, -0.06]}
          />
        </div>

        <img
          ref={stickyRef}
          src="/assets/sticky-note.png"
          alt="Design & Psychology @ UC Davis — actively looking for internships in the Bay Area"
          draggable={false}
          style={{
            position: "absolute",
            left: "1%",
            top: "60%",
            width: "39cqw",
            height: "auto",
            zIndex: 4,
            transform: "rotate(12deg)",
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 10px 20px rgba(44,54,74,.18))",
          }}
        />
      </div>
    </section>
  );
}
