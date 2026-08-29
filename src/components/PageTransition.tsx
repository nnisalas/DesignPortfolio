"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const prevPathname = useRef<string | null>(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    reduceRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // CSS-animation driven entrance: the class (and its transform) is removed
  // as soon as the animation ends, so no stale `transform` can ever linger
  // on this wrapper and break position:sticky/fixed for the page's content.
  useEffect(() => {
    if (reduceRef.current) return;
    // Only re-correct scroll-to-hash for an actual in-app navigation (the
    // pathname genuinely changing from what we last saw) -- on the very
    // first mount (a fresh load or hard refresh) the browser's own native
    // scroll-to-hash already ran correctly, and PixelIntro deliberately
    // resets scroll to the top on load regardless of a stale hash;
    // re-applying scrollIntoView here on first mount would fight that and
    // always win, since it fires later (after animationend / the 900ms
    // safety timeout). Comparing values (not an ordinal "first render"
    // flag) so this stays correct under React StrictMode's dev-only
    // double-invoke of mount effects, which would otherwise flip a plain
    // isFirstMount ref before the "real" mount ever runs.
    const isRealNavigation = prevPathname.current !== null && prevPathname.current !== pathname;
    prevPathname.current = pathname;
    setEntering(true);
    const el = wrapRef.current;
    if (!el) return;
    const clear = () => {
      setEntering(false);
      // the entrance transform can throw off the browser's automatic
      // scroll-to-hash-fragment on a same-session navigation; re-correct
      // it now that the transform has fully cleared.
      if (isRealNavigation && window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView();
      }
    };
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

      // same-page hash links (e.g. "My Works" -> "/#work" while already on
      // "/") don't trigger a real Next.js navigation/remount, so fading the
      // page out here would leave it stuck invisible -- nothing ever fades
      // it back in since the entrance effect only reruns on pathname change.
      // Let the browser/Next.js Link handle these natively instead.
      const [hrefPath] = href.split("#");
      if ((hrefPath || "/") === window.location.pathname) return;

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
