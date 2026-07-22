"use client";

import { useRef, useState } from "react";
import HopLink from "./HopLink";

const RESUME_URL =
  "https://drive.google.com/file/d/16aGoQNVOYrxDGXN1QL7d1B_hI5Ez3xHA/view?usp=sharing";

const DAY = { fg: "#1c1f24", mut: "#b3afa3", link: "#3a3d42", accent: "#2f7ff0" };
const NIGHT = { fg: "#eef2ff", mut: "#93a4dd", link: "#d7e0ff", accent: "#a9c8ff" };

const CLOUDS = [
  { day: "/assets/cloud1.png", night: "/assets/night-cloud1.png", top: "8%", left: "62%", dayW: "clamp(112px,17vw,236px)", nightW: "clamp(120px,18vw,250px)", dur: 15, delay: 0 },
  { day: "/assets/cloud3.png", night: "/assets/night-cloud3.png", top: "50%", left: "-3%", dayW: "clamp(96px,15vw,214px)", nightW: "clamp(96px,15vw,214px)", dur: 18, delay: 1 },
  { day: "/assets/cloud4.png", night: "/assets/night-cloud4.png", top: "56%", right: "-2%", dayW: "clamp(84px,13vw,190px)", nightW: "clamp(84px,13vw,190px)", dur: 17, delay: 2.4 },
  { day: "/assets/cloud2.png", night: "/assets/night-cloud2.png", top: "64%", left: "22%", dayW: "clamp(60px,9vw,140px)", nightW: "clamp(60px,9vw,140px)", dur: 13, delay: 0.6 },
];

const CITY_LAYERS = [
  { day: "/assets/city-back.png", night: "/assets/night-city-back.png", bottom: "6%" },
  { day: "/assets/city-l2.png", night: "/assets/night-city-l2.png", bottom: "13%" },
  { day: "/assets/city-l3.png", night: "/assets/night-city-l3.png", bottom: "0" },
  { day: "/assets/city-front.png", night: "/assets/night-city-front.png", bottom: "0" },
];

export default function CityscapeFooter() {
  const [night, setNight] = useState(false);
  const [hoverSun, setHoverSun] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const C = night ? NIGHT : DAY;

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-ibm-plex-sans)",
    fontSize: 17,
    fontWeight: 400,
    color: C.link,
    textDecoration: "none",
    transition: "color .25s ease",
  };

  return (
    <section
      ref={sectionRef}
      id="skyline"
      style={{
        position: "relative",
        zIndex: 1,
        background: night ? "#2A3B77" : "#ffffff",
        borderTop: `1px solid ${night ? "#1e2c5c" : "#e6e3d9"}`,
        overflow: "hidden",
        color: "#2c3036",
        fontFamily: "var(--font-ibm-plex-sans), sans-serif",
        transition: "background-color .6s ease, border-color .6s ease",
      }}
    >
      {/* TEXT CONTENT */}
      <div
        className="footer-text"
        style={{
          zIndex: 5,
          pointerEvents: "none",
          padding: "clamp(40px,6vw,72px) clamp(28px,6vw,80px) clamp(26px,5vh,52px)",
          background: night ? "linear-gradient(180deg,#2A3B77 62%,rgba(42,59,119,0))" : "linear-gradient(180deg,#ffffff 62%,rgba(255,255,255,0))",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(30px,6vw,80px)",
          justifyContent: "space-between",
          transition: "background .6s ease",
        }}
      >
        <div style={{ flex: "1 1 360px", minWidth: 260 }}>
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: "clamp(30px,4.2vw,46px)", lineHeight: 1.14, letterSpacing: "-.01em", color: C.fg, transition: "color .5s ease" }}>
            Design the systems that make cities spark!
          </h2>
          <p style={{ margin: "clamp(18px,2.6vh,28px) 0 0", fontSize: "clamp(18px,2.2vw,25px)", fontWeight: 600, color: C.fg, transition: "color .5s ease" }}>
            Email me at{" "}
            <a href="mailto:nnisalas710@gmail.com" style={{ pointerEvents: "auto", color: C.accent, textDecoration: "none", fontWeight: 700, transition: "color .5s ease" }}>
              nnisalas710@gmail.com
            </a>
          </p>
          <p style={{ margin: "clamp(12px,1.6vh,18px) 0 0", fontSize: "clamp(13px,1.4vw,16px)", fontWeight: 500, color: C.fg, transition: "color .5s ease" }}>
            Designed with craft and <s style={{ textDecorationThickness: "1.5px" }}>iced coffee</s>
          </p>
        </div>
        <div style={{ display: "flex", gap: "clamp(36px,6vw,80px)", pointerEvents: "auto", paddingRight: "clamp(0px,4vw,32px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(11px,1.6vh,15px)" }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: ".02em", color: C.mut, transition: "color .5s ease" }}>Menu</span>
            <HopLink href="/#work" className="footer-link" style={linkStyle}>My Works</HopLink>
            <HopLink href="/about-me" className="footer-link" style={linkStyle}>About Me</HopLink>
            <HopLink href="/design-wall" className="footer-link" style={linkStyle}>Design Wall</HopLink>
            <a href={RESUME_URL} target="_blank" rel="noopener" className="hoplink footer-link" style={linkStyle}>
              {"Resume".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(11px,1.6vh,15px)" }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: ".02em", color: C.mut, transition: "color .5s ease" }}>Contacts</span>
            <a href="https://www.linkedin.com/in/nathan-salas-a55565351" target="_blank" rel="noopener" className="hoplink footer-link" style={linkStyle}>
              {"LinkedIn".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
            <a href="mailto:nnisalas710@gmail.com" className="hoplink footer-link" style={linkStyle}>
              {"Email".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
            <a href="https://x.com/Hojichakohako" target="_blank" rel="noopener" className="hoplink footer-link" style={linkStyle}>
              {"Twitter/X".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
          </div>
        </div>
      </div>

      {/* SKY + CITYSCAPE */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* SKY BAND */}
        <div aria-hidden="true" style={{ position: "relative", width: "100%", height: "clamp(170px,20vw,340px)", overflow: "hidden" }}>
          {CLOUDS.map((cl, i) => (
            <img
              key={"day" + i}
              src={cl.day}
              alt=""
              style={{
                position: "absolute",
                top: cl.top,
                left: cl.left,
                right: cl.right,
                width: cl.dayW,
                height: "auto",
                opacity: night ? 0 : 1,
                transition: "opacity .6s ease",
                animation: `drift ${cl.dur}s ease-in-out ${cl.delay}s infinite`,
                willChange: "transform",
              }}
            />
          ))}
          {CLOUDS.map((cl, i) => (
            <img
              key={"night" + i}
              src={cl.night}
              alt=""
              style={{
                position: "absolute",
                top: cl.top,
                left: cl.left,
                right: cl.right,
                width: cl.nightW,
                height: "auto",
                opacity: night ? 1 : 0,
                transition: "opacity .6s ease",
                animation: `drift ${cl.dur}s ease-in-out ${cl.delay}s infinite`,
                willChange: "transform",
              }}
            />
          ))}
          <div
            role="button"
            tabIndex={0}
            title={night ? "Switch to day" : "Switch to night"}
            aria-label="Toggle day and night"
            onClick={() => setNight((n) => !n)}
            onMouseEnter={() => setHoverSun(true)}
            onMouseLeave={() => setHoverSun(false)}
            style={{
              position: "absolute",
              top: "40%",
              left: "47%",
              transform: hoverSun ? "translate(-50%,-50%) scale(1.12)" : "translate(-50%,-50%)",
              width: "clamp(48px,6.5vw,96px)",
              height: "clamp(48px,6.5vw,96px)",
              cursor: "pointer",
              pointerEvents: "auto",
              zIndex: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform .3s ease",
            }}
          >
            <img src="/assets/sun.png" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "100%", height: "auto", opacity: night ? 0 : 1, transition: "opacity .6s ease" }} />
            <img src="/assets/moon.png" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "auto", height: "134%", opacity: night ? 1 : 0, transition: "opacity .6s ease" }} />
          </div>
        </div>

        {/* CITY LAYERS */}
        <div aria-hidden="true" style={{ position: "relative", width: "100%", aspectRatio: "2880 / 1090" }}>
          {CITY_LAYERS.map((l, i) => (
            <img key={"day" + i} src={l.day} alt="" style={{ position: "absolute", left: 0, bottom: l.bottom, width: "100%", height: "auto", display: "block", opacity: night ? 0 : 1, transition: "opacity .6s ease" }} />
          ))}
          {CITY_LAYERS.map((l, i) => (
            <img key={"night" + i} src={l.night} alt="" style={{ position: "absolute", left: 0, bottom: l.bottom, width: "100%", height: "auto", display: "block", opacity: night ? 1 : 0, transition: "opacity .6s ease" }} />
          ))}
        </div>

        {/* WATER REFLECTION */}
        <div aria-hidden="true" style={{ position: "relative", width: "100%", marginTop: -1 }}>
          <img src="/assets/city-reflection.png" alt="" style={{ display: "block", width: "100%", height: "auto", opacity: night ? 0 : 1, transition: "opacity .6s ease" }} />
          <img src="/assets/night-city-reflection.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "auto", opacity: night ? 1 : 0, transition: "opacity .6s ease" }} />
        </div>
      </div>
    </section>
  );
}
