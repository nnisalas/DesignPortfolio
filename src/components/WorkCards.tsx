import Link from "next/link";
import RevealImage from "./RevealImage";
import RevealVideo from "./RevealVideo";
import RevealText from "./RevealText";
import RevealPhoneMockup from "./RevealPhoneMockup";

const tagStyle: React.CSSProperties = { margin: 0, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: "clamp(13px,1.15vw,16px)", lineHeight: 1.5, letterSpacing: ".08em", color: "#3295CE" };

function CardText({ title, subtitle, tag }: { title: string; subtitle: string; tag?: string }) {
  return (
    <div style={{ padding: "clamp(16px,1.6vw,22px) 2px 0" }}>
      <RevealText
        tag="h3"
        trigger="scroll"
        variant="lines"
        stagger={0.1}
        // Only the clamp ceilings come down (28 -> 24 here, 20 -> 17 on the
        // subtitle): the 21px/15px floors still govern phones, so this is a
        // desktop-only reduction.
        style={{ margin: 0, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: "clamp(21px,1.95vw,24px)", lineHeight: 1.2, letterSpacing: 0, color: "#3D3D3D" }}
      >
        {title}
      </RevealText>
      <RevealText
        tag="p"
        trigger="scroll"
        variant="lines"
        stagger={0.08}
        style={{ margin: "clamp(10px,1vw,14px) 0 0", fontFamily: "var(--font-geist)", fontWeight: 400, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.27, letterSpacing: ".07em", color: "#3D3D3D" }}
      >
        {subtitle}
      </RevealText>
      {tag ? (
        <RevealText tag="p" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "clamp(12px,1.2vw,16px) 0 0" }}>
          {tag}
        </RevealText>
      ) : null}
    </div>
  );
}

export default function WorkCards() {
  return (
    <section
      id="work"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#ffffff",
        padding: "clamp(70px,11vh,130px) clamp(16px,3vw,40px) clamp(60px,9vh,110px)",
      }}
    >
      <div style={{ maxWidth: 1340, margin: "0 auto" }}>
        <div
          className="workstack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
            gap: "clamp(20px,2.4vw,36px)",
            alignItems: "start",
            justifyItems: "stretch",
          }}
        >
          <Link href="/threadit-case-study" data-cursor="view" className="work-card-trigger work-card-link" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 clamp(10px,1vw,14px)", color: "#3d3d3d" }}>
              Design Interactive • Jun 2026
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealImage src="/assets/cover-threadit.webp" alt="A neatly organized closet of hanging clothes, shoes, and storage bins" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <RevealPhoneMockup style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "26%", aspectRatio: "600/1206", filter: "drop-shadow(0 14px 30px rgba(44,54,74,.25))" }}>
                <video
                  src="/assets/final-onboarding.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ position: "absolute", left: "6.2%", top: "2.8%", width: "87.5%", height: "94.4%", objectFit: "cover", borderRadius: "7.6%/3.7%" }}
                />
                <img src="/assets/iphone14-bezel.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
              </RevealPhoneMockup>
              <div className="work-card-overlay" aria-hidden="true" />
            </div>
            <CardText
              title="Reducing first-time user activation drop-offs in onboarding"
              subtitle="Accelerated time-to-value from 10 minutes to under 3 minutes"
            />
            {/* Only rendered on touch devices (see .work-card-cta) -- desktop
                still gets the hover overlay. */}
            <p className="work-card-cta">
              View case study
              <span className="wc-arrow" aria-hidden="true">
                →
              </span>
            </p>
          </Link>

          <Link href="/dicircle-case-study" data-cursor="view" className="work-card-trigger work-card-link" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 clamp(10px,1vw,14px)", color: "#3d3d3d" }}>
              Design Interactive • Dec 2025
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealVideo src="/assets/cover-dicircle.mp4" poster="/assets/cover-dicircle.webp" label="The di.circle My Connections screen, showing community member cards with their relationship states" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <div className="work-card-overlay" aria-hidden="true" />
            </div>
            {/* Mirrors the case study's own h1 and subtitle. */}
            <CardText
              title="Lowering the psychological barrier to starting and maintaining professional relationships"
              subtitle="Redesigning student-to-professional outreach through insights from 8 usability tests"
            />
            {/* Only rendered on touch devices (see .work-card-cta). */}
            <p className="work-card-cta">
              View case study
              <span className="wc-arrow" aria-hidden="true">
                →
              </span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
