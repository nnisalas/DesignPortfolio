"use client";

import { useEffect, useRef, useState } from "react";
import HopLink from "./HopLink";
import { BP, BP_BOX, CITY, CLOUDS, SUN, generateStars, type Star } from "@/lib/cityscape";

const RESUME_URL =
  "https://drive.google.com/file/d/16aGoQNVOYrxDGXN1QL7d1B_hI5Ez3xHA/view?usp=sharing";

export default function CityscapeFooter({ buildingStyle = "circles" }: { buildingStyle?: "circles" | "boxes" }) {
  const buildings = buildingStyle === "boxes" ? BP_BOX : BP;
  const [stages, setStages] = useState<number[]>(() => CITY.map((b) => b.s0));
  const [night, setNight] = useState(false);
  const [stars, setStars] = useState<Star[] | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const mouse = useRef({ x: 0, y: 0 });
  const rafPending = useRef(false);

  useEffect(() => {
    setStars(generateStars());
  }, []);

  const growCity = (i: number) => {
    setStages((prev) => {
      const next = prev.slice();
      next[i] = Math.min(3, next[i] + 1);
      return next;
    });
    spawnDrop(i);
  };

  const spawnDrop = (i: number) => {
    const c = cityRef.current;
    const node = nodeRefs.current[CITY[i].id];
    if (!c || !node) return;
    const cr = c.getBoundingClientRect();
    const nr = node.getBoundingClientRect();
    const x = nr.left - cr.left + nr.width / 2;
    const y = nr.top - cr.top;
    const b = CITY[i];
    const sp = document.createElement("span");
    sp.textContent = "*";
    sp.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,0);color:${b.c};font:${b.fs}px 'IBM Plex Mono',ui-monospace,monospace;pointer-events:none;z-index:6;animation:cityDrop .7s ease-out forwards;`;
    c.appendChild(sp);
    setTimeout(() => sp.remove(), 720);
  };

  const applyProximity = () => {
    const R = 170;
    const { x: mx, y: my } = mouse.current;
    for (const id of Object.keys(nodeRefs.current)) {
      const n = nodeRefs.current[id];
      if (!n) continue;
      const r = n.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(mx - cx, my - cy);
      const f = Math.max(0, Math.min(1, 1 - d / R));
      const baseOp = parseFloat(n.dataset.base || "1");
      n.style.opacity = f > 0 ? Math.min(1, baseOp + f * (1 - baseOp)).toFixed(2) : String(baseOp);
      n.style.zIndex = f > 0.15 ? "4" : "";
    }
  };

  const onCityMove = (e: React.MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      applyProximity();
    });
  };

  const onCityLeave = () => {
    for (const id of Object.keys(nodeRefs.current)) {
      const n = nodeRefs.current[id];
      if (n) {
        n.style.opacity = String(parseFloat(n.dataset.base || "1"));
        n.style.zIndex = "";
      }
    }
  };

  const preBase: React.CSSProperties = {
    position: "absolute",
    margin: 0,
    whiteSpace: "pre",
    fontFamily: "'IBM Plex Mono',ui-monospace,monospace",
    lineHeight: 1.05,
    userSelect: "none",
  };

  const sunColor = night ? "#e7ebf6" : SUN.c;

  const rays = [
    { g: "|", bx: 0, by: -20, dx: 0, dy: -12 },
    { g: "|", bx: 0, by: 20, dx: 0, dy: 12 },
    { g: "—", bx: 26, by: 0, dx: 14, dy: 0 },
    { g: "—", bx: -26, by: 0, dx: -14, dy: 0 },
    { g: "/", bx: 18, by: -16, dx: 9, dy: -8 },
    { g: "\\", bx: -18, by: -16, dx: -9, dy: -8 },
    { g: "\\", bx: 18, by: 16, dx: 9, dy: 8 },
    { g: "/", bx: -18, by: 16, dx: -9, dy: 8 },
  ];

  return (
    <section
      id="work-skyline"
      ref={sectionRef}
      style={{
        position: "relative",
        zIndex: 1,
        background: "#ffffff",
        borderTop: "1px solid #e6e3d9",
        overflow: "hidden",
        height: "100vh",
        minHeight: 640,
        color: "#2c3036",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        filter: night ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "filter .4s ease",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "44%",
          background: "linear-gradient(to top,rgba(236,90,46,.05),rgba(244,243,237,0))",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* interactive cityscape layer */}
      <div
        ref={cityRef}
        onMouseMove={onCityMove}
        onMouseLeave={onCityLeave}
        style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}
      >
        {/* stars */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          {CLOUDS.map((cl) => (
            <pre
              key={cl.id}
              style={{
                ...preBase,
                left: cl.left + "%",
                top: cl.top + "%",
                fontSize: cl.fs,
                color: cl.c,
                animation: `drift ${cl.dur}s ease-in-out ${cl.delay}s infinite`,
              }}
            >
              {cl.art.join("\n")}
            </pre>
          ))}

          <div
            role="button"
            tabIndex={0}
            title={night ? "Switch to day" : "Switch to night"}
            onClick={() => setNight((n) => !n)}
            style={{
              position: "absolute",
              left: SUN.left + "%",
              top: SUN.top + "%",
              width: 72,
              height: 72,
              cursor: "pointer",
              pointerEvents: "auto",
              filter: night ? "invert(1) hue-rotate(180deg)" : "none",
              transition: "filter .5s ease",
            }}
          >
            {night ? (
              <pre
                style={{
                  ...preBase,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: SUN.fs + 12,
                  color: sunColor,
                  fontWeight: 700,
                  lineHeight: 1,
                  filter: "drop-shadow(0 0 7px rgba(216,224,244,.55))",
                  animation: "sunPulse 5s ease-in-out infinite",
                }}
              >
                {"☾"}
              </pre>
            ) : (
              <>
                <pre
                  style={{
                    ...preBase,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: SUN.fs,
                    color: sunColor,
                    fontWeight: 700,
                    animation: "sunPulse 4s ease-in-out infinite",
                  }}
                >
                  {["  .-.", "(   )", "  '-'"].join("\n")}
                </pre>
                {rays.map((r, k) => (
                  <span
                    key={k}
                    style={
                      {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        color: sunColor,
                        fontFamily: "'IBM Plex Mono',ui-monospace,monospace",
                        fontSize: SUN.fs - 2,
                        fontWeight: 700,
                        lineHeight: 1,
                        "--bx": r.bx + "px",
                        "--by": r.by + "px",
                        "--dx": r.dx + "px",
                        "--dy": r.dy + "px",
                        animation: `rayOut 2.6s ease-out ${(k * 0.22).toFixed(2)}s infinite`,
                      } as React.CSSProperties
                    }
                  >
                    {r.g}
                  </span>
                ))}
              </>
            )}
          </div>

          {stars &&
            stars.map((s) => (
              <span
                key={s.id}
                style={{
                  position: "absolute",
                  left: s.left + "%",
                  top: s.top + "%",
                  color: s.c,
                  fontFamily: "'IBM Plex Mono',ui-monospace,monospace",
                  fontSize: s.fs,
                  lineHeight: 1,
                  userSelect: "none",
                  animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                }}
              >
                {s.ch}
              </span>
            ))}
        </div>

        {/* buildings */}
        {CITY.map((b, i) => {
          const st = stages[i];
          const art = buildings[b.bp][st].join("\n");
          const op = [0.5, 0.72, 0.88, 1][st];
          const col = st === 0 ? "rgba(44,48,54,.34)" : b.c;
          return (
            <pre
              key={b.id}
              ref={(n) => {
                nodeRefs.current[b.id] = n;
                if (n) n.dataset.base = String(op);
              }}
              onClick={() => growCity(i)}
              title="click to grow"
              style={{
                position: "absolute",
                left: b.left + "%",
                bottom: b.bottom * 0.42 + "%",
                margin: 0,
                fontFamily: "'IBM Plex Mono',ui-monospace,monospace",
                fontSize: b.fs,
                lineHeight: 1.05,
                whiteSpace: "pre",
                cursor: "pointer",
                color: col,
                opacity: op,
                pointerEvents: "auto",
                userSelect: "none",
                transition: "filter .18s ease, transform .18s ease, opacity .4s ease, color .4s ease",
              }}
            >
              {art}
            </pre>
          );
        })}
      </div>

      {/* text overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          pointerEvents: "none",
          padding: "clamp(46px,7vw,86px) clamp(28px,6vw,90px) 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(34px,6vw,90px)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1 1 340px", minWidth: 260 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-ibm-plex-sans)",
              fontWeight: 700,
              fontSize: "clamp(34px,6vw,64px)",
              lineHeight: 1,
              letterSpacing: ".02em",
              color: "#2c2f33",
            }}
          >
            STAY IN TOUCH!
          </h2>
          <p style={{ margin: "clamp(16px,2.6vh,26px) 0 0", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 500, color: "#2c2f33" }}>
            Email me at{" "}
            <a href="mailto:nnisalas710@gmail.com" style={{ pointerEvents: "auto", color: "#2f7ff0", textDecoration: "none", fontWeight: 600 }}>
              nnisalas710@gmail.com
            </a>
          </p>
          <p style={{ margin: "clamp(14px,2vh,20px) 0 0", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(14px,1.6vw,17px)", fontWeight: 500, color: "#b3afa3" }}>
            Designed with craft <s style={{ textDecorationThickness: "1.5px" }}>and lots of iced coffee!</s>
          </p>
          <div style={{ margin: "clamp(20px,3vh,32px) 0 0", display: "flex", alignItems: "center", gap: 13 }}>
            <img src="/assets/footer-flowers.png" alt="" style={{ display: "block", height: 24, width: "auto" }} />
            <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, fontWeight: 500, letterSpacing: ".1em", color: "#9c988c" }}>c. 2026</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "clamp(40px,6vw,84px)", pointerEvents: "auto", paddingRight: "clamp(0px,4vw,40px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.8vh,16px)" }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, fontWeight: 500, letterSpacing: ".12em", color: "#b3afa3" }}>Menu</span>
            <HopLink href="/#work" className="footer-link" style={footLinkStyle}>My Works</HopLink>
            <HopLink href="/about-me" className="footer-link" style={footLinkStyle}>About Me</HopLink>
            <HopLink href="/design-wall" className="footer-link" style={footLinkStyle}>Design Wall</HopLink>
            <a href={RESUME_URL} target="_blank" rel="noopener" className="hoplink footer-link" style={footLinkStyle}>
              {"Resume".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.8vh,16px)" }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, fontWeight: 500, letterSpacing: ".12em", color: "#b3afa3" }}>Contacts</span>
            <a href="https://www.linkedin.com/in/nathan-salas-a55565351" target="_blank" rel="noopener" className="hoplink footer-link" style={footLinkStyle}>
              {"LinkedIn".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
            <a href="mailto:nnisalas710@gmail.com" className="hoplink footer-link" style={footLinkStyle}>
              {"Email".split("").map((c, i) => (
                <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>{c}</span>
              ))}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const footLinkStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#2c2f33",
  textDecoration: "none",
  transition: "color .25s ease",
};
