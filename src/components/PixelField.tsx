"use client";

// Hero background: the site's own pixel-cluster assets (the ones flanking
// the value-highlight section) scattered at wildly varying scale, drifting
// and parallaxing with the cursor.
//
// The assets are a 4-square diamond cluster with soft edges baked in, so
// rotating 45deg yields the plus/cross form -- both orientations in the
// reference come from the same four files, no extra art needed. They're
// 197px native and the largest sprite here is ~155px, so every sprite is
// downscaled and none of them go soft from upscaling.
//
// Sprites are DOM <img> rather than canvas drawImage: transforms stay on
// the compositor, and the browser handles decode and filtering.

import { useEffect, useRef, useState } from "react";

const ASSETS = ["/assets/px-blue.webp", "/assets/px-green.webp", "/assets/px-yellow.webp", "/assets/px-orange.webp"];

const AREA_PER_SPRITE = 52000; // px^2 -- density held constant across viewports
const MIN_SPRITES = 8;
const MAX_SPRITES = 40;
const PARALLAX = 42; // px of travel at depth 1
const DRIFT = 0.02; // px/frame ambient motion

type Sprite = {
  src: string;
  nx: number; // normalised base position
  ny: number;
  depth: number; // 0.12..1 -> drives size, opacity and parallax together
  size: number;
  rot: number; // 0 = diamond (asset's own orientation), 45 = plus
  dx: number;
  dy: number;
  opacity: number;
};

function makeSprites(w: number, h: number): Sprite[] {
  const count = Math.max(MIN_SPRITES, Math.min(MAX_SPRITES, Math.round((w * h) / AREA_PER_SPRITE)));
  return Array.from({ length: count }, () => {
    // squared-ish falloff keeps most sprites small, with a few large ones
    const depth = Math.pow(Math.random(), 1.5);
    return {
      src: ASSETS[Math.floor(Math.random() * ASSETS.length)],
      nx: Math.random(),
      ny: Math.random(),
      depth,
      size: 10 + Math.pow(depth, 1.7) * 145,
      rot: Math.random() < 0.5 ? 0 : 45,
      dx: (Math.random() - 0.5) * DRIFT,
      dy: (Math.random() - 0.5) * DRIFT,
      opacity: 0.62 + depth * 0.38,
    };
  });
}

export default function PixelField({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLImageElement | null)[]>([]);
  // Generated after mount, never during render: the count depends on the
  // measured viewport, and seeding it from Math.random() during SSR would
  // hydrate to different positions than the server sent.
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const spritesRef = useRef<Sprite[]>([]);
  spritesRef.current = sprites;

  // Build on mount, and rebuild only when the area changes enough to matter
  // (orientation change, a jump between breakpoints). Rebuilding on every
  // resize tick would reshuffle the whole field while dragging a window,
  // but never rebuilding leaves a phone-sized count on a desktop.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let builtArea = 0;

    const build = () => {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      const area = w * h;
      if (builtArea && area > builtArea * 0.6 && area < builtArea * 1.6) return;
      builtArea = area;
      setSprites(makeSprites(w, h));
    };

    // measure after a frame so the hero's svh height has settled
    const id = requestAnimationFrame(build);
    window.addEventListener("resize", build);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(build) : null;
    ro?.observe(wrap);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", build);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || sprites.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = wrap.clientWidth || 1;
    let h = wrap.clientHeight || 1;
    let camX = 0;
    let camY = 0;
    let camTX = 0;
    let camTY = 0;

    const paint = () => {
      const list = spritesRef.current;
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        const el = nodeRefs.current[i];
        if (!el) continue;
        if (!reduced) {
          s.nx += s.dx / w;
          s.ny += s.dy / h;
          if (s.nx < -0.15) s.nx += 1.3;
          else if (s.nx > 1.15) s.nx -= 1.3;
          if (s.ny < -0.15) s.ny += 1.3;
          else if (s.ny > 1.15) s.ny -= 1.3;
        }
        const x = s.nx * w + camX * s.depth - s.size / 2;
        const y = s.ny * h + camY * s.depth - s.size / 2;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${s.rot}deg)`;
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      camX += (camTX - camX) * 0.045;
      camY += (camTY - camY) * 0.045;
      paint();
    };

    const setRunning = (on: boolean) => {
      if (reduced) return;
      if (on && !raf) frame();
      else if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const b = wrap.getBoundingClientRect();
      const px = (e.clientX - b.left) / Math.max(1, b.width);
      const py = (e.clientY - b.top) / Math.max(1, b.height);
      camTX = -(px * 2 - 1) * PARALLAX;
      camTY = -(py * 2 - 1) * PARALLAX;
    };
    const onPointerLeave = () => {
      camTX = 0;
      camTY = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      w = wrap.clientWidth || 1;
      h = wrap.clientHeight || 1;
      paint();
    };
    window.addEventListener("resize", onResize);
    // The hero is sized in svh, so it can change without a window resize.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(wrap);

    paint(); // place them before the first animated frame

    // Park the loop while the hero is scrolled away. The first visibility
    // test is synchronous: IntersectionObserver callbacks ride the rendering
    // lifecycle, so a throttled tab can withhold them and waiting on one
    // risks never starting at all.
    const b = wrap.getBoundingClientRect();
    setRunning(b.top < window.innerHeight && b.bottom > 0);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting))
        : null;
    io?.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [sprites]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", overflow: "hidden", ...style }}
    >
      {sprites.map((s, i) => (
        <img
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          src={s.src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            willChange: "transform",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ))}
    </div>
  );
}
