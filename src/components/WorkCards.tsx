import Link from "next/link";
import RevealImage from "./RevealImage";
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
        style={{ margin: 0, fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 600, fontSize: "clamp(21px,1.95vw,28px)", lineHeight: 1.2, letterSpacing: 0, color: "#3D3D3D" }}
      >
        {title}
      </RevealText>
      <RevealText
        tag="p"
        trigger="scroll"
        variant="lines"
        stagger={0.08}
        style={{ margin: "clamp(10px,1vw,14px) 0 0", fontFamily: "var(--font-geist)", fontWeight: 400, fontSize: "clamp(15px,1.4vw,20px)", lineHeight: 1.27, letterSpacing: ".07em", color: "#3D3D3D" }}
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
          <Link href="/threadit-case-study" data-cursor="view" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 clamp(10px,1vw,14px)", color: "#3d3d3d" }}>
              Design Interactive • Jun 2026
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealImage src="/assets/cover-threadit.webp" alt="ThreadIt app — closet, home, and planning screens" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <img className="pc-pop" src="/assets/pop-tie.webp" alt="" style={{ position: "absolute", top: "-4%", right: "-5%", width: "22%", transform: "scale(.4) rotate(14deg)" }} />
              <img className="pc-pop" src="/assets/pop-hanger.webp" alt="" style={{ position: "absolute", top: "52%", left: "-5%", width: "12%", transform: "scale(.4) rotate(-16deg)" }} />
              <RevealPhoneMockup style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "24%", aspectRatio: "600/1206", filter: "drop-shadow(0 14px 30px rgba(44,54,74,.25))" }}>
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
            </div>
            <CardText
              title="Mitigating first-time user activation drop-offs in onboarding"
              subtitle="Lowering onboarding friction for first-time users by 46%"
            />
          </Link>

          <div data-cursor="soon" style={{ width: "100%" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealImage src="/assets/cover-dicircle.webp" alt="di.circle messaging dashboard for connecting students with alumni" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
            </div>
            <CardText
              title="Lowering First-Contact Friction Between Students and Alumni"
              subtitle="Reducing the friction that keeps students from reaching out to alumni and mentors"
              tag="Design Interactive • October 2025"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
