"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParallax } from "@/lib/useParallax";
import RevealText from "./RevealText";
import RippleGrid from "./RippleGrid";
import PixelField from "./PixelField";

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
// the "sky" seen through window holes punched into the wall (fill-rule
// evenodd, so the holes are genuinely transparent), with the footer's
// daytime clouds and a scrolling skyline drifting behind it. Handle-bar
// rail on top, seats at the bottom (both 1440px-wide SVG assets from the
// design handoff), hero text floating inside the central window.
const TRAIN_BLUE = "#0A365B"; // from the handoff's Subtract.svg

// Design canvas straight from the handoff (Subtract.svg is 1440x1238).
// The windows are now plain rectangles -- no stepped corners -- so the
// full box is usable for text, which is what lets the type run larger.
const D_H = 1238;
const WIN_TOP = 354;
const WIN_BOT = 876;
const WIN_L = 229.16; // central window's left/right edges
const WIN_R = 1206.84;
const WIN_W = WIN_R - WIN_L;
// The scene is anchored to its bottom and may crop this much off the top
// when the viewport is short. It's capped at the empty blue above the
// rail, so nothing (rail, handles, seats, floor) is ever cut -- it just
// lets the whole composition run bigger than a strict contain-fit would.
const MAX_CROP = 60;
// Type scale. The measure is kept proportional to the font size so the
// 3-line headline break survives the size bump. The ratio was measured in
// the browser rather than inherited: the headline actually holds 3 lines
// down to 23.02, where the old hand-derived 820/34 (24.12) was leaving
// ~4.5% of width unused. 23.5 keeps a safety margin over that threshold
// so font-rendering differences can't tip it to 4 lines.
const HEADLINE_FS = 39;
const SUB_FS = 24;
const MEASURE_RATIO = 23.5;
const SUB_MEASURE_RATIO = 482 / 20;
// The handoff's own pillars are 133.09 (left) and 138.09 (right) -- 5px
// asymmetric -- so tiling uses their average to stay symmetric.
const WIN_PITCH = 1113.27;
const RAIL_Y = 90; // handle-bar group's y in the canvas (blue shows above it)
const HANDLE_X0 = 71;
const HANDLE_PITCH = 405;
const SEATS_H = 412; // Seats.svg is 1440x412, bottom-aligned

// ---- Scenery seen through the windows ----
// Everything here scrolls left-to-right on a seamless loop, at different
// speeds, to read as the view from a moving train.
const GLASS_COLOR = "#EDEDED"; // window pane tint, per the handoff
const GLASS_OPACITY = 0.53;

// Cityscape.svg is 1156x545; its skyline sits at y=121.282 on the tile's
// left edge but y=103.957 on the right, so butting copies edge-to-edge
// would jog ~17px at every seam. Mirroring alternate copies makes both
// seams match exactly, which is why the repeat unit is a mirrored PAIR.
const CITY_TILE = 1150; // one copy's width in design units
const CITY_RATIO = 545 / 1156;
const CITY_SINK = 180; // how far the solid ground is pushed below the window

// Clouds tile at the window pitch; none crosses a tile edge, so the
// repeat is seamless without mirroring.
const CLOUD_TILE = WIN_PITCH;
const TILE_CLOUDS = [
  { src: "/assets/cloud1.webp", x: 112, y: 18, w: 150 },
  { src: "/assets/cloud4.webp", x: 600, y: 34, w: 112 },
  { src: "/assets/cloud2.webp", x: 848, y: 300, w: 96 },
];
const MOBILE_CLOUD_TILE = 1440;
const MOBILE_TILE_CLOUDS = [
  { src: "/assets/cloud1.webp", x: 170, y: 70, w: 260 },
  { src: "/assets/cloud3.webp", x: 890, y: 125, w: 215 },
  { src: "/assets/cloud4.webp", x: 145, y: 560, w: 200 },
  { src: "/assets/cloud2.webp", x: 980, y: 500, w: 190 },
];

// A horizontally looping layer: `count` copies of one repeat unit, shifted
// by exactly one unit per cycle so the wrap is invisible.
function ScrollTrack({
  unitW,
  count,
  dur,
  z,
  top,
  height,
  render,
}: {
  unitW: number;
  count: number;
  dur: number;
  z: number;
  top: number;
  height: number;
  render: () => React.ReactNode;
}) {
  return (
    <div
      className="train-scroll"
      aria-hidden="true"
      style={
        {
          position: "absolute",
          left: 0,
          top,
          width: unitW * count,
          height,
          zIndex: z,
          pointerEvents: "none",
          ["--tile"]: `${unitW}px`,
          animation: `trainScroll ${dur}s linear infinite`,
          willChange: "transform",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: i * unitW, top: 0, width: unitW, height }}>
          {render()}
        </div>
      ))}
    </div>
  );
}

// One repeat unit of skyline: a copy plus its mirror (see CITY_TILE).
function CityPair() {
  const half: React.CSSProperties = { position: "absolute", top: 0, width: "50%", height: "100%", display: "block" };
  return (
    <>
      <img src="/assets/train/cityscape.svg" alt="" style={{ ...half, left: 0 }} />
      <img src="/assets/train/cityscape.svg" alt="" style={{ ...half, left: "50%", transform: "scaleX(-1)" }} />
    </>
  );
}

// Plain rectangular window subpath, translated by `dx` for tiling and by
// `crop` for the bottom-anchored scale.
function rectHole(x: number, y: number, w: number, h: number) {
  return `M ${x.toFixed(3)} ${y.toFixed(3)} H ${(x + w).toFixed(3)} V ${(y + h).toFixed(3)} H ${x.toFixed(3)} Z`;
}

// Canvas shortened from 1600 so the bottom-aligned seats ride up into the
// window the way they do on desktop (~5% of window height) instead of
// sitting in a gap below it.
const M_CANVAS_H = 1450;
const M_WIN_TOP = 280;
const M_WIN_BOT = 1140;
const M_WIN_L = 60; // widened from 90 to buy the headline room for 3 lines
const M_WIN_W = 1320;
const MOBILE_HOLE = rectHole(M_WIN_L, M_WIN_TOP, M_WIN_W, M_WIN_BOT - M_WIN_TOP);
// Mobile headline is sized off the same measure ratio as desktop, so the
// 3-line break holds instead of spilling to 4. `cqw` here is 1% of the
// 1440-wide design canvas, i.e. 1% of the viewport.
const M_TEXT_PAD = 1; // cqw, each side
const M_MEASURE = M_WIN_W / 14.4 - M_TEXT_PAD * 2; // cqw
const M_HEADLINE_FS = M_MEASURE / MEASURE_RATIO; // cqw

function windowHolePath(dx: number, crop: number) {
  return rectHole(WIN_L + dx, WIN_TOP - crop, WIN_W, WIN_BOT - WIN_TOP);
}

function WallSvg({ dw, dh, holes, z }: { dw: number; dh: number; holes: string[]; z: number }) {
  return (
    <svg
      viewBox={`0 0 ${dw} ${dh}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: z, display: "block" }}
    >
      <path fillRule="evenodd" d={`M 0 0 H ${dw} V ${dh} H 0 Z ${holes.join(" ")}`} fill={TRAIN_BLUE} />
    </svg>
  );
}

// One hanging handle, rebuilt 1:1 from the handoff's Handle bar.svg (same
// rects, translated into a local 92x158 box) so handles can tile across
// any viewport width at a uniform scale instead of stretching with it.
// `x`/`y` are already in css px; `s` only sizes the handle itself.
function Handle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <svg
      viewBox="0 0 92 158"
      aria-hidden="true"
      style={{ position: "absolute", left: x, top: y, width: 92 * s, height: 158 * s, zIndex: 4, display: "block" }}
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
  // Defaults to the design canvas so the pre-measurement first paint is
  // the design at 1:1 (crop 0) rather than an arbitrary size that snaps.
  const [sceneSize, setSceneSize] = useState({ w: 1440, h: D_H });
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
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSceneSize((prev) => {
        const w = Math.max(1, r.width);
        const h = Math.max(1, r.height);
        return Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5 ? prev : { w, h };
      });
    };
    measure();
    // window resize as well as ResizeObserver: RO callbacks are delivered
    // as part of the rendering lifecycle, so they can be withheld while the
    // tab is throttled/backgrounded, leaving the scene sized from a stale
    // measurement. The resize listener covers the viewport-change case.
    window.addEventListener("resize", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
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
  // The scene height is capped at the viewport, so the fixed 1440x1238
  // design can't just stretch with the width. Everything scales uniformly
  // by `sScene` (contain-fit) and the 1440-wide composition is centered;
  // extra width is filled by tiling the wall's windows at the handoff's
  // own pitch and the handles at theirs, so at 1440 this reproduces
  // Blue Bg.svg exactly (its side partial windows ARE those neighbors).
  // Scale is bottom-anchored: rather than a strict contain-fit (which on a
  // short viewport shrinks everything and pulls in extra window tiles,
  // leaving the text small), the composition is allowed to run up to
  // MAX_CROP design px past the top of the box. That budget is exactly the
  // empty blue above the rail, so the whole scene reads bigger without
  // clipping any asset.
  const sScene = Math.min(sceneSize.w / 1440, sceneSize.h / (D_H - MAX_CROP)) || 1;
  const dw = sceneSize.w / sScene; // design-unit scene width (>= 1440)
  const dh = sceneSize.h / sScene; // visible design height (D_H-MAX_CROP..D_H)
  const crop = D_H - dh; // design px hidden above the top edge (0..MAX_CROP)
  const off = (dw - 1440) / 2; // centering offset for 1440-based coords
  const Y = (dy: number) => (dy - crop) * sScene; // design y -> css y
  const windowKs: number[] = [];
  for (let k = -4; k <= 4; k++) {
    const x0 = off + WIN_L + k * WIN_PITCH;
    if (x0 + WIN_W > -10 && x0 < dw + 10) windowKs.push(k);
  }
  const desktopHoles = windowKs.map((k) => windowHolePath(off + k * WIN_PITCH, crop));
  const handleXs: number[] = [];
  for (let k = -8; k <= 8; k++) {
    const x = off + HANDLE_X0 + k * HANDLE_PITCH;
    if (x + 92 > -10 && x < dw + 10) handleXs.push(x);
  }
  // Scrolling scenery. The skyline is nearer than the clouds, so it runs
  // faster -- that speed difference is what sells the parallax.
  const cityH = CITY_TILE * CITY_RATIO;
  const cityUnit = CITY_TILE * 2; // mirrored pair, see CITY_TILE
  const cityCount = Math.ceil(dw / cityUnit) + 2;
  const cloudCount = Math.ceil(dw / CLOUD_TILE) + 2;
  // Mobile keeps its cqw-sized 1440x1600 canvas; the scrolling layers are
  // px-positioned, so they need its scale factor explicitly.
  const mS = sceneSize.w / 1440;
  const mCityCount = Math.ceil(1440 / (CITY_TILE * 2)) + 2;
  const mCloudCount = Math.ceil(1440 / MOBILE_CLOUD_TILE) + 2;
  // Floor bands from Seats.svg's own rows, extended full-bleed so the
  // floor doesn't stop at the centered 1440-wide seat unit.
  const floorBands = [
    { c: "#4080B5", b: 48.8, h: 88.4 },
    { c: "#3A86C4", b: 38.44, h: 10.36 },
    { c: "#2C77B4", b: 30.15, h: 22.79 },
    { c: "#3A5D79", b: 0, h: 32.9 },
  ];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        overflow: "hidden",
        padding: "clamp(84px,11vh,120px) clamp(20px,5vw,56px) clamp(28px,4vh,48px)",
        textAlign: "center",
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

      {/* Drifting pixel-cluster field, behind the text (z0 vs z1). */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <PixelField />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          // 1260 (the headline's measure) + the horizontal padding, so the
          // three-line break is preserved at 1440 and up.
          maxWidth: 1324,
          padding: "clamp(36px,7.5vh,104px) clamp(16px,2.2vw,32px)",
          borderRadius: "clamp(14px,1.8vw,26px)",
          // Figma glass, approximated. The fill is the linear gradient
          // (#FFFFFF -> #B9F0FF) at the layer's 20% opacity. Frost is 0, so
          // there is deliberately no backdrop-filter -- besides matching the
          // spec, a backdrop filter would force the whole pane to recomposite
          // every frame while the sprites animate behind it.
          background: "linear-gradient(135deg, rgba(255,255,255,.2) 0%, rgba(185,240,255,.2) 100%)",
          // Refraction/depth/dispersion read as a lit rim: the light sits
          // upper-left per the -50 degree angle, and the far edge picks up the
          // gradient's tint rather than more white.
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow: [
            "inset 1.5px 1.5px 0 rgba(255,255,255,.6)",
            "inset -1.5px -1.5px 0 rgba(185,240,255,.5)",
            "0 1px 2px rgba(16,42,67,.03)",
            "0 18px 48px rgba(16,42,67,.06)",
          ].join(","),
        }}
      >
        <RevealText
          tag="p"
          trigger="load"
          variant="words"
          stagger={0.03}
          style={{
            margin: 0,
            // The glass frame now supplies the measure via its own maxWidth.
            maxWidth: "100%",
            fontFamily: "var(--font-geist)",
            // Below ~520px the flat 26px floor was spilling this sentence onto
            // 7 lines, so under that width the size tracks the viewport (5vw)
            // instead, which holds the headline to 5 lines from 360 to 430.
            // The outer min() leaves everything at 520px and up untouched.
            fontSize: "min(clamp(26px,4.4vw,40px), max(15px,5vw))",
            lineHeight: 1.5,
            // Evens the lines out so the sentence can't end on a lone word.
            // A hard <br /> would fix it at one width and misfire at every
            // other; this holds from 360 through 1440+ without breakpoints.
            textWrap: "balance",
            fontWeight: 300,
            color: "#1f2227",
          }}
        >
          Product Designer &amp; UX Researcher designing{" "}
          <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavior-driven digital experiences</span> through{" "}
          <span style={{ fontWeight: 700, color: "#3d3d3d" }}>interaction design, visual craft, and psychology</span>.
        </RevealText>

        <div style={{ marginTop: "clamp(28px,5vh,48px)", maxWidth: "min(900px,92vw)" }}>
          <RevealText
            tag="p"
            trigger="load"
            variant="words"
            stagger={0.04}
            style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "min(clamp(16px,2.2vw,24px), max(14px,3.7vw))", lineHeight: 1.4, textWrap: "balance", fontWeight: 300, color: "#3d3d3d" }}
          >
            5th year Design &amp; Psychology @ UC Davis • Campus Leader @ Figma
          </RevealText>
          <RevealText
            tag="p"
            trigger="load"
            variant="words"
            stagger={0.04}
            style={{ margin: "clamp(20px,3vw,32px) 0 0", fontFamily: "var(--font-geist)", fontSize: "min(clamp(16px,2.2vw,24px), max(14px,3.7vw))", lineHeight: 1.4, textWrap: "balance", fontWeight: 300, color: "#3d3d3d" }}
          >
            Seeking Product &amp; UX Design internships in creative tools, SaaS, and consumer technology
          </RevealText>
        </div>
      </div>

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

      {/* Train-interior scene -- disabled per request in favor of the
          centered layout above. Kept intact so it can be restored.
      Layers back-to-front are clouds (z0,
          drifting like the footer's), blue wall with transparent window
          holes (z1), rail/handles/floor (z2), seats (z3), hero text (z4).
          Desktop is height-capped to the viewport and tiles horizontally;
          mobile keeps the width-proportional cqw variant.
      <div
        ref={sceneRef}
        style={
          {
            position: "relative",
            width: "100%",
            overflow: "hidden",
            ...(mobileScene
              ? { aspectRatio: `1440 / ${M_CANVAS_H}`, containerType: "inline-size" }
              : { height: "min(78.82vw, calc(100svh - 70px))" }),
          } as React.CSSProperties
        }
      >
        {mobileScene ? (
          <>
            <ScrollTrack
              unitW={CITY_TILE * 2 * mS}
              count={mCityCount}
              dur={20}
              z={0}
              top={(M_WIN_BOT + 100 - CITY_TILE * CITY_RATIO) * mS}
              height={CITY_TILE * CITY_RATIO * mS}
              render={() => <CityPair />}
            />
            <ScrollTrack
              unitW={MOBILE_CLOUD_TILE * mS}
              count={mCloudCount}
              dur={50}
              z={1}
              top={M_WIN_TOP * mS}
              height={(M_WIN_BOT - M_WIN_TOP) * mS}
              render={() => (
                <>
                  {MOBILE_TILE_CLOUDS.map((c, i) => (
                    <img
                      key={i}
                      src={c.src}
                      alt=""
                      draggable={false}
                      style={{ position: "absolute", left: c.x * mS, top: c.y * mS, width: c.w * mS, height: "auto", display: "block" }}
                    />
                  ))}
                </>
              )}
            />
            <div style={{ position: "absolute", inset: 0, zIndex: 2, background: GLASS_COLOR, opacity: GLASS_OPACITY, pointerEvents: "none" }} />
            <WallSvg dw={1440} dh={M_CANVAS_H} holes={[MOBILE_HOLE]} z={3} />
            <img
              src="/assets/train/handle-bar.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", zIndex: 4, pointerEvents: "none", userSelect: "none", display: "block" }}
            />
            <img
              src="/assets/train/seats.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "auto", zIndex: 6, pointerEvents: "none", userSelect: "none", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 7,
                left: `${M_WIN_L / 14.4}cqw`,
                top: `${M_WIN_TOP / 14.4}cqw`,
                width: `${M_WIN_W / 14.4}cqw`,
                height: `${(M_WIN_BOT - M_WIN_TOP) / 14.4}cqw`,
                boxSizing: "border-box",
                padding: `2cqw ${M_TEXT_PAD}cqw 0`,
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
                style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: `min(${M_HEADLINE_FS.toFixed(3)}cqw, 21px)`, lineHeight: 1.45, fontWeight: 300, color: "#1f2227" }}
              >
                Product Designer &amp; UX researcher who designs{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
              </RevealText>
              <div style={{ marginTop: "4cqw", maxWidth: "84cqw" }}>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: "min(3cqw, 13px)", lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  5th year Design &amp; Psychology @ UC Davis •<br />
                  Campus Leader @ Figma
                </RevealText>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: "2.2cqw 0 0", fontFamily: "var(--font-geist)", fontSize: "min(3cqw, 13px)", lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  Currently seeking Product &amp; UX Design internships across tech and entertainment
                </RevealText>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* scenery through the glass: skyline (z0) < clouds (z1) <
                glass (z2) < wall (z3), so it's only visible in the windows }
            <ScrollTrack
              unitW={cityUnit * sScene}
              count={cityCount}
              dur={20}
              z={0}
              top={Y(WIN_BOT + CITY_SINK - cityH)}
              height={cityH * sScene}
              render={() => <CityPair />}
            />
            <ScrollTrack
              unitW={CLOUD_TILE * sScene}
              count={cloudCount}
              dur={50}
              z={1}
              top={Y(WIN_TOP)}
              height={(WIN_BOT - WIN_TOP) * sScene}
              render={() => (
                <>
                  {TILE_CLOUDS.map((c, i) => (
                    <img
                      key={i}
                      src={c.src}
                      alt=""
                      draggable={false}
                      style={{ position: "absolute", left: c.x * sScene, top: c.y * sScene, width: c.w * sScene, height: "auto", display: "block" }}
                    />
                  ))}
                </>
              )}
            />
            <div style={{ position: "absolute", inset: 0, zIndex: 2, background: GLASS_COLOR, opacity: GLASS_OPACITY, pointerEvents: "none" }} />
            <WallSvg dw={dw} dh={dh} holes={desktopHoles} z={3} />
            {/* rail stripes + tiled handles, dropped to RAIL_Y so blue
                shows above the rail rather than it hugging the nav }
            <div style={{ position: "absolute", top: Y(RAIL_Y), left: 0, right: 0, height: 17 * sScene, background: "#D2EFFF", zIndex: 4 }} />
            <div style={{ position: "absolute", top: Y(RAIL_Y + 9), left: 0, right: 0, height: 8 * sScene, background: "#208DE6", zIndex: 4 }} />
            {handleXs.map((x) => (
              <Handle key={x} x={x * sScene} y={Y(RAIL_Y)} s={sScene} />
            ))}
            {floorBands.map((f) => (
              <div
                key={f.c}
                style={{ position: "absolute", left: 0, right: 0, bottom: f.b * sScene, height: f.h * sScene, background: f.c, zIndex: 5 }}
              />
            ))}
            <img
              src="/assets/train/seats.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{
                position: "absolute",
                bottom: 0,
                left: off * sScene,
                width: 1440 * sScene,
                height: "auto",
                zIndex: 6,
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
              }}
            />
            {/* Hero text, sitting in the middle window's bulge. Sized in
                design px and scaled with the scene; the side padding is
                derived from HEADLINE_FS so the measure stays proportional
                to the type and the reference's 3-line break holds at any
                size. }
            <div
              style={{
                position: "absolute",
                zIndex: 7,
                left: (off + WIN_L) * sScene,
                top: Y(WIN_TOP),
                width: WIN_W * sScene,
                height: (WIN_BOT - WIN_TOP) * sScene,
                boxSizing: "border-box",
                padding: `${20 * sScene}px ${((WIN_W - HEADLINE_FS * MEASURE_RATIO) / 2) * sScene}px 0`,
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
                style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: HEADLINE_FS * sScene, lineHeight: 1.45, fontWeight: 300, color: "#1f2227" }}
              >
                Product Designer &amp; UX researcher who designs{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>behavioral and interactive web experiences</span> grounded in{" "}
                <span style={{ fontWeight: 700, color: "#3d3d3d" }}>systems thinking and user research</span>
              </RevealText>
              <div style={{ marginTop: 46 * sScene, maxWidth: SUB_FS * SUB_MEASURE_RATIO * sScene }}>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{ margin: 0, fontFamily: "var(--font-geist)", fontSize: SUB_FS * sScene, lineHeight: 1.5, fontWeight: 300, letterSpacing: ".05em", color: "#3d3d3d" }}
                >
                  5th year Design &amp; Psychology @ UC Davis •<br />
                  Campus Leader @ Figma
                </RevealText>
                <RevealText
                  tag="p"
                  trigger="load"
                  variant="words"
                  stagger={0.04}
                  style={{
                    margin: `${20 * sScene}px 0 0`,
                    fontFamily: "var(--font-geist)",
                    fontSize: SUB_FS * sScene,
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
      */}
    </section>
  );
}
