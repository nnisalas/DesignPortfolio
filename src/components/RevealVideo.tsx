"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

/**
 * The video twin of RevealImage: same scroll reveal, but the source is only
 * attached once the element nears the viewport.
 *
 * That matters here because this plays on the landing page. Card covers are
 * multi-megabyte, and a plain autoplay <video src> would pull the whole file
 * during the initial page load, below the fold, before a visitor has scrolled
 * anywhere near it. `poster` carries the still frame in the meantime, so the
 * card looks finished from the first paint and simply starts moving when it's
 * reached.
 */
export default function RevealVideo({
  src,
  poster,
  label,
  style,
}: {
  src: string;
  poster: string;
  label: string;
  style?: React.CSSProperties;
}) {
  const revealRef = useReveal<HTMLVideoElement>({ trigger: "scroll", variant: "block" });
  const localRef = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = localRef.current;
    if (!el || load) return;

    // Synchronous first check before trusting the observer: IntersectionObserver
    // callbacks arrive via the rendering lifecycle, so a throttled or restored
    // tab can withhold them, and the card would sit on its poster forever.
    // A quarter viewport of lead-in, not a full one: at a full viewport the
    // card already qualifies at scroll 0 on a laptop, so the fetch fired on
    // page load and the deferral bought nothing.
    const near = () => {
      const r = el.getBoundingClientRect();
      const m = window.innerHeight * 0.25;
      return r.top < window.innerHeight + m && r.bottom > -m;
    };
    if (near()) {
      setLoad(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "25% 0px" }
    );
    io.observe(el);

    // Scroll fallback. IntersectionObserver callbacks are delivered through
    // the rendering lifecycle, so a throttled or backgrounded tab can withhold
    // them entirely -- and then the card would keep showing its poster and
    // never start. This costs one cheap rect read per scroll and detaches the
    // moment the source is attached.
    const onScroll = () => {
      if (near()) {
        setLoad(true);
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [load]);

  return (
    <video
      ref={(el) => {
        localRef.current = el;
        revealRef.current = el;
      }}
      src={load ? src : undefined}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-label={label}
      style={style}
    />
  );
}
