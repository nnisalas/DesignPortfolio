"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParallax } from "@/lib/useParallax";
import RevealText from "./RevealText";
import RippleGrid from "./RippleGrid";

// Sparkling red/orange pixel dots below the hero title, fading in from
// white at the top -- reference: a screen recording of another portfolio
// site's hero, sampled with sharp to get the dot color (~#F4502A, the
// most saturated pixels found in the reference frame). Each dot reuses
// the existing `twinkle` keyframe (opacity+scale pulse) already used for
// the footer's night-sky stars, staggered with a random delay/duration
// per dot so they sparkle asynchronously. Kept deliberately cheap after
// the ripple-grid performance issue: no shadows, no per-cell borders, no
// event handlers -- just plain positioned spans animating opacity/scale.
const SPARK_COLOR = "#F4502A";
const SPARK_COUNT = 130;

// Deterministic PRNG (mulberry32) seeded with a fixed constant -- Math.random()
// here would run once during SSR and again during client hydration with
// different results each time, causing a React hydration mismatch since the
// server-rendered dot positions wouldn't match what the client computes.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useSparkDots() {
  return useMemo(() => {
    const rand = mulberry32(20260830);
    return Array.from({ length: SPARK_COUNT }, () => {
      // bias toward the bottom of the band so density increases downward,
      // matching the reference's "more sparkles lower down" look
      const t = rand();
      return {
        left: rand() * 100,
        top: 52 + Math.pow(t, 1.6) * 48,
        size: 2 + rand() * 3,
        delay: rand() * 4.5,
        duration: 1.8 + rand() * 2.4,
      };
    });
  }, []);
}

// ---- Train-interior scene ----
// The hero is a pixel-art train interior: the page's white background is
// the "sky" seen through stepped-corner window holes punched into a blue
// wall (fill-rule evenodd, so the holes are genuinely transparent), with
// the footer's daytime clouds drifting behind everything (z 0) using the
// same `drift` keyframe the footer uses. Handle-bar rail on top, seats at
// the bottom (both 1440px-wide SVG assets from the design handoff), hero
// text floating inside the central window. Design canvas is 1440x1230 --
// all geometry is in cqw (1cqw = 14.4 design px) so the scene scales
// proportionally at every viewport; below 700px a taller 1440x1600
// variant with a near-full-width window keeps the text legible.
const TRAIN_BLUE = "#126EB9"; // from the handoff's Blue BG.svg

type SceneCloud = { src: string; left: number; top: number; width: number; dur: number; delay: number };

// Clouds inside the central window (1440-design coords; footer day clouds
// reused). On wide screens these are tiled into the neighboring windows
// with small offsets so no two windows look identical.
const BASE_WINDOW_CLOUDS = [
  { src: "/assets/cloud1.webp", x: 685, y: 270, w: 142, dur: 15, delay: 0 },
  { src: "/assets/cloud3.webp", x: 267, y: 313, w: 190, dur: 18, delay: 1 },
  { src: "/assets/cloud4.webp", x: 1030, y: 321, w: 129, dur: 17, delay: 2.4 },
];
// One-off clouds near the lower corners of the base 1440 composition.
const EXTRA_CLOUDS = [
  { src: "/assets/cloud2.webp", x: 1361, y: 494, w: 110, dur: 13, delay: 0.6 },
  { src: "/assets/cloud3.webp", x: -14, y: 600, w: 110, dur: 16, delay: 1.5 },
];

const MOBILE_CLOUDS: SceneCloud[] = [
  { src: "/assets/cloud1.webp", left: 12, top: 24, width: 18, dur: 15, delay: 0 },
  { src: "/assets/cloud3.webp", left: 62, top: 28, width: 15, dur: 18, delay: 1 },
  { src: "/assets/cloud4.webp", left: 10, top: 60, width: 14, dur: 17, delay: 2.4 },
  { src: "/assets/cloud2.webp", left: 68, top: 55, width: 13, dur: 13, delay: 0.6 },
];

// Clockwise stepped-corner rectangle subpath ("pixel-rounded" corners:
// n steps of s px each).
function steppedRectPath(x: number, y: number, w: number, h: number, s: number, n: number) {
  const inset = s * n;
  let d = `M ${x + inset} ${y} H ${x + w - inset}`;
  for (let i = 0; i < n; i++) d += ` h ${s} v ${s}`;
  d += ` V ${y + h - inset}`;
  for (let i = 0; i < n; i++) d += ` v ${s} h ${-s}`;
  d += ` H ${x + inset}`;
  for (let i = 0; i < n; i++) d += ` h ${-s} v ${-s}`;
  d += ` V ${y + inset}`;
  for (let i = 0; i < n; i++) d += ` v ${-s} h ${s}`;
  return d + " Z";
}

const MOBILE_HOLE = steppedRectPath(90, 280, 1260, 860, 40, 3);

function WallSvg({ dw, dh, holes }: { dw: number; dh: number; holes: string[] }) {
  return (
    <svg
      viewBox={`0 0 ${dw} ${dh}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, display: "block" }}
    >
      <path fillRule="evenodd" d={`M 0 0 H ${dw} V ${dh} H 0 Z ${holes.join(" ")}`} fill={TRAIN_BLUE} />
    </svg>
  );
}

// One hanging handle, rebuilt 1:1 from the handoff's Handle bar.svg (same
// rects, translated into a local 92x158 box) so handles can tile across
// any viewport width at a uniform scale instead of stretching with it.
function Handle({ x, s }: { x: number; s: number }) {
  return (
    <svg
      viewBox="0 0 92 158"
      aria-hidden="true"
      style={{ position: "absolute", left: x * s, top: 0, width: 92 * s, height: 158 * s, zIndex: 2, display: "block" }}
    >
      <rect x="28" width="36" height="48" fill="#699EEE" />
      <rect x="34" y="48" width="24" height="48" fill="#28569A" />
      <rect x="14" y="84" width="64" height="12" fill="#D9D9D9" />
      <rect y="96" width="14" height="10" fill="#D9D9D9" />
      <rect y="106" width="14" height="42" fill="#D9D9D9" />
      <rect x="78" y="96" width="14" height="10" fill="#D9D9D9" />
      <rect x="78" y="106" width="14" height="42" fill="#D9D9D9" />
      <rect x="14" y="148" width="64" height="10" fill="#D9D9D9" />
    </svg>
  );
}

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
  const sparkDots = useSparkDots();
  // Below 700px the scene switches to a taller variant with a wider
  // window so the text stays legible (same pattern as SiteHeader's
  // mobile flag: false during SSR, corrected after mount).
  const [mobileScene, setMobileScene] = useState(false);
  // Measured scene box (desktop scene is height-capped to the viewport,
  // so geometry can't be pure width-proportional units anymore).
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState({ w: 1440, h: 1230 });
  const cutRef = useParallax<HTMLImageElement>(-0.015, -0.04);
  const stickyRef = useParallax<HTMLImageElement>(-0.1, -0.14);
  const monRef = useRef<HTMLDivElement>(null);
  const pixelLayerRef = useRef<HTMLDivElement>(null);
  const pxLast = useRef<{ x: number; y: number } | null>(null);
  const pxIndex = useRef(-1);

  useEffect(() => {
    const check = () => setMobileScene(window.innerWidth <= 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSceneSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobileScene]);

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

  // ---- Desktop scene geometry (viewport-fit) ----
  // The scene height is capped at the viewport (min(85.417vw, 100svh -
  // header)), so the fixed 1440x1230 design can't just stretch with the
  // width. Everything scales uniformly by `sScene` (contain-fit), the
  // 1440-wide composition is centered, and the wall/windows/handles/floor
  // tile outward to fill any extra width. The window pitch (1032 = 828
  // window + 204 pillar) and handle pitch (405) come straight from the
  // handoff SVGs, so at exactly 1440px this reproduces the mock 1:1 --
  // the mock's side "slivers" ARE the neighboring windows in this tiling.
  const sScene = Math.min(sceneSize.w / 1440, sceneSize.h / 1230) || 1;
  const dw = sceneSize.w / sScene; // design-unit scene width (>= 1440)
  const dh = sceneSize.h / sScene; // design-unit scene height (>= 1230)
  const off = (dw - 1440) / 2; // centering offset for 1440-based coords
  const winH = dh - 674; // window band: y 252 .. dh-422 (556 at dh=1230)
  const windowKs: number[] = [];
  for (let k = -3; k <= 3; k++) {
    const x0 = off + 306 + k * 1032;
    if (x0 + 828 > -10 && x0 < dw + 10) windowKs.push(k);
  }
  const desktopHoles = windowKs.map((k) => steppedRectPath(off + 306 + k * 1032, 252, 828, winH, 26, 3));
  const handleXs: number[] = [];
  for (let k = -8; k <= 8; k++) {
    const x = off + 71 + k * 405;
    if (x + 92 > -10 && x < dw + 10) handleXs.push(x);
  }
  const desktopClouds = [
    ...windowKs.flatMap((k) =>
      BASE_WINDOW_CLOUDS.map((c, i) => ({
        ...c,
        key: `w${k}-${i}`,
        x: off + c.x + k * 1032 + (k % 2 !== 0 ? 45 : 0),
        y: c.y + (k % 2 !== 0 ? 34 : 0),
        delay: c.delay + Math.abs(k) * 0.7,
      }))
    ),
    ...EXTRA_CLOUDS.map((c, i) => ({ ...c, key: `x${i}`, x: off + c.x })),
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        background: "#ffffff",
        overflowX: "clip",
        // clear the fixed site header so the rail sits right below it
        paddingTop: mobileScene ? 62 : 70,
      }}
    >
      {/* Sparkling red/orange pixel dots below the title -- disabled per
          request in favor of the hover-color grid below. Kept commented
          (not deleted) so it can be restored later.
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          maskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 78%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 78%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(120,116,102,.24) 1.2px, transparent 1.4px)",
            backgroundSize: "22px 22px",
          }}
        />
        {sparkDots.map((d, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              background: SPARK_COLOR,
              animation: `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>
      */}

      {/* Hover-color grid + plain centered headline/subtext layout --
          disabled per request in favor of reverting to the original
          iPad/cutting-board composition below. All of this kept intact
          (not deleted) so it can be restored by uncommenting.
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <RippleGrid trigger="hover" fill cellSize={48} opacity={22} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <RevealText
          tag="p"
          trigger="load"
          variant="words"
          stagger={0.03}
          style={{
            margin: 0,
            maxWidth: "min(1260px,94vw)",
            fontFamily: "var(--font-geist)",
            fontSize: "clamp(26px,4.4vw,50px)",
            lineHeight: 1.35,
            fontWeight: 300,
            color: "#1f2227",
          }}
        >
          Product Designer &amp; UX researcher who designs{" "}
          <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
          <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
        </RevealText>

        <div style={{ marginTop: "clamp(28px,5vh,48px)", maxWidth: "min(900px,92vw)" }}>
          <RevealText
            tag="p"
            trigger="load"
            variant="words"
            stagger={0.04}
            style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "clamp(16px,2.2vw,24px)", lineHeight: 1.4, fontWeight: 300, color: "#3d3d3d" }}
          >
            5th year Design &amp; Psychology @ UC Davis • Campus Leader @ Figma
          </RevealText>
          <RevealText
            tag="p"
            trigger="load"
            variant="words"
            stagger={0.04}
            style={{ margin: "clamp(20px,3vw,32px) 0 0", fontFamily: "var(--font-geist)", fontSize: "clamp(16px,2.2vw,24px)", lineHeight: 1.4, fontWeight: 300, color: "#3d3d3d" }}
          >
            Currently seeking Product &amp; UX Design internships across tech and entertainment
          </RevealText>
        </div>
      </div>
      */}

      {/* Previous hero visual composition (cutting board, iPad mockup +
          pixel-trail hover effect, illustrated portrait, apple pencil,
          sticky-note graphic) — disabled per request in favor of the
          train-interior scene below. All assets/positioning/parallax data
          kept intact here so it can be restored by uncommenting.
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
          src="/assets/cutting-board.webp"
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

        {/* Hero stickers (Figma/Spotify/Claude/croissant/coffee cup) —
            disabled per request, kept here (position/rotate/hover/parallax
            data intact) so they can be restored by just uncommenting this
            block.
        <DraggableSticker
          src="/assets/icon-figma.webp" alt="Figma" left={61} top={89} width="10.5cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[-0.06, -0.12]}
        />
        <DraggableSticker
          src="/assets/icon-spotify.webp" alt="Spotify" left={70} top={80} width="11cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(-3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[0.025, -0.18]}
        />
        <DraggableSticker
          src="/assets/icon-claude.webp" alt="Claude" left={78} top={90} width="10.5cqw" zIndex={2} rotate={0}
          hoverTransform="translate(-50%,-50%) scale(1.1) rotate(-3deg)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.18))" plx={[0.07, -0.09]}
        />

        <DraggableSticker
          src="/assets/croissant.webp" alt="Croissant" left={89} top={77} width="12.5cqw" zIndex={4} rotate={5}
          hoverTransform="translate(-50%,-50%) rotate(9deg) scale(1.08)" filter="drop-shadow(0 5px 11px rgba(44,54,74,.16))" plx={[0.1, -0.16]}
        />
        <DraggableSticker
          src="/assets/coffee-cup.webp" alt="Coffee cup" left={96} top={85} width="10.5cqw" zIndex={4} rotate={-4}
          hoverTransform="translate(-50%,-50%) rotate(-8deg) scale(1.08)" filter="drop-shadow(0 5px 11px rgba(44,54,74,.16))" plx={[0.14, -0.07]}
        />
        }

        <div ref={monRef} style={{ position: "absolute", left: "7%", top: "14%", width: "86cqw", zIndex: 3, containerType: "inline-size" } as React.CSSProperties}>
          <img
            src="/assets/ipad.webp"
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
              <RevealText tag="p" trigger="load" variant="words" stagger={0.03} style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "3.55cqw", lineHeight: 1.5, fontWeight: 300, color: "#1f2227", textAlign: "left" }}>
                Product Designer &amp; UX researcher who designs{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
              </RevealText>
            </div>
            <RevealText tag="p" trigger="load" variant="words" stagger={0.05} style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "2.1cqw", lineHeight: 1.4, fontWeight: 300, letterSpacing: ".02em", color: "#2c3036", textAlign: "center" }}>
              View my works!
            </RevealText>
          </div>

          <HoverImg
            src="/assets/me-note.webp" alt="Illustrated portrait" left="90%" top="3%" width="26cqw" zIndex={5} rotate={4}
            hoverTransform="translate(-50%,-50%) rotate(1deg) scale(1.04)" plx={[0.08, -0.2]}
          />
          <HoverImg
            src="/assets/apple-pen.webp" alt="" ariaHidden left="79%" top="99%" width="56cqw" zIndex={5} rotate={0}
            hoverTransform="translate(-50%,-50%) rotate(-3deg) scale(1.03)" filter="drop-shadow(0 6px 12px rgba(44,54,74,.14))" plx={[0.12, -0.06]}
          />
        </div>

        <img
          ref={stickyRef}
          src="/assets/sticky-note.webp"
          alt="5th year Design & Psychology @ UC Davis — Campus Leader @ Figma — seeking product & UX design internships across tech & entertainment"
          draggable={false}
          style={{
            position: "absolute",
            left: "1%",
            top: "54%",
            width: "39cqw",
            height: "auto",
            zIndex: 4,
            transform: "rotate(-3deg)",
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 10px 20px rgba(44,54,74,.18))",
          }}
        />
      </div>
      */}

      {/* Train-interior scene: layers back-to-front are clouds (z0,
          drifting like the footer's), blue wall with transparent window
          holes (z1), rail/handles/floor (z2), seats (z3), hero text (z4).
          Desktop is height-capped to the viewport and tiles horizontally;
          mobile keeps the width-proportional cqw variant. */}
      <div
        ref={sceneRef}
        style={
          {
            position: "relative",
            width: "100%",
            overflow: "hidden",
            ...(mobileScene
              ? { aspectRatio: "1440 / 1600", containerType: "inline-size" }
              : { height: "min(85.417vw, calc(100svh - 70px))" }),
          } as React.CSSProperties
        }
      >
        {mobileScene ? (
          <>
            {MOBILE_CLOUDS.map((c, i) => (
              <img
                key={i}
                src={c.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{
                  position: "absolute",
                  left: `${c.left}cqw`,
                  top: `${c.top}cqw`,
                  width: `${c.width}cqw`,
                  height: "auto",
                  zIndex: 0,
                  animation: `drift ${c.dur}s ease-in-out ${c.delay}s infinite`,
                  willChange: "transform",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            ))}
            <WallSvg dw={1440} dh={1600} holes={[MOBILE_HOLE]} />
            <img
              src="/assets/train/handle-bar.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", zIndex: 2, pointerEvents: "none", userSelect: "none", display: "block" }}
            />
            <img
              src="/assets/train/seats.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "auto", zIndex: 2, pointerEvents: "none", userSelect: "none", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 4,
                left: "6.25cqw",
                top: "19.44cqw",
                width: "87.5cqw",
                height: "59.72cqw",
                boxSizing: "border-box",
                padding: "2cqw 1cqw 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <RevealText
                tag="p"
                trigger="load"
                variant="words"
                stagger={0.03}
                style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "min(4.4cqw, 21px)", lineHeight: 1.45, fontWeight: 300, color: "#1f2227" }}
              >
                Product Designer &amp; UX researcher who designs{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
              </RevealText>
              <div style={{ marginTop: "4cqw", maxWidth: "78cqw" }}>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "min(2.8cqw, 12px)", lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  5th year Design &amp; Psychology @ UC Davis • Campus Leader @ Figma
                </RevealText>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: "2.2cqw 0 0", fontFamily: "var(--font-geist)", fontSize: "min(2.8cqw, 12px)", lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  Currently seeking Product &amp; UX Design internships across tech and entertainment
                </RevealText>
              </div>
            </div>
          </>
        ) : (
          <>
            {desktopClouds.map((c) => (
              <img
                key={c.key}
                src={c.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{
                  position: "absolute",
                  left: c.x * sScene,
                  top: c.y * sScene,
                  width: c.w * sScene,
                  height: "auto",
                  zIndex: 0,
                  animation: `drift ${c.dur}s ease-in-out ${c.delay}s infinite`,
                  willChange: "transform",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            ))}
            <WallSvg dw={dw} dh={dh} holes={desktopHoles} />
            {/* full-width rail stripes + uniformly-scaled tiled handles */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 17 * sScene, background: "#D2EFFF", zIndex: 2 }} />
            <div style={{ position: "absolute", top: 9 * sScene, left: 0, right: 0, height: 8 * sScene, background: "#208DE6", zIndex: 2 }} />
            {handleXs.map((x) => (
              <Handle key={x} x={x} s={sScene} />
            ))}
            {/* floor strips extend the seats' floor to the full scene width
                (colors/heights from the seats SVG's own floor rows) */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 30 * sScene, height: 23 * sScene, background: "#2C77B4", zIndex: 2 }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 38.4 * sScene, height: 10.4 * sScene, background: "#3A86C4", zIndex: 2 }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 33 * sScene, background: "#3A5D79", zIndex: 2 }} />
            <img
              src="/assets/train/seats.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{
                position: "absolute",
                bottom: 0,
                left: (sceneSize.w - 1440 * sScene) / 2,
                width: 1440 * sScene,
                height: "auto",
                zIndex: 3,
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
              }}
            />
            {/* hero text in the central window: 34px/20px at full design
                scale, shrinking uniformly with the scene so it always
                fits; paddingTop biases it below the clouds, per mock */}
            <div
              style={{
                position: "absolute",
                zIndex: 4,
                left: (off + 306) * sScene,
                top: 252 * sScene,
                width: 828 * sScene,
                height: winH * sScene,
                boxSizing: "border-box",
                paddingTop: 130 * sScene,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <RevealText
                tag="p"
                trigger="load"
                variant="words"
                stagger={0.03}
                style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: 34 * sScene, lineHeight: 1.45, fontWeight: 300, color: "#1f2227" }}
              >
                Product Designer &amp; UX researcher who designs{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
              </RevealText>
              <div style={{ marginTop: 47 * sScene, maxWidth: 482 * sScene }}>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: 20 * sScene, lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  5th year Design &amp; Psychology @ UC Davis • Campus Leader @ Figma
                </RevealText>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{
                    margin: `${20 * sScene}px 0 0`,
                    fontFamily: "var(--font-geist)",
                    fontSize: 20 * sScene,
                    lineHeight: 1.5,
                    fontWeight: 300,
                    letterSpacing: ".05em",
                    color: "#3d3d3d",
                  }}
                >
                  Currently seeking Product &amp; UX Design internships across tech and entertainment
                </RevealText>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
