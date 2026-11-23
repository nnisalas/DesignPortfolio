"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HopLink from "./HopLink";

const RESUME_URL = "/resume.pdf";

export default function SubpageHeader() {
  const [onFooter, setOnFooter] = useState(false);

  // The header's white glass fill clashes with the footer's dark night
  // sky, so slide it off-screen while any part of the footer is in view
  // and bring it back once the user scrolls away from it.
  useEffect(() => {
    const footer = document.getElementById("skyline");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setOnFooter(entry.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const navLinkStyle: React.CSSProperties = { color: "inherit", textDecoration: "none" };
  const hideStyle: React.CSSProperties = {
    transform: onFooter ? "translateY(-100%)" : "translateY(0)",
    // This header is position:sticky, so it sits in normal flow and follows
    // body's margin-right on its own -- no `right` leg needed here.
    transition: "transform .45s cubic-bezier(.65,0,.35,1)",
    pointerEvents: onFooter ? "none" : "auto",
  };

  return (
    <>
      <div
        id="ts-header-desktop"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--nav-link-gap)",
          padding: "16px var(--nav-gutter)",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #f0f0f0",
          ...hideStyle,
        }}
      >
        <Link className="logo-link nav-logo" href="/" style={{ position: "relative", display: "block", flex: "none", width: "var(--nav-logo-w)", height: "var(--nav-logo-h)", pointerEvents: "auto" }}>
          <img src="/assets/logo.svg" alt="NS logo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "opacity .3s ease-in-out" }} />
          <img className="logo-hov" src="/assets/logo-hover.svg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, transition: "opacity .3s ease-in-out" }} />
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: "var(--nav-link-gap)", whiteSpace: "nowrap", fontFamily: "var(--font-family)", fontSize: "var(--label-size)", lineHeight: "var(--label-line)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--label-tracking)", color: "var(--color-label-muted)" }}>
          <HopLink href="/#work" short="Works" style={navLinkStyle}>My Works</HopLink>
          <HopLink href="/about-me" short="About" style={navLinkStyle}>About Me</HopLink>
          <HopLink href="/design-wall" short="Wall" style={navLinkStyle}>Design Wall</HopLink>
          <HopLink href="/stickies" style={navLinkStyle}>Stickies</HopLink>
          <a href={RESUME_URL} target="_blank" rel="noopener" className="hoplink" style={navLinkStyle}>
            {"Resume".split("").map((c, i) => (
              <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
            ))}
          </a>
        </nav>
      </div>
    </>
  );
}
