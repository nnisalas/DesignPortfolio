"use client";

import Link from "next/link";
import HopLink from "./HopLink";

const RESUME_URL = "/resume.pdf";

export default function DesignWallHeader() {
  return (
    <>
      <div
        className="dw-desktop-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--nav-link-gap)",
          padding: "22px var(--nav-gutter)",
          pointerEvents: "none",
        }}
      >
        <Link className="logo-link nav-logo" href="/" style={{ position: "relative", display: "block", flex: "none", width: "var(--nav-logo-w)", height: "var(--nav-logo-h)", pointerEvents: "auto" }}>
          <img src="/assets/logo.svg" alt="NS logo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "opacity .3s ease-in-out" }} />
          <img className="logo-hov" src="/assets/logo-hover.svg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, transition: "opacity .3s ease-in-out" }} />
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: "var(--nav-link-gap)", whiteSpace: "nowrap", pointerEvents: "auto", fontFamily: "var(--font-family)", fontSize: "var(--label-size)", lineHeight: "var(--label-line)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--label-tracking)", color: "var(--color-label-muted)" }}>
          <HopLink href="/#work" short="Works" style={{ color: "inherit", textDecoration: "none" }}>My Works</HopLink>
          <HopLink href="/about-me" short="About" style={{ color: "inherit", textDecoration: "none" }}>About Me</HopLink>
          {/* The active item is carried by colour alone now -- the nav is
              already at the medium weight, so there is no heavier step. */}
          <HopLink href="/design-wall" short="Wall" style={{ color: "var(--color-headline)", textDecoration: "none" }}>Design Wall</HopLink>
          <HopLink href="/stickies" style={{ color: "inherit", textDecoration: "none" }}>Stickies</HopLink>
          <a href={RESUME_URL} target="_blank" rel="noopener" className="hoplink" style={{ color: "inherit", textDecoration: "none" }}>
            {"Resume".split("").map((c, i) => (
              <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
            ))}
          </a>
        </nav>
      </div>
    </>
  );
}
