"use client";

// Hero background: an abstract "systems map" -- nodes joined by thin links,
// with a few larger squares as focal points, reacting to the cursor.
//
// Replaces the three.js starfield. That was a 3D point cloud, which is the
// wrong shape for this: linking dots is an O(n^2) proximity problem, and at
// its 3000 points that's ~4.5M pair checks a frame (and a hairball of lines
// even if it were free). A network wants far fewer, well-spaced nodes, so
// this is a plain 2D canvas -- cheaper, crisper for 1px lines, and it drops
// the ~150KB three.js dependency entirely.
//
// Node count scales with viewport area to hold density constant, so the map
// reads the same on a phone (~26 nodes) as on a wide display (~173).

import { useEffect, useRef } from "react";

export interface SystemsFieldProps {
  nodeColor?: string;
  focalColor?: string;
  linkColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SPACING = 108; // px between nodes; drives count, link range and sizes
const MIN_NODES = 18;
const MAX_NODES = 190;
const LINK_RANGE = SPACING * 1.5; // a node keeps ~2-4 links: a map, not a mesh
const CURSOR_RANGE = 190;
const CURSOR_PUSH = 15; // px a node drifts away from the cursor at closest
const PARALLAX = 26; // px of camera travel at depth 1
const DRIFT = 0.018; // px/frame ambient motion, so it breathes when idle
const LINK_ALPHA = 0.85; // ceiling for link opacity
const FOCAL_RATIO = 0.055; // share of nodes promoted to focal squares

type Node = {
  nx: number; // normalised base position, so resizes redistribute cleanly
  ny: number;
  depth: number; // 0.4..1 -> size, opacity and parallax all scale with it
  size: number;
  focal: boolean;
  dx: number; // ambient drift velocity
  dy: number;
  ox: number; // eased cursor displacement
  oy: number;
  react: number; // eased 0..1 cursor proximity, drives focal grow/glow
};

export default function SystemsField({
  nodeColor = "#87CEEB",
  focalColor = "#3F9FE5",
  linkColor = "#6FB6D4",
  className,
  style,
}: SystemsFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;

    // camera (parallax) and cursor, both in css px
    let camX = 0;
    let camY = 0;
    let camTX = 0;
    let camTY = 0;
    const cursor = { x: -9999, y: -9999, active: false };

    const build = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(MIN_NODES, Math.min(MAX_NODES, Math.round((w * h) / (SPACING * SPACING))));
      const focalTarget = Math.max(3, Math.round(count * FOCAL_RATIO));
      nodes = Array.from({ length: count }, (_, i) => {
        const depth = 0.4 + Math.random() * 0.6;
        // focal points are spread through the list rather than clustered
        const focal = i % Math.max(1, Math.floor(count / focalTarget)) === 0;
        return {
          nx: Math.random(),
          ny: Math.random(),
          depth,
          size: focal ? 7 + Math.random() * 4 : 2 + Math.random() * 3.5,
          focal,
          dx: (Math.random() - 0.5) * DRIFT,
          dy: (Math.random() - 0.5) * DRIFT,
          ox: 0,
          oy: 0,
          react: 0,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // --- positions for this frame ---
      const xs = new Float32Array(nodes.length);
      const ys = new Float32Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduced) {
          n.nx += n.dx / w;
          n.ny += n.dy / h;
          if (n.nx < 0) n.nx += 1;
          else if (n.nx > 1) n.nx -= 1;
          if (n.ny < 0) n.ny += 1;
          else if (n.ny > 1) n.ny -= 1;
        }
        const bx = n.nx * w + camX * n.depth;
        const by = n.ny * h + camY * n.depth;

        // cursor push + reaction, both eased so nothing snaps
        let tx = 0;
        let ty = 0;
        let tReact = 0;
        if (cursor.active) {
          const vx = bx - cursor.x;
          const vy = by - cursor.y;
          const d = Math.hypot(vx, vy);
          if (d < CURSOR_RANGE && d > 0.001) {
            const f = 1 - d / CURSOR_RANGE;
            tReact = f;
            const push = f * f * CURSOR_PUSH;
            tx = (vx / d) * push;
            ty = (vy / d) * push;
          }
        }
        n.ox += (tx - n.ox) * 0.12;
        n.oy += (ty - n.oy) * 0.12;
        n.react += (tReact - n.react) * 0.12;

        xs[i] = bx + n.ox;
        ys[i] = by + n.oy;
      }

      // --- links between nearby nodes (the "system") ---
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = xs[i] - xs[j];
          const dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_RANGE * LINK_RANGE) continue;
          const d = Math.sqrt(d2);
          // fade with distance, and lift a little near the cursor
          const near = Math.max(nodes[i].react, nodes[j].react);
          const depth = (nodes[i].depth + nodes[j].depth) / 2;
          const a = (1 - d / LINK_RANGE) * LINK_ALPHA * depth * (0.7 + near * 0.8);
          if (a < 0.012) continue;
          ctx.globalAlpha = Math.min(a, 1);
          ctx.strokeStyle = linkColor;
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[j], ys[j]);
          ctx.stroke();
        }
      }

      // --- links from the cursor itself, so it joins the system ---
      if (cursor.active) {
        for (let i = 0; i < nodes.length; i++) {
          const r = nodes[i].react;
          if (r < 0.02) continue;
          ctx.globalAlpha = Math.min(r * 0.75, 1);
          ctx.strokeStyle = linkColor;
          ctx.beginPath();
          ctx.moveTo(cursor.x, cursor.y);
          ctx.lineTo(xs[i], ys[i]);
          ctx.stroke();
        }
      }

      // --- nodes ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const grow = n.focal ? 1 + n.react * 0.55 : 1 + n.react * 0.25;
        const s = n.size * n.depth * grow;
        const x = xs[i] - s / 2;
        const y = ys[i] - s / 2;

        if (n.focal) {
          // soft square "glow" behind, kept as a square to match the pixel look
          const g = s * (2.1 + n.react * 1.3);
          ctx.globalAlpha = (0.1 + n.react * 0.22) * n.depth;
          ctx.fillStyle = focalColor;
          ctx.fillRect(xs[i] - g / 2, ys[i] - g / 2, g, g);
        }

        ctx.globalAlpha = Math.min((n.focal ? 0.95 : 0.7) * n.depth + n.react * 0.3, 1);
        ctx.fillStyle = n.focal ? focalColor : nodeColor;
        ctx.fillRect(x, y, s, s);
      }

      ctx.globalAlpha = 1;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      camX += (camTX - camX) * 0.05;
      camY += (camTY - camY) * 0.05;
      draw();
    };

    const setRunning = (on: boolean) => {
      if (reduced) return;
      if (on && !raf) frame();
      else if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      running = on;
    };

    // --- input ---
    const onPointerMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      camTX = -((px / Math.max(1, r.width)) * 2 - 1) * PARALLAX;
      camTY = -((py / Math.max(1, r.height)) * 2 - 1) * PARALLAX;
      if (finePointer) {
        cursor.x = px;
        cursor.y = py;
        cursor.active = px >= 0 && py >= 0 && px <= r.width && py <= r.height;
      }
    };
    const onPointerLeave = () => {
      cursor.active = false;
      camTX = 0;
      camTY = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      build();
      if (reduced || !running) draw();
    };
    window.addEventListener("resize", onResize);
    // The hero is sized in svh, so it can change without a window resize.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(wrap);

    build();
    draw(); // paint immediately, so there's never an empty frame

    // Park the loop while the hero is scrolled away. The first visibility
    // test is synchronous: IntersectionObserver callbacks are delivered via
    // the rendering lifecycle, so a throttled tab can withhold them, and
    // waiting on one risks never starting at all.
    const onScreen = () => {
      const r = wrap.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    setRunning(onScreen());
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
  }, [nodeColor, focalColor, linkColor]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={className} style={{ width: "100%", height: "100%", ...style }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
