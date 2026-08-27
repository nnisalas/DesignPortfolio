"use client";

import { useEffect } from "react";

// Pixel-block trail cursor: a "snake" of grid-snapped squares following the
// real (still-visible) system cursor, all one solid green, per the
// reference recording. Segments are connected with axis-aligned (never
// diagonal) steps between grid cells so fast moves read as a continuous
// Manhattan-style path instead of leaving gaps, and the tail continuously
// drains on a timer so the trail shrinks to nothing a beat after the
// cursor stops moving.
const GRID = 14;
const MAX_LEN = 10;
const DECAY_MS = 75;
const COLOR = "rgb(190,254,0)";

export default function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647;";
    document.body.appendChild(layer);

    type Cell = { gx: number; gy: number; el: HTMLDivElement };
    const queue: Cell[] = [];
    let lastGX: number | null = null;
    let lastGY: number | null = null;

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
      window.clearInterval(interval);
      layer.remove();
    };
  }, []);

  return null;
}
