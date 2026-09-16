"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A screen recording in a case study.
 *
 * Two things a bare autoplaying <video> gets wrong, both of which read as a
 * broken embed rather than a slow one:
 *
 * 1. With no `preload`, the element paints nothing until enough of the file
 *    has arrived. The desktop Triceratops recording is 9.2MB, so on a slow
 *    connection that is several seconds of an empty rectangle sitting inside
 *    a bordered white frame. `preload="metadata"` gets the first frame up
 *    almost immediately, which is what a poster image would have done.
 *
 * 2. Autoplay is not guaranteed. iOS Low Power Mode, Safari's per-site
 *    auto-play setting and most data-saver modes all refuse it, and with no
 *    controls there is then no way to start the video at all -- it just sits
 *    there dead. So we attempt play() ourselves and, if the promise rejects,
 *    reveal native controls so it is always playable.
 */
export default function CaseStudyVideo({
  src,
  label,
  className,
  style,
}: {
  src: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsControls, setNeedsControls] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // autoPlay may already have started it; play() on a playing element
    // resolves harmlessly, so this only ever *adds* a rejection path.
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => setNeedsControls(true));
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      controls={needsControls}
      aria-label={label}
      className={className}
      style={style}
    />
  );
}
