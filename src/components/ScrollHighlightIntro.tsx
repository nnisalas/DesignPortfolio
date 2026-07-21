"use client";

import { useEffect, useRef } from "react";

const TEXT =
  "I care about turning friction into flow, especially in the moments that matter most. " +
  "I design experiences that make those moments feel easy, grounded in systems thinking and research. " +
  "Here's what that looks like in practice!";

const WORDS = TEXT.split(" ");

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ScrollHighlightIntro() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const track = trackRef.current;
      if (track) {
        const vh = window.innerHeight;
        const t = track.getBoundingClientRect();
        const travel = Math.max(1, t.height - vh);
        const prog = clamp(-t.top / travel, 0, 1);
        const N = WORDS.length;
        const wnd = 0.08;
        for (let i = 0; i < N; i++) {
          const el = wordRefs.current[i];
          if (!el) continue;
          const frac = N > 1 ? i / (N - 1) : 0;
          const local = clamp((prog - frac * (1 - 2 * wnd)) / (2 * wnd), 0, 1);
          el.style.opacity = (0.3 + 0.7 * easeInOut(local)).toFixed(3);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={trackRef} aria-label="About intro" style={{ position: "relative", zIndex: 1, background: "transparent", height: "220vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          width: "100%",
          padding: "0 clamp(24px,6vw,90px)",
        }}
      >
        <img src="/assets/px-blue.png" alt="" aria-hidden="true" draggable={false} style={{ position: "absolute", left: "clamp(24px,5vw,96px)", top: "clamp(40px,13vh,150px)", width: "clamp(64px,7vw,104px)", height: "auto", pointerEvents: "none", userSelect: "none" }} />
        <img src="/assets/px-green.png" alt="" aria-hidden="true" draggable={false} style={{ position: "absolute", right: "clamp(24px,5vw,96px)", top: "clamp(40px,13vh,150px)", width: "clamp(64px,7vw,104px)", height: "auto", pointerEvents: "none", userSelect: "none" }} />
        <img src="/assets/px-yellow.png" alt="" aria-hidden="true" draggable={false} style={{ position: "absolute", left: "clamp(24px,5vw,96px)", bottom: "clamp(40px,13vh,150px)", width: "clamp(64px,7vw,104px)", height: "auto", pointerEvents: "none", userSelect: "none" }} />
        <img src="/assets/px-orange.png" alt="" aria-hidden="true" draggable={false} style={{ position: "absolute", right: "clamp(24px,5vw,96px)", bottom: "clamp(40px,13vh,150px)", width: "clamp(64px,7vw,104px)", height: "auto", pointerEvents: "none", userSelect: "none" }} />

        <p style={{ margin: 0, maxWidth: 1000, fontFamily: "var(--font-geist), system-ui, sans-serif", fontWeight: 500, fontSize: "clamp(20px,3.6vw,32px)", lineHeight: 1.5, letterSpacing: ".01em", textAlign: "center", color: "#3d3d3d", textWrap: "pretty" } as React.CSSProperties}>
          {WORDS.map((w, i) => (
            <span
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              style={{ opacity: 0.3, transition: "opacity .2s ease-in-out" }}
            >
              {w}{i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
