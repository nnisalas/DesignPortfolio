"use client";

import { useState } from "react";
import Link from "next/link";
import HopLink from "./HopLink";

const RESUME_URL =
  "https://drive.google.com/file/d/16aGoQNVOYrxDGXN1QL7d1B_hI5Ez3xHA/view?usp=sharing";

export default function SubpageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle: React.CSSProperties = { color: "inherit", textDecoration: "none" };

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
          padding: "16px clamp(20px,5vw,56px)",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link className="logo-link" href="/" style={{ position: "relative", display: "block", width: 52, height: 26, pointerEvents: "auto" }}>
          <img src="/assets/logo.svg" alt="NS logo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transition: "opacity .3s ease-in-out" }} />
          <img className="logo-hov" src="/assets/logo-hover.svg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, transition: "opacity .3s ease-in-out" }} />
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.6vw,30px)", fontSize: 14, fontWeight: 500, letterSpacing: ".02em", color: "#5a616b" }}>
          <HopLink href="/about-me" style={navLinkStyle}>About Me</HopLink>
          <HopLink href="/#work" style={navLinkStyle}>My Works</HopLink>
          <HopLink href="/design-wall" style={navLinkStyle}>Design Wall</HopLink>
          <a href={RESUME_URL} target="_blank" rel="noopener" className="hoplink" style={navLinkStyle}>
            {"Resume".split("").map((c, i) => (
              <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
            ))}
          </a>
        </nav>
      </div>

      <div
        id="ts-header-mobile"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link href="/" style={{ display: "block", width: 44, height: 22 }}>
          <img src="/assets/logo-hover.svg" alt="NS logo" style={{ display: "block", width: "100%", height: "100%" }} />
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", background: "none", border: "none", cursor: "pointer", padding: "8px 2px" }}
        >
          <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: "#2c3036" }} />
          <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: "#2c3036" }} />
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "#ffffff",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity .5s cubic-bezier(.65,0,.35,1), visibility .5s cubic-bezier(.65,0,.35,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px" }}>
          <img src="/assets/logo-hover.svg" alt="NS logo" style={{ display: "block", width: 44, height: 22 }} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2c3036" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "clamp(20px,4.2vh,34px)", padding: "14% 34px 0" }}>
          {[
            { num: "01.", label: "About Me", href: "/about-me", color: "#5aa9e6" },
            { num: "02.", label: "My Works", href: "/#work", color: "#8cc164" },
            { num: "03.", label: "Design Wall", href: "/design-wall", color: "#efc84e" },
            { num: "04.", label: "Resume", href: RESUME_URL, color: "#f3a738", external: true },
          ].map((item) => {
            const content = (
              <>
                <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(26px,8vw,34px)", fontWeight: 700, color: item.color }}>{item.num}</span>
                <span style={{ fontSize: "clamp(20px,6vw,26px)", fontWeight: 500, color: "#2c3036" }}>{item.label}</span>
              </>
            );
            const style: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 18, textDecoration: "none" };
            return item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)} style={style}>{content}</a>
            ) : (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={style}>{content}</Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
