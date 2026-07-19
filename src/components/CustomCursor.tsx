"use client";

import { useEffect } from "react";

const MODES: Record<string, { src: string; h: number }> = {
  dot: { src: "/assets/cursor-dot.png", h: 26 },
  view: { src: "/assets/cursor-view.png", h: 38 },
  soon: { src: "/assets/cursor-soon.png", h: 38 },
};

export default function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    const wrap = document.createElement("div");
    wrap.style.cssText =
      "position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;opacity:0;transition:opacity .25s ease-in-out;";

    const layers: Record<string, HTMLImageElement> = {};
    Object.keys(MODES).forEach((k) => {
      const i = document.createElement("img");
      i.src = MODES[k].src;
      i.alt = "";
      i.style.cssText =
        "position:absolute;left:0;top:0;height:" +
        MODES[k].h +
        "px;width:auto;transform:translate(-50%,-50%) scale(" +
        (k === "dot" ? 1 : 0.7) +
        ");opacity:0;transition:opacity .28s ease-in-out,transform .28s ease-in-out;";
      layers[k] = i;
      wrap.appendChild(i);
    });
    document.body.appendChild(wrap);

    let mode = "dot";
    let pressed = false;
    let shown = false;

    function apply() {
      Object.keys(layers).forEach((k) => {
        const on = k === mode;
        layers[k].style.opacity = on ? "1" : "0";
        layers[k].style.transform =
          "translate(-50%,-50%) scale(" + (on ? (pressed ? 0.82 : 1) : 0.7) + ")";
      });
    }
    apply();

    const onMove = (e: MouseEvent) => {
      wrap.style.left = e.clientX + "px";
      wrap.style.top = e.clientY + "px";
      if (!shown) {
        shown = true;
        wrap.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const t = target && target.closest ? target.closest("[data-cursor]") : null;
      let m = t ? t.getAttribute("data-cursor") || "dot" : "dot";
      if (!MODES[m]) m = "dot";
      if (m !== mode) {
        mode = m;
        apply();
      }
    };
    const onDown = () => {
      pressed = true;
      apply();
    };
    const onUp = () => {
      pressed = false;
      apply();
    };
    const onLeave = () => {
      shown = false;
      wrap.style.opacity = "0";
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onUp, true);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      wrap.remove();
    };
  }, []);

  return null;
}
