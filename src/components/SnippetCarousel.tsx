"use client";

import { useEffect, useRef } from "react";

export type Snippet = { src: string; caption: string };

export default function SnippetCarousel({ items, direction }: { items: Snippet[]; direction: 1 | -1 }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let off = 0;
    let dragging = false;
    let lastX = 0;
    let lastT = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 0.1);
      lastT = t;
      const half = el.scrollWidth / 2 || 1;
      if (!dragging) off += direction * (half / 36) * dt;
      off = (((off % half) + half) % half) - half;
      el.style.transform = "translateX(" + off + "px)";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      off += e.clientX - lastX;
      lastX = e.clientX;
    };
    const end = () => {
      dragging = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
  }, [direction]);

  const Figure = ({ item, hidden }: { item: Snippet; hidden?: boolean }) => (
    <figure aria-hidden={hidden} style={{ margin: "0 24px 0 0", width: 211, flex: "none" }}>
      <img src={item.src} alt={hidden ? "" : item.caption} draggable={false} style={{ display: "block", width: 211, height: 254, objectFit: "cover", borderRadius: 8 }} />
      <figcaption style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: "#898989" }}>{item.caption}</figcaption>
    </figure>
  );

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div ref={trackRef} style={{ display: "inline-flex", userSelect: "none", cursor: "grab", touchAction: "pan-y" }}>
        <div style={{ display: "flex" }}>
          {items.map((item, i) => (
            <Figure key={i} item={item} />
          ))}
        </div>
        <div style={{ display: "flex" }} aria-hidden="true">
          {items.map((item, i) => (
            <Figure key={i} item={item} hidden />
          ))}
        </div>
      </div>
    </div>
  );
}
