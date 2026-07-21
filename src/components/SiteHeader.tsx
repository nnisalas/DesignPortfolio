"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HopLink from "./HopLink";
import MobileMenuPixels from "./MobileMenuPixels";

const RESUME_URL =
  "https://drive.google.com/file/d/16aGoQNVOYrxDGXN1QL7d1B_hI5Ez3xHA/view?usp=sharing";

export default function SiteHeader() {
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinkStyle: React.CSSProperties = { color: "inherit", textDecoration: "none" };

  return (
    <>
      {/* fixed minimal header */}
      <div
        style={{
          display: mobile ? "none" : "flex",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 40,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px clamp(20px,5vw,56px)",
        }}
      >
        <Link
          className="logo-link"
          href="/"
          style={{ position: "relative", display: "block", width: 52, height: 26, pointerEvents: "auto" }}
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
            gap: "clamp(16px,2.6vw,30px)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: ".02em",
            color: "#5a616b",
          }}
        >
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

      {/* mobile header */}
      <div
        style={{
          display: mobile ? "flex" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 22px",
        }}
      >
        <img src="/assets/logo-hover.svg" alt="NS logo" style={{ display: "block", width: 44, height: 22 }} />
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            width: 30,
            padding: "6px 2px",
            background: "none",
            border: "none",
            cursor: "pointer",
            alignItems: "flex-end",
          }}
        >
          <span style={{ display: "block", width: 26, height: 2, borderRadius: 2, background: "#2c3036" }} />
          <span style={{ display: "block", width: 26, height: 2, borderRadius: 2, background: "#2c3036" }} />
        </button>
      </div>

      {/* mobile menu overlay */}
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
          overflow: "hidden",
        }}
      >
        <MobileMenuPixels />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 22px",
            zIndex: 2,
          }}
        >
          <img src="/assets/logo-hover.svg" alt="NS logo" style={{ display: "block", width: 44, height: 22 }} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2c3036" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav
          style={{
            position: "absolute",
            top: "24%",
            left: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(20px,4.2vh,34px)",
            padding: "0 34px",
            zIndex: 2,
          }}
        >
          {[
            { num: "01.", label: "My Works", href: "/#work", color: "#5aa9e6", delay: 0.1 },
            { num: "02.", label: "About Me", href: "/about-me", color: "#8cc164", delay: 0.17 },
            { num: "03.", label: "Design Wall", href: "/design-wall", color: "#efc84e", delay: 0.24 },
            { num: "04.", label: "Resume", href: RESUME_URL, color: "#f3a738", delay: 0.31, external: true },
          ].map((item) => {
            const content = (
              <>
                <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(26px,8vw,34px)", fontWeight: 700, color: item.color }}>
                  {item.num}
                </span>
                <span style={{ fontSize: "clamp(20px,6vw,26px)", fontWeight: 500, color: "#2c3036" }}>{item.label}</span>
              </>
            );
            const style: React.CSSProperties = {
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              textDecoration: "none",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(22px)",
              transition: `opacity .55s cubic-bezier(.65,0,.35,1) ${item.delay}s, transform .55s cubic-bezier(.65,0,.35,1) ${item.delay}s`,
            };
            return item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)} style={style}>
                {content}
              </a>
            ) : (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={style}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
