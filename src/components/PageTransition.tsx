"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    reduceRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // CSS-animation driven entrance: the class (and its transform) is removed
  // as soon as the animation ends, so no stale `transform` can ever linger
  // on this wrapper and break position:sticky/fixed for the page's content.
  useEffect(() => {
    if (reduceRef.current) return;
    setEntering(true);
    const el = wrapRef.current;
    if (!el) return;
    const clear = () => setEntering(false);
    el.addEventListener("animationend", clear);
    const safety = setTimeout(clear, 900);
    return () => {
      el.removeEventListener("animationend", clear);
      clearTimeout(safety);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        reduceRef.current ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const target = e.target as HTMLElement | null;
      const a = target && target.closest ? (target.closest("a[href]") as HTMLAnchorElement | null) : null;
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      e.preventDefault();
      const el = wrapRef.current;
      if (el) {
        el.style.transition = "opacity .3s ease-in-out";
        el.style.opacity = "0";
      }
      setTimeout(() => router.push(href), 300);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div ref={wrapRef} key={pathname} className={entering ? "page-enter" : undefined}>
      {children}
    </div>
  );
}
