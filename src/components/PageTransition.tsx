"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduceRef.current) return;
    el.style.transition = "none";
    el.style.transform = "translateY(100vh)";
    el.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
          "transform .65s cubic-bezier(.22,.9,.32,1), opacity .55s ease-in-out";
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
        const done = () => {
          el.style.transition = "";
          el.style.transform = "";
          el.removeEventListener("transitionend", done);
        };
        el.addEventListener("transitionend", done);
        setTimeout(done, 800);
      });
    });
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
    <div ref={wrapRef} key={pathname}>
      {children}
    </div>
  );
}
