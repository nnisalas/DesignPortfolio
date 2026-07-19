"use client";

import { useEffect } from "react";
import { PAL } from "@/lib/cityscape";

export default function SparkleClicks() {
  useEffect(() => {
    const glyphs = ["*", "+", ".", "'", "*", "✦"];
    const cols = [PAL.blue, PAL.green, PAL.orange, PAL.pink, PAL.yellow];
    const onClick = (e: MouseEvent) => {
      const n = 7;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.7;
        const dist = 24 + Math.random() * 30;
        const sp = document.createElement("span");
        sp.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        sp.style.cssText =
          "position:fixed;left:" +
          e.clientX +
          "px;top:" +
          e.clientY +
          "px;color:" +
          cols[Math.floor(Math.random() * cols.length)] +
          ";font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:" +
          (11 + Math.random() * 9).toFixed(1) +
          "px;font-weight:700;line-height:1;pointer-events:none;z-index:99998;--dx:" +
          (Math.cos(ang) * dist).toFixed(1) +
          "px;--dy:" +
          (Math.sin(ang) * dist).toFixed(1) +
          "px;--r:" +
          ((Math.random() - 0.5) * 180).toFixed(0) +
          "deg;animation:sparkPop .62s cubic-bezier(.3,.7,.4,1) forwards;";
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 640);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return null;
}
