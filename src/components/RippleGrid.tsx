"use client";

// Interactive background ripple-grid effect: a grid of cells that, on
// click, flashes outward from the clicked cell in a distance-staggered
// wave (same "stagger by distance" technique PixelIntro.tsx uses for its
// tile-wave dissolve). Adapted from a Framer component -- this project
// has no `framer`/`framer-motion` dependency, so the ripple is done with
// plain CSS keyframes (see .rg-cell / @keyframes ripple-flash-* in
// globals.css) driven by per-cell inline `animation` + CSS custom
// properties, instead of framer-motion's `motion.div` + Framer's
// addPropertyControls/useIsStaticRenderer (Framer-canvas-only APIs).
//
// Each click cycles to the next color in `colors` (wrapping around), so
// consecutive clicks always flash a different color -- default palette
// is the site's #3F9FE5 / #F3A739 / #8ABA69 / #EFC94F set.
//
// Not wired into any page yet -- standalone component only.

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export type RippleGridShape = "square" | "circle" | "triangle" | "hexagon" | "diamond";

export interface RippleGridProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  borderColor?: string;
  restColor?: string;
  colors?: string[];
  opacity?: number; // 0-100, resting opacity
  hoverOpacity?: number; // 0-100
  rippleDuration?: number; // ms, base per-cell flash duration
  rippleStagger?: number; // ms of delay added per grid-unit of distance from the clicked cell
  showShadow?: boolean;
  shadowColor?: string;
  interactive?: boolean;
  shape?: RippleGridShape;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS = ["#3F9FE5", "#F3A739", "#8ABA69", "#EFC94F"];
const MAX_CELLS = 1000;

function getShapeStyle(shape: RippleGridShape, size: number, restColor: string): CSSProperties {
  const s = size - 1; // account for the 0.5px border
  switch (shape) {
    case "circle":
      return { borderRadius: "50%", width: s, height: s };
    case "triangle":
      return {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderLeft: `${s / 2}px solid transparent`,
        borderRight: `${s / 2}px solid transparent`,
        borderBottom: `${s}px solid ${restColor}`,
        border: "none",
      };
    case "hexagon":
      return {
        width: s,
        height: s * 0.866,
        clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
      };
    case "diamond":
      return { width: s, height: s, transform: "rotate(45deg)", transformOrigin: "center" };
    default:
      return { width: s, height: s };
  }
}

export default function RippleGrid({
  rows = 8,
  cols = 27,
  cellSize = 56,
  borderColor = "#E5E5E5",
  restColor = "#F5F5F5",
  colors = DEFAULT_COLORS,
  opacity = 40,
  hoverOpacity = 80,
  rippleDuration = 500,
  rippleStagger = 55,
  showShadow = true,
  shadowColor = "#CCCCCC",
  interactive = true,
  shape = "square",
  className,
  style,
}: RippleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cap total cell count for very large grids, same as the source component.
  const totalCells = rows * cols;
  const shouldVirtualize = totalCells > MAX_CELLS;
  const actualRows = shouldVirtualize ? Math.min(rows, Math.floor(MAX_CELLS / cols)) : rows;
  const actualCols = shouldVirtualize ? Math.min(cols, Math.floor(MAX_CELLS / rows)) : cols;

  const cells = useMemo(() => Array.from({ length: actualRows * actualCols }, (_, i) => i), [actualRows, actualCols]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!interactive) return;
      startTransition(() => {
        setClickedCell({ row, col });
        setRippleKey((k) => k + 1);
        setColorIdx((i) => (i + 1) % colors.length);
      });
    },
    [interactive, colors.length]
  );

  const activeColor = colors[colorIdx] ?? colors[0];
  const animName = shape === "triangle" ? "ripple-flash-border" : "ripple-flash-bg";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${actualCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${actualRows}, ${cellSize}px)`,
          width: actualCols * cellSize,
          height: actualRows * cellSize,
          margin: "0 auto",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {cells.map((idx) => {
          const row = Math.floor(idx / actualCols);
          const col = idx % actualCols;
          const distance = clickedCell ? Math.hypot(clickedCell.row - row, clickedCell.col - col) : 0;
          const delay = clickedCell ? distance * rippleStagger : 0;
          const duration = rippleDuration + distance * 60;

          return (
            <div
              key={`${idx}-${rippleKey}`}
              className="rg-cell"
              onClick={() => handleCellClick(row, col)}
              style={
                {
                  position: "relative",
                  backgroundColor: shape === "triangle" ? "transparent" : restColor,
                  border: shape === "triangle" ? "none" : `0.5px solid ${borderColor}`,
                  opacity: opacity / 100,
                  cursor: interactive ? "pointer" : "default",
                  pointerEvents: interactive ? "auto" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity .15s ease",
                  ...(showShadow && shape !== "triangle" && { boxShadow: `0px 0px 40px 1px ${shadowColor} inset` }),
                  ...getShapeStyle(shape, cellSize, restColor),
                  ["--rg-rest" as string]: restColor,
                  ["--rg-ripple" as string]: activeColor,
                  ["--rg-hover-opacity" as string]: hoverOpacity / 100,
                  ...(clickedCell && inView
                    ? { animation: `${animName} ${Math.min(duration, 2000)}ms ease-out ${delay}ms 1` }
                    : null),
                } as CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
