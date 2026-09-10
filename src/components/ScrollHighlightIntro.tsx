"use client";

import { Fragment, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

// Single spaces only: these are split on " " to build the per-word reveal,
// so a double space would emit an empty word span and throw the highlight
// index off by one for everything after it.
const TEXT_1 =
  "I'm a Product Designer & UX Researcher who uses a modular approach to turn complex problems into intuitive, behavior-driven experiences grounded in research, interaction design, and behavioral psychology.";
const TEXT_2 =
  "At heart, though, I'm someone who loves to create and build!! I've recently expanded my toolkit with AI, using it to bring fun ideas and personal projects to life while exploring new ways to design and prototype.";
const TEXT_3 =
  "If you're excited about thoughtful, behavior-driven design and building things that make an impact, let's connect!";

const WORDS_1 = TEXT_1.split(" ");
const WORDS_2 = TEXT_2.split(" ");
const WORDS_3 = TEXT_3.split(" ");
const WORDS = [...WORDS_1, ...WORDS_2, ...WORDS_3];

const paragraphStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-geist), system-ui, sans-serif",
  fontWeight: 300,
  // The flat 20px floor below 555px was the "text is big on mobile" half of
  // the problem. Under that width the size now tracks the viewport instead,
  // with a hard 16px floor so it never drops below a comfortable reading
  // size. The outer min() leaves 555px and up exactly as it was.
  fontSize: "min(clamp(20px,3.6vw,32px), max(16px,4.4vw))",
  lineHeight: 1.5,
  letterSpacing: ".01em",
  textAlign: "left",
  color: "#3d3d3d",
  textWrap: "pretty",
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ScrollHighlightIntro() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Entrance reveal (mask + translateY/opacity/blur, per-line, one-time on
  // scroll-into-view) layered on top of the pre-existing continuous
  // scroll-linked word-dimming loop below. reveal.ts's splitLines() groups
  // the ".hw" spans (not their own opacity) into line-level mask wrappers,
  // so the two effects animate different properties on different elements
  // and don't fight each other; once the entrance finishes, the wrappers
  // are unwrapped and the .hw spans go back to being direct children,
  // leaving the continuous highlight loop's opacity control untouched.
  const revealRef1 = useReveal<HTMLParagraphElement>({ trigger: "scroll", variant: "lines", stagger: 0.12 });
  const revealRef2 = useReveal<HTMLParagraphElement>({ trigger: "scroll", variant: "lines", stagger: 0.12 });
  const revealRef3 = useReveal<HTMLParagraphElement>({ trigger: "scroll", variant: "lines", stagger: 0.12 });

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
        className="shi-stage"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Sizing/placement lives in .shi-stage / .shi-asset so the copy's
            horizontal padding can be derived from the same values. */}
        <img src="/assets/px-blue.webp" alt="" aria-hidden="true" draggable={false} className="shi-asset tl" />
        <img src="/assets/px-green.webp" alt="" aria-hidden="true" draggable={false} className="shi-asset tr" />
        <img src="/assets/px-yellow.webp" alt="" aria-hidden="true" draggable={false} className="shi-asset bl" />
        <img src="/assets/px-orange.webp" alt="" aria-hidden="true" draggable={false} className="shi-asset br" />

        <div style={{ width: "100%", maxWidth: 1000 }}>
          <p ref={revealRef1} style={{ ...paragraphStyle, margin: "0 0 clamp(20px,3vh,32px)" }}>
            {WORDS_1.map((w, i) => (
              <Fragment key={i}>
                <span
                  className="hw"
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  style={{ opacity: 0.3, transition: "opacity .2s ease-in-out" }}
                >
                  {w}
                </span>
                {i < WORDS_1.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>
          <p ref={revealRef2} style={{ ...paragraphStyle, margin: "0 0 clamp(20px,3vh,32px)" }}>
            {WORDS_2.map((w, i) => (
              <Fragment key={i}>
                <span
                  className="hw"
                  ref={(el) => {
                    wordRefs.current[WORDS_1.length + i] = el;
                  }}
                  style={{ opacity: 0.3, transition: "opacity .2s ease-in-out" }}
                >
                  {w}
                </span>
                {i < WORDS_2.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>
          <p ref={revealRef3} style={paragraphStyle}>
            {WORDS_3.map((w, i) => (
              <Fragment key={i}>
                <span
                  className="hw"
                  ref={(el) => {
                    wordRefs.current[WORDS_1.length + WORDS_2.length + i] = el;
                  }}
                  style={{ opacity: 0.3, transition: "opacity .2s ease-in-out" }}
                >
                  {w}
                </span>
                {i < WORDS_3.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
