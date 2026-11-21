"use client";

import { Children, useEffect, useRef, useState } from "react";

/**
 * The dot bar from the About mockups, made to work: a heading, the
 * pill-and-dots indicator, and a pair of arrows that page through the sets.
 *
 * Every slide is rendered at every width. On desktop the inactive ones are
 * taken out of flow with `display: none` (see `.ab-slide[data-on="false"]` in
 * globals.css); below 760px that rule does not apply and the nav is hidden,
 * so the section collapses into the one long column the mockups show for
 * mobile. Doing it in CSS rather than JS keeps the server and client markup
 * identical -- a `matchMedia` check at render time would hydrate wrong.
 */
export default function AboutCarousel({
  heading,
  labels,
  children,
}: {
  heading: string;
  /** One per slide, for the screen-reader announcement. */
  labels: string[];
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children);
  const n = slides.length;

  // Index and direction travel together so the enter animation knows which
  // way the set moved; two separate states would fire the effect twice.
  const [at, setAt] = useState({ i: 0, dir: 1 });
  const trackRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const go = (dir: 1 | -1) => setAt((p) => ({ i: (p.i + dir + n) % n, dir }));

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true; // don't animate the first paint
      return;
    }
    const el = trackRef.current?.children[at.i] as HTMLElement | undefined;
    if (!el) return;
    // Below 760px every slide is already on screen, so there is nothing to
    // animate in; and a reduced-motion reader gets the swap with no movement.
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [
        { opacity: 0, transform: `translate3d(${at.dir * 22}px,0,0)` },
        { opacity: 1, transform: "translate3d(0,0,0)" },
      ],
      { duration: 420, easing: "cubic-bezier(.22,.9,.32,1)" }
    );
  }, [at]);

  return (
    <section
      className="ab-section"
      aria-roledescription="carousel"
      aria-label={heading}
    >
      <div className="ab-head">
        <h2 className="t-headline" style={{ margin: 0 }}>
          {heading}
        </h2>

        {/* Indicator + arrows. Hidden below 760px, where all the sets show. */}
        <div className="ab-nav">
          <span className="ab-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className="ab-dot" data-on={i === at.i} />
            ))}
          </span>
          <span className="ab-arrows">
            <button
              type="button"
              className="ab-arrow"
              onClick={() => go(-1)}
              aria-label={`Previous set in ${heading}`}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className="ab-arrow"
              onClick={() => go(1)}
              aria-label={`Next set in ${heading}`}
            >
              <Chevron dir="right" />
            </button>
          </span>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {labels[at.i]} — {at.i + 1} of {n}
      </p>

      <div ref={trackRef} className="ab-track">
        {slides.map((slide, i) => (
          <div key={i} className="ab-slide" data-on={i === at.i}>
            {slide}
          </div>
        ))}
      </div>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M5 2.5 L9.5 7 L5 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
