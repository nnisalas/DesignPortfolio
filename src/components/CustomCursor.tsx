"use client";

import { useEffect } from "react";

// Pixel-block trail cursor: a "snake" of grid-snapped squares following the
// real (still-visible) system cursor, all one solid color (matching the
// pixel-intro loading screen's blue), per the reference recording.
// Segments are connected with axis-aligned (never diagonal) steps between
// grid cells so fast moves read as a continuous Manhattan-style path
// instead of leaving gaps, and the tail continuously drains on a timer so
// the trail shrinks to nothing a beat after the cursor stops moving.
const GRID = 14;
const MAX_LEN = 10;
const DECAY_MS = 75;
const COLOR = "#3F9FE5";

export default function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647;transition:opacity .18s ease;";
    document.body.appendChild(layer);

    // The hero has its own cursor-reactive pixel field, so the trail stands
    // down while the pointer is over it and returns everywhere else. Only the
    // landing page has #hero; elsewhere this stays null and the trail is
    // always on. The rect is cached and refreshed on scroll/resize rather
    // than measured per mousemove, to keep the move handler layout-free.
    const hero = document.getElementById("hero");
    let heroTop = 0;
    let heroBottom = -1;
    const measureHero = () => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      heroTop = r.top;
      heroBottom = r.bottom;
    };
    measureHero();
    window.addEventListener("scroll", measureHero, { passive: true });
    window.addEventListener("resize", measureHero);

    type Cell = { gx: number; gy: number; el: HTMLDivElement };
    const queue: Cell[] = [];
    let lastGX: number | null = null;
    let lastGY: number | null = null;

    let suppressed = false;
    const setSuppressed = (on: boolean) => {
      if (on === suppressed) return;
      suppressed = on;
      layer.style.opacity = on ? "0" : "1";
      if (on) {
        // Drop the trail outright so re-entering doesn't flash the stale path.
        while (queue.length) queue.shift()?.el.remove();
      }
    };

    function pushCell(gx: number, gy: number) {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${gx}px;top:${gy}px;width:${GRID}px;height:${GRID}px;transform:translate(-50%,-50%);background:${COLOR};`;
      layer.appendChild(el);
      queue.push({ gx, gy, el });
      while (queue.length > MAX_LEN) {
        queue.shift()?.el.remove();
      }
    }

    function popOldest() {
      if (!queue.length) return;
      queue.shift()?.el.remove();
    }

    const onMove = (e: MouseEvent) => {
      const gx = Math.round(e.clientX / GRID) * GRID;
      const gy = Math.round(e.clientY / GRID) * GRID;

      if (heroBottom > heroTop && e.clientY >= heroTop && e.clientY < heroBottom) {
        setSuppressed(true);
        // Keep the anchor current so leaving the hero starts a fresh trail
        // instead of drawing an L back to wherever the cursor entered.
        lastGX = gx;
        lastGY = gy;
        return;
      }
      setSuppressed(false);

      if (lastGX === null || lastGY === null) {
        pushCell(gx, gy);
        lastGX = gx;
        lastGY = gy;
        return;
      }
      if (gx === lastGX && gy === lastGY) return;
      // Walk one axis fully, then the other -- an L-shaped connector
      // between the last cell and the new one, never diagonal.
      let cx = lastGX;
      let cy = lastGY;
      let guard = 0;
      while (cx !== gx && guard < 200) {
        cx += cx < gx ? GRID : -GRID;
        pushCell(cx, cy);
        guard++;
      }
      while (cy !== gy && guard < 200) {
        cy += cy < gy ? GRID : -GRID;
        pushCell(cx, cy);
        guard++;
      }
      lastGX = gx;
      lastGY = gy;
    };

    const interval = window.setInterval(popOldest, DECAY_MS);
    document.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", measureHero);
      window.removeEventListener("resize", measureHero);
      window.clearInterval(interval);
      layer.remove();
    };
  }, []);

  return null;
}
