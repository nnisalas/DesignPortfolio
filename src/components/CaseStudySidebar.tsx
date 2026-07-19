"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The Problem" },
  { id: "challenge", label: "Design Challenge" },
  { id: "exploration", label: "Design Exploration" },
  { id: "testing", label: "User Testing" },
  { id: "solution", label: "Final Solution" },
  { id: "reflection", label: "Reflection" },
  { id: "outcome", label: "The Outcome" },
];

export default function CaseStudySidebar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fillStyle, setFillStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
  const [showBackTop, setShowBackTop] = useState(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const spy = () => {
      let nextActive: string | null = null;
      for (const s of SECTIONS) {
        const sec = document.getElementById(s.id);
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          nextActive = s.id;
        }
      }
      setActiveId(nextActive);
      if (nextActive && linkRefs.current[nextActive]) {
        const a = linkRefs.current[nextActive]!;
        setFillStyle({ top: a.offsetTop, height: a.offsetHeight });
      } else {
        setFillStyle((f) => ({ ...f, height: 0 }));
      }
      const art = document.getElementById("ts-article");
      setShowBackTop(art ? art.getBoundingClientRect().bottom <= window.innerHeight : false);
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();
    return () => window.removeEventListener("scroll", spy);
  }, []);

  return (
    <aside id="ts-side" style={{ position: "sticky", top: 96, flex: "0 0 188px", paddingLeft: 16 }}>
      <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, borderRadius: 2, background: "#eceef1" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: fillStyle.top,
            width: "100%",
            height: fillStyle.height,
            borderRadius: 2,
            background: "#2f9fe0",
            transition: "top .25s ease, height .25s ease",
          }}
        />
      </div>
      <nav ref={navRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            ref={(el) => {
              linkRefs.current[s.id] = el;
            }}
            href={`#${s.id}`}
            style={{
              fontSize: 15,
              fontWeight: activeId === s.id ? 600 : 500,
              color: activeId === s.id ? "#1f2329" : "#b9bfc7",
              textDecoration: "none",
            }}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 28,
          fontSize: 15,
          fontWeight: 500,
          color: "#8a919b",
          textDecoration: "none",
          opacity: showBackTop ? 1 : 0,
          visibility: showBackTop ? "visible" : "hidden",
          transition: "opacity .3s ease, visibility .3s ease",
        }}
      >
        ↑ Back to top
      </a>
    </aside>
  );
}
