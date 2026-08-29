"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Full-screen pixel-dissolve loading intro, ported from the design handoff
// (design_handoff_pixel_intro). A solid brand-blue screen types the name
// with a blinking caret, holds, then breaks into a grid of square tiles
// that pop off (0ms opacity transition, all timing lives in per-tile
// transition-delay) in a bottom-up wave with a stable per-tile jitter, and
// finally unmounts. Plays on every page load (including refresh), and can
// be replayed in place -- see the "pixel-intro:replay" event, dispatched
// by the homepage logo click in SiteHeader.tsx.
const NAME = "Nathan Salas";
const SCREEN_COLOR = "#3F9FE5";
const TYPE_MS = 65;
const ROW_STEP_MS = 45;
const HOLD_MS = 520;
const UNMOUNT_PAD_MS = 400;
export const REPLAY_EVENT = "pixel-intro:replay";

type Geometry = { cols: number; rows: number; size: number; rand: number[] };

function measure(): Geometry {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const size = Math.round(Math.max(38, Math.min(w, h) / 12));
  const cols = Math.ceil(w / size);
  const rows = Math.ceil(h / size);
  const rand: number[] = [];
  for (let i = 0; i < cols * rows; i++) rand.push(Math.random());
  return { cols, rows, size, rand };
}

export default function PixelIntro() {
  const [geom, setGeom] = useState<Geometry>({ cols: 0, rows: 0, size: 64, rand: [] });
  const [typed, setTyped] = useState("");
  const [dissolve, setDissolve] = useState(false);
  const [fadeText, setFadeText] = useState(false);
  const [overlayOn, setOverlayOn] = useState(false);
  const [ready, setReady] = useState(false);

  const timers = useRef<number[]>([]);
  const typer = useRef<number | null>(null);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (typer.current !== null) window.clearInterval(typer.current);
    typer.current = null;
  }, []);

  const start = useCallback(
    (rows: number) => {
      clear();
      setTyped("");
      setDissolve(false);
      setFadeText(false);
      setOverlayOn(true);
      let i = 0;
      typer.current = window.setInterval(() => {
        i++;
        setTyped(NAME.slice(0, i));
        if (i >= NAME.length) {
          if (typer.current !== null) window.clearInterval(typer.current);
          typer.current = null;
          timers.current.push(window.setTimeout(() => setDissolve(true), HOLD_MS));
          const total = rows * ROW_STEP_MS + 200;
          timers.current.push(window.setTimeout(() => setFadeText(true), HOLD_MS + total * 0.5));
          timers.current.push(window.setTimeout(() => setOverlayOn(false), HOLD_MS + total + UNMOUNT_PAD_MS));
        }
      }, TYPE_MS);
    },
    [clear]
  );

  const run = useCallback(() => {
    // Reduced motion: skip typing/wave entirely, never show the overlay
    // (per the handoff's accessibility note) -- applies to both the
    // initial run and a manually triggered replay.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      setOverlayOn(false);
      return;
    }
    const g = measure();
    setGeom(g);
    start(g.rows);
    setReady(true);
  }, [start]);

  useEffect(() => {
    run();
    const onResize = () => setGeom(measure());
    const onReplay = () => run();
    window.addEventListener("resize", onResize);
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener(REPLAY_EVENT, onReplay);
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready || !overlayOn) return null;

  const { cols, rows, size, rand } = geom;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const delay = (rows - 1 - r) * ROW_STEP_MS + (rand[i] || 0) * 130;
      cells.push(
        <div
          key={i}
          style={{
            background: SCREEN_COLOR,
            opacity: dissolve ? 0 : 1,
            transition: "opacity 0ms linear",
            transitionDelay: dissolve ? `${delay}ms` : "0ms",
          }}
        />
      );
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${size}px)`,
          gridAutoRows: `${size}px`,
        }}
      >
        {cells}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.12em",
          opacity: fadeText ? 0 : 1,
          transition: "opacity 420ms ease",
        }}
      >
        <span style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", fontSize: "clamp(22px,3.4vw,44px)", fontWeight: 300, letterSpacing: "0.01em", color: "#FFFFFF" }}>
          {typed}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            height: "1.15em",
            minWidth: 2,
            background: "#FFFFFF",
            fontSize: "clamp(22px,3.4vw,44px)",
            transform: "translateY(0.14em)",
            animation: "pixel-intro-blink 1s steps(1) infinite",
          }}
        />
      </div>
    </div>
  );
}
