import { useEffect, useRef } from "react";

export function useParallax<T extends HTMLElement>(fx: number, fy: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const loop = () => {
      const s = window.scrollY;
      cx += (s * fx - cx) * 0.075;
      cy += (s * fy - cy) * 0.075;
      el.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fx, fy]);
  return ref;
}
