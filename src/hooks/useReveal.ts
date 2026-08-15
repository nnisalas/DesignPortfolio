"use client";

import { useEffect, useRef } from "react";
import { setupReveal, playReveal, type RevealVariant } from "@/lib/reveal";

export function useReveal<T extends HTMLElement = HTMLElement>(opts: {
  trigger: "load" | "scroll";
  variant: RevealVariant;
  stagger?: number;
}) {
  const ref = useRef<T>(null);
  const { trigger, variant, stagger } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const st = stagger ?? (variant === "lines" ? 0.09 : variant === "words" ? 0.04 : 0);
    let disposed = false;
    let io: IntersectionObserver | null = null;

    const finishSetup = () => {
      if (disposed || !el.isConnected) return;
      const observeTarget = setupReveal(el, variant);
      if (variant === "lines") el.style.visibility = "";
      if (trigger === "load") {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (!disposed) playReveal(el, st);
          })
        );
      } else {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                playReveal(el, st);
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        io.observe(observeTarget);
      }
    };

    if (variant === "lines") {
      // reserve layout, hide while measuring natural line-wraps to avoid a flash
      el.style.visibility = "hidden";
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      fonts.then(finishSetup);
    } else {
      finishSetup();
    }

    return () => {
      disposed = true;
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, variant, stagger]);

  return ref;
}
