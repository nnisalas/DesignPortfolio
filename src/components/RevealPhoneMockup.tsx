"use client";

import { useEffect, useRef, type ReactNode } from "react";

const EASE = "cubic-bezier(.2,.6,.35,1)";

// Same translateY + opacity + blur "block" entrance used across the site
// (see lib/reveal.ts), but applied directly via inline styles instead of
// reveal.ts's mask-wrapping technique. That technique inserts a
// display:block wrapper whose height comes from the revealed element's
// own normal-flow height -- fine for an <img> or text block, but this
// phone mockup is position:absolute (centered via left/top/transform),
// so it contributes no height to a flow wrapper; the mask would collapse
// to 0px and clip the mockup permanently instead of just pre-reveal.
export default function RevealPhoneMockup({ style, children }: { style: React.CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const baseTransform = (style.transform as string) ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.style.transition = `transform .9s ${EASE}, opacity .7s ease, filter .7s ease`;
          el.style.transform = baseTransform;
          el.style.opacity = "1";
          el.style.filter = "blur(0px)";
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [baseTransform]);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: 0,
        filter: "blur(8px)",
        transform: `${baseTransform} translateY(24px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  );
}
