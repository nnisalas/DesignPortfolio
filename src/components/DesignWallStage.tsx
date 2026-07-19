"use client";

import { useEffect, useRef, useState } from "react";
import { LAYER_BACK, LAYER_MID, LAYER_FRONT, WELCOME_ACCENTS } from "@/lib/wallItems";
import WallPlaceholder from "./WallPlaceholder";
import DozeVideoFrame from "./DozeVideoFrame";

export default function DesignWallStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const layers = [
      { el: backRef.current, d: 0.45, s: 0.94 },
      { el: midRef.current, d: 0.72, s: 0.97 },
      { el: frontRef.current, d: 1, s: 1 },
    ];

    let fit = Math.max(0.42, Math.min(1, window.innerWidth / 1440));
    let camX = 0,
      camY = 0,
      curX = 0,
      curY = 0;
    let dragging = false,
      lastX = 0,
      lastY = 0,
      moved = false;

    const clamp = () => {
      const mx = Math.max(0, (3200 * fit - window.innerWidth) / 2 + 60 * fit);
      const my = Math.max(0, (2100 * fit - window.innerHeight) / 2 + 60 * fit);
      camX = Math.min(mx, Math.max(-mx, camX));
      camY = Math.min(my, Math.max(-my, camY));
    };

    const onResize = () => {
      fit = Math.max(0.42, Math.min(1, window.innerWidth / 1440));
      clamp();
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest("a, button")) return;
      dragging = true;
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      camX -= e.clientX - lastX;
      camY -= e.clientY - lastY;
      if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > 2) moved = true;
      lastX = e.clientX;
      lastY = e.clientY;
      clamp();
      if (moved) setHintVisible(false);
    };
    const onUp = () => {
      dragging = false;
      stage.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camX += e.deltaX;
      camY += e.deltaY;
      clamp();
      setHintVisible(false);
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = () => {
      curX += (camX - curX) * 0.085;
      curY += (camY - curY) * 0.085;
      layers.forEach((l) => {
        if (l.el) l.el.style.transform = `translate3d(${(-curX * l.d).toFixed(1)}px,${(-curY * l.d).toFixed(1)}px,0) scale(${l.s * fit})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 3200,
    height: 2100,
    margin: "-1050px 0 0 -1600px",
    willChange: "transform",
  };

  return (
    <div ref={stageRef} style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#ffffff", cursor: "grab", touchAction: "none" }}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(120,116,102,.34) 1.4px, transparent 1.6px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "center",
          animation: "gridPulse 5.5s ease-in-out infinite",
        }}
      />

      <div ref={backRef} style={{ ...layerStyle, zIndex: 1 }}>
        {LAYER_BACK.map((item, i) => (
          <WallPlaceholder key={i} item={item} />
        ))}
      </div>
      <div ref={midRef} style={{ ...layerStyle, zIndex: 2 }}>
        {LAYER_MID.map((item, i) => (
          <WallPlaceholder key={i} item={item} />
        ))}
      </div>
      <div ref={frontRef} style={{ ...layerStyle, zIndex: 3 }}>
        {LAYER_FRONT.map((item, i) => (
          <WallPlaceholder key={i} item={item} />
        ))}
        {WELCOME_ACCENTS.map((item, i) => (
          <WallPlaceholder key={i} item={item} />
        ))}
        <DozeVideoFrame />
      </div>

      <div
        id="wall-hint"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 30,
          transform: "translate(-50%,0)",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(255,255,255,.85)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 6px 22px rgba(44,54,74,.14)",
          fontSize: 13,
          fontWeight: 500,
          color: "#5a616b",
          pointerEvents: "none",
          animation: "hintFloat 3s ease-in-out infinite",
          transition: "opacity .6s ease-in-out",
          opacity: hintVisible ? 1 : 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a616b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
        </svg>
        Click &amp; drag to explore the wall
      </div>
    </div>
  );
}
