"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HopLink from "./HopLink";
// import { REPLAY_EVENT } from "./PixelIntro"; // unmounted -- see below

const RESUME_URL = "/resume.pdf";

export default function SiteHeader() {
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
    // The `right` leg keeps the bar in step with the page as HakoBot opens;
    // an inline transition would otherwise shadow the one in globals.css.
    transition: "transform .45s cubic-bezier(.65,0,.35,1), right var(--hb-speed) var(--hb-ease)",
    pointerEvents: onFooter ? "none" : "auto",
  };

  return (
    <>
      {/* The one header, at every width. */}
      <div
        style={{
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0,
          // Not width:100% -- a fixed element ignores body's margin, so it
          // reads HakoBot's inset itself to stay flush with the page it
          // sits above. See the HAKOBOT block in globals.css.
          right: "var(--hb-inset)",
          zIndex: 40,
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--nav-link-gap)",
          padding: "22px var(--nav-gutter)",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #f0f0f0",
          ...hideStyle,
        }}
      >
        <Link
          className="logo-link nav-logo"
          href="/"
          /* Clicking the logo used to replay the pixel loading screen in
             place. PixelIntro is unmounted (see src/app/page.tsx), so
             nothing listens for the event any more and the logo is now
             just a link home. Restore this line alongside the component:
             onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))} */
          style={{ position: "relative", display: "block", flex: "none", width: "var(--nav-logo-w)", height: "var(--nav-logo-h)", pointerEvents: "auto" }}
        >
          <img
            src="/assets/logo.svg"
            alt="NS logo"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "opacity .3s ease-in-out" }}
          />
          <img
            className="logo-hov"
            src="/assets/logo-hover.svg"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, transition: "opacity .3s ease-in-out" }}
          />
        </Link>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--nav-link-gap)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-family)",
            fontSize: "var(--label-size)",
            lineHeight: "var(--label-line)",
            fontWeight: "var(--weight-medium)",
            letterSpacing: "var(--label-tracking)",
            color: "var(--color-label-muted)",
          }}
        >
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
