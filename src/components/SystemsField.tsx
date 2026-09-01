"use client";

// Hero background: an abstract "systems map" -- nodes joined by thin links,
// with larger squares as focal points, reacting to the cursor.
//
// This is a plain 2D canvas rather than a 3D point cloud: linking dots is an
// O(n^2) proximity problem, so it wants far fewer, well-spaced nodes, and
// canvas is cheaper and crisper for 1px lines.
//
// Node count scales with viewport area to hold density constant, so the map
// reads the same on a phone (~26 nodes) as on a wide display (~173).
//
// Nodes come in two families, cool and warm. Links inherit their endpoints'
// colour when both agree; a cross-family link uses a neutral instead, since
// blending blue with orange just makes mud.

import { useEffect, useRef } from "react";

export interface SystemsFieldProps {
  className?: string;
  style?: React.CSSProperties;
}

const SPACING = 108; // px between nodes; drives count and link range
const MIN_NODES = 18;
const MAX_NODES = 190;
const LINK_RANGE = SPACING * 1.5; // a node keeps ~2-4 links: a map, not a mesh
const CURSOR_RANGE = 190;
const CURSOR_PUSH = 15; // px a node drifts away from the cursor at closest
const PARALLAX = 26; // px of camera travel at depth 1
const DRIFT = 0.018; // px/frame ambient motion, so it breathes when idle
const LINK_ALPHA = 0.85;
const FOCAL_RATIO = 0.055; // share of nodes promoted to focal squares
const WARM_RATIO = 0.3; // share of nodes in the warm family
const SHAPE_POINTS = 4; // nodes the cursor gathers into a shape

const COOL = { node: "#87CEEB", focal: "#3F9FE5", link: "#6FB6D4" };
const WARM = { node: "#F3A738", focal: "#E07B1F", link: "#E3A55F" };
const MIX_LINK = "#AFBAC0"; // cross-family: neutral, not a blue/orange blend

type Node = {
  nx: number; // normalised base position, so resizes redistribute cleanly
  ny: number;
  depth: number; // 0.4..1 -> size, opacity and parallax all scale with it
  size: number;
  focal: boolean;
  warm: boolean;
  dx: number; // ambient drift velocity
  dy: number;
  ox: number; // eased cursor displacement
  oy: number;
  react: number; // eased 0..1 cursor proximity, drives grow/glow
};

export default function SystemsField({ className, style }: SystemsFieldProps) {
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
      const focalEvery = Math.max(1, Math.floor(count / focalTarget));
      nodes = Array.from({ length: count }, (_, i) => {
        const focal = i % focalEvery === 0;
        return {
          nx: Math.random(),
          ny: Math.random(),
          depth: 0.4 + Math.random() * 0.6,
          size: focal ? 7 + Math.random() * 4 : 2 + Math.random() * 3.5,
          focal,
          warm: Math.random() < WARM_RATIO,
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

      const n0 = nodes.length;
      const xs = new Float32Array(n0);
      const ys = new Float32Array(n0);
      const cdist = new Float32Array(n0); // distance to cursor, for the shape
      const near: number[] = []; // indices inside CURSOR_RANGE

      // --- positions for this frame ---
      for (let i = 0; i < n0; i++) {
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

        let tx = 0;
        let ty = 0;
        let tReact = 0;
        cdist[i] = Infinity;
        if (cursor.active) {
          const vx = bx - cursor.x;
          const vy = by - cursor.y;
          const d = Math.hypot(vx, vy);
          cdist[i] = d;
          if (d < CURSOR_RANGE && d > 0.001) {
            const f = 1 - d / CURSOR_RANGE;
            tReact = f;
            const push = f * f * CURSOR_PUSH;
            tx = (vx / d) * push;
            ty = (vy / d) * push;
            near.push(i);
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
      for (let i = 0; i < n0; i++) {
        for (let j = i + 1; j < n0; j++) {
          const dx = xs[i] - xs[j];
          const dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_RANGE * LINK_RANGE) continue;
          const d = Math.sqrt(d2);
          const a = nodes[i];
          const b = nodes[j];
          const lift = Math.max(a.react, b.react);
          const depth = (a.depth + b.depth) / 2;
          const alpha = (1 - d / LINK_RANGE) * LINK_ALPHA * depth * (0.7 + lift * 0.8);
          if (alpha < 0.012) continue;
          ctx.globalAlpha = Math.min(alpha, 1);
          ctx.strokeStyle = a.warm === b.warm ? (a.warm ? WARM.link : COOL.link) : MIX_LINK;
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[j], ys[j]);
          ctx.stroke();
        }
      }

      // --- the cursor's own cell: it links to the nodes around it, and
      // those nodes close into a small polygon that morphs as it moves ---
      if (cursor.active && near.length >= 3) {
        const pick = near.slice().sort((p, q) => cdist[p] - cdist[q]).slice(0, SHAPE_POINTS);
        // order by angle so the polygon is simple, never self-crossing
        pick.sort((p, q) => Math.atan2(ys[p] - cursor.y, xs[p] - cursor.x) - Math.atan2(ys[q] - cursor.y, xs[q] - cursor.x));

        let engage = 0;
        let warmVotes = 0;
        for (const i of pick) {
          engage += nodes[i].react;
          if (nodes[i].warm) warmVotes++;
        }
        engage /= pick.length;
        const fam = warmVotes * 2 > pick.length ? WARM : COOL;

        ctx.beginPath();
        ctx.moveTo(xs[pick[0]], ys[pick[0]]);
        for (let k = 1; k < pick.length; k++) ctx.lineTo(xs[pick[k]], ys[pick[k]]);
        ctx.closePath();
        ctx.globalAlpha = Math.min(engage * 0.16, 1);
        ctx.fillStyle = fam.focal;
        ctx.fill();
        ctx.globalAlpha = Math.min(engage * 0.55, 1);
        ctx.strokeStyle = fam.link;
        ctx.stroke();
      }

      // --- links from the cursor itself, so it joins the system ---
      if (cursor.active) {
        for (let i = 0; i < n0; i++) {
          const r = nodes[i].react;
          if (r < 0.02) continue;
          ctx.globalAlpha = Math.min(r * 0.75, 1);
          ctx.strokeStyle = nodes[i].warm ? WARM.link : COOL.link;
          ctx.beginPath();
          ctx.moveTo(cursor.x, cursor.y);
          ctx.lineTo(xs[i], ys[i]);
          ctx.stroke();
        }
      }

      // --- nodes ---
      for (let i = 0; i < n0; i++) {
        const n = nodes[i];
        const fam = n.warm ? WARM : COOL;
        const grow = n.focal ? 1 + n.react * 0.55 : 1 + n.react * 0.25;
        const s = n.size * n.depth * grow;

        if (n.focal) {
          // square "glow", kept square to match the pixel look
          const g = s * (2.1 + n.react * 1.3);
          ctx.globalAlpha = (0.1 + n.react * 0.22) * n.depth;
          ctx.fillStyle = fam.focal;
          ctx.fillRect(xs[i] - g / 2, ys[i] - g / 2, g, g);
        }

        ctx.globalAlpha = Math.min((n.focal ? 0.95 : 0.7) * n.depth + n.react * 0.3, 1);
        ctx.fillStyle = n.focal ? fam.focal : fam.node;
        ctx.fillRect(xs[i] - s / 2, ys[i] - s / 2, s, s);
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
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={className} style={{ width: "100%", height: "100%", ...style }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
